// ============================================================================
// Firebase Realtime Database key/value mirror.
//
// Every namespaced key the app writes to localStorage is also written here,
// inside the same private room the chat already uses:
//
//   rooms/<room>/kv/<profile>/<key> → { v: "<json>", rev: <ms>, dev: "<id>" }
//
// • `profile` is the active identity (learner | instructor) so Phương's data
//   and Chính's data live in separate buckets and never overwrite each other.
// • `rev` is a millisecond stamp driving last-write-wins reconciliation.
// • `dev` is a per-browser id so a device can ignore the echo of its own write.
//
// The room-level rules that already cover chat + the learner snapshot cover
// this too, so no Realtime Database rules change is needed.
// ============================================================================

import { ref, get, set, remove, onValue } from 'firebase/database'
import { getDb, isFirebaseConfigured, CHAT_ROOM_ID } from './firebase'
import { deviceId } from './deviceIdentity'

export type SyncProfile = 'learner' | 'instructor'

export interface CloudRecord {
  /** The raw JSON string exactly as it is stored locally. */
  v: string
  /** Millisecond stamp of the write that produced `v`. */
  rev: number
  /** Id of the device that wrote it. */
  dev: string
}

// RTDB path segments may not contain . $ # [ ] / — our keys only ever use dots.
const encodeKey = (k: string) => k.replace(/\./g, '_')
const decodeKey = (k: string) => k.replace(/_/g, '.')

const bucket = (profile: SyncProfile) => `rooms/${CHAT_ROOM_ID}/kv/${profile}`
const keyPath = (profile: SyncProfile, key: string) => `${bucket(profile)}/${encodeKey(key)}`

function toRecord(raw: unknown): CloudRecord | null {
  if (!raw || typeof raw !== 'object') return null
  const rec = raw as Partial<CloudRecord>
  if (typeof rec.v !== 'string') return null
  return { v: rec.v, rev: Number(rec.rev) || 0, dev: typeof rec.dev === 'string' ? rec.dev : '' }
}

/** Read the whole profile bucket once (used for the boot reconciliation). */
export async function pullAll(profile: SyncProfile): Promise<Record<string, CloudRecord>> {
  const db = getDb()
  if (!db) return {}
  const snap = await get(ref(db, bucket(profile)))
  const val = snap.val() as Record<string, unknown> | null
  if (!val) return {}
  const out: Record<string, CloudRecord> = {}
  for (const [encoded, raw] of Object.entries(val)) {
    const rec = toRecord(raw)
    if (rec) out[decodeKey(encoded)] = rec
  }
  return out
}

/** Write one key to the cloud. Throws so the caller can surface a sync error. */
export async function pushKey(profile: SyncProfile, key: string, value: string, rev: number): Promise<void> {
  const db = getDb()
  if (!db) return
  await set(ref(db, keyPath(profile, key)), { v: value, rev, dev: deviceId() } satisfies CloudRecord)
}

export async function removeKey(profile: SyncProfile, key: string): Promise<void> {
  const db = getDb()
  if (!db) return
  await remove(ref(db, keyPath(profile, key)))
}

/** Drop the entire profile bucket (used by "Reset everything"). */
export async function clearProfile(profile: SyncProfile): Promise<void> {
  const db = getDb()
  if (!db) return
  await remove(ref(db, bucket(profile)))
}

/**
 * Live-subscribe to a single key. Subscribing per key (rather than to the whole
 * bucket) keeps a notes edit from re-shipping the entire progress blob.
 */
export function subscribeKey(
  profile: SyncProfile,
  key: string,
  cb: (rec: CloudRecord | null) => void,
): () => void {
  const db = getDb()
  if (!db) return () => {}
  return onValue(
    ref(db, keyPath(profile, key)),
    (snap) => cb(toRecord(snap.val())),
    () => cb(null),
  )
}

export { isFirebaseConfigured, deviceId }
