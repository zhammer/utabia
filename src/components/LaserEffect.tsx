import { useEffect, useState, useRef } from 'react'

interface LaserEffectProps {
  targetX: number
  targetY: number
  color: string
  onHit: () => void
  onComplete: () => void
}

export default function LaserEffect({ targetX, targetY, color, onHit, onComplete }: LaserEffectProps) {
  const [progress, setProgress] = useState(0)
  const hasHitRef = useRef(false)

  const totalDuration = 600 // ms total animation
  const hitAt = 0.4 // hit happens 40% through (~240ms delay)

  useEffect(() => {
    const startTime = performance.now()
    let animationId: number

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const p = Math.min(elapsed / totalDuration, 1)
      // Ease out for smooth fade
      const eased = 1 - Math.pow(1 - p, 2)

      setProgress(eased)

      // Trigger hit partway through to simulate depth
      if (p >= hitAt && !hasHitRef.current) {
        hasHitRef.current = true
        onHit()
      }

      if (p >= 1) {
        onComplete()
      } else {
        animationId = requestAnimationFrame(tick)
      }
    }

    animationId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationId)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Start at full size, shrink to nothing
  const scale = 1 - progress
  // Fade out as it shrinks
  const opacity = 1 - progress

  const glowSize = 15 * scale

  return (
    <div
      className="laser"
      style={{
        left: targetX,
        top: targetY,
        backgroundColor: color,
        boxShadow: `0 0 ${glowSize}px ${color}, 0 0 ${glowSize * 2}px ${color}`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
    />
  )
}
