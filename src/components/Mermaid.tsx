import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { useSettingsStore } from '@/store/settingsStore'

let counter = 0

/** Renders a Mermaid diagram from its source, re-rendering on theme change. */
export function Mermaid({ chart }: { chart: string }) {
  const theme = useSettingsStore((s) => s.theme)
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const id = `mermaid-${++counter}`
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    })
    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (active && ref.current) {
          ref.current.innerHTML = svg
          setError(null)
        }
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      active = false
    }
  }, [chart, theme])

  if (error) {
    return (
      <pre className="my-4 whitespace-pre-wrap rounded-lg border border-danger/30 bg-danger/5 p-3 text-xs text-danger">
        {chart}
      </pre>
    )
  }
  return <div ref={ref} className="mermaid my-5 flex justify-center overflow-x-auto" aria-label="diagram" />
}
