// ============================================================================
// Chat panel — real-time learner ⇄ instructor conversation with a buzz button.
//
// Your identity is the shared role toggle (also switchable right here). Messages
// sync live across tabs/devices via chatEngine. When you're the instructor, the
// panel also surfaces what the learner has been doing.
// ============================================================================

import { useEffect, useRef, useState } from 'react'
import { Send, Zap, GraduationCap, UserCog, CheckCircle2, ListChecks, FileText, BookOpen, StickyNote } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import { useStudyStore } from '@/store/studyStore'
import { cn, roleName, displayName } from '@/lib/utils'
import { isFirebaseConfigured } from '@/services/firebase'
import { chatEngine } from './chatSync'
import { useChat } from './useChat'
import { useLearnerProgress } from './useLearnerProgress'
import type { ActivityEntry, Author } from '@/types'

function hhmm(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

const KIND_ICON: Record<ActivityEntry['kind'], typeof BookOpen> = {
  viewed: BookOpen,
  quiz: ListChecks,
  assignment: FileText,
  completed: CheckCircle2,
  note: StickyNote,
}

function relTime(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (s < 10) return 'just now'
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function Tile({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-lg bg-[hsl(var(--card))] py-1.5 text-center">
      <p className="text-sm font-bold text-[hsl(var(--foreground))]">{n}</p>
      <p className="text-[9px] uppercase tracking-wide text-[hsl(var(--muted-foreground))]">{l}</p>
    </div>
  )
}

/** Live view of Phương's real progress, synced from her device via Firebase. */
function LearnerWork() {
  const snap = useLearnerProgress()

  if (!snap) {
    return (
      <div className="mb-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)] p-3 text-center">
        <p className="text-xs font-bold text-[hsl(var(--foreground))]">Phương's progress</p>
        <p className="mt-1 text-pretty text-[11px] text-[hsl(var(--muted-foreground))]">
          Waiting for her data… it shows up here the moment Phương opens the app. 🌸
        </p>
      </div>
    )
  }

  const activity = snap.activity ?? []
  const modules = snap.modules ?? []
  const pct = snap.totalLessons ? Math.round((snap.lessonsCompleted / snap.totalLessons) * 100) : 0

  return (
    <div className="mb-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)] p-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs font-bold text-[hsl(var(--foreground))]">
          <UserCog className="h-3.5 w-3.5 text-[hsl(var(--accent))]" /> {displayName(snap.name)}'s progress
        </p>
        <span className="shrink-0 text-[9px] text-[hsl(var(--muted-foreground))]">⟳ {relTime(snap.updatedAt)}</span>
      </div>

      {/* Overall completion */}
      <div className="mb-2">
        <div className="mb-1 flex items-center justify-between text-[10px]">
          <span className="text-[hsl(var(--muted-foreground))]">Overall</span>
          <span className="font-semibold text-[hsl(var(--foreground))]">{pct}% · {snap.lessonsCompleted}/{snap.totalLessons} lessons</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
          <div className="h-full rounded-full bg-[hsl(var(--primary))] transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-4 gap-1.5">
        <Tile n={`${snap.hours}h`} l="Studied" />
        <Tile n={`${snap.streak}`} l="Streak" />
        <Tile n={`${snap.quizzesPassed}`} l="Quizzes" />
        <Tile n={`${snap.assignmentsSubmitted}`} l="Assign." />
      </div>

      {/* Per-module progress */}
      <details className="mt-2">
        <summary className="cursor-pointer list-none text-[11px] font-semibold text-[hsl(var(--primary))]">▸ Modules</summary>
        <ul className="mt-1.5 space-y-1.5">
          {modules.map((m) => {
            const mp = m.total ? Math.round((m.done / m.total) * 100) : 0
            return (
              <li key={m.id} className="text-[11px]">
                <div className="mb-0.5 flex items-center justify-between gap-2 text-[hsl(var(--muted-foreground))]">
                  <span className="truncate">{m.icon} {m.title}</span>
                  <span className="shrink-0">{m.done}/{m.total}</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                  <div className="h-full rounded-full bg-[hsl(var(--primary)/0.7)]" style={{ width: `${mp}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      </details>

      {/* Recent activity */}
      <details className="mt-1.5">
        <summary className="cursor-pointer list-none text-[11px] font-semibold text-[hsl(var(--primary))]">
          ▸ Recent activity{activity.length ? ` (${activity.length})` : ''}
        </summary>
        {activity.length > 0 ? (
          <ul className="mt-1.5 space-y-1">
            {activity.slice(0, 12).map((a) => {
              const Icon = KIND_ICON[a.kind as ActivityEntry['kind']] ?? BookOpen
              return (
                <li key={a.id} className="flex items-start gap-1.5 text-[11px] text-[hsl(var(--muted-foreground))]">
                  <Icon className="mt-0.5 h-3 w-3 shrink-0 text-[hsl(var(--primary))]" />
                  <span className="text-pretty">{a.label}</span>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mt-1.5 text-[11px] text-[hsl(var(--muted-foreground))]">No activity yet — cheer her on! 💖</p>
        )}
      </details>
    </div>
  )
}

export function ChatPanel() {
  const { messages } = useChat()
  const role = useSettingsStore((s) => s.role)
  const setRole = useSettingsStore((s) => s.setRole)
  const markChatRead = useStudyStore((s) => s.markChatRead)
  const [text, setText] = useState('')
  const [justBuzzed, setJustBuzzed] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Mark read whenever the panel is showing new messages.
  useEffect(() => { markChatRead() }, [messages, markChatRead])
  // Keep pinned to the latest message.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const send = () => {
    const t = text.trim()
    if (!t) return
    void chatEngine.send(role, t)
    setText('')
  }

  const buzz = () => {
    void chatEngine.buzz(role)
    setJustBuzzed(true)
    window.setTimeout(() => setJustBuzzed(false), 1600)
  }

  const roleBtn = (r: Author, label: string, Icon: typeof GraduationCap) => (
    <button
      onClick={() => setRole(r)}
      className={cn(
        'flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold transition',
        role === r ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
      )}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  )

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Identity switch */}
      <div className="mb-2 shrink-0">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--muted-foreground))]">You are chatting as</p>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[9px] font-semibold',
              isFirebaseConfigured() ? 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
            )}
            title={isFirebaseConfigured() ? 'Messages sync live across devices' : 'Chat is stored only on this device until Firebase is set up'}
          >
            {isFirebaseConfigured() ? '🌐 Live sync' : '🔒 This device only'}
          </span>
        </div>
        <div className="flex gap-1 rounded-xl border border-[hsl(var(--border))] p-1">
          {roleBtn('learner', 'Phương', GraduationCap)}
          {roleBtn('instructor', 'Chính', UserCog)}
        </div>
      </div>

      {role === 'instructor' && (
        <div className="shrink-0">
          <LearnerWork />
        </div>
      )}

      {/* Messages — the single scroll region */}
      <div ref={scrollRef} className="mb-2 min-h-0 flex-1 space-y-2 overflow-y-auto rounded-2xl bg-[hsl(var(--muted)/0.4)] p-3">
        {messages.length === 0 && (
          <p className="mt-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
            No messages yet 🌸<br />Say hi to {roleName(role === 'learner' ? 'instructor' : 'learner')}!
          </p>
        )}
        {messages.map((m) => {
          const mine = m.from === role
          return (
            <div key={m.id} className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}>
              <div
                className={cn(
                  'max-w-[85%] text-pretty rounded-2xl px-3 py-1.5 text-sm shadow-sm',
                  mine
                    ? 'rounded-br-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'rounded-bl-sm bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]',
                )}
              >
                {m.text}
              </div>
              <span className="mt-0.5 px-1 text-[9px] text-[hsl(var(--muted-foreground))]">{roleName(m.from)} · {hhmm(m.ts)}</span>
            </div>
          )
        })}
      </div>

      {/* Composer */}
      <div className="flex shrink-0 items-center gap-1.5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          placeholder="Type a message…"
          className="min-w-0 flex-1 rounded-full border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))]"
        />
        <button
          onClick={send}
          disabled={!text.trim()}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
        <button
          onClick={buzz}
          className={cn(
            'grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition active:scale-90',
            justBuzzed && 'scale-110',
          )}
          style={{ background: 'linear-gradient(135deg,#ff4f9a,#ff9e40)' }}
          title="Buzz the other person"
          aria-label="Buzz"
        >
          <Zap className="h-4 w-4" fill="currentColor" />
        </button>
      </div>
      <p className="mt-1.5 text-center text-[10px] text-[hsl(var(--muted-foreground))]">
        {justBuzzed ? '⚡ Buzzed! Sending a little nudge…' : 'Tap ⚡ to buzz — it shakes their screen 💖'}
      </p>
    </div>
  )
}
