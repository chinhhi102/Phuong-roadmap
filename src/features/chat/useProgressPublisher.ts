import { useEffect, useRef } from 'react'
import { create } from 'zustand'
import { useProgressStore } from '@/store/progressStore'
import { useExamStore } from '@/store/examStore'
import { useNotesStore } from '@/store/notesStore'
import { useSettingsStore } from '@/store/settingsStore'
import { isFirebaseConfigured } from '@/services/firebase'
import { isInstructorDevice } from '@/services/deviceIdentity'
import { computeSnapshot, publishSnapshot, type PublishResult } from './learnerSync'

const DEBOUNCE_MS = 1200

interface ShareStatus {
  /** Outcome of the last publish attempt; null while the device isn't sharing. */
  result: PublishResult | null
  at: number | null
  set: (result: PublishResult | null) => void
}

/** Last publish outcome, so Settings can explain a device that isn't sharing. */
export const useShareStatus = create<ShareStatus>()((set) => ({
  result: null,
  at: null,
  set: (result) => set({ result, at: result === 'published' ? Date.now() : null }),
}))

/**
 * On the learner's device, publishes her work — progress, exam attempts,
 * assignment submissions and notes — to the shared room so the instructor can
 * review it live. No-op on an instructor device, or when Firebase isn't set up.
 */
export function useProgressPublisher(): void {
  const progress = useProgressStore((s) => s.progress)
  const activity = useProgressStore((s) => s.activity)
  const attempts = useExamStore((s) => s.attempts)
  const notes = useNotesStore((s) => s.notes)
  const role = useSettingsStore((s) => s.role)
  const name = useSettingsStore((s) => s.learnerName)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const report = useShareStatus.getState().set
    if (role !== 'learner' || isInstructorDevice() || !isFirebaseConfigured()) {
      report(null)
      return
    }
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      void publishSnapshot(computeSnapshot({ progress, activity, attempts, notes, name })).then(report)
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(timer.current)
  }, [progress, activity, attempts, notes, role, name])
}
