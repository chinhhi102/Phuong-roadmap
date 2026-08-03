import { useEffect, useRef } from 'react'
import { useProgressStore } from '@/store/progressStore'
import { useSettingsStore } from '@/store/settingsStore'
import { isFirebaseConfigured } from '@/services/firebase'
import { computeSnapshot, publishSnapshot } from './learnerSync'

/**
 * On the learner's device, mirrors her progress to the shared room (debounced)
 * so the instructor can watch it live. No-op unless the role is "learner" and
 * Firebase is configured.
 */
export function useProgressPublisher() {
  const progress = useProgressStore((s) => s.progress)
  const activity = useProgressStore((s) => s.activity)
  const role = useSettingsStore((s) => s.role)
  const name = useSettingsStore((s) => s.learnerName)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (role !== 'learner' || !isFirebaseConfigured()) return
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      publishSnapshot(computeSnapshot(progress, activity, name))
    }, 1200)
    return () => window.clearTimeout(timer.current)
  }, [progress, activity, role, name])
}
