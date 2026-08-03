// ============================================================================
// PowerUp — "💖 Nhận thêm sức mạnh từ anh nè!"
//
// A big pulsing button that showers the screen with cute icons, flashes, and
// pops up a themed love/system/cat/coffee/quest/anime message (Phương's own
// wording). 1% of the time it triggers the LEGENDARY sakura garden. 🌸
//
// The button lives in the study panel; the overlay (popup + flash + legendary)
// is mounted once at the StudyMode overlay layer and driven via the bus.
// ============================================================================

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { studyBus, emitPowerup, emitBurst, emitCompanion } from './bus'
import { useSettingsStore } from '@/store/settingsStore'
import { useAnimations } from './useMotion'
import { CHEERS_WARM, CHEERS_FUNNY, CHEERS_RANDOM } from './cheers'

interface PowerEvent {
  title: string
  avatar: string
  color: string
  messages: string[]
}

// Each click draws from Phương's full 300 wishes (cheers.ts). A themed "skin"
// (avatar + title + colour) is chosen from the message's flavour so the popup
// still feels like a little event card.
type ThemeKey = 'love' | 'system' | 'cat' | 'coffee' | 'quest' | 'anime'

const THEMES: Record<ThemeKey, { avatar: string; title: string; color: string }> = {
  love: { avatar: '💕', title: '💌 Một chút yêu thương', color: '#ffe0ef' },
  system: { avatar: '🤖', title: '🤖 SYSTEM BOOST', color: '#dff6ff' },
  cat: { avatar: '🐱', title: '🐱 Tin nhắn dễ thương', color: '#fff3c4' },
  coffee: { avatar: '☕', title: '☕ Quán cà phê gửi lời', color: '#ffe6cf' },
  quest: { avatar: '🎮', title: '🎮 QUEST COMPLETE', color: '#eee0ff' },
  anime: { avatar: '🌸', title: '🌸 Anime Power Up', color: '#ffdff7' },
}

const pickOne = (a: string[]): string => a[Math.floor(Math.random() * a.length)]

/** Choose a skin from the message's leading emoji (random-set wishes). */
function detectTheme(msg: string): ThemeKey | null {
  if (msg.startsWith('🤖')) return 'system'
  if (msg.startsWith('🐱') || msg.startsWith('🐶') || msg.startsWith('🐹')) return 'cat'
  if (msg.startsWith('☕')) return 'coffee'
  if (msg.startsWith('🎮')) return 'quest'
  if (msg.startsWith('🌸')) return 'anime'
  if (msg.startsWith('💕') || msg.startsWith('💖') || msg.startsWith('💗')) return 'love'
  if (msg.startsWith('😂') || msg.startsWith('😎') || msg.startsWith('🚨')) return 'quest'
  return null
}

let lastWish = ''

/** A random wish from all 300 + a matching themed skin, avoiding immediate repeats. */
function wish(): { ev: PowerEvent; message: string } {
  const buckets: { list: string[]; theme: ThemeKey | null }[] = [
    { list: CHEERS_WARM, theme: 'love' },
    { list: CHEERS_FUNNY, theme: 'quest' },
    { list: CHEERS_RANDOM, theme: null }, // decide from the leading emoji
  ]
  let message = lastWish
  let theme: ThemeKey = 'love'
  for (let i = 0; i < 8; i++) {
    const b = buckets[Math.floor(Math.random() * buckets.length)]
    const m = pickOne(b.list)
    if (m === lastWish) continue
    message = m
    theme = b.theme ?? detectTheme(m) ?? 'anime'
    break
  }
  lastWish = message
  const th = THEMES[theme]
  return { ev: { title: th.title, avatar: th.avatar, color: th.color, messages: [] }, message }
}

const LEGENDARY: PowerEvent = {
  title: '🌸 LEGENDARY — Vườn hoa anh đào',
  avatar: '🌸',
  color: '#ffe3f3',
  messages: ['Sự kiện siêu hiếm 1%! Cả thế giới nở hoa vì Phương 🌸✨💖'],
}

// A soft welcome-reminder shown gently each time the page opens.
const REMINDER_EVENT: PowerEvent = { title: 'Chào Phương 🌸', avatar: '🌷', color: '#ffe9f4', messages: [] }

function reminderMessage(name: string): string {
  const who = name && name.toLowerCase() !== 'future business analyst' ? name : 'Phương'
  const list = [
    `Mình cùng học nhé ${who} 💕 Bắt đầu một phiên tập trung 🍅, chọn một bản nhạc thật dịu êm 🎧, và nhớ uống nước 🥤. Anh luôn ở đây cổ vũ em 💖`,
    `Hôm nay của ${who} bắt đầu rồi 🌸 Chọn một âm thanh yêu thích 🎧, bấm bắt đầu tập trung 🍅, rồi cứ từ từ từng bước nhỏ nhé. Em làm được mà 💪`,
    `Chào cô BA tương lai 💕 Hít thở thật sâu, thả lỏng vai một chút, mở một bản nhạc êm rồi bắt đầu 25 phút tập trung nha. Anh tin ${who} 🌟`,
    `Ngồi thoải mái nhé ${who} 🌷 Chọn nhạc, bấm tập trung, và mình học cùng nhau từng chút một. Anh ở ngay bên cạnh em 💖`,
  ]
  return list[Math.floor(Math.random() * list.length)]
}

