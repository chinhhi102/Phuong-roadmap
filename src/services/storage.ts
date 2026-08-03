// ============================================================================
// Storage abstraction layer.
//
// The whole app persists through this module. It ships with two backends:
//   • localStorage (default) — works on static hosts like GitHub Pages
//   • ServerStore  — set VITE_STORAGE=server to persist to an XML file via the
//                    local data server (/server/index.mjs)
// To add Firebase / Supabase / IndexedDB, implement `KeyValueStore` once and
// swap `activeStore` — no UI changes.
// ============================================================================

import { ServerStore } from './serverStore'

export interface KeyValueStore {
  getItem(key: string): string | null | Promise<string | null>
  setItem(key: string, value: string): void | Promise<void>
  removeItem(key: string): void | Promise<void>
  /** All keys owned by this store (used for global export). */
  keys(): string[] | Promise<string[]>
}

/** Namespaced localStorage keys so a global export/import is deterministic. */
export const STORAGE_KEYS = {
  settings: 'ba.settings',
  progress: 'ba.progress',
  notes: 'ba.notes',
  exams: 'ba.exams',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

const OWNED_KEYS: string[] = Object.values(STORAGE_KEYS)

/** Guard against SSR / disabled storage. */
function safeLocalStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const probe = '__ba_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return null
  }
}

/** In-memory fallback so the app never crashes if localStorage is blocked. */
class MemoryStore implements KeyValueStore {
  private map = new Map<string, string>()
  getItem(key: string) {
    return this.map.has(key) ? this.map.get(key)! : null
  }
  setItem(key: string, value: string) {
    this.map.set(key, value)
  }
  removeItem(key: string) {
    this.map.delete(key)
  }
  keys() {
    return [...this.map.keys()]
  }
}

class LocalStore implements KeyValueStore {
  constructor(private ls: Storage) {}
  getItem(key: string) {
    return this.ls.getItem(key)
  }
  setItem(key: string, value: string) {
    this.ls.setItem(key, value)
  }
  removeItem(key: string) {
    this.ls.removeItem(key)
  }
  keys() {
    return OWNED_KEYS.filter((k) => this.ls.getItem(k) !== null)
  }
}

const ls = safeLocalStorage()
const useServer = import.meta.env.VITE_STORAGE === 'server'

/** The active backend for the whole app (localStorage by default). */
export const activeStore: KeyValueStore = useServer
  ? new ServerStore()
  : ls
    ? new LocalStore(ls)
    : new MemoryStore()

/** True when data is being persisted to the local file/server backend. */
export const usingServerStore = useServer

/**
 * Adapter compatible with zustand's `persist` StateStorage interface.
 * Every store passes through here, so persistence backend is centralized.
 */
export const zustandStorage = {
  getItem: (name: string) => activeStore.getItem(name),
  setItem: (name: string, value: string) => activeStore.setItem(name, value),
  removeItem: (name: string) => activeStore.removeItem(name),
}

// --------------------------------------------------------------------------
// Global backup: export / import ALL learner data as one JSON blob.
// --------------------------------------------------------------------------

export interface BackupFile {
  app: 'ba-academy'
  version: 1
  exportedAt: string
  data: Record<string, unknown>
}

export async function exportAll(): Promise<BackupFile> {
  const keys = await activeStore.keys()
  const data: Record<string, unknown> = {}
  for (const key of keys) {
    const raw = await activeStore.getItem(key)
    if (raw != null) {
      try {
        data[key] = JSON.parse(raw)
      } catch {
        data[key] = raw
      }
    }
  }
  return { app: 'ba-academy', version: 1, exportedAt: new Date().toISOString(), data }
}

export async function importAll(file: BackupFile): Promise<void> {
  if (!file || file.app !== 'ba-academy' || !file.data) {
    throw new Error('Invalid backup file.')
  }
  for (const [key, value] of Object.entries(file.data)) {
    if (!OWNED_KEYS.includes(key)) continue
    await activeStore.setItem(key, JSON.stringify(value))
  }
}

export async function clearAll(): Promise<void> {
  const keys = await activeStore.keys()
  for (const key of keys) await activeStore.removeItem(key)
}
