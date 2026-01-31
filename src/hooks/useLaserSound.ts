import { useCallback } from 'react'

export function useLaserSound() {
  const playPew = useCallback(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}pew.wav`)
    audio.volume = 0.3
    audio.play().catch(() => {
      // Ignore autoplay errors
    })
  }, [])

  return { playPew }
}
