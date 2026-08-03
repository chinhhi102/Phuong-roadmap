// ============================================================================
// Achievements — cozy milestones celebrated with gentle animations.
//
// Definitions are pure data + a predicate over `Facts`. Facts are derived from
// the progress store (lessons, quizzes, module completion) and the study store
// (focus minutes, streak), so unlocking stays decoupled from where the numbers
// live.
// ============================================================================

import { curriculum } from '@/data/curriculum'
import type { LessonProgress } from '@/types'
import type { DayStat } from '@/store/studyStore'
import { focusStreak } from '@/store/studyStore'

export interface Facts {
  lessonsCompleted: number
  quizzesPassed: number
  focusStreakDays: number
  totalFocusMin: number
  completedModuleIds: Set<string>
  totalLessons: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  emoji: string
  check: (f: Facts) => boolean
}

/** Approximate "passed": auto-graded score at or above a friendly bar. */
const PASS_BAR = 70

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'First Lesson', description: 'Completed your very first lesson.', emoji: '🌱', check: (f) => f.lessonsCompleted >= 1 },
  { id: 'first-quiz', title: 'First Quiz Passed', description: 'Passed your first practice quiz.', emoji: '🧠', check: (f) => f.quizzesPassed >= 1 },
  { id: 'streak-5', title: '5-Day Study Streak', description: 'Focused five days in a row.', emoji: '🔥', check: (f) => f.focusStreakDays >= 5 },
  { id: 'focus-10h', title: '10 Hours Focused', description: 'Ten hours of deep focus time.', emoji: '⏳', check: (f) => f.totalFocusMin >= 600 },
  { id: 'ba-beginner', title: 'BA Beginner', description: 'Finished the BA Foundations module.', emoji: '🎓', check: (f) => f.completedModuleIds.has('m2-foundations') },
  { id: 'requirements-master', title: 'Requirements Master', description: 'Completed Requirements Life Cycle Management.', emoji: '📋', check: (f) => f.completedModuleIds.has('m5-rlcm') },
  { id: 'process-modeling', title: 'Process Modeling Expert', description: 'Completed Requirements Analysis & Design.', emoji: '🗺️', check: (f) => f.completedModuleIds.has('m7-radd') },
  { id: 'roadmap-complete', title: 'Roadmap Completed', description: 'Every lesson in the roadmap — done!', emoji: '🏆', check: (f) => f.totalLessons > 0 && f.lessonsCompleted >= f.totalLessons },
]

const ACHIEVEMENT_INDEX = new Map(ACHIEVEMENTS.map((a) => [a.id, a]))
export const getAchievement = (id: string) => ACHIEVEMENT_INDEX.get(id)

/** Derive the current facts from stored progress + study statistics. */
export function computeFacts(
  progress: Record<string, LessonProgress>,
  dailyFocus: Record<string, DayStat>,
  totalFocusMin: number,
): Facts {
  let lessonsCompleted = 0
  let quizzesPassed = 0
  for (const p of Object.values(progress)) {
    if (p.completed) lessonsCompleted++
    if (p.quiz && p.quiz.score >= PASS_BAR) quizzesPassed++
  }

  const completedModuleIds = new Set<string>()
  for (const module of curriculum) {
    if (module.lessons.length > 0 && module.lessons.every((l) => progress[l.id]?.completed)) {
      completedModuleIds.add(module.id)
    }
  }

  const totalLessons = curriculum.reduce((n, m) => n + m.lessons.length, 0)

  return {
    lessonsCompleted,
    quizzesPassed,
    focusStreakDays: focusStreak(dailyFocus),
    totalFocusMin,
    completedModuleIds,
    totalLessons,
  }
}
