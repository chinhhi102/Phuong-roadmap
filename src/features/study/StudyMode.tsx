// ============================================================================
// StudyMode — the cozy pink study experience that layers onto a lesson.
//
// One place assembles it all: a shared Pomodoro instance, audio syncing, the
// floating dock + panel of controls, and the overlay layers (cute effects,
// motivational toasts, achievements, companion). It also listens to real
// progress events (lessons, quizzes) and study stats to fire celebrations and
// unlock achievements — so encouragement tracks what the learner actually does.
// ============================================================================

import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Flower2, X, Timer, Music, BarChart3, Trophy, Volume2, VolumeX,
  Palette, Sparkles, MessageCircle, Smile, Bell, Play, Square, Youtube, Link2, MessagesSquare,
} from 'lucide-react'
import { useProgressStore } from '@/store/progressStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useStudyStore, AMBIENTS } from '@/store/studyStore'
import { cn } from '@/lib/utils'
import { audioEngine } from './audio'
import { mediaEngine, AMBIENT_FILES, parseYouTubeId } from './mediaEngine'
import { PowerUpButton, PowerUpOverlay } from './PowerUp'
import { ChatPanel } from '@/features/chat/ChatPanel'
import { BuzzOverlay } from '@/features/chat/BuzzOverlay'
import { useBuzzWatcher } from '@/features/chat/useBuzzWatcher'
import { useMessageWatcher } from '@/features/chat/useMessageWatcher'
import { useChat } from '@/features/chat/useChat'
import { usePomodoro } from './usePomodoro'
import { PomodoroTimer } from './PomodoroTimer'
import { CuteEffects } from './CuteEffects'
import { MessageToast } from './MessageToast'
import { AchievementToast } from './AchievementToast'
import { Companion } from './Companion'
import { ACHIEVEMENTS, computeFacts } from './achievements'
import {
  emitAchievement, emitBurst, emitCelebrate, emitCompanion, emitMessage, emitReminder,
} from './bus'
import type { ActivityEntry } from '@/types'

// Recharts is heavy; only pull it in when the learner opens the Stats tab.
const StudyStats = lazy(() => import('./StudyStats').then((m) => ({ default: m.StudyStats })))

type PanelTab = 'focus' | 'chat' | 'sounds' | 'stats' | 'badges'

