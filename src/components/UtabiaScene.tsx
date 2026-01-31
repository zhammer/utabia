import { useEffect, useState, useRef } from 'react'
import { useAudio } from '../contexts/AudioContext'

export default function UtabiaScene() {
  const basePath = import.meta.env.BASE_URL || './'
  const [isVisible, setIsVisible] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<number | null>(null)
  const { isMuted } = useAudio()

  // Create and start audio on mount
  useEffect(() => {
    // Fade in Raye after a short delay
    const rayeTimer = setTimeout(() => setIsVisible(true), 100)
    // Show title 15 seconds after Raye appears
    const titleTimer = setTimeout(() => setShowTitle(true), 15100)

    // Start playing music
    const audio = new Audio(`${basePath}piano%20shop%20in%20san%20sebastian.m4a`)
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
  }, [basePath])

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

  return (
    <div className={`utabia-scene ${isVisible ? 'visible' : ''}`}>
      {/* Raye on empty tab */}
      <div className="utabia-raye-container">
        <div className="utabia-raye-inner">
          <div className="utabia-empty-tab">
            <div className="tab-content">
              <span className="tab-close">×</span>
            </div>
          </div>
          <img
            src={`${basePath}raye.gif`}
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
