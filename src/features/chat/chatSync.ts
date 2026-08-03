// ============================================================================
// Real-time chat sync — learner ⇄ instructor.
//
// Rides on the same storage layer as everything else (localStorage by default,
// or the XML data server when VITE_STORAGE=server). "Real-time" is achieved by
// polling the shared key every ~1.5s and by listening to cross-tab `storage`
// events, so:
//   • two tabs / two people on the same machine sync instantly (storage event)
//   • two devices pointed at the data server sync within a poll tick
//
// Writes are read-merge-write and de-duplicated by id, so concurrent messages
// from both sides survive.
// ============================================================================

import { ref, query, limitToLast, onValue, push } from 'firebase/database'
import { STORAGE_KEYS, activeStore } from '@/services/storage'
import { getDb, isFirebaseConfigured, CHAT_ROOM_ID } from '@/services/firebase'
import { uid } from '@/lib/utils'
import type { Author } from '@/types'

export interface ChatMessage {
  id: string
  from: Author
  text: string
  ts: number
}

export interface BuzzMark {
  id: string
  from: Author
  ts: number
}

export interface ChatData {
  messages: ChatMessage[]
  buzzes: BuzzMark[]
}

const KEY = STORAGE_KEYS.chat
const MAX_MESSAGES = 300
const MAX_BUZZES = 50
const POLL_MS = 1500

const empty = (): ChatData => ({ messages: [], buzzes: [] })

async function read(): Promise<ChatData> {
  try {
    const raw = await activeStore.getItem(KEY)
    if (!raw) return empty()
    const d = JSON.parse(raw)
    return {
      messages: Array.isArray(d.messages) ? d.messages : [],
      buzzes: Array.isArray(d.buzzes) ? d.buzzes : [],
    }
  } catch {
    return empty()
  }
}

async function write(d: ChatData): Promise<void> {
  await activeStore.setItem(KEY, JSON.stringify(d))
}

function mergeById<T extends { id: string; ts: number }>(a: T[], b: T[], cap: number): T[] {
  const map = new Map<string, T>()
  for (const item of [...a, ...b]) map.set(item.id, item)
  return [...map.values()].sort((x, y) => x.ts - y.ts).slice(-cap)
}

function signature(d: ChatData): string {
  const lastMsg = d.messages[d.messages.length - 1]
  const lastBuzz = d.buzzes[d.buzzes.length - 1]
  return `${d.messages.length}:${lastMsg?.id ?? ''}:${d.buzzes.length}:${lastBuzz?.id ?? ''}`
}

type Listener = (d: ChatData) => void

export interface ChatEngineApi {
  subscribe(fn: Listener): () => void
  get(): ChatData
  send(from: Author, text: string): Promise<void> | void
  buzz(from: Author): Promise<void> | void
}

/** On-device engine (localStorage + polling). Syncs only across same-browser tabs. */
class LocalChatEngine implements ChatEngineApi {
  private data: ChatData = empty()
  private sig = signature(this.data)
  private listeners = new Set<Listener>()
  private started = false

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn)
    fn(this.data)
    this.ensureStarted()
    return () => this.listeners.delete(fn)
  }

  get(): ChatData {
    return this.data
  }

  private emit() {
    this.listeners.forEach((l) => l(this.data))
  }

  private commit(next: ChatData) {
    const sig = signature(next)
    this.data = next
    if (sig !== this.sig) {
      this.sig = sig
      this.emit()
    }
  }

  private ensureStarted() {
    if (this.started || typeof window === 'undefined') return
    this.started = true
    void this.refresh()
    window.setInterval(() => void this.refresh(), POLL_MS)
    window.addEventListener('storage', (e) => {
      if (e.key === KEY) void this.refresh()
    })
  }

  private async refresh() {
    const remote = await read()
    this.commit({
      messages: mergeById(this.data.messages, remote.messages, MAX_MESSAGES),
      buzzes: mergeById(this.data.buzzes, remote.buzzes, MAX_BUZZES),
    })
  }

  async send(from: Author, text: string) {
    const msg: ChatMessage = { id: uid('m'), from, text, ts: Date.now() }
    const remote = await read()
    const next: ChatData = {
      messages: mergeById([...this.data.messages, ...remote.messages], [msg], MAX_MESSAGES),
      buzzes: mergeById(this.data.buzzes, remote.buzzes, MAX_BUZZES),
    }
    await write(next)
    this.commit(next)
  }

  async buzz(from: Author) {
    const b: BuzzMark = { id: uid('bz'), from, ts: Date.now() }
    const remote = await read()
    const next: ChatData = {
      messages: mergeById(this.data.messages, remote.messages, MAX_MESSAGES),
      buzzes: mergeById([...this.data.buzzes, ...remote.buzzes], [b], MAX_BUZZES),
    }
    await write(next)
    this.commit(next)
  }
}

/** Firebase Realtime Database engine — true cross-device, cross-internet sync. */
class FirebaseChatEngine implements ChatEngineApi {
  private data: ChatData = empty()
  private listeners = new Set<Listener>()
  private started = false

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn)
    fn(this.data)
    this.ensureStarted()
    return () => this.listeners.delete(fn)
  }

  get(): ChatData {
    return this.data
  }

  private emit() {
    this.listeners.forEach((l) => l(this.data))
  }

  private ensureStarted() {
    if (this.started) return
    const db = getDb()
    if (!db) return
    this.started = true
    const base = `rooms/${CHAT_ROOM_ID}`

    onValue(query(ref(db, `${base}/messages`), limitToLast(MAX_MESSAGES)), (snap) => {
      const messages: ChatMessage[] = []
      snap.forEach((c) => {
        const v = c.val() || {}
        messages.push({ id: c.key as string, from: v.from, text: v.text, ts: v.ts || 0 })
      })
      messages.sort((a, b) => a.ts - b.ts)
      this.data = { ...this.data, messages }
      this.emit()
    })

    onValue(query(ref(db, `${base}/buzzes`), limitToLast(MAX_BUZZES)), (snap) => {
      const buzzes: BuzzMark[] = []
      snap.forEach((c) => {
        const v = c.val() || {}
        buzzes.push({ id: c.key as string, from: v.from, ts: v.ts || 0 })
      })
      buzzes.sort((a, b) => a.ts - b.ts)
      this.data = { ...this.data, buzzes }
      this.emit()
    })
  }

  async send(from: Author, text: string) {
    const db = getDb()
    if (!db) return
    await push(ref(db, `rooms/${CHAT_ROOM_ID}/messages`), { from, text, ts: Date.now() })
  }

  async buzz(from: Author) {
    const db = getDb()
    if (!db) return
    await push(ref(db, `rooms/${CHAT_ROOM_ID}/buzzes`), { from, ts: Date.now() })
  }
}

/** Cross-internet chat when Firebase is configured; on-device fallback otherwise. */
export const chatEngine: ChatEngineApi = isFirebaseConfigured() ? new FirebaseChatEngine() : new LocalChatEngine()
