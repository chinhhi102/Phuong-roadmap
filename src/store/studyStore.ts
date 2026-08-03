// ============================================================================
// Study Mode store — the cozy Pomodoro + companion experience.
//
// Persists timer settings, focus statistics, sound preferences, feature
// toggles, and unlocked achievements through the shared storage layer, so a
// learner's setup follows them across sessions (localStorage or the XML server
// backend — this store doesn't care which).
// ============================================================================

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS, zustandStorage } from '@/services/storage'
import { clamp, todayKey } from '@/lib/utils'

export type PomodoroPreset = '45/5' | '25/5' | '50/10' | '90/20' | 'custom'

/** Focus / break minutes for each named preset. */
export const PRESETS: Record<Exclude<PomodoroPreset, 'custom'>, { focus: number; break: number }> = {
  '45/5': { focus: 45, break: 5 },
  '25/5': { focus: 25, break: 5 },
  '50/10': { focus: 50, break: 10 },
  '90/20': { focus: 90, break: 20 },
}

export type Ambient = 'none' | 'rain' | 'cafe' | 'fire' | 'nature' | 'keyboard' | 'lofi'

export const AMBIENTS: { id: Ambient; label: string; emoji: string }[] = [
  { id: 'none', label: 'Silence', emoji: '🤫' },
  { id: 'rain', label: 'Rain', emoji: '🌧️' },
  { id: 'cafe', label: 'Café', emoji: '☕' },
  { id: 'fire', label: 'Fireplace', emoji: '🔥' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'keyboard', label: 'Keyboard', emoji: '⌨️' },
  { id: 'lofi', label: 'Lo-fi', emoji: '🎧' },
]

/** Which audio source is currently driving the ambience. */
export type AudioSource = 'builtin' | 'youtube' | 'custom'

export interface DayStat {
  focusMin: number
  sessions: number
}

interface StudyState {
  // Pomodoro configuration
  preset: PomodoroPreset
  focusMin: number
  breakMin: number
  autoStart: boolean

  // Sound preferences
  soundEnabled: boolean
  tickingEnabled: boolean
  ambient: Ambient
  audioSource: AudioSource
  youtubeUrl: string
  customAudioUrl: string
  volume: number // 0–1
  muted: boolean

  // Experience toggles
  pinkPage: boolean // paint the whole reading area pink
  animationsOn: boolean // decorative motion (respects prefers-reduced-motion too)
  popupsOn: boolean // motivational message toasts
  companionOn: boolean // floating study companion

  // Statistics + progress
  dailyFocus: Record<string, DayStat> // dateKey -> stats
  totalFocusMin: number
  totalSessions: number
  unlocked: Record<string, string> // achievementId -> ISO timestamp
  chatReadTs: number // last time chat was read (for the unread badge)

  // actions
  setPreset: (p: PomodoroPreset) => void
  setCustom: (focusMin: number, breakMin: number) => void
  toggleAutoStart: () => void
  toggleSound: () => void
  toggleTicking: () => void
  setAmbient: (a: Ambient) => void
  setAudioSource: (s: AudioSource) => void
  setYoutubeUrl: (url: string) => void
  setCustomAudioUrl: (url: string) => void
  setVolume: (v: number) => void
  toggleMute: () => void
  togglePinkPage: () => void
  toggleAnimations: () => void
  togglePopups: () => void
  toggleCompanion: () => void
  recordFocus: (minutes: number) => void
  /** Returns true only when the achievement was newly unlocked (for celebrations). */
  unlockAchievement: (id: string) => boolean
  markChatRead: () => void
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      preset: '45/5',
      focusMin: 45,
      breakMin: 5,
      autoStart: false,

      soundEnabled: true,
      tickingEnabled: false,
      ambient: 'none',
      audioSource: 'builtin',
      youtubeUrl: '',
      customAudioUrl: '',
      volume: 0.5,
      muted: false,

      pinkPage: true,
      animationsOn: true,
      popupsOn: true,
      companionOn: true,

      dailyFocus: {},
      totalFocusMin: 0,
      totalSessions: 0,
      unlocked: {},
      chatReadTs: 0,

      setPreset: (preset) =>
        set(() =>
          preset === 'custom'
            ? { preset }
            : { preset, focusMin: PRESETS[preset].focus, breakMin: PRESETS[preset].break },
        ),

      setCustom: (focusMin, breakMin) =>
        set({
          preset: 'custom',
          focusMin: clamp(Math.round(focusMin), 1, 180),
          breakMin: clamp(Math.round(breakMin), 1, 60),
        }),

      toggleAutoStart: () => set((s) => ({ autoStart: !s.autoStart })),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleTicking: () => set((s) => ({ tickingEnabled: !s.tickingEnabled })),
      setAmbient: (ambient) => set({ ambient }),
      setAudioSource: (audioSource) => set({ audioSource }),
      setYoutubeUrl: (youtubeUrl) => set({ youtubeUrl }),
      setCustomAudioUrl: (customAudioUrl) => set({ customAudioUrl }),
      setVolume: (v) => set({ volume: clamp(v, 0, 1) }),
      toggleMute: () => set((s) => ({ muted: !s.muted })),
      togglePinkPage: () => set((s) => ({ pinkPage: !s.pinkPage })),
      toggleAnimations: () => set((s) => ({ animationsOn: !s.animationsOn })),
      togglePopups: () => set((s) => ({ popupsOn: !s.popupsOn })),
      toggleCompanion: () => set((s) => ({ companionOn: !s.companionOn })),

      recordFocus: (minutes) =>
        set((s) => {
          const key = todayKey()
          const day = s.dailyFocus[key] ?? { focusMin: 0, sessions: 0 }
          return {
            dailyFocus: {
              ...s.dailyFocus,
              [key]: { focusMin: day.focusMin + minutes, sessions: day.sessions + 1 },
            },
            totalFocusMin: s.totalFocusMin + minutes,
            totalSessions: s.totalSessions + 1,
          }
        }),

      unlockAchievement: (id) => {
        if (get().unlocked[id]) return false
        set((s) => ({ unlocked: { ...s.unlocked, [id]: new Date().toISOString() } }))
        return true
      },

      markChatRead: () => set({ chatReadTs: Date.now() }),
    }),
    {
      name: STORAGE_KEYS.study,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
)

/** Focus stats for the last `days` calendar days (oldest → newest) for charts. */
export function weeklyFocus(dailyFocus: Record<string, DayStat>, days = 7): { day: string; label: string; focusMin: number; sessions: number }[] {
  const out: { day: string; label: string; focusMin: number; sessions: number }[] = []
  const base = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(base.getDate() - i)
    const key = todayKey(d)
    const stat = dailyFocus[key] ?? { focusMin: 0, sessions: 0 }
    out.push({
      day: key,
      label: d.toLocaleDateString(undefined, { weekday: 'short' }),
      focusMin: stat.focusMin,
      sessions: stat.sessions,
    })
  }
  return out
}

/** Consecutive-day focus streak counting back from today. */
export function focusStreak(dailyFocus: Record<string, DayStat>): number {
  let streak = 0
  const d = new Date()
  // Allow the streak to still count if today has no focus yet but yesterday did.
  if (!dailyFocus[todayKey(d)]?.focusMin) d.setDate(d.getDate() - 1)
  for (;;) {
    const key = todayKey(d)
    if (dailyFocus[key]?.focusMin) {
      streak++
      d.setDate(d.getDate() - 1)
    } else break
  }
  return streak
}
