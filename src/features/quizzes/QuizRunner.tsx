import type { Quiz } from '@/types'
import { useProgressStore } from '@/store/progressStore'
import { useSettingsStore } from '@/store/settingsStore'
import { AssessmentRunner } from '@/features/assessments/AssessmentRunner'

export function QuizRunner({ quiz, lessonId, lessonTitle }: { quiz: Quiz; lessonId: string; lessonTitle: string }) {
  const attempt = useProgressStore((s) => s.progress[lessonId]?.quiz)
  const submitQuiz = useProgressStore((s) => s.submitQuiz)
  const setQuizOverride = useProgressStore((s) => s.setQuizOverride)
  const resetQuiz = useProgressStore((s) => s.resetQuiz)
  const role = useSettingsStore((s) => s.role)

  return (
    <AssessmentRunner
      questions={quiz.questions}
      passingScore={quiz.passingScore}
      attempt={attempt}
      role={role}
      kind="quiz"
      onSubmit={(answers) => submitQuiz(lessonId, quiz, answers, lessonTitle)}
      onOverride={(qid, correct) => setQuizOverride(lessonId, quiz, qid, correct)}
      onReset={() => resetQuiz(lessonId)}
    />
  )
}
