import { useState } from 'react'
import { CheckCircle2, Circle, Lightbulb, ChevronDown } from 'lucide-react'
import type { Exercise } from '@/types'
import { useProgressStore } from '@/store/progressStore'
import { cn } from '@/lib/utils'

function ExerciseItem({ exercise, lessonId }: { exercise: Exercise; lessonId: string }) {
  const done = useProgressStore((s) => s.progress[lessonId]?.completedExerciseIds.includes(exercise.id) ?? false)
  const toggle = useProgressStore((s) => s.toggleExercise)
  const [showSolution, setShowSolution] = useState(false)
  const [showHint, setShowHint] = useState(false)

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <button onClick={() => toggle(lessonId, exercise.id)} className="mt-0.5 shrink-0" aria-label="Toggle done">
          {done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
        </button>
        <div className="flex-1">
          <p className={cn('font-medium', done && 'text-muted-foreground line-through')}>{exercise.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{exercise.prompt}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {exercise.hint && (
              <button
                onClick={() => setShowHint((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                <Lightbulb className="h-3.5 w-3.5" /> {showHint ? 'Hide hint' : 'Hint'}
              </button>
            )}
            {exercise.sampleSolution && (
              <button
                onClick={() => setShowSolution((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showSolution && 'rotate-180')} />
                {showSolution ? 'Hide sample' : 'Sample solution'}
              </button>
            )}
          </div>

          {showHint && exercise.hint && (
            <p className="mt-2 rounded-md bg-accent/10 px-3 py-2 text-sm text-muted-foreground">{exercise.hint}</p>
          )}
          {showSolution && exercise.sampleSolution && (
            <p className="mt-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">{exercise.sampleSolution}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function ExercisePanel({ exercises, lessonId }: { exercises: Exercise[]; lessonId: string }) {
  if (exercises.length === 0) return null
  return (
    <div className="space-y-3">
      {exercises.map((ex) => (
        <ExerciseItem key={ex.id} exercise={ex} lessonId={lessonId} />
      ))}
    </div>
  )
}
