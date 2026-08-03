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
import { useProgressStore } from '@/store/progressStore'
import { cn, roleName } from '@/lib/utils'
import { chatEngine } from './chatSync'
import { useChat } from './useChat'
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

function LearnerWork() {
  const progress = useProgressStore((s) => s.progress)
  const activity = useProgressStore((s) => s.activity)
  const values = Object.values(progress)
  const completed = values.filter((p) => p.completed).length
  const quizzes = values.filter((p) => p.quiz).length
  const assignments = values.filter((p) => p.submission).length
  const recent = activity.slice(0, 6)

  return (
    <div className="mb-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)] p-2.5">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[hsl(var(--foreground))]">
        <UserCog className="h-3.5 w-3.5 text-[hsl(var(--accent))]" /> Phương's work
      </p>
      <div className="grid grid-cols-3 gap-1.5 text-center">
        {[
          { n: completed, l: 'Lessons' },
          { n: quizzes, l: 'Quizzes' },
          { n: assignments, l: 'Assignments' },
        ].map((s) => (
          <div key={s.l} className="rounded-lg bg-[hsl(var(--card))] py-1.5">
            <p className="text-sm font-bold text-[hsl(var(--foreground))]">{s.n}</p>
            <p className="text-[9px] uppercase tracking-wide text-[hsl(var(--muted-foreground))]">{s.l}</p>
          </div>
        ))}
      </div>
      <details className="mt-2 group">
        <summary className="cursor-pointer list-none text-[11px] font-semibold text-[hsl(var(--primary))]">
          ▸ Recent activity{recent.length ? ` (${recent.length})` : ''}
        </summary>
        {recent.length > 0 ? (
          <ul className="mt-1.5 space-y-1">
            {recent.map((a) => {
              const Icon = KIND_ICON[a.kind]
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
        <p className="mb-1 text-[10px] uppercase tracking-wide text-[hsl(var(--muted-foreground))]">You are chatting as</p>
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
