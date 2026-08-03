import { Link } from 'react-router-dom'
import { FileQuestion, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react'
import { curriculum } from '@/data/curriculum'
import { getExam } from '@/data/exams'
import { useExamStore } from '@/store/examStore'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { cn } from '@/lib/utils'

export default function ExamsPage() {
  const attempts = useExamStore((s) => s.attempts)

  const rows = curriculum
    .map((m) => ({ module: m, exam: getExam(m.id), attempt: attempts[m.id] }))
    .filter((r) => r.exam)

  const taken = rows.filter((r) => r.attempt)
  const avg = taken.length ? Math.round(taken.reduce((s, r) => s + (r.attempt?.score ?? 0), 0) / taken.length) : 0

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Exams</h1>
        <p className="text-sm text-muted-foreground">One focused exam per module (20–30 questions each). Your best score counts toward the module score.</p>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium">Exams completed</span>
          <span className="font-semibold">{taken.length}/{rows.length} · avg {avg}%</span>
        </div>
        <Progress value={rows.length ? (taken.length / rows.length) * 100 : 0} gradient="from-primary to-accent" className="h-2.5" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {rows.map(({ module, exam, attempt }) => {
          const passed = attempt && exam && attempt.score >= exam.passingScore
          return (
            <Link key={module.id} to={`/exam/${module.id}`}>
              <Card className="transition-colors hover:border-primary">
                <CardContent className="flex items-center gap-4 py-4">
                  <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl', module.accent)}>
                    {module.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{module.code}</Badge>
                      <span className="truncate font-semibold">{module.title}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><FileQuestion className="h-3.5 w-3.5" />{exam!.questions.length} questions</span>
                      {attempt ? (
                        <span className={cn('flex items-center gap-1 font-medium', passed ? 'text-success' : 'text-warning')}>
                          {passed && <CheckCircle2 className="h-3.5 w-3.5" />} Scored {attempt.score}%
                        </span>
                      ) : (
                        <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> Not attempted</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
