import { useEffect, useState, useRef, useMemo } from 'react'
import { useAudio } from '../contexts/AudioContext'
import { getAssetUrl } from '../config'

interface Particle {
  id: number
  x: number  // relative to Raye's center (-150 to 150 px range)
  y: number  // relative to Raye's center
  size: number
  speed: number
  baseOpacity: number
  inFront: boolean  // whether particle passes in front of Raye
}

interface UtabiaSceneProps {
  isExiting?: boolean
}

export default function UtabiaScene({ isExiting = false }: UtabiaSceneProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<number | null>(null)
  const particleIdRef = useRef(0)
  const { isMuted } = useAudio()

  // Initialize particles around Raye
  useEffect(() => {
    const initialParticles: Particle[] = []
    for (let i = 0; i < 15; i++) {
      initialParticles.push({
        id: particleIdRef.current++,
        x: (Math.random() - 0.5) * 900,  // -450 to 450 px from center
        y: (Math.random() - 0.5) * 200,  // -100 to 100 px from center
        size: 2 + Math.random() * 3,
        speed: 3 + Math.random() * 5,
        baseOpacity: 0.4 + Math.random() * 0.4,
        inFront: Math.random() < 0.3,  // 30% pass in front
      })
    }
    setParticles(initialParticles)
  }, [])

  // Calculate opacity based on distance from center (fades at edges)
  const getParticleOpacity = (x: number, y: number, baseOpacity: number) => {
    const distance = Math.sqrt(x * x + y * y)
    const maxDistance = 120
    const fadeStart = 60
    if (distance < fadeStart) return baseOpacity
    if (distance > maxDistance) return 0
    // Smooth fade from fadeStart to maxDistance
    return baseOpacity * (1 - (distance - fadeStart) / (maxDistance - fadeStart))
  }

  // Animate particles - they drift from right to left through Raye's space
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => {
        let newX = p.x - p.speed
        // Reset particle to right side when it drifts too far left
        if (newX < -450) {
          return {
            ...p,
            x: 450,
            y: (Math.random() - 0.5) * 200,
            size: 2 + Math.random() * 3,
            speed: 3 + Math.random() * 5,
            baseOpacity: 0.4 + Math.random() * 0.4,
            inFront: Math.random() < 0.3,
          }
        }
        return { ...p, x: newX }
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Create and start audio on mount
  useEffect(() => {
    // Fade in Raye after a short delay
    const rayeTimer = setTimeout(() => setIsVisible(true), 100)
    // Show title 15 seconds after Raye appears
    const titleTimer = setTimeout(() => setShowTitle(true), 15100)

    // Start playing music
    const audio = new Audio(getAssetUrl('piano%20shop%20in%20san%20sebastian.m4a'))
    audio.loop = true
    audio.volume = 0
    audioRef.current = audio

    audio.play().catch((e) => {
      console.log('Audio play failed:', e)
    })

    return () => {
      clearTimeout(rayeTimer)
      clearTimeout(titleTimer)
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }

      // Stop audio on cleanup
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Handle mute state changes
  useEffect(() => {
    if (!audioRef.current) return

    // Clear any existing fade
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
    }

    if (isMuted) {
      audioRef.current.volume = 0
    } else {
      // Fade in over 9 seconds
      fadeIntervalRef.current = window.setInterval(() => {
        if (audioRef.current && audioRef.current.volume < 0.5) {
          audioRef.current.volume = Math.min(0.5, audioRef.current.volume + 0.005)
        } else if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current)
          fadeIntervalRef.current = null
        }
      }, 90)
    }
  }, [isMuted])

  // Handle exit animation - fade out music
  useEffect(() => {
    if (!isExiting || !audioRef.current) return

    // Clear any existing fade
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
    }

    // Fade out over 9 seconds
    fadeIntervalRef.current = window.setInterval(() => {
      if (audioRef.current && audioRef.current.volume > 0) {
        audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.005)
      } else if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
        fadeIntervalRef.current = null
      }
    }, 90)
  }, [isExiting])

  return (
    <div className={`utabia-scene ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}>
      {/* Raye on empty tab */}
      <div className="utabia-raye-container">
        {/* Floating particles behind Raye */}
        <div className="utabia-particles-local">
          {particles.filter(p => !p.inFront).map(p => (
            <div
              key={p.id}
              className="utabia-particle"
              style={{
                left: `${450 + p.x}px`,
                top: `${100 + p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: getParticleOpacity(p.x, p.y, p.baseOpacity),
              }}
            />
          ))}
        </div>
        <div className="utabia-raye-inner">
          <div className="utabia-empty-tab">
            <div className="tab-content">
              <span className="tab-close">×</span>
            </div>
          </div>
          <img
            src={getAssetUrl('raye.gif')}
            alt="Raye"
            className="utabia-raye"
          />
        </div>
        {/* Floating particles in front of Raye */}
        <div className="utabia-particles-local utabia-particles-front">
          {particles.filter(p => p.inFront).map(p => (
            <div
              key={p.id}
              className="utabia-particle"
              style={{
                left: `${450 + p.x}px`,
                top: `${100 + p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: getParticleOpacity(p.x, p.y, p.baseOpacity),
              }}
            />
          ))}
        </div>
      </div>

      {/* Utabia text - appears 10s after Raye */}
      {showTitle && <div className="utabia-message">Utabia</div>}
    </div>
  )
}
