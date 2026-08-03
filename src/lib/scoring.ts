import type {
  Curriculum,
  Lesson,
  LessonProgress,
  LessonScore,
  Module,
  ModuleScore,
  Question,
} from '@/types'

/** Base component weights; renormalized over whichever components a lesson has. */
const WEIGHTS = {
  quiz: 0.4,
  exercise: 0.25,
  assignment: 0.25,
  completion: 0.1,
} as const

/** Grade a single quiz answer. */
export function isAnswerCorrect(q: Question, answer: number | boolean | string | undefined): boolean {
  if (answer === undefined || answer === null) return false
  switch (q.type) {
    case 'mcq':
      return answer === q.correctIndex
    case 'truefalse':
      return answer === q.correctBool
    case 'short': {
      const text = String(answer).toLowerCase()
      if (!q.keywords || q.keywords.length === 0) return text.trim().length > 0
      return q.keywords.some((k) => text.includes(k.toLowerCase()))
    }
    default:
      return false
  }
}

/** Auto-grade a full quiz submission → percentage 0–100. */
export function gradeQuiz(questions: Question[], answers: Record<string, number | boolean | string>): number {
  const totalPoints = questions.reduce((s, q) => s + q.points, 0)
  if (totalPoints === 0) return 0
  const earned = questions.reduce((s, q) => s + (isAnswerCorrect(q, answers[q.id]) ? q.points : 0), 0)
  return Math.round((earned / totalPoints) * 100)
}

/**
 * Grade an exam. Instructor `overrides` (questionId -> correct?) take precedence
 * over auto-grading — used to review/adjust open (short-answer) questions.
 */
export function scoreExam(
  questions: Question[],
  answers: Record<string, number | boolean | string>,
  overrides: Record<string, boolean> = {},
): number {
  const totalPoints = questions.reduce((s, q) => s + q.points, 0)
  if (totalPoints === 0) return 0
  const earned = questions.reduce((s, q) => {
    const correct = q.id in overrides ? overrides[q.id] : isAnswerCorrect(q, answers[q.id])
    return s + (correct ? q.points : 0)
  }, 0)
  return Math.round((earned / totalPoints) * 100)
}

/** Compute the weighted score breakdown for a single lesson. */
export function computeLessonScore(lesson: Lesson, progress?: LessonProgress): LessonScore {
  // A practice quiz counts if the lesson defines one OR the learner has taken one
  // (practice quizzes are supplied from a separate data set, keyed by lesson id).
  const hasQuiz = (!!lesson.quiz && lesson.quiz.questions.length > 0) || !!progress?.quiz
  const hasExercises = lesson.exercises.length > 0
  const hasAssignment = !!lesson.assignment

  const quiz = hasQuiz ? progress?.quiz?.score ?? 0 : null

  const exercise = hasExercises
    ? Math.round(((progress?.completedExerciseIds.length ?? 0) / lesson.exercises.length) * 100)
    : null

  let assignment: number | null = null
  if (hasAssignment) {
    if (progress?.submission?.score != null) assignment = progress.submission.score
    else if (progress?.submission) assignment = progress.submission.approved ? 100 : 80
    else assignment = 0
  }

  const completion = progress?.completed ? 100 : 0

  // Renormalize weights across the components that actually apply.
  const parts: Array<{ value: number; weight: number }> = [
    { value: completion, weight: WEIGHTS.completion },
  ]
  if (quiz !== null) parts.push({ value: quiz, weight: WEIGHTS.quiz })
  if (exercise !== null) parts.push({ value: exercise, weight: WEIGHTS.exercise })
  if (assignment !== null) parts.push({ value: assignment, weight: WEIGHTS.assignment })

  const weightSum = parts.reduce((s, p) => s + p.weight, 0)
  const total = weightSum === 0 ? 0 : Math.round(parts.reduce((s, p) => s + p.value * p.weight, 0) / weightSum)

  return { quiz, exercise, assignment, completion, total }
}

export function computeModuleScore(
  module: Module,
  progressMap: Record<string, LessonProgress>,
  examScore?: number | null,
): ModuleScore {
  const totalLessons = module.lessons.length
  let completedLessons = 0
  let attempted = 0
  let sum = 0

  for (const lesson of module.lessons) {
    const p = progressMap[lesson.id]
    if (p?.completed) completedLessons++
    if (p && p.status !== 'not_started') {
      attempted++
      sum += computeLessonScore(lesson, p).total
    }
  }

  const lessonAvg = attempted === 0 ? 0 : Math.round(sum / attempted)

  // The exam is the focus: when taken, it weighs 60% of the module score.
  let score: number
  if (examScore != null) {
    score = attempted > 0 ? Math.round(0.4 * lessonAvg + 0.6 * examScore) : examScore
  } else {
    score = lessonAvg
  }

  return {
    moduleId: module.id,
    completedLessons,
    totalLessons,
    score,
    completion: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
    examScore: examScore ?? null,
  }
}

export interface OverallScore {
  completedLessons: number
  totalLessons: number
  completionPct: number
  averageScore: number
  moduleScores: ModuleScore[]
}

export function computeOverall(
  curriculum: Curriculum,
  progressMap: Record<string, LessonProgress>,
  examScores: Record<string, number> = {},
): OverallScore {
  const moduleScores = curriculum.map((m) => computeModuleScore(m, progressMap, examScores[m.id] ?? null))
  const totalLessons = curriculum.reduce((s, m) => s + m.lessons.length, 0)
  const completedLessons = moduleScores.reduce((s, m) => s + m.completedLessons, 0)

  const attemptedModules = moduleScores.filter((m) => m.completedLessons > 0 || m.score > 0)
  const averageScore =
    attemptedModules.length === 0
      ? 0
      : Math.round(attemptedModules.reduce((s, m) => s + m.score, 0) / attemptedModules.length)

  return {
    completedLessons,
    totalLessons,
    completionPct: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
    averageScore,
    moduleScores,
  }
}
