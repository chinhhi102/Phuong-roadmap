// ============================================================================
// One-shot UI sounds — the Pomodoro tick and the completion chime.
//
// Synthesized with the Web Audio API (no files needed for these tiny cues).
// Ambience is handled separately by mediaEngine (real recordings). The context
// is created lazily on first use, which also satisfies autoplay policies since
// that first use comes from a click / running timer.
// ============================================================================

class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private volume = 0.5
  private muted = false

  private ensure(): AudioContext | null {
    if (typeof window === 'undefined') return null
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    if (!this.ctx) {
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.muted ? 0 : this.volume
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  /** A short filtered-noise burst (used for the soft tick). */
  private burst(when: number, dur: number, freq: number, q: number, peak: number) {
    const ctx = this.ctx
    if (!ctx || !this.master) return
    const len = Math.floor(ctx.sampleRate * dur) + 1
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = freq
    filter.Q.value = q
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, when)
    g.gain.exponentialRampToValueAtTime(peak, when + Math.min(0.008, dur / 2))
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur)
    src.connect(filter).connect(g).connect(this.master)
    src.start(when)
    src.stop(when + dur + 0.05)
  }

  /** A soft sine blip (chime notes). */
  private blip(when: number, freq: number, dur: number, peak: number) {
    const ctx = this.ctx
    if (!ctx || !this.master) return
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, when)
    g.gain.exponentialRampToValueAtTime(peak, when + 0.03)
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur)
    osc.connect(g).connect(this.master)
    osc.start(when)
    osc.stop(when + dur + 0.05)
  }

  setVolume(v: number) {
    this.volume = v
    if (this.master) this.master.gain.value = this.muted ? 0 : v
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (this.master) this.master.gain.value = muted ? 0 : this.volume
  }

  /** A single soft tick — called once per second while ticking is enabled. */
  tick() {
    if (!this.ensure()) return
    this.burst(this.ctx!.currentTime, 0.03, 2000, 4, 0.04)
  }

  /** A cheerful ascending arpeggio when a focus session completes. */
  chime() {
    if (!this.ensure()) return
    const t = this.ctx!.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5 · E5 · G5 · C6
    notes.forEach((f, i) => this.blip(t + i * 0.12, f, 0.35, 0.12))
  }

  /** An attention-grabbing double buzz (when the other person buzzes you). */
  buzz() {
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    const pulse = (when: number) => {
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.setValueAtTime(440, when)
      osc.frequency.exponentialRampToValueAtTime(180, when + 0.16)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, when)
      g.gain.exponentialRampToValueAtTime(0.16, when + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.18)
      osc.connect(g).connect(this.master!)
      osc.start(when)
      osc.stop(when + 0.22)
    }
    const t = ctx.currentTime
    pulse(t)
    pulse(t + 0.24)
  }
}

/** App-wide singleton for the tick + chime cues. */
export const audioEngine = new AudioEngine()
