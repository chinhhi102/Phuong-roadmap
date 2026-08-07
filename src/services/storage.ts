// ============================================================================
// Storage abstraction layer.
//
// The whole app persists through this module. It ships with two local backends:
//   • localStorage (default) — works on static hosts like GitHub Pages
//   • ServerStore  — set VITE_STORAGE=server to persist to an XML file via the
//                    local data server (/server/index.mjs)
//
// On top of whichever local backend is active sits a *mirror*: every write is
// announced to registered listeners, and `services/cloudSync.ts` uses that to
// copy the same bytes to Firebase. Reads always stay local and synchronous, so
// the app boots instantly and keeps working offline; the cloud is a replica
// that lets the same account resume on any device.
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
  study: 'ba.study',
  chat: 'ba.chat',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

const OWNED_KEYS: string[] = Object.values(STORAGE_KEYS)

/**
 * Keys replicated to the cloud. `ba.chat` is deliberately excluded — chat has
 * its own real-time Firebase engine (features/chat/chatSync.ts) and mirroring
 * it here would have the two engines fighting over the same messages.
 */
export const SYNCED_KEYS: string[] = [
  STORAGE_KEYS.progress,
  STORAGE_KEYS.notes,
  STORAGE_KEYS.exams,
  STORAGE_KEYS.study,
  STORAGE_KEYS.settings,
]

export const isSyncedKey = (key: string) => SYNCED_KEYS.includes(key)

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

// --------------------------------------------------------------------------
// Mirror layer: announce every write so the cloud replica can follow along.
// --------------------------------------------------------------------------

export type WriteListener = (key: string, value: string | null) => void

const writeListeners = new Set<WriteListener>()

/** Keys currently being written *from* the cloud — their writes must not echo back. */
const suppressed = new Set<string>()

/** Register a listener fired after every local write. Returns an unsubscribe. */
export function onStorageWrite(fn: WriteListener): () => void {
  writeListeners.add(fn)
  return () => writeListeners.delete(fn)
}

function announce(key: string, value: string | null) {
  if (suppressed.has(key)) return
  for (const fn of writeListeners) {
    try {
      fn(key, value)
    } catch {
      /* a broken listener must never break a local write */
    }
  }
}

/**
 * Wraps the chosen local backend and notifies listeners on write. Reads and
 * writes keep the underlying backend's own sync/async shape, so behaviour is
 * unchanged for every existing caller.
 */
class MirrorStore implements KeyValueStore {
  constructor(private base: KeyValueStore) {}
  getItem(key: string) {
    return this.base.getItem(key)
  }
  setItem(key: string, value: string) {
    const res = this.base.setItem(key, value)
    announce(key, value)
    return res
  }
  removeItem(key: string) {
    const res = this.base.removeItem(key)
    announce(key, null)
    return res
  }
  keys() {
    return this.base.keys()
  }
}

const ls = safeLocalStorage()
const useServer = import.meta.env.VITE_STORAGE === 'server'

const localBackend: KeyValueStore = useServer
  ? new ServerStore()
  : ls
    ? new LocalStore(ls)
    : new MemoryStore()

/** The active backend for the whole app (localStorage by default, cloud-mirrored). */
export const activeStore: KeyValueStore = new MirrorStore(localBackend)

/** True when data is being persisted to the local file/server backend. */
export const usingServerStore = useServer

/**
 * Write a value that came *from* the cloud. Bypasses the mirror so adopting a
 * remote value — and the store rehydration it triggers — cannot bounce straight
 * back up and start a write ping-pong between two devices.
 */
export async function applyRemote(key: string, value: string | null): Promise<void> {
  suppressed.add(key)
  try {
    if (value === null) await localBackend.removeItem(key)
    else await localBackend.setItem(key, value)
  } finally {
    // Released by the caller once the dependent rehydration has settled.
  }
}

/** Stop suppressing mirror writes for a key adopted via {@link applyRemote}. */
export function releaseRemote(key: string): void {
  suppressed.delete(key)
}

/** Read a key straight from the local backend, ignoring the mirror. */
export function readLocal(key: string): string | null | Promise<string | null> {
  return localBackend.getItem(key)
}

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
