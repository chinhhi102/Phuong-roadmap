// ============================================================================
// Learner ⇄ instructor sharing channel.
//
// Two one-way streams over the same locked Firebase room the chat already uses,
// so no Realtime Database rules change is needed:
//
//   rooms/<room>/learner          ← Phương's device publishes her work
//   rooms/<room>/review/exams/*   ← Chính's device publishes his grading
//
// The learner stream carries more than a progress bar: her actual exam attempts
// (every answer she gave), her assignment submissions, and her notes. Without
// those the instructor can see *that* she finished an exam but has nothing to
// review — which is the whole point.
//
// Ownership guard
// ---------------
// The learner stream is a single shared node, so any device left on the default
// "learner" role would overwrite it — including a fresh instructor browser,
// which silently replaced her real progress with an empty snapshot. Three rules
// close that hole:
//   1. A browser that has ever been switched to the instructor role never
//      publishes again (see services/deviceIdentity).
//   2. A completely empty snapshot is never published, so a brand-new device
//      cannot erase real work before its own data has even loaded.
//   3. A device that does not already own the node may take it over only with a
//      snapshot at least as complete as the one already there — Phương's new
//      phone can adopt it; a bystander cannot.
// ============================================================================

import { ref, get, set, onValue } from 'firebase/database'
import { getDb, isFirebaseConfigured, CHAT_ROOM_ID } from '@/services/firebase'
import { deviceId, isInstructorDevice } from '@/services/deviceIdentity'
import { curriculum, getLesson, getModuleOfLesson } from '@/data/curriculum'
import { computeStreak, totalHoursStudied } from '@/lib/selectors'
import type { ActivityEntry, ExamAttempt, LessonProgress } from '@/types'
import type { Note } from '@/store/notesStore'

type Answer = number | boolean | string

export interface LearnerModule {
  id: string
  title: string
  icon: string
  done: number
  total: number
}

export interface LearnerActivity {
  id: string
  kind: string
  label: string
  date: string
}

/** A finished exam, complete enough for the instructor to re-grade it. */
export interface LearnerExam {
  moduleId: string
  answers: Record<string, Answer>
  overrides: Record<string, boolean>
  autoScore: number
  score: number
  submittedAt: string
}

export interface LearnerSubmission {
  lessonId: string
  lessonTitle: string
  moduleTitle: string
  text: string
  submittedAt: string
  score?: number
  approved?: boolean
}

export interface LearnerNote {
  lessonId: string
  lessonTitle: string
  content: string
  updatedAt: string
}

export interface LearnerSnapshot {
  updatedAt: number
  /** Publishing device, so the ownership guard can recognise a repeat writer. */
  dev: string
  name: string
  lessonsCompleted: number
  totalLessons: number
  hours: number
  streak: number
  quizzesPassed: number
  assignmentsSubmitted: number
  modules: LearnerModule[]
  activity: LearnerActivity[]
  exams: LearnerExam[]
  submissions: LearnerSubmission[]
  notes: LearnerNote[]
}

/** One module exam as graded by the instructor. */
export interface ExamReview {
  /** questionId -> correct?; empty means "back to pure auto-grading". */
  overrides: Record<string, boolean>
  /** Recomputed final score, mirrored so the instructor UI can show it offline. */
  score: number
  gradedAt: number
}

export interface ReviewPayload {
  exams: Record<string, ExamReview>
}

const PASS_BAR = 70
/** Generous caps so one enormous note can't bloat every sync. */
const MAX_NOTE_CHARS = 6000
const MAX_SUBMISSION_CHARS = 12000
const MAX_ACTIVITY = 30

