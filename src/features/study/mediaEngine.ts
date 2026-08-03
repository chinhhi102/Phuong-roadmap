// ============================================================================
// Ambience media engine — real recordings, not synthesized noise.
//
// Three interchangeable sources, only ever one playing at a time:
//   • built-in loops  — royalty-free Pixabay recordings bundled in /public/sounds
//   • custom URL      — any direct audio file link the learner pastes
//   • YouTube         — any video/link, played through the YouTube IFrame API
//
// Volume + mute are applied live across whichever source is active. The
// procedural AudioEngine (see ./audio) is kept only for the tick + chime.
// ============================================================================

import type { Ambient } from '@/store/studyStore'

const BASE = import.meta.env.BASE_URL

/** Built-in ambience → bundled file (base-aware so it works on GitHub Pages). */
export const AMBIENT_FILES: Record<Exclude<Ambient, 'none'>, string> = {
  rain: `${BASE}sounds/rain.mp3`,
  cafe: `${BASE}sounds/cafe.mp3`,
  fire: `${BASE}sounds/fire.mp3`,
  nature: `${BASE}sounds/nature.mp3`,
  keyboard: `${BASE}sounds/keyboard.mp3`,
  lofi: `${BASE}sounds/lofi.mp3`,
}

/** Extract an 11-char YouTube video id from a URL or raw id (null if none). */
export function parseYouTubeId(input: string): string | null {
  const s = (input || '').trim()
  if (!s) return null
  if (/^[\w-]{11}$/.test(s)) return s
  try {
    const u = new URL(s.startsWith('http') ? s : `https://${s}`)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1, 12) || null
    const v = u.searchParams.get('v')
    if (v) return v.slice(0, 11)
    const m = u.pathname.match(/\/(embed|shorts|live)\/([\w-]{11})/)
    if (m) return m[2]
  } catch {
    /* not a URL */
  }
  return null
}

type Kind = 'none' | 'file' | 'youtube'

// Minimal shape of the bits of the YT player we use.
interface YTPlayer {
  loadVideoById(id: string): void
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  setVolume(v: number): void
}

class MediaEngine {
  private audioEl: HTMLAudioElement | null = null
  private yt: YTPlayer | null = null
  private ytReady = false
  private pendingYT: string | null = null
  private active: Kind = 'none'
  private volume = 0.5
  private muted = false

  // --- built-in / custom file loops --------------------------------------
  private ensureAudio(): HTMLAudioElement {
    if (!this.audioEl) {
      this.audioEl = new Audio()
      this.audioEl.loop = true
      this.audioEl.preload = 'auto'
    }
    return this.audioEl
  }

  playFile(url: string) {
    this.stopYouTube()
    const el = this.ensureAudio()
    if (el.src !== url) el.src = url
    el.volume = this.muted ? 0 : this.volume
    void el.play().catch(() => { /* blocked until a user gesture */ })
    this.active = 'file'
  }

  private stopFile() {
    if (this.audioEl) this.audioEl.pause()
  }

  // --- YouTube -----------------------------------------------------------
  private loadApi(cb: () => void) {
    const w = window as unknown as { YT?: { Player: unknown }; onYouTubeIframeAPIReady?: () => void }
    if (w.YT && w.YT.Player) return cb()
    const prev = w.onYouTubeIframeAPIReady
    w.onYouTubeIframeAPIReady = () => { prev?.(); cb() }
    if (!document.getElementById('yt-iframe-api')) {
      const s = document.createElement('script')
      s.id = 'yt-iframe-api'
      s.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(s)
    }
  }

  private ensureContainer(): string {
    const id = 'ba-yt-player'
    if (!document.getElementById(id)) {
      const el = document.createElement('div')
      el.id = id
      // A real (200×200) offscreen size — YouTube throttles/stops 0×0 players,
      // which is why hidden videos would cut out after a short while.
      el.style.cssText = 'position:fixed;left:-9999px;top:0;width:200px;height:200px;overflow:hidden;opacity:0;pointer-events:none'
      const inner = document.createElement('div')
      inner.id = id + '-inner'
      el.appendChild(inner)
      document.body.appendChild(el)
    }
    return id + '-inner'
  }

  playYouTube(videoId: string) {
    this.stopFile()
    this.active = 'youtube'
    const innerId = this.ensureContainer()
    this.loadApi(() => {
      const w = window as unknown as { YT: { Player: new (el: string, opts: unknown) => YTPlayer; PlayerState: { ENDED: number } } }
      if (!this.yt) {
        this.yt = new w.YT.Player(innerId, {
          height: '200', width: '200', videoId,
          playerVars: { autoplay: 1, loop: 1, playlist: videoId, controls: 0, disablekb: 1, playsinline: 1 },
          events: {
            onReady: (e: { target: YTPlayer }) => {
              this.ytReady = true
              const queued = this.pendingYT
              this.pendingYT = null
              e.target.setVolume(this.muted ? 0 : Math.round(this.volume * 100))
              if (queued) e.target.loadVideoById(queued)
              if (this.active === 'youtube') e.target.playVideo()
            },
            onStateChange: (e: { data: number; target: YTPlayer }) => {
              if (e.data === w.YT.PlayerState.ENDED) e.target.playVideo()
            },
          },
        })
      } else if (this.ytReady) {
        this.yt.loadVideoById(videoId)
        this.yt.setVolume(this.muted ? 0 : Math.round(this.volume * 100))
        this.yt.playVideo()
      } else {
        this.pendingYT = videoId
      }
    })
  }

  private stopYouTube() {
    this.pendingYT = null
    try { this.yt?.stopVideo() } catch { /* not ready */ }
  }

  // --- shared controls ---------------------------------------------------
  stop() {
    this.stopFile()
    this.stopYouTube()
    this.active = 'none'
  }

  setVolume(v: number) {
    this.volume = v
    if (this.audioEl) this.audioEl.volume = this.muted ? 0 : v
    if (this.yt && this.ytReady) { try { this.yt.setVolume(this.muted ? 0 : Math.round(v * 100)) } catch { /* noop */ } }
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (muted) {
      this.stopFile()
      try { this.yt?.pauseVideo() } catch { /* noop */ }
      return
    }
    // Unmute: resume whatever was active.
    if (this.audioEl) this.audioEl.volume = this.volume
    if (this.active === 'file' && this.audioEl) void this.audioEl.play().catch(() => {})
    if (this.active === 'youtube' && this.yt && this.ytReady) {
      try { this.yt.setVolume(Math.round(this.volume * 100)); this.yt.playVideo() } catch { /* noop */ }
    }
  }
}

export const mediaEngine = new MediaEngine()
