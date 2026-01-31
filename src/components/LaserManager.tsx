import { useState, useCallback } from 'react'
import LaserEffect from './LaserEffect'
import { useLaserSound } from '../hooks/useLaserSound'
import { useCrunchSound } from '../hooks/useCrunchSound'

interface Laser {
  id: string
  targetX: number
  targetY: number
  color: string
  targetInstanceId?: string
}

interface LaserManagerProps {
  onHit: (instanceId: string) => boolean
  children: (shoot: (x: number, y: number, targetInstanceId?: string) => void) => React.ReactNode
}

// Interpolate between two hex colors
function lerpColor(color1: string, color2: string, t: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16)
  const g1 = parseInt(color1.slice(3, 5), 16)
  const b1 = parseInt(color1.slice(5, 7), 16)
  const r2 = parseInt(color2.slice(1, 3), 16)
  const g2 = parseInt(color2.slice(3, 5), 16)
  const b2 = parseInt(color2.slice(5, 7), 16)

  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export default function LaserManager({ onHit, children }: LaserManagerProps) {
  const [lasers, setLasers] = useState<Laser[]>([])
  const { playPew } = useLaserSound()
  const { playCrunch } = useCrunchSound()

  const shoot = useCallback((targetX: number, targetY: number, targetInstanceId?: string) => {
    // Cycle through colors over time (full cycle every 4 seconds)
    const t = (Math.sin(Date.now() / 2000 * Math.PI) + 1) / 2
    const color = lerpColor('#bd93bd', '#f2edeb', t)

    const laser: Laser = {
      id: Math.random().toString(36).substring(2, 9),
      targetX,
      targetY,
      color,
      targetInstanceId
    }

    setLasers(prev => [...prev, laser])
    playPew()
  }, [playPew])

  const handleLaserHit = useCallback((laser: Laser) => {
    if (laser.targetInstanceId) {
      const wasHit = onHit(laser.targetInstanceId)
      if (wasHit) {
        playCrunch()
      }
    }
  }, [onHit, playCrunch])

  const handleLaserComplete = useCallback((laserId: string) => {
    setLasers(prev => prev.filter(l => l.id !== laserId))
  }, [])

  return (
    <>
      {children(shoot)}
      {lasers.map(laser => (
        <LaserEffect
          key={laser.id}
          targetX={laser.targetX}
          targetY={laser.targetY}
          color={laser.color}
          onHit={() => handleLaserHit(laser)}
          onComplete={() => handleLaserComplete(laser.id)}
        />
      ))}
    </>
  )
}
