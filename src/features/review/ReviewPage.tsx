// ============================================================================
// Instructor review console.
//
// Everything Phương's device publishes, in one place: her finished exams with
// the answer she actually gave to every question, her assignment submissions,
// and her notes. Grading an open question here writes back to the shared room,
// so the corrected score lands on her device too.
//
// Read-only with respect to local state — nothing here touches this device's
// own progress or exam stores, so reviewing her work can never be mistaken for
// doing it.
// ============================================================================

import { useMemo, useState } from 'react'
import {
  UserCog, FileQuestion, FileText, StickyNote, CheckCircle2, XCircle, ShieldCheck,
  RefreshCw, CloudOff, ChevronDown, GraduationCap,
} from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import { useLearnerProgress } from '@/features/chat/useLearnerProgress'
import { useExamReviews } from '@/features/chat/useExamReviews'
import { publishExamReview, type LearnerExam, type LearnerSnapshot } from '@/features/chat/learnerSync'
import { isFirebaseConfigured } from '@/services/firebase'
import { getExam } from '@/data/exams'
import { getModule } from '@/data/curriculum'
import { isAnswerCorrect, scoreExam } from '@/lib/scoring'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/Callout'
import { Tabs } from '@/components/ui/Tabs'
import { Progress } from '@/components/ui/Progress'
import { cn, displayName, formatDateTime } from '@/lib/utils'
import type { Question } from '@/types'

type Answer = number | boolean | string
type TabId = 'exams' | 'assignments' | 'notes'

