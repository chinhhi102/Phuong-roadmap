import type { ActivityEntry, Curriculum, Lesson, LessonProgress } from '@/types'

/**
 * All lessons are open — the course is never locked (by product decision).
 * Prerequisites remain in the data as informational "recommended order" only.
 */
export function isLessonUnlocked(_lesson: Lesson, _progressMap: Record<string, LessonProgress>): boolean {
  return true
}

/** The recommended "current" lesson: first unlocked, not-yet-completed lesson. */
export function findCurrentLesson(
  curriculum: Curriculum,
  progressMap: Record<string, LessonProgress>,
): Lesson | undefined {
  for (const module of curriculum) {
    for (const lesson of module.lessons) {
      const p = progressMap[lesson.id]
      if (!p?.completed && isLessonUnlocked(lesson, progressMap)) return lesson
    }
  }
  return undefined
}

/** Consecutive-day streak ending today (or yesterday if today has no activity yet). */
export function computeStreak(activity: ActivityEntry[]): number {
  if (activity.length === 0) return 0
  const days = new Set(activity.map((a) => a.date.slice(0, 10)))
  let streak = 0
  const cursor = new Date()
  // Allow the streak to still count if the user hasn't studied *yet* today.
  if (!days.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1)
  }
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

/** Total minutes studied across completed + in-progress lessons. */
export function totalHoursStudied(progressMap: Record<string, LessonProgress>): number {
  const mins = Object.values(progressMap).reduce((s, p) => s + (p.timeSpentMin || 0), 0)
  return Math.round((mins / 60) * 10) / 10
}
