import { useEffect, useState } from 'react'
import { subscribeReview, type ExamReview } from './learnerSync'

/**
 * Instructor side: the grading currently published for each module exam.
 *
 * Reads from the shared room rather than local state so the buttons always show
 * what the learner is actually seeing — Firebase applies a `set` locally before
 * the round trip, so a click still feels immediate.
 */
export function useExamReviews(): Record<string, ExamReview> {
  const [reviews, setReviews] = useState<Record<string, ExamReview>>({})
  useEffect(() => subscribeReview((r) => setReviews(r?.exams ?? {})), [])
  return reviews
}
