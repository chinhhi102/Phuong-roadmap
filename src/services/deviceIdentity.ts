// ============================================================================
// Per-browser identity.
//
// Two facts about *this* browser, kept out of the synced stores on purpose —
// they describe the device, not the account, so they must never travel:
//
//   • deviceId()          a stable id, so a device can recognise its own writes
//   • isInstructorDevice() whether this browser has ever acted as Chính
//
// The instructor flag exists because the learner's shared node is a single key
// that any device left on the default "learner" role would overwrite. Once a
// browser has been switched to the instructor role it is Chính's, and it stops
// publishing learner data for good (Settings can undo this deliberately).
// ============================================================================

const DEVICE_KEY = 'ba.device'
const INSTRUCTOR_KEY = 'ba.instructor-device'

/** Stable per-browser id, minted once and kept in localStorage. */
export function deviceId(): string {
  try {
    let id = window.localStorage.getItem(DEVICE_KEY)
    if (!id) {
      id = `${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
      window.localStorage.setItem(DEVICE_KEY, id)
    }
    return id
  } catch {
    return 'anon'
  }
}

/** True once this browser has been used as the instructor. */
export function isInstructorDevice(): boolean {
  try {
    return window.localStorage.getItem(INSTRUCTOR_KEY) === '1'
  } catch {
    return false
  }
}

/** Called whenever the role is switched to instructor. */
export function markInstructorDevice(): void {
  try {
    window.localStorage.setItem(INSTRUCTOR_KEY, '1')
  } catch {
    /* private mode — the completeness guard still protects the shared node */
  }
}

/** Hand this browser back to the learner (Settings → "Use as Phương's device"). */
export function clearInstructorDevice(): void {
  try {
    window.localStorage.removeItem(INSTRUCTOR_KEY)
  } catch {
    /* ignore */
  }
}
