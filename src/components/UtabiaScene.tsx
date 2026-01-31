import { useEffect, useState, useRef, useMemo } from 'react'
import { useAudio } from '../contexts/AudioContext'
import { getAssetUrl } from '../config'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
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

  // Initialize particles
  useEffect(() => {
    const initialParticles: Particle[] = []
    for (let i = 0; i < 20; i++) {
      initialParticles.push({
        id: particleIdRef.current++,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        speed: 0.5 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.5,
      })
    }
    setParticles(initialParticles)
  }, [])

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => {
        let newX = p.x - p.speed
        // Reset particle to right side when it goes off screen
        if (newX < -5) {
          return {
            ...p,
            x: 105,
            y: Math.random() * 100,
            size: 2 + Math.random() * 4,
            speed: 0.5 + Math.random() * 1.5,
            opacity: 0.3 + Math.random() * 0.5,
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
      {/* Floating particles */}
      <div className="utabia-particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="utabia-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Raye on empty tab */}
      <div className="utabia-raye-container">
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
      </div>

      {/* Utabia text - appears 10s after Raye */}
      {showTitle && <div className="utabia-message">Utabia</div>}
    </div>
  )
}
