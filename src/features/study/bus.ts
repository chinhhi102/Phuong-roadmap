// ============================================================================
// Tiny typed event bus for the study experience.
//
// Any component can emit a moment ("lesson complete", "celebrate") and the
// overlay layers (messages, cute effects, companion, achievement toasts)
// react — without threading callbacks through the whole lesson tree.
// ============================================================================

import type { MessageContext } from './messages'
import type { Author } from '@/types'

export type EffectKind = 'hearts' | 'sparkles' | 'stars' | 'flowers' | 'confetti' | 'magic'
export type CompanionReaction = 'wave' | 'cheer' | 'celebrate' | 'stretch' | 'hydrate' | 'idle'

export type StudyEvent =
  | { type: 'message'; context: MessageContext }
  | { type: 'burst'; kind: EffectKind; count?: number }
  | { type: 'celebrate' }
  | { type: 'achievement'; id: string }
  | { type: 'companion'; reaction: CompanionReaction }
  | { type: 'powerup' }
  | { type: 'reminder' }
  | { type: 'buzz'; from: Author }

type Listener = (e: StudyEvent) => void

class StudyBus {
  private listeners = new Set<Listener>()
  on(fn: Listener): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }
  emit(e: StudyEvent): void {
    this.listeners.forEach((l) => l(e))
  }
}

export const studyBus = new StudyBus()

export const emitMessage = (context: MessageContext) => studyBus.emit({ type: 'message', context })
export const emitBurst = (kind: EffectKind, count?: number) => studyBus.emit({ type: 'burst', kind, count })
export const emitCelebrate = () => studyBus.emit({ type: 'celebrate' })
export const emitAchievement = (id: string) => studyBus.emit({ type: 'achievement', id })
export const emitCompanion = (reaction: CompanionReaction) => studyBus.emit({ type: 'companion', reaction })
export const emitPowerup = () => studyBus.emit({ type: 'powerup' })
export const emitReminder = () => studyBus.emit({ type: 'reminder' })
export const emitBuzz = (from: Author) => studyBus.emit({ type: 'buzz', from })
