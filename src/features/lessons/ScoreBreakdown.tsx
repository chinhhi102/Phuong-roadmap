import type { Lesson, LessonProgress } from '@/types'
import { computeLessonScore } from '@/lib/scoring'
import { Progress, ScoreRing } from '@/components/ui/Progress'

function Row({ label, value }: { label: string; value: number | null }) {
  if (value === null) return null
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  )
}

export function ScoreBreakdown({ lesson, progress }: { lesson: Lesson; progress?: LessonProgress }) {
  const s = computeLessonScore(lesson, progress)
  return (
    <div className="flex flex-col items-center gap-4">
      <ScoreRing value={s.total} sublabel="Lesson score" size={110} />
      <div className="w-full space-y-2.5">
        <Row label="Quiz" value={s.quiz} />
        <Row label="Exercises" value={s.exercise} />
        <Row label="Assignment" value={s.assignment} />
        <Row label="Completion" value={s.completion} />
      </div>
    </div>
  )
}
