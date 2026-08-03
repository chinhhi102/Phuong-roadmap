import { useState } from 'react'
import { Upload, CheckCircle2, Circle, ShieldCheck, Star } from 'lucide-react'
import type { Assignment } from '@/types'
import { useProgressStore } from '@/store/progressStore'
import { useSettingsStore } from '@/store/settingsStore'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Callout } from '@/components/ui/Callout'
import { Textarea } from '@/components/ui/Input'
import { formatDateTime, cn } from '@/lib/utils'

export function AssignmentPanel({ assignment, lessonId }: { assignment: Assignment; lessonId: string }) {
  const submission = useProgressStore((s) => s.progress[lessonId]?.submission)
  const submit = useProgressStore((s) => s.submitAssignment)
  const review = useProgressStore((s) => s.reviewAssignment)
  const role = useSettingsStore((s) => s.role)

  const [text, setText] = useState(submission?.text ?? '')
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [reviewScore, setReviewScore] = useState(submission?.score ?? 85)

  const selfScore = Math.round((checked.size / assignment.rubric.length) * 100)

  const toggleRubric = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-1 flex items-center gap-2">
          <Badge variant="accent">Assignment</Badge>
          <h3 className="font-semibold">{assignment.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{assignment.brief}</p>
        <p className="mt-3 text-sm">
          <span className="font-medium">Deliverable: </span>
          <span className="text-muted-foreground">{assignment.deliverable}</span>
        </p>
      </div>

      {/* Rubric self-check */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-medium">Rubric — self-check</p>
          <Badge variant={selfScore >= 80 ? 'success' : 'warning'}>{selfScore}% ready</Badge>
        </div>
        <ul className="space-y-1.5">
          {assignment.rubric.map((r, i) => (
            <li key={i}>
              <button onClick={() => toggleRubric(i)} className="flex items-start gap-2 text-left text-sm">
                {checked.has(i) ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
                <span className={cn(checked.has(i) ? 'text-foreground' : 'text-muted-foreground')}>{r}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Submission */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-2 font-medium">Your submission</p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your work here — or a link to your Figma / Notion / GitHub deliverable…"
          className="min-h-[120px]"
        />
        <div className="mt-3 flex items-center gap-3">
          <Button onClick={() => submit(lessonId, text, assignment.title)} disabled={!text.trim()}>
            <Upload className="h-4 w-4" /> {submission ? 'Resubmit' : 'Submit assignment'}
          </Button>
          {submission && <span className="text-xs text-muted-foreground">Last submitted {formatDateTime(submission.submittedAt)}</span>}
        </div>
      </div>

      {/* Review status */}
      {submission?.score != null && (
        <Callout tone={submission.approved ? 'success' : 'info'} title={submission.approved ? 'Approved by instructor' : 'Reviewed'}>
          Instructor score: <strong>{submission.score}%</strong>
          {submission.approved && ' — lesson signed off. Great work!'}
        </Callout>
      )}

      {/* Instructor review (visible in instructor identity) */}
      {role === 'instructor' && submission && (
        <div className="rounded-lg border border-accent/40 bg-accent/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-medium">
            <ShieldCheck className="h-4 w-4 text-accent" /> Instructor review
          </p>
          <label className="text-sm text-muted-foreground">Score: {reviewScore}%</label>
          <input
            type="range"
            min={0}
            max={100}
            value={reviewScore}
            onChange={(e) => setReviewScore(Number(e.target.value))}
            className="w-full accent-[hsl(var(--accent))]"
          />
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" onClick={() => review(lessonId, reviewScore, false)}>
              Save score
            </Button>
            <Button variant="success" onClick={() => review(lessonId, reviewScore, true)}>
              <Star className="h-4 w-4" /> Approve
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
