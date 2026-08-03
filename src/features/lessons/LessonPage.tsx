import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Clock, Lock, BookOpen, Video, Download, Bookmark, Star, CheckCircle2, Circle,
  ChevronLeft, ChevronRight, Target, ListChecks, FileText, Award, GraduationCap,
} from 'lucide-react'
import {
  getLesson, getModuleOfLesson, getLessonNumber, getNextLesson, getPrevLesson, TOTAL_LESSONS,
} from '@/data/curriculum'
import { getPracticeQuiz } from '@/data/quizzes'
import { useProgressStore } from '@/store/progressStore'
import { isLessonUnlocked } from '@/lib/selectors'
import { difficultyColor, formatDuration, cn } from '@/lib/utils'
import { Markdown } from '@/components/Markdown'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/Callout'
import { ExercisePanel } from './ExercisePanel'
import { QuizRunner } from '@/features/quizzes/QuizRunner'
import { NoteEditor } from '@/features/notes/NoteEditor'
import { AssignmentPanel } from './AssignmentPanel'
import { Discussion } from './Discussion'
import { ScoreBreakdown } from './ScoreBreakdown'
import type { ResourceType } from '@/types'

const RESOURCE_ICON: Record<ResourceType, typeof BookOpen> = {
  reading: BookOpen,
  video: Video,
  download: Download,
}

