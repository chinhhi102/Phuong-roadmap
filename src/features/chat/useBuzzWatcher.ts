import { useEffect, useRef } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { emitBuzz } from '@/features/study/bus'
import { useChat } from './useChat'

/**
 * Watches incoming buzzes and fires the reaction when the *other* person
 * buzzes you. Mount once (globally). Buzzes that already existed at mount are
 * ignored, so reloading doesn't replay old buzzes.
 */
export function useBuzzWatcher() {
  const { buzzes } = useChat()
  const role = useSettingsStore((s) => s.role)
  const roleRef = useRef(role)
  roleRef.current = role
  const lastTs = useRef<number>(Date.now())

  useEffect(() => {
    const fresh = buzzes.filter((b) => b.from !== roleRef.current && b.ts > lastTs.current)
    if (fresh.length === 0) return
    lastTs.current = Math.max(...fresh.map((b) => b.ts))
    emitBuzz(fresh[fresh.length - 1].from)
  }, [buzzes])
}
