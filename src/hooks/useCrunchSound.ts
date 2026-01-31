import { useCallback } from 'react'

export function useCrunchSound() {
  const playCrunch = useCallback(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}crunch.wav`)
    audio.volume = 0.3
    audio.play().catch(() => {
      // Ignore autoplay errors
    })
  }, [])

  return { playCrunch }
}
