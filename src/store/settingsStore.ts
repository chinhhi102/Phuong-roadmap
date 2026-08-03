import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS, zustandStorage } from '@/services/storage'
import type { Author } from '@/types'

export type Theme = 'light' | 'dark'

interface SettingsState {
  theme: Theme
  /** Shared UI; the active identity decides who authors comments/reviews. */
  role: Author
  learnerName: string
  sidebarCollapsed: boolean
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  applyTheme: () => void
  setRole: (r: Author) => void
  setLearnerName: (name: string) => void
  toggleSidebar: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      role: 'learner',
      learnerName: 'Phương',
      sidebarCollapsed: false,

      setTheme: (theme) => {
        set({ theme })
        get().applyTheme()
      },
      toggleTheme: () => {
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' })
        get().applyTheme()
      },
      applyTheme: () => {
        const root = document.documentElement
        if (get().theme === 'dark') root.classList.add('dark')
        else root.classList.remove('dark')
      },
      setRole: (role) => set({ role }),
      setLearnerName: (learnerName) => set({ learnerName }),
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => state?.applyTheme(),
    },
  ),
)
