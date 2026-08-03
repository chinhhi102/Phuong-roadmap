import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { allLessons, getModuleOfLesson } from '@/data/curriculum'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) setQ('')
  }, [open])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const list = term
      ? allLessons.filter(
          (l) =>
            l.title.toLowerCase().includes(term) ||
            l.summary.toLowerCase().includes(term) ||
            l.code.toLowerCase().includes(term),
        )
      : allLessons
    return list.slice(0, 8)
  }, [q])

  const go = (id: string) => {
    navigate(`/lesson/${id}`)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-xl">
      <div className="mb-3 flex items-center gap-2 rounded-lg border border-input bg-background px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && results[0] && go(results[0].id)}
          placeholder="Search lessons…"
          className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="space-y-1">
        {results.map((l) => {
          const mod = getModuleOfLesson(l.id)
          return (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <span>{mod?.icon}</span>
                <span className="font-medium">{l.title}</span>
              </span>
              <Badge variant="outline">{l.code}</Badge>
            </button>
          )
        })}
        {results.length === 0 && <p className="px-3 py-6 text-center text-sm text-muted-foreground">No lessons found.</p>}
      </div>
    </Modal>
  )
}
