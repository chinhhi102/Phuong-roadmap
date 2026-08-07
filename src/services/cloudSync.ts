// ============================================================================
// Cloud sync orchestration.
//
// Keeps the local backend (localStorage / XML server) and the Firebase replica
// in agreement so Phương can close her laptop, open her phone, and land exactly
// where she left off.
//
// Shape of the thing:
//   • Reads are ALWAYS local → the app still boots instantly and works offline.
//   • Every local write is debounced and pushed to the cloud (rev = Date.now()).
//   • On boot we reconcile per key: whichever side has the newer `rev` wins.
//   • A live per-key subscription adopts changes made on another device.
//
// Reconciliation is last-write-wins per key, not a field-level merge. For one
// learner moving between her own devices that is the right trade-off; the one
// case it cannot resolve is the same key edited offline on two devices at once,
// where the later write wins and the earlier one is replaced. The JSON backup
// in Settings remains the escape hatch.
// ============================================================================

import { useEffect } from 'react'
import { create } from 'zustand'
import {
  SYNCED_KEYS,
  STORAGE_KEYS,
  isSyncedKey,
  onStorageWrite,
  applyRemote,
  releaseRemote,
  readLocal,
} from './storage'
import {
  pullAll,
  pushKey,
  removeKey,
  clearProfile,
  subscribeKey,
  deviceId,
  isFirebaseConfigured,
  type CloudRecord,
  type SyncProfile,
} from './cloudStore'
import { useProgressStore } from '@/store/progressStore'
import { useNotesStore } from '@/store/notesStore'
import { useExamStore } from '@/store/examStore'
import { useStudyStore } from '@/store/studyStore'
import { useSettingsStore } from '@/store/settingsStore'

const META_KEY = 'ba.syncmeta'
const PUSH_DEBOUNCE_MS = 700
/** Window allowed for a rehydration's own persist write to settle. */
const ADOPT_SETTLE_MS = 300

// --------------------------------------------------------------------------
// Status (for the Settings screen / sync badge)
// --------------------------------------------------------------------------

export type SyncState = 'off' | 'connecting' | 'syncing' | 'synced' | 'error'

interface SyncStatus {
  state: SyncState
  lastSyncedAt: number | null
  error: string | null
  profile: SyncProfile | null
  set: (patch: Partial<Omit<SyncStatus, 'set'>>) => void
}

export const useSyncStatus = create<SyncStatus>()((set) => ({
  state: isFirebaseConfigured() ? 'connecting' : 'off',
  lastSyncedAt: null,
  error: null,
  profile: null,
  set: (patch) => set(patch),
}))

const status = (patch: Partial<Omit<SyncStatus, 'set'>>) => useSyncStatus.getState().set(patch)

// --------------------------------------------------------------------------
// Local revision bookkeeping
// --------------------------------------------------------------------------

function readMeta(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(META_KEY)
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch {
    return {}
  }
}

function setMetaRev(key: string, rev: number): void {
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify({ ...readMeta(), [key]: rev }))
  } catch {
    /* private mode — sync degrades to push-only, which is still useful */
  }
}

// --------------------------------------------------------------------------
// Store rehydration
// --------------------------------------------------------------------------

const REHYDRATORS: Record<string, () => Promise<void> | void> = {
  [STORAGE_KEYS.progress]: () => useProgressStore.persist.rehydrate(),
  [STORAGE_KEYS.notes]: () => useNotesStore.persist.rehydrate(),
  [STORAGE_KEYS.exams]: () => useExamStore.persist.rehydrate(),
  [STORAGE_KEYS.study]: () => useStudyStore.persist.rehydrate(),
  [STORAGE_KEYS.settings]: () => useSettingsStore.persist.rehydrate(),
}

/**
 * Fields that must never travel between devices. `role` is this device's
 * identity — adopting it would let one person's device silently become the
 * other's — and `sidebarCollapsed` is a per-screen-size preference.
 */
const LOCAL_ONLY_FIELDS: Record<string, string[]> = {
  [STORAGE_KEYS.settings]: ['role', 'sidebarCollapsed'],
}

/** Overlay this device's local-only fields onto an incoming cloud payload. */
function mergeLocalOnly(key: string, remoteRaw: string, localRaw: string | null): string {
  const fields = LOCAL_ONLY_FIELDS[key]
  if (!fields || !localRaw) return remoteRaw
  try {
    const remote = JSON.parse(remoteRaw) as { state?: Record<string, unknown> }
    const local = JSON.parse(localRaw) as { state?: Record<string, unknown> }
    if (!remote.state || !local.state) return remoteRaw
    for (const field of fields) {
      if (field in local.state) remote.state[field] = local.state[field]
    }
    return JSON.stringify(remote)
  } catch {
    return remoteRaw
  }
}

const asString = async (v: string | null | Promise<string | null>) => {
  const r = await v
  return typeof r === 'string' ? r : null
}

// --------------------------------------------------------------------------
// The sync engine
// --------------------------------------------------------------------------

