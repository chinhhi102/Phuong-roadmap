import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Tailwind-friendly className combiner that also resolves conflicting utilities
 *  (e.g. `p-5 pt-0` + `py-4`), so spacing overrides behave predictably. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Small unique id generator (browser-only app, collisions are irrelevant here). */
export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10)
}

export function formatDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatDateTime(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

/** Display name for a role (the couple studying together). */
export function roleName(role: 'learner' | 'instructor'): string {
  return role === 'instructor' ? 'Chính' : 'Phương'
}

/** Her cozy display name: Vietnamese given name (last part), fallback to Phương. */
export function displayName(name: string): string {
  const t = (name ?? '').trim()
  if (!t || t.toLowerCase() === 'future business analyst') return 'Phương'
  return t.split(/\s+/).pop() as string
}

/** Difficulty → color token classes. */
export function difficultyColor(d: string): string {
  switch (d) {
    case 'Beginner':
      return 'text-success border-success/30 bg-success/10'
    case 'Intermediate':
      return 'text-warning border-warning/30 bg-warning/10'
    case 'Advanced':
      return 'text-danger border-danger/30 bg-danger/10'
    default:
      return 'text-muted-foreground border-border bg-muted'
  }
}

/** Score → qualitative competency band. */
export function competencyLevel(score: number): string {
  if (score >= 90) return 'Expert'
  if (score >= 75) return 'Proficient'
  if (score >= 60) return 'Competent'
  if (score >= 40) return 'Developing'
  return 'Novice'
}
