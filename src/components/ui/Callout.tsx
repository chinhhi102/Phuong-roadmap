import type { ReactNode } from 'react'
import { Info, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tone = 'info' | 'tip' | 'warning' | 'success'

const config: Record<Tone, { icon: ReactNode; cls: string }> = {
  info: { icon: <Info className="h-4 w-4" />, cls: 'border-primary/30 bg-primary/5 text-foreground' },
  tip: { icon: <Lightbulb className="h-4 w-4" />, cls: 'border-accent/30 bg-accent/5 text-foreground' },
  warning: { icon: <AlertTriangle className="h-4 w-4" />, cls: 'border-warning/30 bg-warning/5 text-foreground' },
  success: { icon: <CheckCircle2 className="h-4 w-4" />, cls: 'border-success/30 bg-success/5 text-foreground' },
}

export function Callout({
  tone = 'info',
  title,
  children,
  className,
}: {
  tone?: Tone
  title?: string
  children: ReactNode
  className?: string
}) {
  const { icon, cls } = config[tone]
  return (
    <div className={cn('flex gap-3 rounded-lg border p-4 text-sm', cls, className)}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        {title && <p className="mb-1 font-semibold">{title}</p>}
        <div className="text-muted-foreground [&_strong]:text-foreground">{children}</div>
      </div>
    </div>
  )
}
