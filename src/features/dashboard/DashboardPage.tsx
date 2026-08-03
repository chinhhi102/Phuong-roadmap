import { Link, useNavigate } from 'react-router-dom'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts'
import {
  Flame, Clock, Trophy as TrophyIcon, BookOpenCheck, TrendingUp, TrendingDown, PlayCircle, Award, Activity as ActivityIcon,
} from 'lucide-react'
import { curriculum, getModule, getLesson } from '@/data/curriculum'
import { useProgressStore } from '@/store/progressStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useExamScores } from '@/store/examStore'
import { computeOverall } from '@/lib/scoring'
import { computeStreak, totalHoursStudied, findCurrentLesson } from '@/lib/selectors'
import { competencyLevel, formatDateTime, cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Progress, ScoreRing } from '@/components/ui/Progress'
import { Button } from '@/components/ui/Button'

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-4">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', accent)}>{icon}</div>
        <div>
          <p className="text-xl font-bold leading-none">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const progressMap = useProgressStore((s) => s.progress)
  const activity = useProgressStore((s) => s.activity)
  const lastLessonId = useProgressStore((s) => s.lastLessonId)
  const name = useSettingsStore((s) => s.learnerName)
  const examScores = useExamScores()

  const overall = computeOverall(curriculum, progressMap, examScores)
  const streak = computeStreak(activity)
  const hours = totalHoursStudied(progressMap)
  const current = findCurrentLesson(curriculum, progressMap)
  const continueLesson = getLesson(lastLessonId ?? '') ?? current
  const certificates = overall.completionPct === 100 ? 1 : 0
  const remainingModules = overall.moduleScores.filter((m) => m.completion < 100).length

  const radarData = overall.moduleScores.map((m) => ({ module: getModule(m.moduleId)?.code ?? '', score: m.score }))
  const barData = overall.moduleScores.map((m) => ({
    name: getModule(m.moduleId)?.code ?? '',
    completion: m.completion,
    accent: getModule(m.moduleId)?.accent ?? '',
  }))

  const attempted = overall.moduleScores.filter((m) => m.score > 0)
  const sorted = [...attempted].sort((a, b) => b.score - a.score)
  const strengths = sorted.slice(0, 2)
  const weaknesses = [...attempted].sort((a, b) => a.score - b.score).slice(0, 2)

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {name.split(' ')[0]} 👋</h1>
          <p className="text-sm text-muted-foreground">
            You're <span className="font-semibold text-foreground">{competencyLevel(overall.averageScore)}</span> level · {overall.completionPct}% through the course.
          </p>
        </div>
        {continueLesson && (
          <Button onClick={() => navigate(`/lesson/${continueLesson.id}`)}>
            <PlayCircle className="h-4 w-4" /> Continue: {continueLesson.code}
          </Button>
        )}
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={<BookOpenCheck className="h-5 w-5 text-primary" />} accent="bg-primary/10" label="Lessons completed" value={`${overall.completedLessons}/${overall.totalLessons}`} />
        <Stat icon={<Clock className="h-5 w-5 text-accent" />} accent="bg-accent/10" label="Hours studied" value={`${hours}h`} />
        <Stat icon={<Flame className="h-5 w-5 text-warning" />} accent="bg-warning/10" label="Day streak" value={`${streak}`} />
        <Stat icon={<Award className="h-5 w-5 text-success" />} accent="bg-success/10" label="Certificates" value={`${certificates}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Overall ring */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-3 py-6">
            <p className="text-sm font-semibold">Overall progress</p>
            <ScoreRing value={overall.completionPct} sublabel="complete" size={150} stroke={12} />
            <div className="grid w-full grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-lg bg-muted p-2">
                <p className="font-bold">{overall.averageScore}%</p>
                <p className="text-xs text-muted-foreground">Avg score</p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <p className="font-bold">{remainingModules}</p>
                <p className="text-xs text-muted-foreground">Modules left</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Radar */}
        <Card className="lg:col-span-2">
          <CardContent className="py-5">
            <p className="mb-2 text-sm font-semibold">Competency by module (score %)</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="module" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} tickCount={5} />
                  <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.35} dot={{ r: 3, fill: 'hsl(var(--primary))' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12, color: 'hsl(var(--foreground))' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Completion bar */}
        <Card className="lg:col-span-2">
          <CardContent className="py-5">
            <p className="mb-2 text-sm font-semibold">Module completion (%)</p>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12, color: 'hsl(var(--foreground))' }} />
                  <Bar dataKey="completion" radius={[6, 6, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill="hsl(var(--primary))" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Strengths / weaknesses */}
        <Card>
          <CardContent className="space-y-4 py-5">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><TrendingUp className="h-4 w-4 text-success" /> Strengths</p>
              {strengths.length ? strengths.map((m) => (
                <div key={m.moduleId} className="mb-2">
                  <div className="flex justify-between text-xs"><span>{getModule(m.moduleId)?.title}</span><span className="font-semibold">{m.score}%</span></div>
                  <Progress value={m.score} barClassName="bg-success" />
                </div>
              )) : <p className="text-xs text-muted-foreground">Complete a few lessons to see your strengths.</p>}
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><TrendingDown className="h-4 w-4 text-danger" /> Focus areas</p>
              {weaknesses.length ? weaknesses.map((m) => (
                <div key={m.moduleId} className="mb-2">
                  <div className="flex justify-between text-xs"><span>{getModule(m.moduleId)?.title}</span><span className="font-semibold">{m.score}%</span></div>
                  <Progress value={m.score} barClassName="bg-danger" />
                </div>
              )) : <p className="text-xs text-muted-foreground">Nothing flagged yet — keep going!</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardContent className="py-5">
          <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold"><ActivityIcon className="h-4 w-4" /> Recent activity</p>
          {activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet. <Link to="/roadmap" className="text-primary underline">Start your first lesson →</Link></p>
          ) : (
            <ul className="space-y-2">
              {activity.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-center gap-3 text-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                    {a.kind === 'completed' ? <TrophyIcon className="h-3.5 w-3.5 text-success" /> : a.kind === 'quiz' ? <BookOpenCheck className="h-3.5 w-3.5 text-primary" /> : <ActivityIcon className="h-3.5 w-3.5 text-muted-foreground" />}
                  </span>
                  <span className="flex-1 truncate">{a.label}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(a.date)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
