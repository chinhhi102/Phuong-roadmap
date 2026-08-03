import { Link } from 'react-router-dom'
import { Award, Printer, Lock, Sparkles } from 'lucide-react'
import { curriculum } from '@/data/curriculum'
import { useProgressStore } from '@/store/progressStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useExamScores } from '@/store/examStore'
import { computeOverall } from '@/lib/scoring'
import { totalHoursStudied } from '@/lib/selectors'
import { competencyLevel } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { Input } from '@/components/ui/Input'

export default function CertificatePage() {
  const progressMap = useProgressStore((s) => s.progress)
  const { learnerName, setLearnerName } = useSettingsStore()
  const examScores = useExamScores()
  const overall = computeOverall(curriculum, progressMap, examScores)
  const complete = overall.completionPct === 100
  const hours = totalHoursStudied(progressMap)
  const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  const level = competencyLevel(overall.averageScore)

  const printCertificate = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Certificate — ${escapeHtml(learnerName)}</title>
    <style>
      *{box-sizing:border-box} body{margin:0;font-family:Georgia,'Times New Roman',serif;color:#1c2430}
      .cert{width:1000px;max-width:100%;margin:24px auto;padding:56px;border:14px solid #4f46e5;border-radius:16px;text-align:center;background:linear-gradient(135deg,#fff,#f5f3ff)}
      .k{font-size:13px;letter-spacing:.35em;text-transform:uppercase;color:#6366f1}
      h1{font-size:44px;margin:10px 0} .name{font-size:38px;margin:18px 0;color:#4f46e5;border-bottom:2px solid #ddd;display:inline-block;padding:0 30px 8px}
      .row{display:flex;justify-content:center;gap:48px;margin-top:28px} .row div{font-size:14px;color:#555}
      .row b{display:block;font-size:22px;color:#1c2430}
    </style></head><body>
      <div class="cert">
        <div class="k">BA Academy · Certificate of Completion</div>
        <h1>Business Analyst Program</h1>
        <p>This certifies that</p>
        <div class="name">${escapeHtml(learnerName)}</div>
        <p>has successfully completed the complete Business Analyst learning path,<br/>demonstrating competency across ${curriculum.length} modules and ${overall.totalLessons} lessons.</p>
        <div class="row">
          <div><b>${date}</b>Date</div>
          <div><b>${overall.averageScore}%</b>Overall score</div>
          <div><b>${level}</b>Competency level</div>
        </div>
      </div>
      <script>window.onload=function(){window.print()}</script>
    </body></html>`
    const w = window.open('', '_blank')
    if (w) {
      w.document.write(html)
      w.document.close()
    }
  }

  if (!complete) {
    return (
      <div className="animate-fade-in mx-auto max-w-lg py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Lock className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Certificate locked</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete all {overall.totalLessons} lessons to unlock your certificate. You're {overall.completionPct}% there!
        </p>
        <div className="mx-auto mt-5 max-w-sm">
          <Progress value={overall.completionPct} gradient="from-primary to-accent" className="h-3" />
          <p className="mt-2 text-sm text-muted-foreground">{overall.totalLessons - overall.completedLessons} lessons to go</p>
        </div>
        <Link to="/roadmap" className="mt-5 inline-block">
          <Button><Sparkles className="h-4 w-4" /> Keep learning</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">🎉 Your Certificate</h1>
        <Button onClick={printCertificate}><Printer className="h-4 w-4" /> Print / Save as PDF</Button>
      </div>

      <div className="rounded-2xl border-[6px] border-primary bg-gradient-to-br from-card to-primary/5 p-8 text-center shadow-xl md:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">BA Academy · Certificate of Completion</p>
        <Award className="mx-auto my-4 h-14 w-14 text-primary" />
        <h2 className="text-2xl font-bold md:text-3xl">Business Analyst Program</h2>
        <p className="mt-3 text-sm text-muted-foreground">This certifies that</p>

        <div className="mx-auto my-3 max-w-sm">
          <Input value={learnerName} onChange={(e) => setLearnerName(e.target.value)} className="border-x-0 border-b border-t-0 border-border bg-transparent text-center text-2xl font-semibold" />
        </div>

        <p className="mx-auto max-w-lg text-sm text-muted-foreground">
          has successfully completed the complete Business Analyst learning path, demonstrating competency across {curriculum.length} modules and {overall.totalLessons} lessons.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-8 text-sm">
          <div><p className="text-lg font-bold">{date}</p><p className="text-muted-foreground">Date</p></div>
          <div><p className="text-lg font-bold">{overall.averageScore}%</p><p className="text-muted-foreground">Overall score</p></div>
          <div><p className="text-lg font-bold">{level}</p><p className="text-muted-foreground">Competency</p></div>
          <div><p className="text-lg font-bold">{hours}h</p><p className="text-muted-foreground">Time invested</p></div>
        </div>
      </div>
    </div>
  )
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c))
}
