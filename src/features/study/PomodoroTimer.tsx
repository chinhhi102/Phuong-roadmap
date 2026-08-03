// ============================================================================
// Pomodoro timer UI — countdown ring, progress bar, presets, custom lengths,
// and pause / resume / skip / reset controls. Purely presentational; the logic
// lives in usePomodoro (a single instance is created in StudyMode and shared).
// ============================================================================

import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react'
import { useStudyStore, type PomodoroPreset } from '@/store/studyStore'
import { cn } from '@/lib/utils'
import type { Pomodoro } from './usePomodoro'
import { usePrefersReducedMotion } from './useMotion'

const PRESET_LABELS: { id: PomodoroPreset; label: string }[] = [
  { id: '45/5', label: '45 / 5' },
  { id: '25/5', label: '25 / 5' },
  { id: '50/10', label: '50 / 10' },
  { id: '90/20', label: '90 / 20' },
  { id: 'custom', label: 'Custom' },
]

function mmss(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function Ring({ progress, phase, running, children }: { progress: number; phase: 'focus' | 'break'; running: boolean; children: React.ReactNode }) {
  const size = 210
  const stroke = 14
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - Math.min(1, Math.max(0, progress)) * c
  const color = phase === 'focus' ? 'hsl(var(--primary))' : 'hsl(var(--accent))'
  const reduced = usePrefersReducedMotion()

  return (
    <div className={cn('relative grid place-items-center', running && !reduced && 'study-breathe')} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--primary) / 0.14)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear', filter: 'drop-shadow(0 0 6px hsl(var(--primary) / 0.5))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex items-center gap-2 text-xs font-medium text-[hsl(var(--muted-foreground))]"
    >
      <span className={cn('relative h-5 w-9 rounded-full transition-colors', checked ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]')}>
        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all', checked ? 'left-[18px]' : 'left-0.5')} />
      </span>
      {label}
    </button>
  )
}

export function PomodoroTimer({ pomodoro }: { pomodoro: Pomodoro }) {
  const preset = useStudyStore((s) => s.preset)
  const focusMin = useStudyStore((s) => s.focusMin)
  const breakMin = useStudyStore((s) => s.breakMin)
  const autoStart = useStudyStore((s) => s.autoStart)
  const setPreset = useStudyStore((s) => s.setPreset)
  const setCustom = useStudyStore((s) => s.setCustom)
  const toggleAutoStart = useStudyStore((s) => s.toggleAutoStart)

  const { phase, running, remaining, progress, sessions, toggle, skip, reset } = pomodoro

  return (
    <div className="flex flex-col items-center gap-4">
      <Ring progress={progress} phase={phase} running={running}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
          {phase === 'focus' ? '🌸 Focus' : '🫧 Break'}
        </span>
        <span className="mt-1 font-mono text-5xl font-bold tabular-nums text-[hsl(var(--foreground))]">{mmss(remaining)}</span>
        <span className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
          {sessions} session{sessions === 1 ? '' : 's'} done
        </span>
      </Ring>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={reset}
          className="grid h-11 w-11 place-items-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))]"
          title="Reset"
          aria-label="Reset timer"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={toggle}
          className="grid h-14 w-14 place-items-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-lg transition hover:opacity-90 active:scale-95"
          title={running ? 'Pause' : 'Start'}
          aria-label={running ? 'Pause timer' : 'Start timer'}
        >
          {running ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
        </button>
        <button
          onClick={skip}
          className="grid h-11 w-11 place-items-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))]"
          title="Skip to next"
          aria-label="Skip to next phase"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {PRESET_LABELS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPreset(p.id)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition',
              preset === p.id
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm'
                : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--primary)/0.15)]',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset === 'custom' && (
        <div className="flex items-end justify-center gap-3 text-xs">
          <label className="flex flex-col items-center gap-1 text-[hsl(var(--muted-foreground))]">
            Focus (min)
            <input
              type="number"
              min={1}
              max={180}
              value={focusMin}
              onChange={(e) => setCustom(Number(e.target.value) || 1, breakMin)}
              className="w-20 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-2 py-1 text-center text-sm text-[hsl(var(--foreground))]"
            />
          </label>
          <label className="flex flex-col items-center gap-1 text-[hsl(var(--muted-foreground))]">
            Break (min)
            <input
              type="number"
              min={1}
              max={60}
              value={breakMin}
              onChange={(e) => setCustom(focusMin, Number(e.target.value) || 1)}
              className="w-20 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-2 py-1 text-center text-sm text-[hsl(var(--foreground))]"
            />
          </label>
        </div>
      )}

      <Switch checked={autoStart} onChange={toggleAutoStart} label="Auto-start next session" />
    </div>
  )
}
