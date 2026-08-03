import { useEffect, useRef } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { audioEngine } from '@/features/study/audio'
import { useChat } from './useChat'

// Only ding for messages that arrived recently, so opening the app doesn't
// replay old ones. Wide enough for normal phone clock skew.
const FRESH_WINDOW_MS = 25_000

/**
 * Plays a gentle notification sound when the *other* person sends a new
 * message. Mount once (globally). De-dupes by id (Firebase re-emits the whole
 * list) and ignores messages older than the freshness window.
 */
export function useMessageWatcher() {
  const { messages } = useChat()
  const role = useSettingsStore((s) => s.role)
  const roleRef = useRef(role)
  roleRef.current = role
  const seen = useRef<Set<string>>(new Set())

  useEffect(() => {
    const now = Date.now()
    const fresh = messages.filter(
      (m) => !seen.current.has(m.id) && m.from !== roleRef.current && now - m.ts < FRESH_WINDOW_MS,
    )
    messages.forEach((m) => seen.current.add(m.id))
    if (fresh.length) audioEngine.notify()
  }, [messages])
}
