import { useMemo } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS, zustandStorage } from '@/services/storage'
import { scoreExam } from '@/lib/scoring'
import type { Exam, ExamAttempt } from '@/types'

/** Override maps are small and flat, so a shallow compare is exact here. */
function sameOverrides(a: Record<string, boolean>, b: Record<string, boolean>): boolean {
  const ka = Object.keys(a)
  const kb = Object.keys(b)
  return ka.length === kb.length && ka.every((k) => a[k] === b[k])
}

interface ExamState {
  attempts: Record<string, ExamAttempt>
  submit: (exam: Exam, answers: Record<string, number | boolean | string>) => void
  /** Instructor override of one question's correctness; pass null to clear. */
  setOverride: (exam: Exam, questionId: string, correct: boolean | null) => void
  /** Adopt the instructor's grading of an exam, received from the shared room. */
  applyReview: (exam: Exam, overrides: Record<string, boolean>) => void
  reset: (moduleId: string) => void
  /** moduleId -> final score, for scoring/aggregation. */
  scores: () => Record<string, number>
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      attempts: {},

      submit: (exam, answers) => {
        const autoScore = scoreExam(exam.questions, answers)
        const attempt: ExamAttempt = {
          moduleId: exam.moduleId,
          answers,
          overrides: {},
          autoScore,
          score: autoScore,
          submittedAt: new Date().toISOString(),
        }
        set((state) => ({ attempts: { ...state.attempts, [exam.moduleId]: attempt } }))
      },

      setOverride: (exam, questionId, correct) => {
        set((state) => {
          const attempt = state.attempts[exam.moduleId]
          if (!attempt) return state
          const overrides = { ...attempt.overrides }
          if (correct === null) delete overrides[questionId]
          else overrides[questionId] = correct
          const score = scoreExam(exam.questions, attempt.answers, overrides)
          return { attempts: { ...state.attempts, [exam.moduleId]: { ...attempt, overrides, score } } }
        })
      },

      applyReview: (exam, overrides) => {
        set((state) => {
          const attempt = state.attempts[exam.moduleId]
          if (!attempt) return state
          // Bail when nothing changed — this runs on every remote update, and a
          // no-op write would re-publish the snapshot and bounce back forever.
          if (sameOverrides(attempt.overrides, overrides)) return state
          const score = scoreExam(exam.questions, attempt.answers, overrides)
          return { attempts: { ...state.attempts, [exam.moduleId]: { ...attempt, overrides, score } } }
        })
      },

      reset: (moduleId) =>
        set((state) => {
          const next = { ...state.attempts }
          delete next[moduleId]
          return { attempts: next }
        }),

      scores: () =>
        Object.fromEntries(Object.entries(get().attempts).map(([moduleId, a]) => [moduleId, a.score])),
    }),

    {
      name: STORAGE_KEYS.exams,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ attempts: state.attempts }),
    },
  ),
)

/** Memoized moduleId → final exam score, for scoring aggregation in the UI. */
export function useExamScores(): Record<string, number> {
  const attempts = useExamStore((s) => s.attempts)
  return useMemo(
    () => Object.fromEntries(Object.entries(attempts).map(([id, a]) => [id, a.score])),
    [attempts],
  )
}
