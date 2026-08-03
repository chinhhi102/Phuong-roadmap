import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Search, ChevronDown, Lock, CheckCircle2, Circle, PlayCircle, Clock, Bookmark, MapPin, FileQuestion,
} from 'lucide-react'
import { curriculum } from '@/data/curriculum'
import { useProgressStore } from '@/store/progressStore'
import { useExamScores } from '@/store/examStore'
import { computeModuleScore, computeOverall } from '@/lib/scoring'
import { isLessonUnlocked, findCurrentLesson } from '@/lib/selectors'
import { difficultyColor, formatDuration, cn } from '@/lib/utils'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import type { Difficulty } from '@/types'

type StatusFilter = 'all' | 'completed' | 'in_progress' | 'not_started' | 'bookmarked'
const DIFFS: Array<Difficulty | 'all'> = ['all', 'Beginner', 'Intermediate', 'Advanced']
const STATUSES: Array<{ id: StatusFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'not_started', label: 'Not started' },
  { id: 'bookmarked', label: 'Bookmarked' },
]

export default function RoadmapPage() {
  const navigate = useNavigate()
  const progressMap = useProgressStore((s) => s.progress)
  const bookmarks = useProgressStore((s) => s.bookmarks)
  const examScores = useExamScores()
  const overall = computeOverall(curriculum, progressMap, examScores)
  const current = findCurrentLesson(curriculum, progressMap)

  const [query, setQuery] = useState('')
  const [diff, setDiff] = useState<Difficulty | 'all'>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const matches = (lessonId: string, difficulty: Difficulty, title: string, summary: string) => {
    const term = query.trim().toLowerCase()
    if (term && !(title.toLowerCase().includes(term) || summary.toLowerCase().includes(term))) return false
    if (diff !== 'all' && difficulty !== diff) return false
    const p = progressMap[lessonId]
    if (status === 'completed' && !p?.completed) return false
    if (status === 'in_progress' && p?.status !== 'in_progress') return false
    if (status === 'not_started' && p && p.status !== 'not_started') return false
    if (status === 'bookmarked' && !bookmarks.includes(lessonId)) return false
    return true
  }

  const filtersActive = query.trim() !== '' || diff !== 'all' || status !== 'all'

  const visibleModules = useMemo(
    () =>
      curriculum
        .map((m) => ({ module: m, lessons: m.lessons.filter((l) => matches(l.id, l.difficulty, l.title, l.summary)) }))
        .filter((x) => x.lessons.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, diff, status, progressMap, bookmarks],
  )

  const toggle = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Learning Roadmap</h1>
        <p className="text-sm text-muted-foreground">Your step-by-step path from beginner to job-ready Business Analyst.</p>
      </div>

      {/* Overall */}
      <div className="mb-5 rounded-xl border border-border bg-card p-4">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium">Overall completion</span>
          <span className="font-semibold">{overall.completionPct}% · {overall.completedLessons}/{overall.totalLessons} lessons</span>
        </div>
        <Progress value={overall.completionPct} gradient="from-primary to-accent" className="h-2.5" />
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search lessons…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {DIFFS.map((d) => (
            <button
              key={d}
              onClick={() => setDiff(d)}
              className={cn('rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors', diff === d ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted')}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStatus(s.id)}
            className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', status === s.id ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-muted/70')}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {visibleModules.map(({ module, lessons }) => {
          const ms = computeModuleScore(module, progressMap, examScores[module.id] ?? null)
          const isCollapsed = collapsed.has(module.id) && !filtersActive
          return (
            <div key={module.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 p-4">
                <button onClick={() => toggle(module.id)} className="flex min-w-0 flex-1 items-center gap-4 text-left">
                  <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl', module.accent)}>
                    {module.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{module.code}</Badge>
                      <h2 className="truncate font-semibold">{module.title}</h2>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{module.description}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <Progress value={ms.completion} gradient={module.accent} className="h-1.5 max-w-[200px]" />
                      <span className="text-xs text-muted-foreground">{ms.completedLessons}/{ms.totalLessons}</span>
                    </div>
                  </div>
                </button>
                <Link
                  to={`/exam/${module.id}`}
                  className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary sm:flex"
                  title="Take the module exam"
                >
                  <FileQuestion className="h-3.5 w-3.5" />
                  {ms.examScore != null ? `Exam ${ms.examScore}%` : 'Exam'}
                </Link>
                <button onClick={() => toggle(module.id)} className="shrink-0" aria-label="Toggle module">
                  <ChevronDown className={cn('h-5 w-5 text-muted-foreground transition-transform', isCollapsed && '-rotate-90')} />
                </button>
              </div>

              {!isCollapsed && (
                <ul className="border-t border-border">
                  {lessons.map((lesson) => {
                    const p = progressMap[lesson.id]
                    const unlocked = isLessonUnlocked(lesson, progressMap)
                    const isCurrent = current?.id === lesson.id
                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => navigate(`/lesson/${lesson.id}`)}
                          className={cn(
                            'flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/50',
                            isCurrent && 'bg-primary/5',
                          )}
                        >
                          <span className="shrink-0">
                            {p?.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : !unlocked ? (
                              <Lock className="h-5 w-5 text-muted-foreground/60" />
                            ) : isCurrent ? (
                              <PlayCircle className="h-5 w-5 text-primary" />
                            ) : p?.status === 'in_progress' ? (
                              <Circle className="h-5 w-5 fill-warning/30 text-warning" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground/50" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-muted-foreground">{lesson.code}</span>
                              <span className={cn('truncate text-sm font-medium', !unlocked && 'text-muted-foreground')}>{lesson.title}</span>
                              {isCurrent && <Badge variant="primary" className="shrink-0"><MapPin className="h-3 w-3" /> Current</Badge>}
                              {bookmarks.includes(lesson.id) && <Bookmark className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" />}
                            </div>
                          </div>
                          <span className={cn('hidden shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium sm:inline', difficultyColor(lesson.difficulty))}>
                            {lesson.difficulty}
                          </span>
                          <span className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
                            <Clock className="h-3.5 w-3.5" />{formatDuration(lesson.durationMinutes)}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
        {visibleModules.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No lessons match your filters.</p>
        )}
      </div>
    </div>
  )
}
