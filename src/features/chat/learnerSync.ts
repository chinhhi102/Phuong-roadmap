// ============================================================================
// Learner progress sync — lets the instructor (Chính) see the learner's
// (Phương's) real progress live, from anywhere.
//
// The learner's device publishes a compact snapshot to the shared room under
// `rooms/<room>/learner`; the instructor's device subscribes to it. Reuses the
// same locked Firebase room + rules as the chat (read/write is already granted
// at the room level), so no rules change is needed.
// ============================================================================

import { ref, set, onValue } from 'firebase/database'
import { getDb, isFirebaseConfigured, CHAT_ROOM_ID } from '@/services/firebase'
import { curriculum } from '@/data/curriculum'
import { computeStreak, totalHoursStudied } from '@/lib/selectors'
import type { ActivityEntry, LessonProgress } from '@/types'

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

export interface LearnerSnapshot {
  updatedAt: number
  name: string
  lessonsCompleted: number
  totalLessons: number
  hours: number
  streak: number
  quizzesPassed: number
  assignmentsSubmitted: number
  modules: LearnerModule[]
  activity: LearnerActivity[]
}

const PASS_BAR = 70

/** Build a compact snapshot of the learner's progress from local stores. */
export function computeSnapshot(
  progress: Record<string, LessonProgress>,
  activity: ActivityEntry[],
  name: string,
): LearnerSnapshot {
  let lessonsCompleted = 0
  let quizzesPassed = 0
  let assignmentsSubmitted = 0
  for (const p of Object.values(progress)) {
    if (p.completed) lessonsCompleted++
    if (p.quiz && p.quiz.score >= PASS_BAR) quizzesPassed++
    if (p.submission) assignmentsSubmitted++
  }

  const modules: LearnerModule[] = curriculum.map((m) => ({
    id: m.id,
    title: m.title,
    icon: m.icon,
    done: m.lessons.filter((l) => progress[l.id]?.completed).length,
    total: m.lessons.length,
  }))

  return {
    updatedAt: Date.now(),
    name,
    lessonsCompleted,
    totalLessons: curriculum.reduce((n, m) => n + m.lessons.length, 0),
    hours: totalHoursStudied(progress),
    streak: computeStreak(activity),
    quizzesPassed,
    assignmentsSubmitted,
    modules,
    activity: activity.slice(0, 30).map((a) => ({ id: a.id, kind: a.kind, label: a.label, date: a.date })),
  }
}

/** Learner device: push the snapshot to the shared room. */
export function publishSnapshot(snap: LearnerSnapshot): void {
  const db = getDb()
  if (!db) return
  void set(ref(db, `rooms/${CHAT_ROOM_ID}/learner`), snap)
}

/** Instructor device: subscribe to the learner's live progress. */
export function subscribeLearner(cb: (s: LearnerSnapshot | null) => void): () => void {
  const db = getDb()
  if (!db) {
    cb(null)
    return () => {}
  }
  return onValue(ref(db, `rooms/${CHAT_ROOM_ID}/learner`), (snap) => cb(snap.val() as LearnerSnapshot | null))
}

export { isFirebaseConfigured }
