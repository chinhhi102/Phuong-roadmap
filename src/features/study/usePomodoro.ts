// ============================================================================
// Pomodoro engine hook.
//
// Drives a focus/break countdown from an end-timestamp (so it stays accurate
// even when the tab is throttled), records completed focus time to the study
// store, fires celebrations + browser notifications, and optionally auto-starts
// the next phase. All sound/celebration side-effects respect the user toggles.
// ============================================================================

import { useEffect, useRef, useState } from 'react'
import { useStudyStore } from '@/store/studyStore'
import { audioEngine } from './audio'
import { emitCelebrate, emitCompanion, emitMessage } from './bus'

export type Phase = 'focus' | 'break'

export interface Pomodoro {
  phase: Phase
  running: boolean
  remaining: number // seconds
  total: number // seconds in the current phase
  progress: number // 0..1 elapsed
  sessions: number // focus sessions completed this sitting
  start: () => void
  pause: () => void
  toggle: () => void
  skip: () => void
  reset: () => void
}

function notify(title: string, body: string) {
  try {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body, silent: true })
    }
  } catch {
    /* notifications unavailable */
  }
}

export function usePomodoro(): Pomodoro {
  const focusMin = useStudyStore((s) => s.focusMin)
  const breakMin = useStudyStore((s) => s.breakMin)
  const autoStart = useStudyStore((s) => s.autoStart)
  const soundEnabled = useStudyStore((s) => s.soundEnabled)
  const tickingEnabled = useStudyStore((s) => s.tickingEnabled)
  const muted = useStudyStore((s) => s.muted)
  const recordFocus = useStudyStore((s) => s.recordFocus)

  const [phase, setPhase] = useState<Phase>('focus')
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(focusMin * 60)
  const [sessions, setSessions] = useState(0)

  const endAt = useRef(0)
  const cfg = useRef({ focusMin, breakMin, autoStart, soundEnabled, tickingEnabled, muted })
  cfg.current = { focusMin, breakMin, autoStart, soundEnabled, tickingEnabled, muted }

  const total = (phase === 'focus' ? focusMin : breakMin) * 60

  // Changing configured lengths resets the timer to a fresh phase.
  useEffect(() => {
    setRunning(false)
    setRemaining((phase === 'focus' ? focusMin : breakMin) * 60)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusMin, breakMin])

  // The one-second countdown loop, plus phase transitions.
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      const rem = Math.max(0, Math.round((endAt.current - Date.now()) / 1000))
      setRemaining(rem)
      const c = cfg.current
      if (rem > 0) {
        if (phase === 'focus' && c.tickingEnabled && c.soundEnabled && !c.muted) audioEngine.tick()
        return
      }
      // --- phase complete ---
      if (phase === 'focus') {
        recordFocus(c.focusMin)
        setSessions((s) => s + 1)
        if (c.soundEnabled && !c.muted) audioEngine.chime()
        emitCelebrate()
        emitMessage('focusDone')
        emitCompanion('cheer')
        notify('Xong một phiên tập trung 🌸', 'Làm tốt lắm — nghỉ ngơi một chút nào!')
        transitionTo('break', c.autoStart, c.breakMin)
      } else {
        emitMessage('breakDone')
        emitCompanion('stretch')
        notify('Hết giờ nghỉ rồi 💐', 'Sẵn sàng tập trung lại khi nào bạn muốn nhé.')
        transitionTo('focus', c.autoStart, c.focusMin)
      }
    }, 1000)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase])

  function transitionTo(next: Phase, auto: boolean, nextMin: number) {
    const secs = nextMin * 60
    setPhase(next)
    setRemaining(secs)
    if (auto) {
      endAt.current = Date.now() + secs * 1000
      setRunning(true)
    } else {
      setRunning(false)
    }
  }

  function requestNotify() {
    try {
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        void Notification.requestPermission()
      }
    } catch {
      /* ignore */
    }
  }

  function start() {
    requestNotify()
    endAt.current = Date.now() + remaining * 1000
    setRunning(true)
  }

  function pause() {
    setRemaining(Math.max(0, Math.round((endAt.current - Date.now()) / 1000)))
    setRunning(false)
  }

  function toggle() {
    if (running) pause()
    else start()
  }

  function skip() {
    const next: Phase = phase === 'focus' ? 'break' : 'focus'
    transitionTo(next, false, next === 'focus' ? cfg.current.focusMin : cfg.current.breakMin)
    emitCompanion(next === 'break' ? 'hydrate' : 'idle')
  }

  function reset() {
    setRunning(false)
    setRemaining(total)
  }

  return {
    phase,
    running,
    remaining,
    total,
    progress: total > 0 ? 1 - remaining / total : 0,
    sessions,
    start,
    pause,
    toggle,
    skip,
    reset,
  }
}
