import { useRef, useState } from 'react'
import { Sun, Moon, Download, Upload, Trash2, GraduationCap, UserCog, Database, Check, Cloud, CloudOff, RefreshCw, TriangleAlert, Share2 } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import { exportAll, importAll, clearAll, usingServerStore, type BackupFile } from '@/services/storage'
import { useSyncStatus, clearCloud, markLocalAuthoritative, isFirebaseConfigured } from '@/services/cloudSync'
import { isInstructorDevice, clearInstructorDevice } from '@/services/deviceIdentity'
import { useShareStatus } from '@/features/chat/useProgressPublisher'
import { downloadJSON } from '@/lib/download'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { theme, setTheme, role, setRole, learnerName, setLearnerName } = useSettingsStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const sync = useSyncStatus()
  const syncOn = isFirebaseConfigured()

  const syncLabel =
    !syncOn ? 'Off — this device only'
    : sync.state === 'connecting' ? 'Connecting…'
    : sync.state === 'syncing' ? 'Saving to the cloud…'
    : sync.state === 'error' ? `Offline — changes are saved here and will sync later${sync.error ? ` (${sync.error})` : ''}`
    : sync.lastSyncedAt ? `All saved · last synced ${new Date(sync.lastSyncedAt).toLocaleTimeString()}`
    : 'All saved'

  const syncTone =
    !syncOn ? 'border-border bg-muted/50 text-muted-foreground'
    : sync.state === 'error' ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
    : sync.state === 'synced' ? 'border-success/30 bg-success/10 text-success'
    : 'border-primary/30 bg-primary/10 text-primary'

  const share = useShareStatus()
  const instructorDevice = isInstructorDevice()

  const shareLabel =
    !syncOn ? 'Off — Firebase is not configured on this build.'
    : instructorDevice ? "This browser is Chính's. It reviews Phương's work and never publishes progress of its own, so it can't overwrite hers."
    : role === 'instructor' ? "You're signed in as Chính — open Review to see her exams, assignments and notes."
    : share.result === 'published' ? `Shared with Chính${share.at ? ` · last sent ${new Date(share.at).toLocaleTimeString()}` : ''}`
    : share.result === 'empty' ? 'Nothing to share yet — finish a lesson, exam or note and it goes straight to Chính.'
    : share.result === 'not-owner' ? "Another device is already publishing Phương's work, and it has more on it than this one. Nothing was overwritten."
    : 'Connecting…'

  const shareTone =
    !syncOn ? 'border-border bg-muted/50 text-muted-foreground'
    : instructorDevice || role === 'instructor' ? 'border-accent/30 bg-accent/10 text-accent'
    : share.result === 'published' ? 'border-success/30 bg-success/10 text-success'
    : share.result === 'not-owner' ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
    : 'border-border bg-muted/50 text-muted-foreground'

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
      // The restored bytes must beat whatever the cloud currently holds.
      markLocalAuthoritative()
      flash('Backup restored. Reloading…')
      setTimeout(() => window.location.reload(), 1200)
    } catch (e) {
      flash(e instanceof Error ? e.message : 'Import failed.')
    }
  }

  const handleReset = async () => {
    if (!confirm('Reset ALL progress, notes, and settings? This cannot be undone.')) return
    // Clear the cloud replica first — otherwise the next load simply pulls it
    // all back down and the reset looks like it did nothing.
    await clearCloud(role)
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
            <GraduationCap className="h-4 w-4" /> Phương
          </button>
          <button
            onClick={() => setRole('instructor')}
            className={cn('flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium', role === 'instructor' ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:bg-muted')}
          >
            <UserCog className="h-4 w-4" /> Chính
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {syncOn ? <Cloud className="h-4 w-4 text-primary" /> : <CloudOff className="h-4 w-4" />} Cloud sync
          </CardTitle>
          <CardDescription>
            {syncOn
              ? 'Your progress, notes, exam results and study setup are saved to this device and mirrored to the cloud, so you can carry on from any phone or computer.'
              : 'Firebase is not configured, so your data stays on this device only.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={cn('flex items-center gap-2 rounded-lg border px-3 py-2 text-sm', syncTone)}>
            {sync.state === 'error' ? (
              <TriangleAlert className="h-4 w-4 shrink-0" />
            ) : sync.state === 'syncing' || sync.state === 'connecting' ? (
              <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
            ) : syncOn ? (
              <Cloud className="h-4 w-4 shrink-0" />
            ) : (
              <CloudOff className="h-4 w-4 shrink-0" />
            )}
            <span>{syncLabel}</span>
          </div>
          {syncOn && (
            <p className="mt-2 text-xs text-muted-foreground">
              Syncing as <strong>{role === 'learner' ? 'Phương' : 'Chính'}</strong> — each identity has its own
              private space, so your data and your instructor's never mix.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Share2 className="h-4 w-4" /> Sharing with Chính</CardTitle>
          <CardDescription>
            Separate from cloud sync: Phương's device publishes her exams, assignments and notes to the shared room
            so Chính can open <strong>Review</strong> and grade them. Only her device publishes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={cn('flex items-start gap-2 rounded-lg border px-3 py-2 text-sm', shareTone)}>
            <Share2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{shareLabel}</span>
          </div>
          {instructorDevice && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-xs text-muted-foreground">Is this actually Phương's device?</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearInstructorDevice()
                  setRole('learner')
                  window.location.reload()
                }}
              >
                Use this as Phương's device
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database className="h-4 w-4" /> Data & backup</CardTitle>
          <CardDescription>
            On this device: <strong>{usingServerStore ? 'local server → data/ba-data.xml file' : 'browser localStorage'}</strong>.
            {usingServerStore ? ' Data persists on disk via the data server.' : ''} Export a JSON backup or restore one.
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
        Reads always come from this device, so the app works offline; the cloud copy catches up as soon as you're back online.
      </p>
    </div>
  )
}
