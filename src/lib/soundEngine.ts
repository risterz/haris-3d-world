class SoundEngine {
  private ctx: AudioContext | null = null
  private muted = true
  private engineOsc: OscillatorNode | null = null
  private engineGain: GainNode | null = null
  private lastBonkAt = 0

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return null
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  private ensureEngineLoop() {
    const ctx = this.ensureContext()
    if (!ctx || this.engineOsc) return

    const osc = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.value = 58

    filter.type = 'lowpass'
    filter.frequency.value = 260

    gain.gain.value = 0.0001

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    osc.start()

    this.engineOsc = osc
    this.engineGain = gain
  }

  isMuted(): boolean {
    return this.muted
  }

  setMuted(nextMuted: boolean): void {
    this.muted = nextMuted
    if (!nextMuted) {
      this.ensureEngineLoop()
    }
    if (this.engineGain && this.ctx) {
      this.engineGain.gain.setTargetAtTime(
        nextMuted ? 0.0001 : 0.03,
        this.ctx.currentTime,
        0.08,
      )
    }
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted)
    if (!this.muted) {
      this.playPadChime()
    }
    return this.muted
  }

  updateEngine(speedRatio: number, boosting: boolean): void {
    if (this.muted || !this.ctx || !this.engineOsc || !this.engineGain) return
    const clamped = Math.max(0, Math.min(1.5, speedRatio))
    const targetFreq = 56 + clamped * 86 + (boosting ? 34 : 0)
    const targetVol = 0.02 + Math.min(0.045, clamped * 0.032) + (boosting ? 0.015 : 0)
    this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.06)
    this.engineGain.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.06)
  }

  playHorn(): void {
    // Allow horn keypress to playfully unmute on first explicit horn tap
    if (this.muted) {
      this.setMuted(false)
    }
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Two-tone toy horn ("beep-beep!")
    ;[0, 0.14].forEach((offset) => {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sawtooth'
      osc2.type = 'triangle'
      osc1.frequency.setValueAtTime(440, now + offset)
      osc2.frequency.setValueAtTime(554.37, now + offset)

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 1400

      gain.gain.setValueAtTime(0.001, now + offset)
      gain.gain.linearRampToValueAtTime(0.09, now + offset + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.11)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now + offset)
      osc2.start(now + offset)
      osc1.stop(now + offset + 0.12)
      osc2.stop(now + offset + 0.12)
    })
  }

  playBonk(intensity = 10): void {
    if (this.muted) return
    const nowMs = Date.now()
    if (nowMs - this.lastBonkAt < 65) return
    this.lastBonkAt = nowMs

    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    const strength = Math.max(0.3, Math.min(1, intensity / 18))
    osc.type = 'sine'
    osc.frequency.setValueAtTime(190 + strength * 120, now)
    osc.frequency.exponentialRampToValueAtTime(68, now + 0.11)

    gain.gain.setValueAtTime(0.11 * strength, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.13)
  }

  playHop(): void {
    if (this.muted) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.12)

    gain.gain.setValueAtTime(0.07, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.14)
  }

  playPadChime(): void {
    if (this.muted) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const notes = [523.25, 659.25]
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.065)

      gain.gain.setValueAtTime(0.001, now + idx * 0.065)
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.065 + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.065 + 0.22)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + idx * 0.065)
      osc.stop(now + idx * 0.065 + 0.24)
    })
  }
}

export const soundEngine = new SoundEngine()
