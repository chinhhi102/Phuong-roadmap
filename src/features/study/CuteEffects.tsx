// ============================================================================
// Cute companion effects — floating hearts, sparkles, flowers, confetti.
//
// Pure CSS keyframe animations (transform/opacity only, so they stay on the
// GPU) driven off the study event bus. Particles self-expire and the total is
// capped, so nothing accumulates. Nothing renders when decorative motion is
// off or the OS asks to reduce motion.
// ============================================================================

import { useEffect, useRef, useState } from 'react'
import { studyBus, type EffectKind } from './bus'
import { useAnimations } from './useMotion'

const EMOJI: Record<Exclude<EffectKind, 'confetti'>, string[]> = {
  hearts: ['💖', '💕', '💗', '🩷', '💞'],
  sparkles: ['✨', '💫', '⭐', '🌟'],
  stars: ['⭐', '🌟', '✨', '🌠'],
  flowers: ['🌸', '🌷', '🌼', '💐', '🌺'],
  magic: ['💖', '💕', '🌸', '✨', '⭐', '🌷', '🦋', '🎀', '🫧', '🌈', '🐱', '🐶', '☁️', '💫'],
}

const CONFETTI_COLORS = ['#ff8fb1', '#ffc2d4', '#ffd6e8', '#c8a2ff', '#ffe0ac', '#a0e7e5', '#fbc4ab', '#ffffff']

interface Particle {
  id: string
  kind: EffectKind
  left: number
  drift: number
  duration: number
  delay: number
  size: number
  emoji?: string
  color?: string
  spin?: number
  top?: number
  mx?: number
  my?: number
  mr?: number
}

const MAX_PARTICLES = 220
let seq = 0

function make(kind: EffectKind, count: number): Particle[] {
  const out: Particle[] = []
  for (let i = 0; i < count; i++) {
    const id = `p${seq++}`
    if (kind === 'confetti') {
      out.push({
        id, kind,
        left: Math.random() * 100,
        drift: (Math.random() - 0.5) * 160,
        duration: 1.8 + Math.random() * 1.8,
        delay: Math.random() * 0.5,
        size: 6 + Math.random() * 7,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        spin: 360 + Math.random() * 720,
      })
    } else if (kind === 'magic') {
      // Burst outward from a random point (like a little spell).
      out.push({
        id, kind,
        left: Math.random() * 100,
        top: Math.random() * 100,
        drift: 0,
        duration: 2 + Math.random() * 2.4,
        delay: Math.random() * 0.25,
        size: 16 + Math.random() * 26,
        emoji: EMOJI.magic[Math.floor(Math.random() * EMOJI.magic.length)],
        mx: (Math.random() - 0.5) * 900,
        my: (Math.random() - 0.5) * 900,
        mr: (Math.random() - 0.5) * 1000,
      })
    } else {
      const pool = EMOJI[kind]
      out.push({
        id, kind,
        left: 4 + Math.random() * 92,
        drift: (Math.random() - 0.5) * 120,
        duration: 2.4 + Math.random() * 2,
        delay: Math.random() * 0.5,
        size: 14 + Math.random() * 18,
        emoji: pool[Math.floor(Math.random() * pool.length)],
      })
    }
  }
  return out
}

export function CuteEffects() {
  const animate = useAnimations()
  const animateRef = useRef(animate)
  animateRef.current = animate
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    return studyBus.on((e) => {
      if (!animateRef.current) return
      let batch: Particle[] = []
      if (e.type === 'burst') batch = make(e.kind, e.count ?? 14)
      else if (e.type === 'celebrate') batch = [...make('confetti', 46), ...make('hearts', 10)]
      if (!batch.length) return

      setParticles((prev) => [...prev, ...batch].slice(-MAX_PARTICLES))
      const life = Math.max(...batch.map((p) => p.duration + p.delay)) * 1000 + 200
      const ids = new Set(batch.map((p) => p.id))
      window.setTimeout(() => setParticles((prev) => prev.filter((p) => !ids.has(p.id))), life)
    })
  }, [])

  if (!animate || particles.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {particles.map((p) => {
        const style = {
          left: `${p.left}%`,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          ['--drift' as string]: `${p.drift}px`,
          ['--spin' as string]: `${p.spin ?? 0}deg`,
        } as React.CSSProperties
        if (p.kind === 'confetti') {
          return (
            <span
              key={p.id}
              className="study-confetti"
              style={{ ...style, width: p.size, height: p.size * 0.6, background: p.color }}
            />
          )
        }
        if (p.kind === 'magic') {
          const magicStyle = {
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ['--mx' as string]: `${p.mx}px`,
            ['--my' as string]: `${p.my}px`,
            ['--mr' as string]: `${p.mr}deg`,
          } as React.CSSProperties
          return (
            <span key={p.id} className="study-magic" style={magicStyle}>
              {p.emoji}
            </span>
          )
        }
        return (
          <span key={p.id} className="study-rise" style={{ ...style, fontSize: p.size }}>
            {p.emoji}
          </span>
        )
      })}
    </div>
  )
}
