import type { KeyValueStore } from './storage'

/**
 * Storage backend that talks to the local data server (see /server/index.mjs),
 * which persists to an XML file on disk. Selected when VITE_STORAGE === 'server'.
 * All methods are async; zustand's persist middleware handles async storage.
 */
export class ServerStore implements KeyValueStore {
  private base: string

  constructor(base = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787') {
    this.base = base.replace(/\/$/, '')
  }

  private url(key: string) {
    return `${this.base}/api/kv/${encodeURIComponent(key)}`
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const res = await fetch(this.url(key))
      if (res.status === 200) return await res.text()
      return null
    } catch {
      return null
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await fetch(this.url(key), { method: 'PUT', headers: { 'Content-Type': 'text/plain' }, body: value })
    } catch {
      /* server unavailable — swallow so the UI stays responsive */
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await fetch(this.url(key), { method: 'DELETE' })
    } catch {
      /* ignore */
    }
  }

  async keys(): Promise<string[]> {
    try {
      const res = await fetch(`${this.base}/api/keys`)
      if (res.ok) return (await res.json()) as string[]
      return []
    } catch {
      return []
    }
  }
}
