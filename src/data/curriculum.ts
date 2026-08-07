import type { Curriculum, Lesson, Module } from '@/types'
import { module1Powerbi } from './modules/module1-powerbi'
import { module2Foundations } from './modules/module2-foundations'
import { module3Planning } from './modules/module3-planning'
import { module4Elicitation } from './modules/module4-elicitation'
import { module5Rlcm } from './modules/module5-rlcm'
import { module6Strategy } from './modules/module6-strategy'
import { module7Radd } from './modules/module7-radd'
import { module8Solution } from './modules/module8-solution'
import { module9AgileCapstone } from './modules/module9-agile-capstone'

/**
 * The complete Business Analyst learning path, in study order.
 * Structure follows Simplilearn's BA program: Power BI (PL-300) first, then the
 * IIBA BABOK v3 knowledge areas, then Agile/tools and a capstone.
 */
export const curriculum: Curriculum = [
  module1Powerbi, // Power BI & Data Visualization
  module2Foundations, // BA Foundations & Core Concepts (BACCM)
  module3Planning, // KA1 — BA Planning & Monitoring
  module4Elicitation, // KA2 — Elicitation & Collaboration
  module5Rlcm, // KA3 — Requirements Life Cycle Management
  module6Strategy, // KA4 — Strategy Analysis
  module7Radd, // KA5 — Requirements Analysis & Design Definition
  module8Solution, // KA6 — Solution Evaluation
  module9AgileCapstone, // Agile, Tools & Capstone
]

/** Flat list of every lesson across all modules, in order. */
export const allLessons: Lesson[] = curriculum.flatMap((m) => m.lessons)

const lessonIndex = new Map<string, Lesson>(allLessons.map((l) => [l.id, l]))
const moduleIndex = new Map<string, Module>(curriculum.map((m) => [m.id, m]))
const lessonPosition = new Map<string, number>(allLessons.map((l, i) => [l.id, i]))

export function getLesson(id: string): Lesson | undefined {
  return lessonIndex.get(id)
}

export function getModule(id: string): Module | undefined {
  return moduleIndex.get(id)
}

export function getModuleOfLesson(lessonId: string): Module | undefined {
  const lesson = lessonIndex.get(lessonId)
  return lesson ? moduleIndex.get(lesson.moduleId) : undefined
}

/** 1-based global lesson number. */
export function getLessonNumber(lessonId: string): number {
  return (lessonPosition.get(lessonId) ?? 0) + 1
}

export function getNextLesson(lessonId: string): Lesson | undefined {
  const pos = lessonPosition.get(lessonId)
  return pos === undefined ? undefined : allLessons[pos + 1]
}

export function getPrevLesson(lessonId: string): Lesson | undefined {
  const pos = lessonPosition.get(lessonId)
  return pos === undefined || pos === 0 ? undefined : allLessons[pos - 1]
}

export const TOTAL_LESSONS = allLessons.length
