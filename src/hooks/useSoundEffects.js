import { useCallback, useRef } from 'react'

export function useSoundEffects() {
  const audioCtx = useRef(null)

  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume()
    }
  }

  // Soft tactile click
  const playClick = useCallback(() => {
    initAudio()
    const ctx = audioCtx.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.1)
  }, [])

  // Subdued transition whoosh
  const playTransition = useCallback(() => {
    initAudio()
    const ctx = audioCtx.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(120, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.4)

    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.4)
  }, [])

  // Resonant success chime
  const playSuccess = useCallback(() => {
    initAudio()
    const ctx = audioCtx.current
    
    const playNote = (freq, delay, volume = 0.05) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
      
      gain.gain.setValueAtTime(0, ctx.currentTime + delay)
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.8)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + 0.8)
    }

    // A-major-ish chord
    playNote(440, 0)      // A4
    playNote(554.37, 0.1) // C#5
    playNote(659.25, 0.2) // E5
    playNote(880, 0.3, 0.03) // A5
  }, [])

  return { playClick, playTransition, playSuccess }
}
