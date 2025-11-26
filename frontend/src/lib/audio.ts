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

    // Create oscillators for the whisper effect
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const osc3 = ctx.createOscillator()

    // Create gain nodes for volume control
    const gain1 = ctx.createGain()
    const gain2 = ctx.createGain()
    const gain3 = ctx.createGain()
    const masterGain = ctx.createGain()

    // Create a filter for the eerie effect
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, now)
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.8)
    filter.Q.setValueAtTime(10, now)

    // Configure oscillators for ghostly sound
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(150, now)
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.6)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(200, now)
    osc2.frequency.exponentialRampToValueAtTime(100, now + 0.5)

    osc3.type = 'triangle'
    osc3.frequency.setValueAtTime(100, now)
    osc3.frequency.exponentialRampToValueAtTime(50, now + 0.7)

    // Configure gain envelopes (fade in/out)
    gain1.gain.setValueAtTime(0, now)
    gain1.gain.linearRampToValueAtTime(0.15, now + 0.1)
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.8)

    gain2.gain.setValueAtTime(0, now)
    gain2.gain.linearRampToValueAtTime(0.1, now + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.7)

    gain3.gain.setValueAtTime(0, now)
    gain3.gain.linearRampToValueAtTime(0.08, now + 0.05)
    gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.6)

    // Master volume
    masterGain.gain.setValueAtTime(0.5, now)

    // Connect the audio graph
    osc1.connect(gain1)
    osc2.connect(gain2)
    osc3.connect(gain3)

    gain1.connect(filter)
    gain2.connect(filter)
    gain3.connect(filter)

    filter.connect(masterGain)
    masterGain.connect(ctx.destination)

    // Start and stop oscillators
    osc1.start(now)
    osc2.start(now)
    osc3.start(now)

    osc1.stop(now + 0.9)
    osc2.stop(now + 0.8)
    osc3.stop(now + 0.7)

    // Add some noise for texture
    addNoiseTexture(ctx, masterGain, now, 0.8)

  } catch (error) {
    console.error('Failed to play whisper sound:', error)
  }
}

/**
 * Add noise texture to the sound
 */
function addNoiseTexture(ctx: AudioContext, destination: AudioNode, startTime: number, duration: number): void {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  // Generate filtered noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.02
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0, startTime)
  noiseGain.gain.linearRampToValueAtTime(0.3, startTime + 0.1)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.setValueAtTime(500, startTime)
  noiseFilter.Q.setValueAtTime(5, startTime)

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