const learnerPath = () => `rooms/${CHAT_ROOM_ID}/learner`
const reviewPath = () => `rooms/${CHAT_ROOM_ID}/review`
const examReviewPath = (moduleId: string) => `${reviewPath()}/exams/${moduleId}`

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max)}…` : s)

/**
 * How much real work a snapshot represents. Used only to compare two snapshots
 * competing for the same node — exams and submissions weigh more than a page
 * view because they are the things that would hurt most to lose.
 */
export function completeness(s: LearnerSnapshot | null): number {
  if (!s) return 0
  return (
    (s.lessonsCompleted ?? 0) +
    (s.quizzesPassed ?? 0) +
    (s.activity?.length ?? 0) +
    (s.exams?.length ?? 0) * 5 +
    (s.submissions?.length ?? 0) * 3 +
    (s.notes?.length ?? 0)
  )
}

// --------------------------------------------------------------------------
// Building the snapshot
// --------------------------------------------------------------------------

export interface SnapshotInput {
  progress: Record<string, LessonProgress>
  activity: ActivityEntry[]
  attempts: Record<string, ExamAttempt>
  notes: Record<string, Note>
  name: string
}

/** Build the full picture of the learner's work from her local stores. */
export function computeSnapshot({ progress, activity, attempts, notes, name }: SnapshotInput): LearnerSnapshot {
  let lessonsCompleted = 0
  let quizzesPassed = 0
  const submissions: LearnerSubmission[] = []

  for (const [lessonId, p] of Object.entries(progress)) {
    if (p.completed) lessonsCompleted++
    if (p.quiz && p.quiz.score >= PASS_BAR) quizzesPassed++
    if (p.submission) {
      submissions.push({
        lessonId,
        lessonTitle: getLesson(lessonId)?.title ?? lessonId,
        moduleTitle: getModuleOfLesson(lessonId)?.title ?? '',
        text: clip(p.submission.text, MAX_SUBMISSION_CHARS),
        submittedAt: p.submission.submittedAt,
        // Firebase rejects `undefined`, so optional fields are only ever added
        // when they actually hold a value.
        ...(p.submission.score != null ? { score: p.submission.score } : {}),
        ...(p.submission.approved != null ? { approved: p.submission.approved } : {}),
      })
    }
  }
  submissions.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))

  const exams: LearnerExam[] = Object.values(attempts)
    .map((a) => ({
      moduleId: a.moduleId,
      answers: a.answers ?? {},
      overrides: a.overrides ?? {},
      autoScore: a.autoScore,
      score: a.score,
      submittedAt: a.submittedAt,
    }))
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))

  const sharedNotes: LearnerNote[] = Object.entries(notes)
    .filter(([, n]) => n.content.trim().length > 0)
    .map(([lessonId, n]) => ({
      lessonId,
      lessonTitle: getLesson(lessonId)?.title ?? lessonId,
      content: clip(n.content, MAX_NOTE_CHARS),
      updatedAt: n.updatedAt,
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  const modules: LearnerModule[] = curriculum.map((m) => ({
    id: m.id,
    title: m.title,
    icon: m.icon,
    done: m.lessons.filter((l) => progress[l.id]?.completed).length,
    total: m.lessons.length,
  }))

  return {
    updatedAt: Date.now(),
    dev: deviceId(),
    name,
    lessonsCompleted,
    totalLessons: curriculum.reduce((n, m) => n + m.lessons.length, 0),
    hours: totalHoursStudied(progress),
    streak: computeStreak(activity),
    quizzesPassed,
    assignmentsSubmitted: submissions.length,
    modules,
    activity: activity
      .slice(0, MAX_ACTIVITY)
      .map((a) => ({ id: a.id, kind: a.kind, label: a.label, date: a.date })),
    exams,
    submissions,
    notes: sharedNotes,
  }
}

// --------------------------------------------------------------------------
// Learner device → shared room
// --------------------------------------------------------------------------

export type PublishResult = 'published' | 'off' | 'empty' | 'not-owner'

/**
 * Publish the learner's work, subject to the ownership guard described at the
 * top of this file. Returns why it declined so the UI can explain itself.
 */
export async function publishSnapshot(snap: LearnerSnapshot): Promise<PublishResult> {
  const db = getDb()
  if (!db) return 'off'
  if (isInstructorDevice()) return 'not-owner'
  if (completeness(snap) === 0) return 'empty'

  const node = ref(db, learnerPath())
  const existing = (await get(node)).val() as LearnerSnapshot | null
  const foreign = !!existing?.dev && existing.dev !== snap.dev
  if (foreign && completeness(snap) < completeness(existing)) return 'not-owner'

  await set(node, snap)
  return 'published'
}

/** Instructor device: subscribe to the learner's live work. */
export function subscribeLearner(cb: (s: LearnerSnapshot | null) => void): () => void {
  const db = getDb()
  if (!db) {
    cb(null)
    return () => {}
  }
  return onValue(ref(db, learnerPath()), (snap) => cb(snap.val() as LearnerSnapshot | null))
}

// --------------------------------------------------------------------------
// Instructor device → shared room (grading write-back)
// --------------------------------------------------------------------------

/**
 * Publish the instructor's grade for one exam.
 *
 * An empty override set is still written rather than deleted — Firebase drops
 * the empty `overrides` map but keeps the record, which is what marks the exam
 * as "graded, back to pure auto-grading". Deleting it instead would make the
 * reviewer fall back to the stale overrides in her last snapshot and the
 * cleared grade would appear to bounce back.
 */
export async function publishExamReview(moduleId: string, overrides: Record<string, boolean>, score: number): Promise<void> {
  const db = getDb()
  if (!db) return
  await set(ref(db, examReviewPath(moduleId)), { overrides, score, gradedAt: Date.now() } satisfies ExamReview)
}

/** Learner device: subscribe to the instructor's grading. */
export function subscribeReview(cb: (r: ReviewPayload | null) => void): () => void {
  const db = getDb()
  if (!db) {
    cb(null)
    return () => {}
  }
  return onValue(ref(db, reviewPath()), (snap) => cb(snap.val() as ReviewPayload | null))
}

export { isFirebaseConfigured }