/**
 * Start replicating the given profile's data. Returns a stop function; safe to
 * start/stop repeatedly (React StrictMode, identity switches).
 */
export function startCloudSync(profile: SyncProfile): () => void {
  if (!isFirebaseConfigured()) {
    status({ state: 'off', profile: null })
    return () => {}
  }

  let stopped = false
  let ready = false
  const unsubs: Array<() => void> = []
  const timers = new Map<string, number>()
  /** Keys written locally before the boot reconciliation finished. */
  const pending = new Set<string>()

  status({ state: 'connecting', error: null, profile })

  const push = async (key: string, value: string | null) => {
    if (stopped) return
    const rev = Date.now()
    status({ state: 'syncing', error: null })
    try {
      if (value === null) await removeKey(profile, key)
      else await pushKey(profile, key, value, rev)
      setMetaRev(key, rev)
      if (!stopped) status({ state: 'synced', lastSyncedAt: rev, error: null })
    } catch (e) {
      if (!stopped) {
        status({ state: 'error', error: e instanceof Error ? e.message : 'Sync failed' })
      }
    }
  }

  const schedulePush = (key: string, value: string | null) => {
    window.clearTimeout(timers.get(key))
    timers.set(key, window.setTimeout(() => void push(key, value), PUSH_DEBOUNCE_MS))
  }

  /** Take a cloud value as the truth for `key` and refresh the store from it. */
  const adopt = async (key: string, rec: CloudRecord) => {
    const localRaw = await asString(readLocal(key))
    const merged = mergeLocalOnly(key, rec.v, localRaw)
    setMetaRev(key, rec.rev)
    if (merged === localRaw) return

    try {
      await applyRemote(key, merged)
      await REHYDRATORS[key]?.()
    } finally {
      window.setTimeout(() => {
        releaseRemote(key)
        // A write made during the adoption window was suppressed to stop an
        // echo loop — if the learner really did change something, push it now.
        void (async () => {
          if (stopped) return
          const now = await asString(readLocal(key))
          if (now !== null && now !== merged) schedulePush(key, now)
        })()
      }, ADOPT_SETTLE_MS)
    }
  }

  const offWrite = onStorageWrite((key, value) => {
    if (stopped || !isSyncedKey(key)) return
    if (!ready) {
      pending.add(key)
      return
    }
    schedulePush(key, value)
  })

  const run = async () => {
    try {
      const remote = await pullAll(profile)
      if (stopped) return
      const meta = readMeta()

      for (const key of SYNCED_KEYS) {
        const rec = remote[key]
        const localRev = meta[key] ?? 0
        const localRaw = await asString(readLocal(key))
        if (stopped) return

        if (rec && rec.rev > localRev) {
          await adopt(key, rec)
        } else if (localRaw !== null && (!rec || localRev > rec.rev)) {
          await push(key, localRaw)
        }
      }
      if (stopped) return

      ready = true
      // Anything the learner touched while we were reconciling wins — it is the
      // most recent intent on this device.
      for (const key of pending) {
        const raw = await asString(readLocal(key))
        schedulePush(key, raw)
      }
      pending.clear()

      if (useSyncStatus.getState().state !== 'error') {
        status({ state: 'synced', lastSyncedAt: Date.now(), error: null })
      }

      for (const key of SYNCED_KEYS) {
        unsubs.push(
          subscribeKey(profile, key, (rec) => {
            if (stopped || !rec) return
            if (rec.dev === deviceId()) return // our own write coming back
            if (rec.rev <= (readMeta()[key] ?? 0)) return
            void adopt(key, rec)
          }),
        )
      }
    } catch (e) {
      if (!stopped) {
        ready = true
        status({ state: 'error', error: e instanceof Error ? e.message : 'Sync failed' })
      }
    }
  }

  void run()

  return () => {
    stopped = true
    offWrite()
    for (const t of timers.values()) window.clearTimeout(t)
    timers.clear()
    for (const un of unsubs) un()
  }
}

/**
 * Declare this device's local data newer than anything in the cloud.
 *
 * Needed after a JSON backup is restored: the restored bytes carry no revision,
 * so without this the next boot would see a higher `rev` in the cloud and quietly
 * overwrite the very data that was just imported.
 */
export function markLocalAuthoritative(): void {
  const rev = Date.now()
  const meta = readMeta()
  for (const key of SYNCED_KEYS) meta[key] = rev
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify(meta))
  } catch {
    /* ignore */
  }
}

/** Wipe this profile's cloud replica and the local revision bookkeeping. */
export async function clearCloud(profile: SyncProfile): Promise<void> {
  if (!isFirebaseConfigured()) return
  await clearProfile(profile)
  try {
    window.localStorage.removeItem(META_KEY)
  } catch {
    /* ignore */
  }
}

/** Mount once (AppShell) — restarts sync whenever the active identity changes. */
export function useCloudSync(): void {
  const role = useSettingsStore((s) => s.role)
  useEffect(() => startCloudSync(role), [role])
}

export { isFirebaseConfigured }