export default function LessonPage() {
  const { lessonId = '' } = useParams()
  const navigate = useNavigate()
  const topRef = useRef<HTMLDivElement>(null)

  const lesson = getLesson(lessonId)
  const module = getModuleOfLesson(lessonId)

  const progressMap = useProgressStore((s) => s.progress)
  const progress = progressMap[lessonId]
  const visit = useProgressStore((s) => s.visit)
  const addTime = useProgressStore((s) => s.addTime)
  const setComplete = useProgressStore((s) => s.setComplete)
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark)
  const toggleFavorite = useProgressStore((s) => s.toggleFavorite)
  const bookmarked = useProgressStore((s) => s.bookmarks.includes(lessonId))
  const favorited = useProgressStore((s) => s.favorites.includes(lessonId))

  const [tab, setTab] = useState('learn')

  const unlocked = useMemo(() => (lesson ? isLessonUnlocked(lesson, progressMap) : false), [lesson, progressMap])

  // Record visit + track time-on-lesson.
  useEffect(() => {
    if (!lesson || !unlocked) return
    visit(lesson.id, lesson.title)
    setTab('learn')
    topRef.current?.scrollIntoView({ block: 'start' })
    const start = Date.now()
    return () => {
      const mins = Math.round((Date.now() - start) / 60000)
      if (mins > 0) addTime(lesson.id, Math.min(mins, 120))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, unlocked])

  if (!lesson || !module) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold">Lesson not found</p>
        <Link to="/roadmap" className="text-primary underline">Back to roadmap</Link>
      </div>
    )
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">This lesson is locked</h2>
        <p className="mt-1 text-sm text-muted-foreground">Complete the prerequisites to unlock “{lesson.title}”.</p>
        <div className="mt-4 space-y-2">
          {lesson.prerequisites.map((id) => {
            const pre = getLesson(id)
            if (!pre) return null
            return (
              <Link key={id} to={`/lesson/${id}`} className="block rounded-lg border border-border bg-card p-3 text-left text-sm hover:border-primary">
                <span className="font-medium">{pre.code}</span> · {pre.title}
                {progressMap[id]?.completed && <CheckCircle2 className="ml-2 inline h-4 w-4 text-success" />}
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  const completed = progress?.completed ?? false
  const next = getNextLesson(lesson.id)
  const prev = getPrevLesson(lesson.id)
  const practiceQuiz = getPracticeQuiz(lesson.id) ?? lesson.quiz

  const tabs: TabItem[] = [
    { id: 'learn', label: 'Learn', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'practice', label: 'Practice', icon: <ListChecks className="h-4 w-4" /> },
    ...(lesson.assignment ? [{ id: 'assignment', label: 'Assignment', icon: <FileText className="h-4 w-4" /> }] : []),
    { id: 'notes', label: 'Notes', icon: <FileText className="h-4 w-4" /> },
    { id: 'discussion', label: 'Discussion', icon: <GraduationCap className="h-4 w-4" />, badge: progress?.comments.length ? <Badge variant="primary">{progress.comments.length}</Badge> : undefined },
  ]

  return (
    // key forces a fresh subtree per lesson so note/quiz/assignment local
    // state resets correctly when navigating between lessons.
    <div ref={topRef} key={lesson.id} className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/roadmap" className="hover:text-foreground">Roadmap</Link>
        <span>/</span>
        <span>{module.icon} {module.title}</span>
        <span>/</span>
        <span>Lesson {getLessonNumber(lesson.id)} of {TOTAL_LESSONS}</span>
      </div>

      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="outline">{lesson.code}</Badge>
            <span className={cn('rounded-full border px-2 py-0.5 text-xs font-medium', difficultyColor(lesson.difficulty))}>{lesson.difficulty}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{formatDuration(lesson.durationMinutes)}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{lesson.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{lesson.summary}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => toggleBookmark(lesson.id)} title="Bookmark">
            <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-current text-primary')} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => toggleFavorite(lesson.id)} title="Favorite">
            <Star className={cn('h-4 w-4', favorited && 'fill-current text-warning')} />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main column */}
        <div>
          <Tabs tabs={tabs} active={tab} onChange={setTab} className="mb-5" />

          {tab === 'learn' && (
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-5">
                  <Markdown>{lesson.content}</Markdown>
                </CardContent>
              </Card>

              <div>
                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold"><Target className="h-5 w-5 text-accent" /> Real-world example</h3>
                <Card><CardContent className="pt-5"><Markdown>{lesson.realWorldExample}</Markdown></CardContent></Card>
              </div>

              {lesson.resources.length > 0 && (
                <div>
                  <h3 className="mb-2 text-lg font-semibold">📚 Resources</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {lesson.resources.map((r, i) => {
                      const Icon = RESOURCE_ICON[r.type]
                      return (
                        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary">
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div>
                            <p className="text-sm font-medium leading-tight">{r.title}</p>
                            {r.description && <p className="mt-0.5 text-xs text-muted-foreground">{r.description}</p>}
                            <div className="mt-1 flex gap-2">
                              <Badge variant="outline" className="capitalize">{r.type}</Badge>
                              {r.meta && <Badge variant="outline">{r.meta}</Badge>}
                            </div>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'practice' && (
            <div className="space-y-8">
              {lesson.exercises.length > 0 && (
                <section>
                  <h3 className="mb-3 text-lg font-semibold">✏️ Exercises</h3>
                  <ExercisePanel exercises={lesson.exercises} lessonId={lesson.id} />
                </section>
              )}
              {practiceQuiz && (
                <section>
                  <h3 className="mb-1 text-lg font-semibold">🧠 Practice quiz</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{practiceQuiz.questions.length} questions · pass mark {practiceQuiz.passingScore}%. Switch to the Instructor role to grade open answers.</p>
                  <QuizRunner quiz={practiceQuiz} lessonId={lesson.id} lessonTitle={lesson.title} />
                </section>
              )}
              {lesson.exercises.length === 0 && !practiceQuiz && (
                <p className="text-sm text-muted-foreground">No practice items for this lesson.</p>
              )}
            </div>
          )}

          {tab === 'assignment' && lesson.assignment && <AssignmentPanel assignment={lesson.assignment} lessonId={lesson.id} />}
          {tab === 'notes' && <NoteEditor lessonId={lesson.id} lessonTitle={lesson.title} />}
          {tab === 'discussion' && <Discussion lessonId={lesson.id} />}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent className="pt-5">
              <ScoreBreakdown lesson={lesson} progress={progress} />
              <Button
                className="mt-4 w-full"
                variant={completed ? 'success' : 'primary'}
                onClick={() => setComplete(lesson.id, !completed, lesson.title)}
              >
                {completed ? <><CheckCircle2 className="h-4 w-4" /> Completed</> : <><Circle className="h-4 w-4" /> Mark complete</>}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-5 text-sm">
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 font-semibold"><Target className="h-4 w-4 text-primary" /> Objectives</p>
                <ul className="space-y-1">
                  {lesson.objectives.map((o, i) => (
                    <li key={i} className="flex gap-2 text-muted-foreground"><span className="text-primary">•</span>{o}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 font-semibold"><ListChecks className="h-4 w-4 text-success" /> Completion criteria</p>
                <ul className="space-y-1">
                  {lesson.completionCriteria.map((c, i) => (
                    <li key={i} className="flex gap-2 text-muted-foreground"><span className="text-success">✓</span>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 font-semibold"><FileText className="h-4 w-4 text-accent" /> Deliverables</p>
                <ul className="space-y-1">
                  {lesson.deliverables.map((d, i) => (
                    <li key={i} className="flex gap-2 text-muted-foreground"><span className="text-accent">→</span>{d}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {lesson.portfolioArtifact && (
            <Callout tone="tip" title="Portfolio artifact">
              Completing this lesson adds <strong>{lesson.portfolioArtifact.title}</strong> ({lesson.portfolioArtifact.type}) to your <Link to="/portfolio" className="text-primary underline">portfolio</Link>.
            </Callout>
          )}
        </aside>
      </div>

      {/* Bottom nav */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
        {prev ? (
          <Button variant="outline" onClick={() => navigate(`/lesson/${prev.id}`)}>
            <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">{prev.code}</span> Prev
          </Button>
        ) : <span />}

        {!completed && (
          <Button variant="success" onClick={() => setComplete(lesson.id, true, lesson.title)}>
            <CheckCircle2 className="h-4 w-4" /> Mark complete
          </Button>
        )}
        {completed && next && (
          <Badge variant="success" className="hidden sm:inline-flex"><Award className="h-3.5 w-3.5" /> Done</Badge>
        )}

        {next ? (
          <Button onClick={() => navigate(`/lesson/${next.id}`)}>
            Next <span className="hidden sm:inline">{next.code}</span> <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => navigate('/certificate')}>Finish <Award className="h-4 w-4" /></Button>
        )}
      </div>
    </div>
  )
}
