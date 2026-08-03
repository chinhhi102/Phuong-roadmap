import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, Download, Lock, CheckCircle2, FileDown, ChevronDown } from 'lucide-react'
import { allLessons, getModuleOfLesson } from '@/data/curriculum'
import { useProgressStore } from '@/store/progressStore'
import { useNotesStore } from '@/store/notesStore'
import { useSettingsStore } from '@/store/settingsStore'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { downloadText } from '@/lib/download'
import { formatDate, cn } from '@/lib/utils'

export default function PortfolioPage() {
  const progressMap = useProgressStore((s) => s.progress)
  const notes = useNotesStore((s) => s.notes)
  const name = useSettingsStore((s) => s.learnerName)
  const [expanded, setExpanded] = useState<string | null>(null)

  const artifacts = useMemo(
    () =>
      allLessons
        .filter((l) => l.portfolioArtifact)
        .map((l) => ({
          lesson: l,
          artifact: l.portfolioArtifact!,
          earned: progressMap[l.id]?.completed ?? false,
          submission: progressMap[l.id]?.submission,
        })),
    [progressMap],
  )

  const earnedCount = artifacts.filter((a) => a.earned).length
  const pct = artifacts.length ? Math.round((earnedCount / artifacts.length) * 100) : 0

  const exportPortfolio = () => {
    const rows = artifacts
      .filter((a) => a.earned)
      .map(
        (a) => `
      <section style="margin:24px 0;padding:20px;border:1px solid #ddd;border-radius:10px">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#6366f1">${a.artifact.type}</div>
        <h2 style="margin:4px 0">${a.artifact.title}</h2>
        <p style="color:#555">${a.artifact.description}</p>
        <p style="font-size:13px;color:#888">Source lesson: ${a.lesson.code} — ${a.lesson.title}</p>
        ${a.submission?.text ? `<h4>Submission</h4><pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px">${escapeHtml(a.submission.text)}</pre>` : ''}
        ${notes[a.lesson.id]?.content ? `<h4>Notes</h4><pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px">${escapeHtml(notes[a.lesson.id].content)}</pre>` : ''}
      </section>`,
      )
      .join('')

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(name)} — BA Portfolio</title>
      <style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:820px;margin:40px auto;padding:0 20px;color:#1c2430}</style></head>
      <body>
        <h1>${escapeHtml(name)} — Business Analyst Portfolio</h1>
        <p style="color:#666">Generated ${new Date().toLocaleDateString()} · ${earnedCount} artifacts</p>
        <hr/>
        ${rows || '<p>No artifacts earned yet.</p>'}
        <hr/><p style="font-size:12px;color:#999">Produced with BA Academy.</p>
      </body></html>`
    downloadText(`${name.replace(/\s+/g, '-').toLowerCase()}-ba-portfolio.html`, html, 'text/html')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">BA Portfolio</h1>
          <p className="text-sm text-muted-foreground">Proof of work, built automatically as you complete lessons.</p>
        </div>
        <Button onClick={exportPortfolio} disabled={earnedCount === 0}>
          <Download className="h-4 w-4" /> Export portfolio
        </Button>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium">Artifacts earned</span>
          <span className="font-semibold">{earnedCount}/{artifacts.length}</span>
        </div>
        <Progress value={pct} gradient="from-violet-500 to-purple-500" className="h-2.5" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {artifacts.map(({ lesson, artifact, earned, submission }) => {
          const mod = getModuleOfLesson(lesson.id)
          const isOpen = expanded === lesson.id
          return (
            <Card key={lesson.id} className={cn(!earned && 'opacity-70')}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="accent" className="mb-1">{artifact.type}</Badge>
                    <h3 className="font-semibold leading-tight">{artifact.title}</h3>
                  </div>
                  {earned ? <CheckCircle2 className="h-5 w-5 shrink-0 text-success" /> : <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{artifact.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{mod?.icon} {lesson.code}</span>
                  <Link to={`/lesson/${lesson.id}`} className="text-primary underline">Open lesson</Link>
                </div>

                {earned && submission?.text && (
                  <div className="mt-3">
                    <button onClick={() => setExpanded(isOpen ? null : lesson.id)} className="flex items-center gap-1 text-xs font-medium text-primary">
                      <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} /> {isOpen ? 'Hide' : 'View'} submission
                    </button>
                    {isOpen && <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs">{submission.text}</pre>}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {artifacts.length > 0 && earnedCount === 0 && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          <FolderKanban className="h-6 w-6" />
          <span>Complete lessons that produce artifacts (look for the <FileDown className="inline h-3.5 w-3.5" /> portfolio tag) to start filling your portfolio.</span>
        </div>
      )}
      <p className="mt-6 text-center text-xs text-muted-foreground">Portfolio last reflects your progress as of {formatDate(new Date().toISOString())}.</p>
    </div>
  )
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c))
}
