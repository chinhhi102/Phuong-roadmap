import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileQuestion, Target, ListChecks } from 'lucide-react'
import { getModule } from '@/data/curriculum'
import { getExam } from '@/data/exams'
import { useExamStore } from '@/store/examStore'
import { Badge } from '@/components/ui/Badge'
import { ExamRunner } from './ExamRunner'

export default function ExamPage() {
  const { moduleId = '' } = useParams()
  const module = getModule(moduleId)
  const exam = getExam(moduleId)
  const attempt = useExamStore((s) => s.attempts[moduleId])

  if (!module || !exam) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold">Exam not found</p>
        <Link to="/exams" className="text-primary underline">Back to exams</Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in mx-auto max-w-3xl">
      <Link to="/exams" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All exams
      </Link>

      <div className="mb-5 rounded-xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl">{module.icon}</span>
          <Badge variant="outline">{module.code} Exam</Badge>
          {attempt && <Badge variant={attempt.score >= exam.passingScore ? 'success' : 'warning'}>Best: {attempt.score}%</Badge>}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{exam.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{exam.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><FileQuestion className="h-4 w-4" />{exam.questions.length} questions</span>
          <span className="flex items-center gap-1.5"><Target className="h-4 w-4" />Pass mark {exam.passingScore}%</span>
          <span className="flex items-center gap-1.5"><ListChecks className="h-4 w-4" />Auto-graded (open questions instructor-reviewable)</span>
        </div>
      </div>

      <ExamRunner exam={exam} />
    </div>
  )
}
