import { useRef, useState } from 'react'
import { Sun, Moon, Download, Upload, Trash2, GraduationCap, UserCog, Database, Check } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import { exportAll, importAll, clearAll, usingServerStore, type BackupFile } from '@/services/storage'
import { downloadJSON } from '@/lib/download'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { theme, setTheme, role, setRole, learnerName, setLearnerName } = useSettingsStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(null), 2500)
  }

  const handleExport = async () => {
    const backup = await exportAll()
    downloadJSON(`ba-academy-backup-${new Date().toISOString().slice(0, 10)}.json`, backup)
    flash('Backup downloaded.')
  }

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text()
      const data = JSON.parse(text) as BackupFile
      await importAll(data)
      flash('Backup restored. Reloading…')
      setTimeout(() => window.location.reload(), 800)
    } catch (e) {
      flash(e instanceof Error ? e.message : 'Import failed.')
    }
  }

  const handleReset = async () => {
    if (!confirm('Reset ALL progress, notes, and settings? This cannot be undone.')) return
    await clearAll()
    window.location.reload()
  }

  return (
    <div className="animate-fade-in mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Personalize your experience and manage your data.</p>
      </div>

      {msg && (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2 text-sm text-success">
          <Check className="h-4 w-4" /> {msg}
        </div>
      )}

      <Card>
        <CardHeader><CardTitle>Profile</CardTitle><CardDescription>The name shown on your dashboard and certificate.</CardDescription></CardHeader>
        <CardContent>
          <label className="mb-1 block text-sm font-medium">Display name</label>
          <Input value={learnerName} onChange={(e) => setLearnerName(e.target.value)} placeholder="Your name" className="max-w-sm" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Choose your theme.</CardDescription></CardHeader>
        <CardContent className="flex gap-2">
          {(['light', 'dark'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn('flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium capitalize', theme === t ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted')}
            >
              {t === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} {t}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Active identity</CardTitle><CardDescription>The shared workspace uses one identity at a time for comments and reviews.</CardDescription></CardHeader>
        <CardContent className="flex gap-2">
          <button
            onClick={() => setRole('learner')}
            className={cn('flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium', role === 'learner' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted')}
          >
            <GraduationCap className="h-4 w-4" /> Learner
          </button>
          <button
            onClick={() => setRole('instructor')}
            className={cn('flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium', role === 'instructor' ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:bg-muted')}
          >
            <UserCog className="h-4 w-4" /> Instructor
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database className="h-4 w-4" /> Data & backup</CardTitle>
          <CardDescription>
            Backend: <strong>{usingServerStore ? 'local server → data/ba-data.xml file' : 'browser localStorage'}</strong>.
            {usingServerStore ? ' Data persists on disk via the data server.' : ' Run `npm run dev:server` to persist to an XML file instead.'} Export a JSON backup or restore one.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4" /> Export backup</Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Import backup</Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleImportFile(f)
              e.target.value = ''
            }}
          />
          <Button variant="danger" onClick={handleReset}><Trash2 className="h-4 w-4" /> Reset everything</Button>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Storage backend is abstracted — the same UI can later be pointed at Firebase or Supabase without changes.
      </p>
    </div>
  )
}
