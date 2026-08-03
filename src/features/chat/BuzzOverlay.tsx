// ============================================================================
// Buzz reaction — when the other person buzzes you: the page shakes, a buzzer
// sound plays, the phone vibrates, and a bold banner drops in.
// ============================================================================

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { studyBus } from '@/features/study/bus'
import { audioEngine } from '@/features/study/audio'
import { usePrefersReducedMotion } from '@/features/study/useMotion'
import type { Author } from '@/types'

const LABEL: Record<Author, string> = { learner: 'Phương', instructor: 'Chính' }

export function BuzzOverlay() {
  const reduced = usePrefersReducedMotion()
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced
  const [buzz, setBuzz] = useState<{ from: Author; key: number } | null>(null)
  const seq = useRef(0)

  useEffect(() => {
    return studyBus.on((e) => {
      if (e.type !== 'buzz') return
      setBuzz({ from: e.from, key: ++seq.current })
      audioEngine.buzz()
      try { navigator.vibrate?.([120, 60, 120]) } catch { /* not supported */ }
      if (!reducedRef.current) {
        document.body.classList.add('study-shake')
        window.setTimeout(() => document.body.classList.remove('study-shake'), 650)
      }
      window.setTimeout(() => setBuzz(null), 2600)
    })
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[95] grid justify-items-center px-4">
      <AnimatePresence>
        {buzz && (
          <motion.div
            key={buzz.key}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -24, scale: 0.9 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            className="flex items-center gap-2 rounded-2xl px-5 py-3 text-white shadow-2xl [grid-area:1/1]"
            style={{ background: 'linear-gradient(135deg,#ff4f9a,#ff9e40)' }}
          >
            <motion.span animate={reduced ? undefined : { rotate: [0, -20, 20, -10, 0] }} transition={{ duration: 0.5, repeat: 2 }}>
              <Zap className="h-6 w-6" fill="currentColor" />
            </motion.span>
            <span className="text-sm font-extrabold">{LABEL[buzz.from]} vừa buzz bạn nè! 💥</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