/** Floating power-up button (bottom-left). Compact 💖 that expands on hover. */
export function PowerUpButton() {
  return (
    <button
      onClick={() => emitPowerup()}
      className="study-powerup-fab group fixed bottom-4 left-24 z-[66] flex h-14 items-center overflow-hidden rounded-full px-4 text-white shadow-xl"
      aria-label="Nhận thêm sức mạnh từ anh nè"
      title="💖 Nhận thêm sức mạnh từ anh nè!"
    >
      <span className="text-2xl leading-none">💖</span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-[230px] group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-[230px] group-focus-visible:opacity-100">
        Nhận thêm sức mạnh từ anh nè!
      </span>
    </button>
  )
}

interface Display {
  key: string
  ev: PowerEvent
  message: string
  legendary: boolean
  soft: boolean
}

let seq = 0

// Popups linger, so they can actually be read.
const POPUP_MS = 10000
const LEGENDARY_MS = 13000
const REMINDER_MS = 12000

/** Full-screen popup + particle storm + flash + rare legendary garden. */
export function PowerUpOverlay() {
  const animate = useAnimations()
  const animateRef = useRef(animate)
  animateRef.current = animate
  const learnerName = useSettingsStore((s) => s.learnerName)
  const nameRef = useRef(learnerName)
  nameRef.current = learnerName

  const [display, setDisplay] = useState<Display | null>(null)
  const [flash, setFlash] = useState(false)
  const [legendary, setLegendary] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const clearTimers = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = [] }
    const off = studyBus.on((e) => {
      // Gentle welcome-reminder (soft, no storm) shown on page open.
      if (e.type === 'reminder') {
        setDisplay({ key: `pu${seq++}`, ev: REMINDER_EVENT, message: reminderMessage(nameRef.current), legendary: false, soft: true })
        emitCompanion('wave')
        if (animateRef.current) emitBurst('hearts', 12)
        timers.current.push(window.setTimeout(() => setDisplay(null), REMINDER_MS))
        return
      }
      if (e.type !== 'powerup') return

      const isLegendary = Math.random() < 0.01
      let ev: PowerEvent
      let message: string
      if (isLegendary) {
        ev = LEGENDARY
        message = LEGENDARY.messages[0]
      } else {
        const w = wish()
        ev = w.ev
        message = w.message
      }
      setDisplay({ key: `pu${seq++}`, ev, message, legendary: isLegendary, soft: false })
      emitCompanion('celebrate')

      if (animateRef.current) {
        setFlash(true)
        timers.current.push(window.setTimeout(() => setFlash(false), 800))
        emitBurst('magic', 90)
        emitBurst('hearts', 18)
        if (isLegendary) {
          setLegendary(true)
          // Keep the garden blooming for a good while.
          ;[0, 700, 1400, 2100, 2800, 3500, 4200, 4900, 5600].forEach((d) =>
            timers.current.push(window.setTimeout(() => { emitBurst('flowers', 44); emitBurst('magic', 40) }, d)),
          )
          timers.current.push(window.setTimeout(() => setLegendary(false), LEGENDARY_MS))
        }
      }
      timers.current.push(window.setTimeout(() => setDisplay(null), isLegendary ? LEGENDARY_MS : POPUP_MS))
    })
    return () => { off(); clearTimers() }
  }, [])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  return (
    <>
      {/* Screen flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[85]"
            style={{ background: 'radial-gradient(circle at center, rgba(255,180,220,0.55), rgba(255,255,255,0))' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      {/* Legendary sakura garden veil */}
      <AnimatePresence>
        {legendary && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[82]"
            style={{ background: 'linear-gradient(180deg, rgba(255,214,236,0.35), rgba(200,162,255,0.25))' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Themed popup — grid so overlapping (enter/exit) cards stack dead-center
          instead of flowing side-by-side and pushing each other off-center. */}
      <div className="pointer-events-none fixed inset-0 z-[90] grid place-items-center p-4">
        <AnimatePresence>
          {display && (
            <motion.div
              key={display.key}
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              onClick={() => setDisplay(null)}
              className="pointer-events-auto relative w-full max-w-sm cursor-pointer rounded-[32px] px-7 py-8 text-center shadow-2xl [grid-area:1/1]"
              style={{ background: display.ev.color, boxShadow: '0 25px 70px rgba(0,0,0,.22)' }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setDisplay(null) }}
                className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full text-lg leading-none"
                style={{ background: 'rgba(255,255,255,0.55)', color: '#b06690' }}
                aria-label="Đóng"
              >
                ×
              </button>
              <motion.div
                className="mb-3 text-6xl"
                animate={animate ? (display.soft ? { y: [0, -6, 0], scale: [1, 1.06, 1] } : { rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }) : undefined}
                transition={display.soft ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.9 }}
              >
                <span aria-hidden>{display.ev.avatar}</span>
              </motion.div>
              <h2 className="mb-2 text-balance text-xl font-extrabold" style={{ color: '#ff4f99' }}>{display.ev.title}</h2>
              <p className="text-pretty text-[15px] leading-relaxed" style={{ color: '#5a5560' }}>{display.message}</p>
              <p className="mt-4 text-[11px]" style={{ color: '#b98aa6' }}>Chạm để đóng 💕</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
