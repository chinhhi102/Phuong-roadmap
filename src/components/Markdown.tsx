import { lazy, Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { cn } from '@/lib/utils'

// Mermaid pulls in a large dependency graph — load it only when a diagram
// actually appears in the content.
const Mermaid = lazy(() => import('./Mermaid').then((m) => ({ default: m.Mermaid })))

/**
 * Rich Markdown renderer: GitHub-flavored Markdown + fenced ```mermaid diagrams.
 * `pre` is a passthrough so the custom `code` renderer fully controls fenced
 * blocks (and can swap mermaid blocks for live diagrams).
 */
const components: Components = {
  pre: ({ children }) => <>{children}</>,
  code(props) {
    const { className, children } = props
    const match = /language-(\w+)/.exec(className || '')
    const value = String(children).replace(/\n$/, '')
    if (!match) return <code className={className}>{children}</code>
    if (match[1] === 'mermaid')
      return (
        <Suspense fallback={<div className="my-4 text-xs text-muted-foreground">Loading diagram…</div>}>
          <Mermaid chart={value} />
        </Suspense>
      )
    return (
      <pre>
        <code className={className}>{value}</code>
      </pre>
    )
  },
  a: (props) => (
    <a href={props.href} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  ),
}

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn('prose-ba', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
