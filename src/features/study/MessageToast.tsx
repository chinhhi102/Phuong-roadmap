// ============================================================================
// Motivational message toasts — warm, personalized, auto-dismissing.
// Never modal, never blocking; they drift in at the corner and fade away.
// ============================================================================

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSettingsStore } from '@/store/settingsStore'
import { useStudyStore } from '@/store/studyStore'
import { studyBus } from './bus'
import { nextMessage } from './messages'
import { usePrefersReducedMotion } from './useMotion'

interface Toast {
  id: string
  text: string
}

let seq = 0

export function MessageToast() {
  const popupsOn = useStudyStore((s) => s.popupsOn)
  const learnerName = useSettingsStore((s) => s.learnerName)
  const reduced = usePrefersReducedMotion()

  const [toasts, setToasts] = useState<Toast[]>([])
  const cfg = useRef({ popupsOn, learnerName })
  cfg.current = { popupsOn, learnerName }

  useEffect(() => {
    return studyBus.on((e) => {
      if (e.type !== 'message' || !cfg.current.popupsOn) return
      const id = `t${seq++}`
      const text = nextMessage(e.context, cfg.current.learnerName)
      setToasts((prev) => [...prev.slice(-2), { id, text }])
      window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5400)
    })
  }, [])

  if (!popupsOn) return null

  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-[70] flex max-w-[86vw] flex-col items-end gap-2 sm:max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.92 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="study-glass pointer-events-auto text-pretty rounded-2xl px-4 py-2.5 text-sm font-medium leading-snug text-[hsl(var(--foreground))] shadow-lg"
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
