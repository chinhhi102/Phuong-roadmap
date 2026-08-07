import { useEffect } from 'react'
import { useExamStore } from '@/store/examStore'
import { useSettingsStore } from '@/store/settingsStore'
import { getExam } from '@/data/exams'
import { isFirebaseConfigured } from '@/services/firebase'
import { isInstructorDevice } from '@/services/deviceIdentity'
import { subscribeReview } from './learnerSync'

/**
 * On the learner's device, adopts the instructor's grading of her exams so an
 * open question he marked correct raises the score she actually sees.
 *
 * Every attempt is reconciled on each update — including attempts the review no
 * longer mentions — so clearing an override on his side reverts hers too.
 */
export function useReviewReceiver(): void {
  const role = useSettingsStore((s) => s.role)

  useEffect(() => {
    if (role !== 'learner' || isInstructorDevice() || !isFirebaseConfigured()) return
    return subscribeReview((review) => {
      const graded = review?.exams ?? {}
      for (const moduleId of Object.keys(useExamStore.getState().attempts)) {
        const exam = getExam(moduleId)
        if (exam) useExamStore.getState().applyReview(exam, graded[moduleId]?.overrides ?? {})
      }
    })
  }, [role])
}
