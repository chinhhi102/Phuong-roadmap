// ============================================================================
// Study statistics — daily + weekly focus, streak, and lifetime totals.
// A compact Recharts bar for the last 7 days plus a few warm stat tiles.
// ============================================================================

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Clock, Flame, Timer, CalendarCheck } from 'lucide-react'
import { useStudyStore, weeklyFocus, focusStreak } from '@/store/studyStore'
import { todayKey } from '@/lib/utils'

function Tile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="study-glass rounded-2xl px-3 py-2.5 text-center">
      <div className="mb-0.5 flex items-center justify-center gap-1 text-[hsl(var(--primary))]">{icon}</div>
      <p className="text-base font-bold leading-none text-[hsl(var(--foreground))]">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wide text-[hsl(var(--muted-foreground))]">{label}</p>
    </div>
  )
}

export function StudyStats() {
  const dailyFocus = useStudyStore((s) => s.dailyFocus)
  const totalFocusMin = useStudyStore((s) => s.totalFocusMin)
  const totalSessions = useStudyStore((s) => s.totalSessions)

  const week = weeklyFocus(dailyFocus, 7)
  const today = dailyFocus[todayKey()] ?? { focusMin: 0, sessions: 0 }
  const streak = focusStreak(dailyFocus)
  const maxMin = Math.max(1, ...week.map((d) => d.focusMin))

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Tile icon={<Timer className="h-4 w-4" />} label="Today" value={`${today.focusMin}m`} />
        <Tile icon={<Flame className="h-4 w-4" />} label="Day streak" value={`${streak}`} />
        <Tile icon={<Clock className="h-4 w-4" />} label="Total focus" value={`${Math.round((totalFocusMin / 60) * 10) / 10}h`} />
        <Tile icon={<CalendarCheck className="h-4 w-4" />} label="Sessions" value={`${totalSessions}`} />
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold text-[hsl(var(--muted-foreground))]">This week (focus minutes)</p>
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={week} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--primary) / 0.08)' }}
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 10, fontSize: 12, color: 'hsl(var(--foreground))' }}
                formatter={(v: number) => [`${v} min`, 'Focus']}
              />
              <Bar dataKey="focusMin" radius={[8, 8, 4, 4]}>
                {week.map((d, i) => (
                  <Cell key={i} fill={d.focusMin >= maxMin && maxMin > 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.55)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
