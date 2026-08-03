import { useEffect, useState } from 'react'
import { subscribeLearner, type LearnerSnapshot } from './learnerSync'

/** Live snapshot of the learner's (Phương's) progress from the shared room. */
export function useLearnerProgress(): LearnerSnapshot | null {
  const [snap, setSnap] = useState<LearnerSnapshot | null>(null)
  useEffect(() => subscribeLearner(setSnap), [])
  return snap
}
