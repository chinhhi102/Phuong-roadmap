import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS, zustandStorage } from '@/services/storage'
import { uid } from '@/lib/utils'
import { scoreExam } from '@/lib/scoring'
import type {
  ActivityEntry,
  Author,
  Comment,
  LessonProgress,
  Quiz,
} from '@/types'

function defaultProgress(lessonId: string): LessonProgress {
  return {
    lessonId,
    status: 'not_started',
    completed: false,
    completedExerciseIds: [],
    comments: [],
    approved: false,
    timeSpentMin: 0,
  }
}

interface ProgressState {
  progress: Record<string, LessonProgress>
  activity: ActivityEntry[]
  bookmarks: string[]
  favorites: string[]
  recentlyViewed: string[]
  lastLessonId?: string

  get: (lessonId: string) => LessonProgress | undefined
  visit: (lessonId: string, title: string) => void
  addTime: (lessonId: string, minutes: number) => void
  toggleExercise: (lessonId: string, exerciseId: string) => void
  submitQuiz: (lessonId: string, quiz: Quiz, answers: Record<string, number | boolean | string>, title: string) => void
  setQuizOverride: (lessonId: string, quiz: Quiz, questionId: string, correct: boolean | null) => void
  resetQuiz: (lessonId: string) => void
  submitAssignment: (lessonId: string, text: string, title: string) => void
  reviewAssignment: (lessonId: string, score: number, approved: boolean) => void
  addComment: (lessonId: string, author: Author, text: string) => void
  setComplete: (lessonId: string, completed: boolean, title: string) => void
  toggleBookmark: (lessonId: string) => void
  toggleFavorite: (lessonId: string) => void
  resetLesson: (lessonId: string) => void
  logNote: (lessonId: string, title: string) => void
}

const MAX_ACTIVITY = 200

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => {
      const patch = (lessonId: string, fn: (p: LessonProgress) => LessonProgress) => {
        set((state) => {
          const current = state.progress[lessonId] ?? defaultProgress(lessonId)
          return { progress: { ...state.progress, [lessonId]: fn(current) } }
        })
      }

      const log = (entry: Omit<ActivityEntry, 'id' | 'date'>) => {
        set((state) => ({
          activity: [
            { ...entry, id: uid('act'), date: new Date().toISOString() },
            ...state.activity,
          ].slice(0, MAX_ACTIVITY),
        }))
      }

      return {
        progress: {},
        activity: [],
        bookmarks: [],
        favorites: [],
        recentlyViewed: [],
        lastLessonId: undefined,

        get: (lessonId) => get().progress[lessonId],

        visit: (lessonId, title) => {
          patch(lessonId, (p) => ({
            ...p,
            status: p.status === 'not_started' ? 'in_progress' : p.status,
            lastVisited: new Date().toISOString(),
          }))
          set((state) => ({
            lastLessonId: lessonId,
            recentlyViewed: [lessonId, ...state.recentlyViewed.filter((id) => id !== lessonId)].slice(0, 12),
          }))
          log({ lessonId, kind: 'viewed', label: `Opened “${title}”` })
        },

        addTime: (lessonId, minutes) =>
          patch(lessonId, (p) => ({ ...p, timeSpentMin: p.timeSpentMin + minutes })),

        toggleExercise: (lessonId, exerciseId) =>
          patch(lessonId, (p) => {
            const has = p.completedExerciseIds.includes(exerciseId)
            return {
              ...p,
              status: p.status === 'not_started' ? 'in_progress' : p.status,
              completedExerciseIds: has
                ? p.completedExerciseIds.filter((id) => id !== exerciseId)
                : [...p.completedExerciseIds, exerciseId],
            }
          }),

        submitQuiz: (lessonId, quiz, answers, title) => {
          const autoScore = scoreExam(quiz.questions, answers)
          patch(lessonId, (p) => ({
            ...p,
            status: p.status === 'not_started' ? 'in_progress' : p.status,
            quiz: { answers, overrides: {}, autoScore, score: autoScore, takenAt: new Date().toISOString() },
          }))
          log({ lessonId, kind: 'quiz', label: `Scored ${autoScore}% on “${title}” quiz` })
        },

        setQuizOverride: (lessonId, quiz, questionId, correct) =>
          patch(lessonId, (p) => {
            if (!p.quiz) return p
            const overrides = { ...p.quiz.overrides }
            if (correct === null) delete overrides[questionId]
            else overrides[questionId] = correct
            const score = scoreExam(quiz.questions, p.quiz.answers, overrides)
            return { ...p, quiz: { ...p.quiz, overrides, score } }
          }),

        resetQuiz: (lessonId) => patch(lessonId, (p) => ({ ...p, quiz: undefined })),

        submitAssignment: (lessonId, text, title) => {
          patch(lessonId, (p) => ({
            ...p,
            status: p.status === 'not_started' ? 'in_progress' : p.status,
            submission: { text, submittedAt: new Date().toISOString(), approved: false },
          }))
          log({ lessonId, kind: 'assignment', label: `Submitted assignment for “${title}”` })
        },

        reviewAssignment: (lessonId, score, approved) =>
          patch(lessonId, (p) =>
            p.submission
              ? { ...p, approved, submission: { ...p.submission, score, approved } }
              : p,
          ),

        addComment: (lessonId, author, text) => {
          const comment: Comment = { id: uid('c'), author, text, createdAt: new Date().toISOString() }
          patch(lessonId, (p) => ({ ...p, comments: [...p.comments, comment] }))
        },

        setComplete: (lessonId, completed, title) => {
          patch(lessonId, (p) => ({
            ...p,
            completed,
            status: completed ? 'completed' : 'in_progress',
          }))
          if (completed) log({ lessonId, kind: 'completed', label: `Completed “${title}”` })
        },

        toggleBookmark: (lessonId) =>
          set((state) => ({
            bookmarks: state.bookmarks.includes(lessonId)
              ? state.bookmarks.filter((id) => id !== lessonId)
              : [...state.bookmarks, lessonId],
          })),

        toggleFavorite: (lessonId) =>
          set((state) => ({
            favorites: state.favorites.includes(lessonId)
              ? state.favorites.filter((id) => id !== lessonId)
              : [...state.favorites, lessonId],
          })),

        resetLesson: (lessonId) =>
          set((state) => {
            const next = { ...state.progress }
            delete next[lessonId]
            return { progress: next }
          }),

        logNote: (lessonId, title) => log({ lessonId, kind: 'note', label: `Edited notes for “${title}”` }),
      }
    },
    {
      name: STORAGE_KEYS.progress,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        progress: state.progress,
        activity: state.activity,
        bookmarks: state.bookmarks,
        favorites: state.favorites,
        recentlyViewed: state.recentlyViewed,
        lastLessonId: state.lastLessonId,
      }),
    },
  ),
)
