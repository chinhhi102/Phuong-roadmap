import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS, zustandStorage } from '@/services/storage'

export interface Note {
  content: string
  updatedAt: string // ISO
}

interface NotesState {
  notes: Record<string, Note>
  setNote: (lessonId: string, content: string) => void
  getNote: (lessonId: string) => Note | undefined
  /** All lesson ids that have non-empty notes (for the notes search view). */
  lessonIdsWithNotes: () => string[]
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: {},
      setNote: (lessonId, content) =>
        set((state) => ({
          notes: { ...state.notes, [lessonId]: { content, updatedAt: new Date().toISOString() } },
        })),
      getNote: (lessonId) => get().notes[lessonId],
      lessonIdsWithNotes: () =>
        Object.entries(get().notes)
          .filter(([, n]) => n.content.trim().length > 0)
          .map(([id]) => id),
    }),
    {
      name: STORAGE_KEYS.notes,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ notes: state.notes }),
    },
  ),
)
