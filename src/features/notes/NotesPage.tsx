import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, StickyNote, ArrowRight } from 'lucide-react'
import { useNotesStore } from '@/store/notesStore'
import { getLesson, getModuleOfLesson } from '@/data/curriculum'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime } from '@/lib/utils'

export default function NotesPage() {
  const notes = useNotesStore((s) => s.notes)
  const [query, setQuery] = useState('')

  const items = useMemo(() => {
    const term = query.trim().toLowerCase()
    return Object.entries(notes)
      .filter(([, n]) => n.content.trim().length > 0)
      .map(([lessonId, note]) => ({ lesson: getLesson(lessonId), note, lessonId }))
      .filter((x) => x.lesson)
      .filter((x) => {
        if (!term) return true
        return x.lesson!.title.toLowerCase().includes(term) || x.note.content.toLowerCase().includes(term)
      })
      .sort((a, b) => (a.note.updatedAt < b.note.updatedAt ? 1 : -1))
  }, [notes, query])

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">My Notes</h1>
        <p className="text-sm text-muted-foreground">All your lesson notes in one place. Notes auto-save as you write.</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your notes…" className="pl-9" />
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <StickyNote className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No notes yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Open a lesson and use the <strong>Notes</strong> tab to capture your thoughts.</p>
          <Link to="/roadmap" className="mt-3 inline-block text-sm text-primary underline">Go to roadmap →</Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map(({ lesson, note, lessonId }) => {
            const mod = getModuleOfLesson(lessonId)
            return (
              <Link
                key={lessonId}
                to={`/lesson/${lessonId}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span>{mod?.icon}</span>
                  <Badge variant="outline">{lesson!.code}</Badge>
                  <span className="truncate text-sm font-semibold">{lesson!.title}</span>
                </div>
                <p className="line-clamp-3 flex-1 whitespace-pre-wrap text-sm text-muted-foreground">
                  {note.content.replace(/[#*`>-]/g, '').slice(0, 220)}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Updated {formatDateTime(note.updatedAt)}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
