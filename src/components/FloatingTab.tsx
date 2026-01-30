import { useEffect } from 'react'
import { useMachine } from '@xstate/react'
import { floatingTabMachine } from '../machines/floatingTabMachine'
import { TabInfo } from '../types'

interface FloatingTabProps {
  tab: TabInfo
  instanceId: string
  x: number
  y: number
  onGone: () => void
  onClosed: () => void
  onRegister: (handle: { hit: () => void }) => void
}

export default function FloatingTab({ tab, instanceId, x, y, onGone, onClosed, onRegister }: FloatingTabProps) {
  const [state, send] = useMachine(floatingTabMachine)

  // Register hit handler
  useEffect(() => {
    onRegister({
      hit: () => {
        if (state.matches('hovering')) {
          send({ type: 'HIT' })
        }
      }
    })
  }, [onRegister, send, state])

  useEffect(() => {
    if (state.matches('gone')) {
      onGone()
    } else if (state.matches('closed')) {
      onClosed()
    }
  }, [state.value, onGone, onClosed])

  const isDisintegrating = state.matches('disintegrating')
  const isFadingOut = state.matches('fadingOut')
  const isFadingIn = state.matches('fadingIn')

  // Pixelate the title
  const displayTitle = tab.title.length > 20 ? tab.title.substring(0, 20) + '...' : tab.title

  return (
    <div
      className={`floating-tab ${isDisintegrating ? 'disintegrating' : ''} ${isFadingOut ? 'fading-out' : ''} ${isFadingIn ? 'fading-in' : ''}`}
      style={{
        left: `${x * 100}%`,
        top: `${y * 100}%`,
      }}
      data-instance-id={instanceId}
    >
      <div className="tab-content">
        {tab.favIconUrl && (
          <img
            src={tab.favIconUrl}
            alt=""
            className="tab-favicon"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        )}
        <span className="tab-title">{displayTitle}</span>
      </div>
    </div>
  )
}
