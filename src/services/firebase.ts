// ============================================================================
// Firebase bootstrap — lazily initializes the app + Realtime Database, but only
// when a real config has been provided (otherwise chat runs on-device only).
// ============================================================================

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getDatabase, type Database } from 'firebase/database'
import { firebaseConfig, CHAT_ROOM_ID } from './firebaseConfig'

/** True once the real Firebase web config has been filled in. */
export function isFirebaseConfigured(): boolean {
  const { apiKey, databaseURL } = firebaseConfig
  return !!apiKey && !apiKey.startsWith('REPLACE') && !!databaseURL && !databaseURL.startsWith('REPLACE')
}

let db: Database | null = null

/** The shared Realtime Database, or null when Firebase isn't configured. */
export function getDb(): Database | null {
  if (!isFirebaseConfigured()) return null
  if (db) return db
  const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  db = getDatabase(app)
  return db
}

export { CHAT_ROOM_ID }