function mmss(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function StudyMode() {
  const pomodoro = usePomodoro()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<PanelTab>('focus')

  // --- chat + buzz ---------------------------------------------------------
  useBuzzWatcher()
  useMessageWatcher()
  const chat = useChat()
  const chatRole = useSettingsStore((s) => s.role)
  const chatReadTs = useStudyStore((s) => s.chatReadTs)
  const chatUnread = chat.messages.filter((m) => m.from !== chatRole && m.ts > chatReadTs).length

  // --- audio syncing (tick/chime via audioEngine, ambience via mediaEngine) --
  const volume = useStudyStore((s) => s.volume)
  const muted = useStudyStore((s) => s.muted)
  const soundEnabled = useStudyStore((s) => s.soundEnabled)

  useEffect(() => { audioEngine.setVolume(volume); mediaEngine.setVolume(volume) }, [volume])
  useEffect(() => {
    const m = muted || !soundEnabled
    audioEngine.setMuted(m)
    mediaEngine.setMuted(m)
  }, [muted, soundEnabled])
  useEffect(() => () => mediaEngine.stop(), [])

  // --- sweet welcome reminder on every page open ---------------------------
  useEffect(() => {
    const t = window.setTimeout(() => emitReminder(), 1100)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    let hiddenAt = 0
    const onVis = () => {
      if (document.hidden) hiddenAt = Date.now()
      else if (hiddenAt && Date.now() - hiddenAt > 3 * 60 * 1000) {
        emitMessage('idleReturn')
        emitCompanion('wave')
        hiddenAt = 0
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // --- occasional encouragement during study -------------------------------
  useEffect(() => {
    const id = window.setInterval(() => {
      emitMessage('random')
      if (Math.random() < 0.5) emitBurst('sparkles', 6)
    }, 5 * 60 * 1000)
    return () => window.clearInterval(id)
  }, [])

  // --- react to real progress activity -------------------------------------
  const activity = useProgressStore((s) => s.activity)
  const lastSeen = useRef<string | undefined>(activity[0]?.id)
  useEffect(() => {
    const head = activity[0]
    if (!head) return
    // Adopt the current head as the baseline without reacting (covers async
    // storage rehydration where activity arrives after mount).
    if (lastSeen.current === undefined) {
      lastSeen.current = head.id
      return
    }
    if (head.id === lastSeen.current) return
    const idx = activity.findIndex((a) => a.id === lastSeen.current)
    const fresh = idx === -1 ? activity.slice(0, 1) : activity.slice(0, idx)
    lastSeen.current = head.id
    fresh.reverse().forEach(reactToActivity)
  }, [activity])

  // --- unlock achievements when the facts change ---------------------------
  const progress = useProgressStore((s) => s.progress)
  const dailyFocus = useStudyStore((s) => s.dailyFocus)
  const totalFocusMin = useStudyStore((s) => s.totalFocusMin)
  const unlockAchievement = useStudyStore((s) => s.unlockAchievement)
  const evaluated = useRef(false)
  useEffect(() => {
    const facts = computeFacts(progress, dailyFocus, totalFocusMin)
    for (const a of ACHIEVEMENTS) {
      if (!a.check(facts)) continue
      const isNew = unlockAchievement(a.id)
      if (isNew && evaluated.current) {
        emitAchievement(a.id)
        emitCelebrate()
        emitMessage('achievement')
        emitCompanion('celebrate')
      }
    }
    evaluated.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, dailyFocus, totalFocusMin])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="study-scope">
      <CuteEffects />
      <MessageToast />
      <AchievementToast />
      <Companion />
      <PowerUpOverlay />
      <PowerUpButton />
      <BuzzOverlay />

      {/* Panel — a bottom-sheet on phones, a corner card on desktop */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[74] bg-black/30 backdrop-blur-[2px] sm:hidden"
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="study-glass fixed inset-x-0 bottom-0 z-[76] flex max-h-[86vh] flex-col overflow-hidden rounded-t-3xl shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-4 sm:max-h-[80vh] sm:w-[22rem] sm:rounded-3xl"
            >
              <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-[hsl(var(--muted-foreground)/0.4)] sm:hidden" />
              <PanelHeader tab={tab} setTab={setTab} onClose={() => setOpen(false)} chatUnread={chatUnread} />
              {tab === 'chat' ? (
                // Chat owns its own single scroll (messages), so no nested scrollbars.
                <div className="flex min-h-0 flex-1 flex-col px-4 pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                  <ChatPanel />
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  {tab === 'focus' && <PomodoroTimer pomodoro={pomodoro} />}
                  {tab === 'sounds' && <SoundControls />}
                  {tab === 'stats' && (
                    <Suspense fallback={<p className="py-10 text-center text-xs text-[hsl(var(--muted-foreground))]">Loading stats…</p>}>
                      <StudyStats />
                    </Suspense>
                  )}
                  {tab === 'badges' && <BadgeGrid />}
                </div>
              )}
              <PanelFooter />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating dock button (bottom-right, every page) */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-4 right-4 z-[73] flex h-14 items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-4 text-[hsl(var(--primary-foreground))] shadow-xl"
        aria-label="Toggle study companion"
      >
        {pomodoro.running ? (
          <span className="font-mono text-base font-bold tabular-nums">{mmss(pomodoro.remaining)}</span>
        ) : (
          <Flower2 className="h-6 w-6" />
        )}
        <span className="hidden text-sm font-semibold sm:inline">{pomodoro.running ? (pomodoro.phase === 'focus' ? 'Focus' : 'Break') : 'Study'}</span>
        {!open && chatUnread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-extrabold text-[hsl(var(--primary))] shadow">
            {chatUnread > 9 ? '9+' : chatUnread}
          </span>
        )}
      </motion.button>
    </div>,
    document.body,
  )
}

// ---------------------------------------------------------------------------
// Activity → celebration mapping
// ---------------------------------------------------------------------------

function reactToActivity(entry: ActivityEntry) {
  switch (entry.kind) {
    case 'completed':
      emitMessage('lessonComplete')
      emitBurst('confetti', 26)
      emitBurst('hearts', 8)
      emitCompanion('celebrate')
      break
    case 'quiz': {
      const m = /(\d+)%/.exec(entry.label)
      const passed = m ? Number(m[1]) >= 70 : true
      emitMessage(passed ? 'quizPass' : 'quizFail')
      if (passed) { emitBurst('sparkles', 14); emitCompanion('cheer') }
      break
    }
    case 'assignment':
      emitMessage('random')
      emitBurst('stars', 10)
      emitCompanion('cheer')
      break
    default:
      break // 'viewed' and 'note' stay quiet
  }
}

// ---------------------------------------------------------------------------
// Panel chrome
// ---------------------------------------------------------------------------

const TABS: { id: PanelTab; label: string; icon: typeof Timer }[] = [
  { id: 'focus', label: 'Focus', icon: Timer },
  { id: 'chat', label: 'Chat', icon: MessagesSquare },
  { id: 'sounds', label: 'Sounds', icon: Music },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'badges', label: 'Badges', icon: Trophy },
]

function PanelHeader({ tab, setTab, onClose, chatUnread }: { tab: PanelTab; setTab: (t: PanelTab) => void; onClose: () => void; chatUnread: number }) {
  const learnerName = useSettingsStore((s) => s.learnerName)
  // Vietnamese given names come last, so address by the final name part.
  const firstName = (learnerName || '').trim().split(/\s+/).pop() || 'bạn'
  return (
    <div className="border-b border-[hsl(var(--border))] px-4 pb-2 pt-3">
      <div className="mb-1 flex items-start justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-bold text-[hsl(var(--foreground))]">
            <span aria-hidden>🌸</span> Study together
          </p>
          <p className="mt-0.5 text-[10px] leading-tight text-[hsl(var(--muted-foreground))]">
            Dành cho {firstName} 💖 — dũng cảm, tài giỏi, luôn tiến về phía trước
          </p>
        </div>
        <button onClick={onClose} className="rounded-full p-1 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]" aria-label="Close panel">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-2" />
      <div className="flex gap-1">
        {TABS.map((t) => {
          const Icon = t.icon
          const showDot = t.id === 'chat' && chatUnread > 0 && tab !== 'chat'
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[11px] font-medium transition',
                tab === t.id ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
              {showDot && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[hsl(var(--danger))] px-1 text-[9px] font-bold text-white">
                  {chatUnread > 9 ? '9+' : chatUnread}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SoundControls() {
  const soundEnabled = useStudyStore((s) => s.soundEnabled)
  const tickingEnabled = useStudyStore((s) => s.tickingEnabled)
  const ambient = useStudyStore((s) => s.ambient)
  const audioSource = useStudyStore((s) => s.audioSource)
  const youtubeUrl = useStudyStore((s) => s.youtubeUrl)
  const customAudioUrl = useStudyStore((s) => s.customAudioUrl)
  const volume = useStudyStore((s) => s.volume)
  const muted = useStudyStore((s) => s.muted)
  const toggleSound = useStudyStore((s) => s.toggleSound)
  const toggleTicking = useStudyStore((s) => s.toggleTicking)
  const setAmbient = useStudyStore((s) => s.setAmbient)
  const setAudioSource = useStudyStore((s) => s.setAudioSource)
  const setYoutubeUrl = useStudyStore((s) => s.setYoutubeUrl)
  const setCustomAudioUrl = useStudyStore((s) => s.setCustomAudioUrl)
  const setVolume = useStudyStore((s) => s.setVolume)
  const toggleMute = useStudyStore((s) => s.toggleMute)

  const [yt, setYt] = useState(youtubeUrl)
  const [file, setFile] = useState(customAudioUrl)
  const [ytError, setYtError] = useState(false)

  const chooseBuiltin = (id: (typeof AMBIENTS)[number]['id']) => {
    setAmbient(id)
    setAudioSource('builtin')
    if (id === 'none') mediaEngine.stop()
    else mediaEngine.playFile(AMBIENT_FILES[id])
  }

  const playYoutube = () => {
    const id = parseYouTubeId(yt)
    if (!id) { setYtError(true); return }
    setYtError(false)
    setYoutubeUrl(yt)
    setAudioSource('youtube')
    setAmbient('none')
    mediaEngine.playYouTube(id)
  }

  const playCustom = () => {
    const url = file.trim()
    if (!url) return
    setCustomAudioUrl(url)
    setAudioSource('custom')
    setAmbient('none')
    mediaEngine.playFile(url)
  }

  const stopAll = () => { mediaEngine.stop(); setAmbient('none') }
  const ytOn = audioSource === 'youtube'
  const customOn = audioSource === 'custom'

  return (
    <div className="space-y-4">
      <RowToggle label="Sound" description="Ambience, ticking & chimes" checked={soundEnabled} onChange={toggleSound} />

      <div className={cn('space-y-3 transition-opacity', !soundEnabled && 'pointer-events-none opacity-40')}>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Ambience</p>
          <div className="grid grid-cols-3 gap-1.5">
            {AMBIENTS.map((a) => {
              const on = audioSource === 'builtin' && ambient === a.id
              return (
                <button
                  key={a.id}
                  onClick={() => chooseBuiltin(a.id)}
                  className={cn(
                    'flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2 text-[11px] font-medium transition',
                    on
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--foreground))]'
                      : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
                  )}
                >
                  <span className="text-lg" aria-hidden>{a.emoji}</span>
                  {a.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Volume + mute */}
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]" aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-[hsl(var(--muted))] accent-[hsl(var(--primary))]"
            aria-label="Volume"
          />
        </div>

        {/* YouTube ambience */}
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">
            <Youtube className="h-3.5 w-3.5 text-[hsl(var(--primary))]" /> Play from YouTube
            {ytOn && <span className="ml-auto text-[10px] font-normal text-[hsl(var(--primary))]">▶ playing</span>}
          </p>
          <div className="flex gap-1.5">
            <input
              value={yt}
              onChange={(e) => { setYt(e.target.value); setYtError(false) }}
              placeholder="Paste a YouTube link…"
              className="min-w-0 flex-1 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-2 py-1.5 text-xs text-[hsl(var(--foreground))]"
            />
            <button onClick={playYoutube} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" aria-label="Play YouTube">
              <Play className="h-3.5 w-3.5" />
            </button>
          </div>
          {ytError && <p className="mt-1 text-[10px] text-[hsl(var(--danger))]">Hmm, that doesn't look like a YouTube link.</p>}
        </div>

        {/* Custom direct audio URL (e.g. a Pixabay download link) */}
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">
            <Link2 className="h-3.5 w-3.5 text-[hsl(var(--primary))]" /> Custom audio link (.mp3)
            {customOn && <span className="ml-auto text-[10px] font-normal text-[hsl(var(--primary))]">▶ playing</span>}
          </p>
          <div className="flex gap-1.5">
            <input
              value={file}
              onChange={(e) => setFile(e.target.value)}
              placeholder="Paste a direct .mp3 URL…"
              className="min-w-0 flex-1 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-2 py-1.5 text-xs text-[hsl(var(--foreground))]"
            />
            <button onClick={playCustom} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" aria-label="Play custom audio">
              <Play className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-1 text-[10px] leading-snug text-[hsl(var(--muted-foreground))]">
            Tip: on pixabay.com/sound-effects, open a sound and copy its download link. 🌸
          </p>
        </div>

        <button onClick={stopAll} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[hsl(var(--border))] py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]">
          <Square className="h-3 w-3" /> Stop sound
        </button>

        <RowToggle label="Ticking sound" description="A soft tick each second while focusing" checked={tickingEnabled} onChange={toggleTicking} />
      </div>
    </div>
  )
}

function BadgeGrid() {
  const unlocked = useStudyStore((s) => s.unlocked)
  return (
    <div className="grid grid-cols-2 gap-2">
      {ACHIEVEMENTS.map((a) => {
        const has = !!unlocked[a.id]
        return (
          <div
            key={a.id}
            className={cn(
              'rounded-2xl border p-3 text-center transition',
              has ? 'study-glow border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]' : 'border-[hsl(var(--border))] opacity-60',
            )}
          >
            <div className={cn('text-2xl', !has && 'grayscale')} aria-hidden>{has ? a.emoji : '🔒'}</div>
            <p className="mt-1 text-xs font-bold leading-tight text-[hsl(var(--foreground))]">{a.title}</p>
            <p className="mt-0.5 text-[10px] leading-snug text-[hsl(var(--muted-foreground))]">{a.description}</p>
          </div>
        )
      })}
    </div>
  )
}

function PanelFooter() {
  const pinkPage = useStudyStore((s) => s.pinkPage)
  const animationsOn = useStudyStore((s) => s.animationsOn)
  const popupsOn = useStudyStore((s) => s.popupsOn)
  const companionOn = useStudyStore((s) => s.companionOn)
  const togglePinkPage = useStudyStore((s) => s.togglePinkPage)
  const toggleAnimations = useStudyStore((s) => s.toggleAnimations)
  const togglePopups = useStudyStore((s) => s.togglePopups)
  const toggleCompanion = useStudyStore((s) => s.toggleCompanion)

  const items = [
    { on: pinkPage, toggle: togglePinkPage, icon: Palette, label: 'Pink page' },
    { on: animationsOn, toggle: toggleAnimations, icon: Sparkles, label: 'Effects' },
    { on: popupsOn, toggle: togglePopups, icon: MessageCircle, label: 'Messages' },
    { on: companionOn, toggle: toggleCompanion, icon: Smile, label: 'Companion' },
  ]

  return (
    <div className="flex items-center justify-around border-t border-[hsl(var(--border))] px-2 py-2">
      {items.map((it) => {
        const Icon = it.icon
        return (
          <button
            key={it.label}
            onClick={it.toggle}
            aria-pressed={it.on}
            title={`${it.label}: ${it.on ? 'on' : 'off'}`}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium transition',
              it.on ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))] opacity-60',
            )}
          >
            <Icon className="h-4 w-4" />
            {it.label}
          </button>
        )
      })}
    </div>
  )
}

function RowToggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={onChange} className="flex w-full items-center justify-between gap-3 text-left">
      <span>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--foreground))]">
          {label === 'Sound' && <Bell className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />} {label}
        </span>
        <span className="text-xs text-[hsl(var(--muted-foreground))]">{description}</span>
      </span>
      <span className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]')}>
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </span>
    </button>
  )
}
