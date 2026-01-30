interface WavesBackgroundProps {
  onReady?: () => void
}

export default function WavesBackground({ onReady }: WavesBackgroundProps) {
  const videoId = 'bn9F19Hi1Lk'
  const startTime = 3600 // 1 hour in seconds

  return (
    <div className="waves-background">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&start=${startTime}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3`}
        allow="autoplay"
        onLoad={onReady}
      />
    </div>
  )
}
