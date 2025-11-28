/**
 * Audio utilities for GhostNet
 * Generates spooky sounds using Web Audio API
 */

let audioContext: AudioContext | null = null

/**
 * Get or create the audio context
 */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

/**
 * Play a spooky whisper sound using Web Audio API
 * Creates an eerie, ghostly sound effect
 */
export function playWhisperSound(): void {
  try {
    const ctx = getAudioContext()
    
    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const now = ctx.currentTime
    const duration = 1.5

    // Create oscillators for the whisper effect
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const osc3 = ctx.createOscillator()
    const osc4 = ctx.createOscillator() // Extra low rumble

    // Create gain nodes for volume control
    const gain1 = ctx.createGain()
    const gain2 = ctx.createGain()
    const gain3 = ctx.createGain()
    const gain4 = ctx.createGain()
    const masterGain = ctx.createGain()

    // Create filters for the eerie effect
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1200, now)
    filter.frequency.exponentialRampToValueAtTime(300, now + duration)
    filter.Q.setValueAtTime(15, now)

    // Add reverb-like effect with delay
    const delay = ctx.createDelay()
    delay.delayTime.setValueAtTime(0.1, now)
    const delayGain = ctx.createGain()
    delayGain.gain.setValueAtTime(0.4, now)

    // Configure oscillators for ghostly sound - deeper and more dramatic
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(180, now)
    osc1.frequency.exponentialRampToValueAtTime(60, now + duration)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(250, now)
    osc2.frequency.exponentialRampToValueAtTime(80, now + duration * 0.8)

    osc3.type = 'triangle'
    osc3.frequency.setValueAtTime(120, now)
    osc3.frequency.exponentialRampToValueAtTime(40, now + duration)

    // Deep rumble oscillator
    osc4.type = 'sine'
    osc4.frequency.setValueAtTime(50, now)
    osc4.frequency.exponentialRampToValueAtTime(30, now + duration)

    // Configure gain envelopes - LOUDER and longer
    gain1.gain.setValueAtTime(0, now)
    gain1.gain.linearRampToValueAtTime(0.5, now + 0.1)
    gain1.gain.setValueAtTime(0.5, now + 0.3)
    gain1.gain.exponentialRampToValueAtTime(0.01, now + duration)

    gain2.gain.setValueAtTime(0, now)
    gain2.gain.linearRampToValueAtTime(0.4, now + 0.15)
    gain2.gain.setValueAtTime(0.4, now + 0.4)
    gain2.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.9)

    gain3.gain.setValueAtTime(0, now)
    gain3.gain.linearRampToValueAtTime(0.35, now + 0.05)
    gain3.gain.setValueAtTime(0.35, now + 0.5)
    gain3.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.85)

    gain4.gain.setValueAtTime(0, now)
    gain4.gain.linearRampToValueAtTime(0.6, now + 0.2)
    gain4.gain.exponentialRampToValueAtTime(0.01, now + duration)

    // Master volume - MUCH LOUDER
    masterGain.gain.setValueAtTime(1.0, now)

    // Connect the audio graph
    osc1.connect(gain1)
    osc2.connect(gain2)
    osc3.connect(gain3)
    osc4.connect(gain4)

    gain1.connect(filter)
    gain2.connect(filter)
    gain3.connect(filter)
    gain4.connect(filter)

    // Add delay for echo effect
    filter.connect(delay)
    delay.connect(delayGain)
    delayGain.connect(masterGain)
    
    filter.connect(masterGain)
    masterGain.connect(ctx.destination)

    // Start and stop oscillators
    osc1.start(now)
    osc2.start(now)
    osc3.start(now)
    osc4.start(now)

    osc1.stop(now + duration + 0.2)
    osc2.stop(now + duration + 0.1)
    osc3.stop(now + duration)
    osc4.stop(now + duration + 0.3)

    // Add more noise for spooky texture
    addNoiseTexture(ctx, masterGain, now, duration)

  } catch (error) {
    console.error('Failed to play whisper sound:', error)
  }
}

/**
 * Add noise texture to the sound - creates the "breath" of the whisper
 */
function addNoiseTexture(ctx: AudioContext, destination: AudioNode, startTime: number, duration: number): void {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  // Generate filtered noise - louder and more textured
  for (let i = 0; i < bufferSize; i++) {
    // Add some variation to make it sound more like breathing
    const breathCycle = Math.sin(i / ctx.sampleRate * 4 * Math.PI) * 0.5 + 0.5
    data[i] = (Math.random() * 2 - 1) * 0.15 * breathCycle
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0, startTime)
  noiseGain.gain.linearRampToValueAtTime(0.8, startTime + 0.15)
  noiseGain.gain.setValueAtTime(0.7, startTime + duration * 0.3)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.setValueAtTime(800, startTime)
  noiseFilter.frequency.exponentialRampToValueAtTime(400, startTime + duration)
  noiseFilter.Q.setValueAtTime(3, startTime)

  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(destination)

  noise.start(startTime)
  noise.stop(startTime + duration)
}

/**
 * Check if Web Audio API is supported
 */
export function isAudioSupported(): boolean {
  return typeof AudioContext !== 'undefined' || typeof (window as unknown as { webkitAudioContext: unknown }).webkitAudioContext !== 'undefined'
}
