// ============================================================================
// Study companion — a small, friendly mascot that occasionally reacts.
// It waves on arrival, cheers after wins, and gently nudges you to rest.
// Reactions are brief and infrequent; it just breathes quietly the rest of
// the time. Hidden entirely when the companion toggle is off.
// ============================================================================

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStudyStore } from '@/store/studyStore'
import { studyBus, type CompanionReaction } from './bus'
import { useAnimations } from './useMotion'

const FACE: Record<CompanionReaction, string> = {
  idle: '🐰',
  wave: '🐰',
  cheer: '🐰',
  celebrate: '🥳',
  stretch: '🧘‍♀️',
  hydrate: '🧋',
}

// Cheers are Vietnamese (only the encouragement is localized; UI stays English).
const BUBBLE: Partial<Record<CompanionReaction, string>> = {
  wave: 'Chào cậu! Mình học cùng nhau nha 🌸',
  cheer: 'Giỏi quá đi! 💖',
  celebrate: 'Tự hào về cậu lắm! 🎉',
  stretch: 'Vươn vai chút nào~ 🧘‍♀️',
  hydrate: 'Uống ngụm nước nhé 💧',
}

export function Companion() {
  const companionOn = useStudyStore((s) => s.companionOn)
  const animate = useAnimations()
  const [reaction, setReaction] = useState<CompanionReaction>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    return studyBus.on((e) => {
      if (e.type === 'companion') react(e.reaction)
      else if (e.type === 'celebrate') react('celebrate')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function react(r: CompanionReaction) {
    window.clearTimeout(timer.current)
    setReaction(r)
    timer.current = window.setTimeout(() => setReaction('idle'), 5000)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  if (!companionOn) return null
  const active = reaction !== 'idle'
  const bubble = active ? BUBBLE[reaction] : undefined

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[65] flex flex-col items-start gap-2">
      <AnimatePresence>
        {bubble && (
          <motion.div
            key={bubble}
            initial={{ opacity: 0, y: 14, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 440, damping: 20 }}
            className="relative ml-1 max-w-[72vw] text-balance rounded-2xl rounded-bl-md px-4 py-2.5 text-sm font-bold text-white shadow-xl sm:max-w-[240px]"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}
          >
            {bubble}
            {/* little pointer toward the rabbit */}
            <span className="absolute -bottom-1.5 left-4 h-4 w-4 rotate-45 rounded-[3px]" style={{ background: 'hsl(var(--accent))' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative grid h-16 w-16 place-items-center rounded-full text-4xl shadow-xl"
        style={{ background: 'linear-gradient(135deg, hsl(var(--card)), hsl(var(--muted)))', border: '2px solid hsl(var(--primary) / 0.5)' }}
        animate={
          !animate
            ? undefined
            : reaction === 'idle'
              ? { scale: [1, 1.06, 1], y: [0, -2, 0] }
              : reaction === 'wave'
                ? { rotate: [0, -14, 14, -8, 0] }
                : { scale: [1, 1.28, 1], rotate: [0, -8, 8, 0] }
        }
        transition={
          reaction === 'idle'
            ? { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.9 }
        }
      >
        {/* attention ping ring while reacting */}
        {active && animate && (
          <motion.span
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: 'hsl(var(--primary))' }}
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span aria-hidden>{FACE[reaction]}</span>
      </motion.div>
    </div>
  )
}
