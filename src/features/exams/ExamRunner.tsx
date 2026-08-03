import type { Exam } from '@/types'
import { useExamStore } from '@/store/examStore'
import { useSettingsStore } from '@/store/settingsStore'
import { AssessmentRunner } from '@/features/assessments/AssessmentRunner'

export function ExamRunner({ exam }: { exam: Exam }) {
  const attempt = useExamStore((s) => s.attempts[exam.moduleId])
  const submit = useExamStore((s) => s.submit)
  const setOverride = useExamStore((s) => s.setOverride)
  const reset = useExamStore((s) => s.reset)
  const role = useSettingsStore((s) => s.role)

  return (
    <AssessmentRunner
      questions={exam.questions}
      passingScore={exam.passingScore}
      attempt={attempt}
      role={role}
      kind="exam"
      onSubmit={(answers) => submit(exam, answers)}
      onOverride={(qid, correct) => setOverride(exam, qid, correct)}
      onReset={() => reset(exam.moduleId)}
    />
  )
}