function relTime(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

/** Render her answer the way she gave it, whatever the question type. */
function AnswerText({ q, answer }: { q: Question; answer: Answer | undefined }) {
  if (answer === undefined || answer === '') {
    return <span className="italic text-muted-foreground">No answer given</span>
  }
  if (q.type === 'mcq') {
    const idx = Number(answer)
    const opt = q.options?.[idx]
    return <span>{opt ? `${String.fromCharCode(65 + idx)}. ${opt}` : String(answer)}</span>
  }
  if (q.type === 'truefalse') return <span>{answer ? 'True' : 'False'}</span>
  return <span className="whitespace-pre-wrap">{String(answer)}</span>
}

/** The expected answer, so the instructor doesn't have to open the exam data. */
function ExpectedText({ q }: { q: Question }) {
  if (q.type === 'mcq' && q.correctIndex != null) {
    const opt = q.options?.[q.correctIndex]
    return <span>{opt ? `${String.fromCharCode(65 + q.correctIndex)}. ${opt}` : `#${q.correctIndex}`}</span>
  }
  if (q.type === 'truefalse') return <span>{q.correctBool ? 'True' : 'False'}</span>
  if (q.sampleAnswer) return <span>{q.sampleAnswer}</span>
  if (q.keywords?.length) return <span>Keywords: {q.keywords.join(', ')}</span>
  return <span className="italic text-muted-foreground">Open question — your call</span>
}

function Tile({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-center">
      <p className="text-lg font-bold">{n}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{l}</p>
    </div>
  )
}

// --------------------------------------------------------------------------
// One exam, fully reviewable
// --------------------------------------------------------------------------

function ExamCard({ attempt, overrides }: { attempt: LearnerExam; overrides: Record<string, boolean> }) {
  const [open, setOpen] = useState(false)
  const exam = getExam(attempt.moduleId)
  const module = getModule(attempt.moduleId)

  // The live score is recomputed here from her answers plus whatever grading is
  // currently published, so the number matches what she will see on her device.
  const score = useMemo(
    () => (exam ? scoreExam(exam.questions, attempt.answers, overrides) : attempt.score),
    [exam, attempt.answers, attempt.score, overrides],
  )

  if (!exam) return null
  const passed = score >= exam.passingScore
  const adjusted = score !== attempt.autoScore
  const openQuestions = exam.questions.filter((q) => q.type === 'short').length

  const setOverride = (questionId: string, correct: boolean | null) => {
    const next = { ...overrides }
    if (correct === null) delete next[questionId]
    else next[questionId] = correct
    void publishExamReview(attempt.moduleId, next, scoreExam(exam.questions, attempt.answers, next))
  }

  return (
    <Card>
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left">
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <span className="text-2xl">{module?.icon}</span>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">{exam.title}</CardTitle>
            <CardDescription>
              Submitted {formatDateTime(attempt.submittedAt)} · {exam.questions.length} questions
              {openQuestions > 0 && ` · ${openQuestions} open`}
            </CardDescription>
          </div>
          <Badge variant={passed ? 'success' : 'warning'}>{score}%</Badge>
          {adjusted && <Badge variant="accent">graded</Badge>}
          <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
        </CardHeader>
      </button>

      {open && (
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
            <span className="text-muted-foreground">Auto-graded <strong className="text-foreground">{attempt.autoScore}%</strong></span>
            {adjusted && <span className="text-muted-foreground">→ after your review <strong className="text-foreground">{score}%</strong></span>}
            <span className="text-muted-foreground">· pass mark {exam.passingScore}%</span>
          </div>

          <ol className="space-y-3">
            {exam.questions.map((q, i) => {
              const ans = attempt.answers[q.id]
              const overridden = q.id in overrides
              const correct = overridden ? overrides[q.id] : isAnswerCorrect(q, ans)
              return (
                <li key={q.id} className="rounded-lg border border-border p-3">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">
                      <span className="text-muted-foreground">{i + 1}.</span> {q.prompt}
                      {q.type === 'short' && <Badge variant="outline" className="ml-2 align-middle">open</Badge>}
                    </p>
                    <span className="shrink-0">
                      {correct ? <CheckCircle2 className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-danger" />}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm">
                    <p className={cn('rounded-md px-3 py-2', correct ? 'bg-success/10' : 'bg-danger/10')}>
                      <span className="font-medium">Her answer: </span>
                      <AnswerText q={q} answer={ans} />
                    </p>
                    <p className="rounded-md bg-muted px-3 py-2 text-muted-foreground">
                      <span className="font-medium text-foreground">Expected: </span>
                      <ExpectedText q={q} />
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-medium text-accent">
                      <ShieldCheck className="h-3.5 w-3.5" /> Grade:
                    </span>
                    <button
                      onClick={() => setOverride(q.id, true)}
                      className={cn('rounded-md border px-2 py-1 text-xs', correct ? 'border-success bg-success/10 text-success' : 'border-border text-muted-foreground hover:bg-muted')}
                    >
                      Correct
                    </button>
                    <button
                      onClick={() => setOverride(q.id, false)}
                      className={cn('rounded-md border px-2 py-1 text-xs', !correct ? 'border-danger bg-danger/10 text-danger' : 'border-border text-muted-foreground hover:bg-muted')}
                    >
                      Incorrect
                    </button>
                    {overridden && (
                      <>
                        <button
                          onClick={() => setOverride(q.id, null)}
                          className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                        >
                          Reset to auto
                        </button>
                        <Badge variant="accent">overridden</Badge>
                      </>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </CardContent>
      )}
    </Card>
  )
}

// --------------------------------------------------------------------------
// Page
// --------------------------------------------------------------------------

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">{children}</p>
}

function ReviewBody({ snap }: { snap: LearnerSnapshot }) {
  const [tab, setTab] = useState<TabId>('exams')
  const reviews = useExamReviews()

  const exams = snap.exams ?? []
  const submissions = snap.submissions ?? []
  const notes = snap.notes ?? []
  const modules = snap.modules ?? []
  const pct = snap.totalLessons ? Math.round((snap.lessonsCompleted / snap.totalLessons) * 100) : 0
  const her = displayName(snap.name)

  return (
    <>
      <Card className="mb-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" /> {her}'s work
          </CardTitle>
          <CardDescription>Live from her device · updated {relTime(snap.updatedAt)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Course progress</span>
              <span className="font-semibold">{pct}% · {snap.lessonsCompleted}/{snap.totalLessons} lessons</span>
            </div>
            <Progress value={pct} gradient="from-primary to-accent" />
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            <Tile n={`${snap.hours}h`} l="Studied" />
            <Tile n={`${snap.streak}`} l="Streak" />
            <Tile n={`${snap.quizzesPassed}`} l="Quizzes" />
            <Tile n={`${exams.length}`} l="Exams" />
            <Tile n={`${submissions.length}`} l="Assign." />
            <Tile n={`${notes.length}`} l="Notes" />
          </div>
          <details>
            <summary className="cursor-pointer list-none text-sm font-semibold text-primary">▸ Per-module progress</summary>
            <ul className="mt-2 space-y-2">
              {modules.map((m) => (
                <li key={m.id} className="text-sm">
                  <div className="mb-0.5 flex items-center justify-between gap-2 text-muted-foreground">
                    <span className="truncate">{m.icon} {m.title}</span>
                    <span className="shrink-0">{m.done}/{m.total}</span>
                  </div>
                  <Progress value={m.total ? Math.round((m.done / m.total) * 100) : 0} />
                </li>
              ))}
            </ul>
          </details>
        </CardContent>
      </Card>

      <Tabs
        className="mb-4"
        active={tab}
        onChange={(id) => setTab(id as TabId)}
        tabs={[
          { id: 'exams', label: 'Exams', icon: <FileQuestion className="h-4 w-4" />, badge: <Badge variant="outline">{exams.length}</Badge> },
          { id: 'assignments', label: 'Assignments', icon: <FileText className="h-4 w-4" />, badge: <Badge variant="outline">{submissions.length}</Badge> },
          { id: 'notes', label: 'Notes', icon: <StickyNote className="h-4 w-4" />, badge: <Badge variant="outline">{notes.length}</Badge> },
        ]}
      />

      {tab === 'exams' && (
        <div className="space-y-3">
          {exams.length === 0 ? (
            <Empty>{her} hasn't finished an exam yet. The moment she submits one it appears here — every question, with her answer. 🌸</Empty>
          ) : (
            <>
              <Callout tone="tip" title="Grading">
                Use <strong>Correct / Incorrect</strong> under any question — especially the open ones auto-grading can only guess at.
                Her score updates on her own device within a few seconds.
              </Callout>
              {exams.map((e) => {
                // A published review wins outright, even when it grades nothing
                // — that's how "reset to auto" is expressed. Only fall back to
                // the overrides in her snapshot when he hasn't graded at all.
                const review = reviews[e.moduleId]
                return (
                  <ExamCard
                    key={e.moduleId}
                    attempt={e}
                    overrides={review ? review.overrides ?? {} : e.overrides ?? {}}
                  />
                )
              })}
            </>
          )}
        </div>
      )}

      {tab === 'assignments' && (
        <div className="space-y-3">
          {submissions.length === 0 ? (
            <Empty>No assignment submissions yet.</Empty>
          ) : (
            submissions.map((s) => (
              <Card key={s.lessonId}>
                <CardHeader>
                  <CardTitle className="text-base">{s.lessonTitle}</CardTitle>
                  <CardDescription>
                    {s.moduleTitle && `${s.moduleTitle} · `}Submitted {formatDateTime(s.submittedAt)}
                    {s.score != null && ` · self-scored ${s.score}%`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap rounded-lg bg-muted p-3 text-sm">{s.text}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === 'notes' && (
        <div className="space-y-3">
          {notes.length === 0 ? (
            <Empty>No notes yet.</Empty>
          ) : (
            notes.map((n) => (
              <Card key={n.lessonId}>
                <CardHeader>
                  <CardTitle className="text-base">{n.lessonTitle}</CardTitle>
                  <CardDescription>Updated {formatDateTime(n.updatedAt)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap rounded-lg bg-muted p-3 text-sm">{n.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </>
  )
}

export default function ReviewPage() {
  const role = useSettingsStore((s) => s.role)
  const setRole = useSettingsStore((s) => s.setRole)
  const snap = useLearnerProgress()

  const header = (
    <div className="mb-5">
      <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
        <UserCog className="h-6 w-6 text-accent" /> Review
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Phương's exams, assignments and notes — live from her device.
      </p>
    </div>
  )

  if (role !== 'instructor') {
    return (
      <div className="animate-fade-in mx-auto max-w-4xl">
        {header}
        <Callout tone="info" title="This is Chính's view">
          You're currently signed in as <strong>Phương</strong>. Switch to <strong>Chính</strong> to review her work.
          <div className="mt-3">
            <Button size="sm" onClick={() => setRole('instructor')}>
              <UserCog className="h-4 w-4" /> Switch to Chính
            </Button>
          </div>
        </Callout>
      </div>
    )
  }

  if (!isFirebaseConfigured()) {
    return (
      <div className="animate-fade-in mx-auto max-w-4xl">
        {header}
        <Callout tone="warning" title="Not connected">
          <span className="inline-flex items-center gap-1.5"><CloudOff className="h-4 w-4" /> Firebase isn't configured on this build, so nothing can reach you from her device.</span>
        </Callout>
      </div>
    )
  }

  return (
    <div className="animate-fade-in mx-auto max-w-4xl">
      {header}
      {snap ? (
        <ReviewBody snap={snap} />
      ) : (
        <Callout tone="info" title="Waiting for Phương's device">
          <span className="inline-flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4 animate-spin" /> Nothing published yet — her work shows up here within seconds of her opening the app.
          </span>
        </Callout>
      )}
    </div>
  )
}
