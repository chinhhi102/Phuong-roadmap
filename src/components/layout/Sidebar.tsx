import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Route as RouteIcon, StickyNote, FolderKanban, Award, Settings, PlayCircle, GraduationCap, FileQuestion, UserCog } from 'lucide-react'
import { curriculum } from '@/data/curriculum'
import { useProgressStore } from '@/store/progressStore'
import { useExamScores } from '@/store/examStore'
import { useSettingsStore } from '@/store/settingsStore'
import { computeOverall } from '@/lib/scoring'
import { findCurrentLesson } from '@/lib/selectors'
import { Progress } from '@/components/ui/Progress'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/roadmap', label: 'Roadmap', icon: RouteIcon },
  { to: '/exams', label: 'Exams', icon: FileQuestion },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  /** Chính's console for reviewing Phương's work — hidden while she's studying. */
  { to: '/review', label: 'Review', icon: UserCog, instructorOnly: true },
  { to: '/portfolio', label: 'Portfolio', icon: FolderKanban },
  { to: '/certificate', label: 'Certificate', icon: Award },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const progress = useProgressStore((s) => s.progress)
  const lastLessonId = useProgressStore((s) => s.lastLessonId)
  const navigate = useNavigate()
  const examScores = useExamScores()
  const role = useSettingsStore((s) => s.role)
  const nav = NAV.filter((item) => !item.instructorOnly || role === 'instructor')
  const overall = computeOverall(curriculum, progress, examScores)
  const current = findCurrentLesson(curriculum, progress)
  const continueId = lastLessonId ?? current?.id

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold">BA Academy</p>
          <p className="text-[11px] text-muted-foreground">Business Analyst Path</p>
        </div>
      </div>

      <div className="px-5 pb-3">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Course progress</span>
          <span className="font-semibold text-foreground">{overall.completionPct}%</span>
        </div>
        <Progress value={overall.completionPct} gradient="from-primary to-accent" />
        <p className="mt-1 text-[11px] text-muted-foreground">
          {overall.completedLessons} / {overall.totalLessons} lessons
        </p>
      </div>

      {continueId && (
        <div className="px-3 pb-2">
          <button
            onClick={() => {
              navigate(`/lesson/${continueId}`)
              onNavigate?.()
            }}
            className="flex w-full items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <PlayCircle className="h-4 w-4" />
            Continue learning
          </button>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-5 py-3 text-[11px] text-muted-foreground">
        <p>Avg score: <span className="font-semibold text-foreground">{overall.averageScore}%</span></p>
      </div>
    </div>
  )
}
