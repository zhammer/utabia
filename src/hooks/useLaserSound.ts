import { useCallback } from 'react'
import { getAssetUrl } from '../config'

export function useLaserSound() {
  const playPew = useCallback(() => {
    const audio = new Audio(getAssetUrl('pew.wav'))
    audio.volume = 0.3
    audio.play().catch(() => {
      // Ignore autoplay errors
    })
  }, [])

  return { playPew }
}
