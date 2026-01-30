import { useEffect, useState } from 'react'

interface LaserEffectProps {
  startX: number
  startY: number
  targetX: number
  targetY: number
  color: string
  onComplete: () => void
}

export default function LaserEffect({ startX, startY, targetX, targetY, color, onComplete }: LaserEffectProps) {
  const [position, setPosition] = useState({ x: startX, y: startY })

  // Calculate angle for 3D perspective effect
  const dx = targetX - startX
  const dy = targetY - startY
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  // Calculate distance for animation
  const distance = Math.sqrt(dx * dx + dy * dy)
  const duration = Math.min(300, distance * 0.3) // ms, faster for closer targets

  useEffect(() => {
    // Animate to target
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out
      const eased = 1 - Math.pow(1 - progress, 2)

      setPosition({
        x: startX + dx * eased,
        y: startY + dy * eased
      })

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setTimeout(onComplete, 50)
      }
    }

    requestAnimationFrame(animate)
  }, [startX, startY, targetX, targetY, dx, dy, duration, onComplete])

  // 3D skew based on angle - more vertical = more skew
  const skewAmount = Math.abs(Math.cos(angle * Math.PI / 180)) * 30

  return (
    <div
      className="laser"
      style={{
        left: position.x,
        top: position.y,
        backgroundColor: color,
        transform: `translate(-50%, -50%) rotate(${angle}deg) perspective(100px) rotateX(${skewAmount}deg)`,
      }}
    />
  )
}
