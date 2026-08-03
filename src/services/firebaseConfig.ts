// ============================================================================
// Firebase config for the real-time chat + buzz (Phương ⇄ Chính).
//
// Paste your Firebase WEB config below:
//   Firebase console → Project settings (gear) → "Your apps" → SDK setup and
//   configuration → "Config". A web config is NOT a secret — it is designed to
//   ship in the browser. Access is controlled by the Realtime Database rules
//   plus the private CHAT_ROOM_ID below.
//
// Until real values are filled in, chat quietly falls back to on-device only.
// ============================================================================

export const firebaseConfig = {
  apiKey: 'AIzaSyAUCRFcU2Ta8beVHTjq1SXFfq6sum7wonE',
  authDomain: 'chinh-phuong-message.firebaseapp.com',
  databaseURL: 'https://chinh-phuong-message-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'chinh-phuong-message',
  storageBucket: 'chinh-phuong-message.firebasestorage.app',
  messagingSenderId: '439144646656',
  appId: '1:439144646656:web:fcce46e396e69c31feb0e5',
}

// A private, hard-to-guess room shared by just the two of you. Keep as-is.
export const CHAT_ROOM_ID = 'phuong-chinh-bdf95cdbb7bee542782cff84'
