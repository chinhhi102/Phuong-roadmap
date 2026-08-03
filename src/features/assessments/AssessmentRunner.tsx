import { useState } from 'react'
import { CheckCircle2, XCircle, RotateCcw, Trophy, ShieldCheck, Sparkles } from 'lucide-react'
import type { Question } from '@/types'
import { isAnswerCorrect } from '@/lib/scoring'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Callout } from '@/components/ui/Callout'
import { ScoreRing } from '@/components/ui/Progress'
import { cn } from '@/lib/utils'

type Answer = number | boolean | string

export interface AttemptView {
  answers: Record<string, Answer>
  overrides?: Record<string, boolean>
  autoScore?: number
  score: number
}

interface Props {
  questions: Question[]
  passingScore: number
  attempt?: AttemptView
  role: 'learner' | 'instructor'
  kind: 'quiz' | 'exam'
  onSubmit: (answers: Record<string, Answer>) => void
  onOverride: (questionId: string, correct: boolean | null) => void
  onReset: () => void
}

function verdictOf(q: Question, answer: Answer | undefined, overrides: Record<string, boolean>): boolean {
  return q.id in overrides ? overrides[q.id] : isAnswerCorrect(q, answer)
}

/** Shared runner for both practice quizzes and module exams, with instructor grade override. */
export function AssessmentRunner({ questions, passingScore, attempt, role, kind, onSubmit, onOverride, onReset }: Props) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const submitted = !!attempt
  const activeAnswers = attempt?.answers ?? answers
  const overrides = attempt?.overrides ?? {}
  const answeredCount = Object.keys(answers).length
  const score = attempt?.score ?? 0
  const autoScore = attempt?.autoScore ?? score
  const passed = score >= passingScore
  const label = kind === 'exam' ? 'exam' : 'quiz'

  const setAnswer = (qid: string, value: Answer) => {
    if (submitted) return
    setAnswers((a) => ({ ...a, [qid]: value }))
  }

  return (
    <div className="space-y-5">
      {submitted && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row">
          <ScoreRing value={score} sublabel={`${label} score`} size={104} />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Trophy className={cn('h-5 w-5', passed ? 'text-success' : 'text-warning')} />
              <span className="text-lg font-bold">{passed ? 'Passed!' : 'Keep going'}</span>
              <Badge variant={passed ? 'success' : 'warning'}>{score}% / need {passingScore}%</Badge>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Auto-graded: {autoScore}%.
              {score !== autoScore && ` Adjusted to ${score}% after instructor review.`}
            </p>
            <div className="mt-3">
              <Button variant="outline" size="sm" onClick={() => { onReset(); setAnswers({}) }}>
                <RotateCcw className="h-4 w-4" /> Retake {label}
              </Button>
            </div>
          </div>
        </div>
      )}

      {submitted && role === 'instructor' && (
        <Callout tone="tip" title="Instructor grading">
          You're viewing this finished {label} as the <strong>instructor</strong>. Use the <strong>Correct / Incorrect</strong> controls under each question to grade — especially the open (short-answer) ones — and the score updates live.
        </Callout>
      )}

      <ol className="space-y-4">
        {questions.map((q, i) => {
          const ans = activeAnswers[q.id]
          const correct = submitted && verdictOf(q, ans, overrides)
          const overridden = q.id in overrides
          return (
            <li key={q.id} className="rounded-lg border border-border bg-card p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="font-medium">
                  <span className="text-muted-foreground">{i + 1}.</span> {q.prompt}
                  {q.type === 'short' && <Badge variant="outline" className="ml-2 align-middle">open</Badge>}
                </p>
                {submitted && (
                  <span className="shrink-0">
                    {correct ? <CheckCircle2 className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-danger" />}
                  </span>
                )}
              </div>

              {q.type === 'mcq' && (
                <div className="space-y-2">
                  {q.options?.map((opt, idx) => {
                    const selected = ans === idx
                    const isKey = submitted && q.correctIndex === idx
                    return (
                      <button
                        key={idx}
                        onClick={() => setAnswer(q.id, idx)}
                        disabled={submitted}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                          selected && !submitted && 'border-primary bg-primary/10',
                          !selected && !submitted && 'border-border hover:bg-muted',
                          isKey && 'border-success bg-success/10',
                          submitted && selected && !isKey && 'border-danger bg-danger/10',
                        )}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px]">{String.fromCharCode(65 + idx)}</span>
                        {opt}
                      </button>
                    )
                  })}
                </div>
              )}

              {q.type === 'truefalse' && (
                <div className="flex gap-2">
                  {[true, false].map((val) => {
                    const selected = ans === val
                    const isKey = submitted && q.correctBool === val
                    return (
                      <button
                        key={String(val)}
                        onClick={() => setAnswer(q.id, val)}
                        disabled={submitted}
                        className={cn(
                          'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                          selected && !submitted && 'border-primary bg-primary/10',
                          !selected && !submitted && 'border-border hover:bg-muted',
                          isKey && 'border-success bg-success/10',
                          submitted && selected && !isKey && 'border-danger bg-danger/10',
                        )}
                      >
                        {val ? 'True' : 'False'}
                      </button>
                    )
                  })}
                </div>
              )}

              {q.type === 'short' && (
                <textarea
                  value={typeof ans === 'string' ? ans : ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  disabled={submitted}
                  placeholder="Type your answer…"
                  className="min-h-[64px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-80"
                />
              )}

              {submitted && (
                <div className="mt-3 space-y-2 text-sm">
                  {q.type === 'short' && q.sampleAnswer && (
                    <p className="text-muted-foreground"><span className="font-medium text-foreground">Sample answer: </span>{q.sampleAnswer}</p>
                  )}
                  <p className="rounded-md bg-muted px-3 py-2 text-muted-foreground"><span className="font-medium text-foreground">Why: </span>{q.explanation}</p>

                  {role === 'instructor' && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="flex items-center gap-1 text-xs font-medium text-accent"><ShieldCheck className="h-3.5 w-3.5" /> Grade:</span>
                      <button onClick={() => onOverride(q.id, true)} className={cn('rounded-md border px-2 py-1 text-xs', correct ? 'border-success bg-success/10 text-success' : 'border-border text-muted-foreground hover:bg-muted')}>Correct</button>
                      <button onClick={() => onOverride(q.id, false)} className={cn('rounded-md border px-2 py-1 text-xs', !correct ? 'border-danger bg-danger/10 text-danger' : 'border-border text-muted-foreground hover:bg-muted')}>Incorrect</button>
                      {overridden && (
                        <button onClick={() => onOverride(q.id, null)} className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted">Reset to auto</button>
                      )}
                      {overridden && <Badge variant="accent">overridden</Badge>}
                    </div>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {!submitted && (
        <div className="sticky bottom-0 flex items-center gap-3 rounded-xl border border-border bg-card/95 p-3 backdrop-blur">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">{answeredCount}/{questions.length} answered</span>
          <div className="flex-1" />
          <Button onClick={() => onSubmit(answers)} disabled={answeredCount < questions.length}>
            Submit {label}
          </Button>
        </div>
      )}
    </div>
  )
}
