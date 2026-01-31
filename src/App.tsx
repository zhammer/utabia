import { useCallback, useRef } from 'react'
import WavesBackground from './components/WavesBackground'
import TabField from './components/TabField'
import LaserManager from './components/LaserManager'

export default function App() {
  const tabFieldRef = useRef<{ hitTab: (instanceId: string) => void } | null>(null)

  const handleHit = useCallback((instanceId: string) => {
    tabFieldRef.current?.hitTab(instanceId)
  }, [])

  return (
    <div className="app">
      <WavesBackground />
      <LaserManager onHit={handleHit}>
        {(shoot) => (
          <TabField ref={tabFieldRef} onShoot={shoot} />
        )}
      </LaserManager>
    </div>
  )
}
