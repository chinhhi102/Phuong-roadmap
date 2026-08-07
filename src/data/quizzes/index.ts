import type { Quiz } from '@/types'
import { quizzesM1 } from './m1-quiz'
import { quizzesM2 } from './m2-quiz'
import { quizzesM3 } from './m3-quiz'
import { quizzesM4 } from './m4-quiz'
import { quizzesM5 } from './m5-quiz'
import { quizzesM6 } from './m6-quiz'
import { quizzesM7 } from './m7-quiz'
import { quizzesM8 } from './m8-quiz'
import { quizzesM9 } from './m9-quiz'

/** Practice quiz per lesson (10–15 questions each), keyed by lesson id. */
const practiceQuizzes: Record<string, Quiz> = {
  ...quizzesM1,
  ...quizzesM2,
  ...quizzesM3,
  ...quizzesM4,
  ...quizzesM5,
  ...quizzesM6,
  ...quizzesM7,
  ...quizzesM8,
  ...quizzesM9,
}

export function getPracticeQuiz(lessonId: string): Quiz | undefined {
  return practiceQuizzes[lessonId]
}
