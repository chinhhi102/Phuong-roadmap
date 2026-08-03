import { useEffect, useState } from 'react'
import { Menu, Search, Sun, Moon, Flame, UserCog, GraduationCap } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import { useProgressStore } from '@/store/progressStore'
import { computeStreak } from '@/lib/selectors'
import { SearchPalette } from '@/components/SearchPalette'
import { cn } from '@/lib/utils'

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggleTheme, role, setRole } = useSettingsStore()
  const activity = useProgressStore((s) => s.activity)
  const streak = computeStreak(activity)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <button onClick={onMenu} className="rounded-md p-2 hover:bg-muted md:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      <button
        onClick={() => setSearchOpen(true)}
        className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:max-w-xs"
      >
        <Search className="h-4 w-4" />
        <span>Search lessons…</span>
        <kbd className="ml-auto hidden rounded border border-border px-1.5 text-[10px] md:inline">⌘K</kbd>
      </button>

      <div className="flex-1" />

      <div
        className="hidden items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1 text-sm font-medium text-warning sm:flex"
        title="Daily study streak"
      >
        <Flame className="h-4 w-4" />
        {streak} day{streak === 1 ? '' : 's'}
      </div>

      {/* Shared UI; the role toggle switches who authors comments / reviews. */}
      <div className="hidden items-center rounded-lg border border-border p-0.5 lg:flex" title="Active identity">
        <button
          onClick={() => setRole('learner')}
          className={cn('flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium', role === 'learner' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
        >
          <GraduationCap className="h-3.5 w-3.5" /> Learner
        </button>
        <button
          onClick={() => setRole('instructor')}
          className={cn('flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium', role === 'instructor' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground')}
        >
          <UserCog className="h-3.5 w-3.5" /> Instructor
        </button>
      </div>

      <button onClick={toggleTheme} className="rounded-md p-2 hover:bg-muted" aria-label="Toggle theme">
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
