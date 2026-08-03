import { useState } from 'react'
import { Send, GraduationCap, UserCog, MessagesSquare } from 'lucide-react'
import { useProgressStore } from '@/store/progressStore'
import { useSettingsStore } from '@/store/settingsStore'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { formatDateTime, cn, roleName } from '@/lib/utils'

export function Discussion({ lessonId }: { lessonId: string }) {
  const comments = useProgressStore((s) => s.progress[lessonId]?.comments ?? [])
  const addComment = useProgressStore((s) => s.addComment)
  const role = useSettingsStore((s) => s.role)
  const [text, setText] = useState('')

  const send = () => {
    if (!text.trim()) return
    addComment(lessonId, role, text.trim())
    setText('')
  }

  return (
    <div className="space-y-4">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <MessagesSquare className="h-4 w-4" /> Ask questions, submit feedback, and respond inline. You are posting as{' '}
        <span className={cn('font-medium', role === 'instructor' ? 'text-accent' : 'text-primary')}>{roleName(role)}</span>.
      </p>

      <div className="space-y-3">
        {comments.length === 0 && <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No messages yet. Start the conversation below.</p>}
        {comments.map((c) => {
          const isInstructor = c.author === 'instructor'
          return (
            <div key={c.id} className={cn('flex gap-3', isInstructor && 'flex-row-reverse')}>
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', isInstructor ? 'bg-accent/15 text-accent' : 'bg-primary/15 text-primary')}>
                {isInstructor ? <UserCog className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
              </div>
              <div className={cn('max-w-[80%] rounded-lg border border-border p-3', isInstructor ? 'bg-accent/5' : 'bg-card')}>
                <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{roleName(c.author)}</span>
                  <span>· {formatDateTime(c.createdAt)}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm">{c.text}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-end gap-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send()
          }}
          placeholder={`Message as ${roleName(role)}… (⌘/Ctrl + Enter to send)`}
          className="min-h-[52px]"
        />
        <Button onClick={send} disabled={!text.trim()} size="icon" className="h-[52px] w-12 shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
