import { useCallback, useRef } from 'react'

// Simple 8-bit pew sound using Web Audio API
export function useLaserSound() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const playPew = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // 8-bit style square wave
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(880, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }, [])

  return { playPew }
}
