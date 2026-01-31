import { useCallback, useRef } from 'react'
import WavesBackground from './components/WavesBackground'
import TabField from './components/TabField'
import LaserManager from './components/LaserManager'

export default function App() {
  const tabFieldRef = useRef<{ hitTab: (instanceId: string) => boolean } | null>(null)

  const handleHit = useCallback((instanceId: string) => {
    return tabFieldRef.current?.hitTab(instanceId) ?? false
  }, [])

  return (
    <div className="app">
      {/* SVG filters for pixelation effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="pixelate-1">
            <feFlood x="2" y="2" height="1" width="1" />
            <feComposite width="4" height="4" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius="2" />
          </filter>
          <filter id="pixelate-2">
            <feFlood x="3" y="3" height="1" width="1" />
            <feComposite width="6" height="6" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius="3" />
          </filter>
          <filter id="pixelate-3">
            <feFlood x="4" y="4" height="1" width="1" />
            <feComposite width="8" height="8" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius="4" />
          </filter>
          <filter id="pixelate-4">
            <feFlood x="6" y="6" height="1" width="1" />
            <feComposite width="12" height="12" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius="6" />
          </filter>
          <filter id="pixelate-5">
            <feFlood x="8" y="8" height="1" width="1" />
            <feComposite width="16" height="16" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius="8" />
          </filter>
        </defs>
      </svg>
      <WavesBackground />
      <LaserManager onHit={handleHit}>
        {(shoot) => (
          <TabField ref={tabFieldRef} onShoot={shoot} />
        )}
      </LaserManager>
    </div>
  )
}
