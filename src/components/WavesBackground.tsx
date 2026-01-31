import { useRef, useState, useEffect } from 'react'

interface WavesBackgroundProps {
  onReady?: () => void
}

export default function WavesBackground({ onReady }: WavesBackgroundProps) {
  const basePath = import.meta.env.BASE_URL || './'
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.5
    }
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  return (
    <>
      <div className="waves-background">
        <video
          ref={videoRef}
          src={`${basePath}waves-background.mp4`}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={onReady}
        />
      </div>
      <button className="audio-toggle" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
        {isMuted ? '🔇' : '🔊'}
      </button>
    </>
  )
}
