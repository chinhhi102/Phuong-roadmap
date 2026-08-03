import { useEffect, useRef } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { emitBuzz } from '@/features/study/bus'
import { useChat } from './useChat'

// Only react to buzzes that arrived recently, so reloading doesn't replay old
// ones. Wide enough to tolerate normal phone clock skew.
const FRESH_WINDOW_MS = 30_000

/**
 * Fires the buzz reaction when the *other* person buzzes you. Mount once
 * (globally). De-dupes by id (Firebase re-emits the whole list) and ignores
 * buzzes older than the freshness window.
 */
export function useBuzzWatcher() {
  const { buzzes } = useChat()
  const role = useSettingsStore((s) => s.role)
  const roleRef = useRef(role)
  roleRef.current = role
  const seen = useRef<Set<string>>(new Set())

  useEffect(() => {
    const now = Date.now()
    const fresh = buzzes.filter(
      (b) => !seen.current.has(b.id) && b.from !== roleRef.current && now - b.ts < FRESH_WINDOW_MS,
    )
    // Mark every buzz in this snapshot as seen so none can fire twice.
    buzzes.forEach((b) => seen.current.add(b.id))
    if (fresh.length) emitBuzz(fresh[fresh.length - 1].from)
  }, [buzzes])
}
