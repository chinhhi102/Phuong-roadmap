import { useEffect, useRef, useState } from 'react'
import { Eye, Pencil, Maximize2, Minimize2, Check, Loader2, ListChecks, Table2, Code2, Quote } from 'lucide-react'
import { useNotesStore } from '@/store/notesStore'
import { useProgressStore } from '@/store/progressStore'
import { Markdown } from '@/components/Markdown'
import { cn } from '@/lib/utils'

type Mode = 'edit' | 'preview'

const SNIPPETS = [
  { icon: ListChecks, label: 'Checklist', text: '\n- [ ] Task one\n- [ ] Task two\n' },
  { icon: Table2, label: 'Table', text: '\n| Column A | Column B |\n| --- | --- |\n| val | val |\n' },
  { icon: Code2, label: 'Code', text: '\n```\ncode here\n```\n' },
  { icon: Quote, label: 'Callout', text: '\n> 💡 **Insight:** write something worth remembering.\n' },
]

export function NoteEditor({ lessonId, lessonTitle }: { lessonId: string; lessonTitle: string }) {
  const note = useNotesStore((s) => s.notes[lessonId])
  const setNote = useNotesStore((s) => s.setNote)
  const logNote = useProgressStore((s) => s.logNote)

  const [value, setValue] = useState(note?.content ?? '')
  const [mode, setMode] = useState<Mode>('edit')
  const [fullscreen, setFullscreen] = useState(false)
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const firstRender = useRef(true)

  // Debounced autosave.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setSaving(true)
    const t = setTimeout(() => {
      setNote(lessonId, value)
      setSaving(false)
      if (value.trim()) logNote(lessonId, lessonTitle)
    }, 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const insert = (snippet: string) => {
    const el = textareaRef.current
    if (!el) {
      setValue((v) => v + snippet)
      return
    }
    const start = el.selectionStart
    const end = el.selectionEnd
    setValue((v) => v.slice(0, start) + snippet + v.slice(end))
    requestAnimationFrame(() => {
      el.focus()
      el.selectionStart = el.selectionEnd = start + snippet.length
    })
  }

  const editor = (
    <div className={cn('flex flex-col', fullscreen ? 'fixed inset-0 z-50 bg-background p-4' : 'h-full')}>
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <div className="flex rounded-md border border-border p-0.5">
          <button
            onClick={() => setMode('edit')}
            className={cn('flex items-center gap-1 rounded px-2 py-1 text-xs', mode === 'edit' ? 'bg-muted' : 'text-muted-foreground')}
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            onClick={() => setMode('preview')}
            className={cn('flex items-center gap-1 rounded px-2 py-1 text-xs', mode === 'preview' ? 'bg-muted' : 'text-muted-foreground')}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
        </div>

        {mode === 'edit' &&
          SNIPPETS.map((s) => (
            <button
              key={s.label}
              onClick={() => insert(s.text)}
              title={`Insert ${s.label}`}
              className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
            >
              <s.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}

        <div className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            {saving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Check className="h-3 w-3 text-success" /> Saved
              </>
            )}
          </span>
          <button onClick={() => setFullscreen((f) => !f)} className="rounded-md p-1 hover:bg-muted" title="Fullscreen">
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mode === 'edit' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write your personal notes in Markdown… (supports checklists, tables, code, callouts)"
          className={cn(
            'w-full flex-1 resize-none rounded-lg border border-input bg-background p-3 font-mono text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring',
            fullscreen ? 'min-h-0' : 'min-h-[280px]',
          )}
        />
      ) : (
        <div className={cn('flex-1 overflow-y-auto rounded-lg border border-border bg-card p-4', fullscreen ? '' : 'min-h-[280px]')}>
          {value.trim() ? <Markdown>{value}</Markdown> : <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>}
        </div>
      )}
    </div>
  )

  return editor
}
