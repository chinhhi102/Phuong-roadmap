import type { Exam } from '@/types'
import { examM1Powerbi } from './m1-powerbi-exam'
import { examM2Foundations } from './m2-foundations-exam'
import { examM3Planning } from './m3-planning-exam'
import { examM4Elicitation } from './m4-elicitation-exam'
import { examM5Rlcm } from './m5-rlcm-exam'
import { examM6Strategy } from './m6-strategy-exam'
import { examM7Radd } from './m7-radd-exam'
import { examM8Solution } from './m8-solution-exam'
import { examM9AgileCapstone } from './m9-agile-capstone-exam'

/** One exam per module, keyed by moduleId. */
export const allExams: Exam[] = [
  examM1Powerbi,
  examM2Foundations,
  examM3Planning,
  examM4Elicitation,
  examM5Rlcm,
  examM6Strategy,
  examM7Radd,
  examM8Solution,
  examM9AgileCapstone,
]

const examIndex = new Map<string, Exam>(allExams.map((e) => [e.moduleId, e]))

export function getExam(moduleId: string): Exam | undefined {
  return examIndex.get(moduleId)
}
