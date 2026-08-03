// ============================================================================
// Motivational message engine.
//
// The cheers themselves are hand-written for Phương and live verbatim in
// ./cheers — this module just picks the right one for the moment and avoids
// repeating the last line. A failed quiz draws from a gentle, reassuring subset
// so the tone always fits; everything else pulls from the full pool.
// ============================================================================

import { ALL_CHEERS, REASSURE } from './cheers'

export type MessageContext =
  | 'welcome'
  | 'random'
  | 'lessonComplete'
  | 'quizPass'
  | 'quizFail'
  | 'focusDone'
  | 'breakStart'
  | 'breakDone'
  | 'idleReturn'
  | 'achievement'

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

let lastText = ''

/**
 * A hand-written cheer for the moment. The learner name is intentionally
 * ignored — the cheers are written for Phương directly. Avoids immediate repeats.
 */
export function nextMessage(context: MessageContext, _learnerName: string): string {
  const pool = context === 'quizFail' ? REASSURE : ALL_CHEERS
  for (let attempt = 0; attempt < 6; attempt++) {
    const text = pick(pool)
    if (text !== lastText) {
      lastText = text
      return text
    }
  }
  return lastText
}
