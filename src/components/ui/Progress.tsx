import { cn, clamp } from '@/lib/utils'

interface ProgressProps {
  value: number // 0–100
  className?: string
  barClassName?: string
  /** Gradient utility, e.g. "from-blue-500 to-indigo-500". */
  gradient?: string
}

export function Progress({ value, className, barClassName, gradient }: ProgressProps) {
  const v = clamp(Math.round(value), 0, 100)
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          'h-full rounded-full transition-[width] duration-500 ease-out',
          gradient ? `bg-gradient-to-r ${gradient}` : 'bg-primary',
          barClassName,
        )}
        style={{ width: `${v}%` }}
      />
    </div>
  )
}

interface ScoreRingProps {
  value: number // 0–100
  size?: number
  stroke?: number
  label?: string
  sublabel?: string
  className?: string
}

/** SVG circular progress used for scores and completion. */
export function ScoreRing({ value, size = 120, stroke = 10, label, sublabel, className }: ScoreRingProps) {
  const v = clamp(Math.round(value), 0, 100)
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (v / 100) * c
  const color = v >= 75 ? 'hsl(var(--success))' : v >= 50 ? 'hsl(var(--warning))' : 'hsl(var(--danger))'

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
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
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{label ?? `${v}%`}</span>
        {sublabel && <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  )
}
