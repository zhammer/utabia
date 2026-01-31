import { useCallback } from 'react'
import { getAssetUrl } from '../config'

export function useCrunchSound() {
  const playCrunch = useCallback(() => {
    const audio = new Audio(getAssetUrl('crunch.wav'))
    audio.volume = 0.3
    audio.play().catch(() => {
      // Ignore autoplay errors
    })
  }, [])

  return { playCrunch }
}
