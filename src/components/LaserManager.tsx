import { useState, useCallback, useRef } from 'react'
import LaserEffect from './LaserEffect'
import { useLaserSound } from '../hooks/useLaserSound'

interface Laser {
  id: string
  startX: number
  startY: number
  targetX: number
  targetY: number
  color: string
  targetInstanceId?: string
}

interface LaserManagerProps {
  onHit: (instanceId: string) => void
  children: (shoot: (x: number, y: number, targetInstanceId?: string) => void) => React.ReactNode
}

const COLORS = ['#FF0000', '#00FF00', '#0088FF', '#FFFF00', '#FF00FF', '#00FFFF']

export default function LaserManager({ onHit, children }: LaserManagerProps) {
  const [lasers, setLasers] = useState<Laser[]>([])
  const colorIndexRef = useRef(0)
  const { playPew } = useLaserSound()

  const shoot = useCallback((targetX: number, targetY: number, targetInstanceId?: string) => {
    const startX = window.innerWidth / 2
    const startY = window.innerHeight

    const color = COLORS[colorIndexRef.current % COLORS.length]
    colorIndexRef.current++

    const laser: Laser = {
      id: Math.random().toString(36).substring(2, 9),
      startX,
      startY,
      targetX,
      targetY,
      color,
      targetInstanceId
    }

    setLasers(prev => [...prev, laser])
    playPew()
  }, [playPew])

  const handleLaserComplete = useCallback((laser: Laser) => {
    setLasers(prev => prev.filter(l => l.id !== laser.id))
    if (laser.targetInstanceId) {
      onHit(laser.targetInstanceId)
    }
  }, [onHit])

  return (
    <>
      {children(shoot)}
      {lasers.map(laser => (
        <LaserEffect
          key={laser.id}
          startX={laser.startX}
          startY={laser.startY}
          targetX={laser.targetX}
          targetY={laser.targetY}
          color={laser.color}
          onComplete={() => handleLaserComplete(laser)}
        />
      ))}
    </>
  )
}
