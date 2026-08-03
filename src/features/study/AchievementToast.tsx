// ============================================================================
// Achievement celebration — a tasteful badge that slides in at the top,
// queued so multiple unlocks show one after another.
// ============================================================================

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { studyBus } from './bus'
import { getAchievement } from './achievements'
import { usePrefersReducedMotion } from './useMotion'

interface Display {
  key: string
  emoji: string
  title: string
  description: string
}

let seq = 0

export function AchievementToast() {
  const reduced = usePrefersReducedMotion()
  const [queue, setQueue] = useState<Display[]>([])
  const [current, setCurrent] = useState<Display | null>(null)

  useEffect(() => {
    return studyBus.on((e) => {
      if (e.type !== 'achievement') return
      const a = getAchievement(e.id)
      if (!a) return
      setQueue((q) => [...q, { key: `a${seq++}`, emoji: a.emoji, title: a.title, description: a.description }])
    })
  }, [])

  useEffect(() => {
    if (current || queue.length === 0) return
    const [next, ...rest] = queue
    setCurrent(next)
    setQueue(rest)
    const t = window.setTimeout(() => setCurrent(null), 5000)
    return () => window.clearTimeout(t)
  }, [current, queue])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[80] grid justify-items-center px-4">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.key}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -24, scale: 0.9 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="study-glass study-glow flex items-center gap-3 rounded-2xl px-5 py-3 shadow-xl [grid-area:1/1]"
          >
            <motion.span
              className="text-3xl"
              animate={reduced ? undefined : { rotate: [0, -12, 12, -6, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.9 }}
            >
              {current.emoji}
            </motion.span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[hsl(var(--primary))]">Achievement unlocked</p>
              <p className="text-sm font-bold leading-tight text-[hsl(var(--foreground))]">{current.title}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">{current.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
