import { useEffect, useCallback } from 'react'
import { useMachine } from '@xstate/react'
import { appMachine, VisibleTab } from '../machines/appMachine'
import { useTabs } from '../hooks/useTabs'
import FloatingTab from './FloatingTab'

interface TabFieldProps {
  onShoot: (x: number, y: number, targetInstanceId?: string) => void
}

export default function TabField({ onShoot }: TabFieldProps) {
  const { tabs, closeTab } = useTabs()
  const [state, send] = useMachine(appMachine)

  // Sync tabs with machine
  useEffect(() => {
    send({ type: 'SET_TABS', tabs })
  }, [tabs, send])

  const handleClick = useCallback((e: React.MouseEvent) => {
    const x = e.clientX
    const y = e.clientY

    // Check if clicked on a tab
    const target = e.target as HTMLElement
    const tabElement = target.closest('.floating-tab')
    const instanceId = tabElement?.getAttribute('data-instance-id') || undefined

    onShoot(x, y, instanceId)
  }, [onShoot])

  const handleTabGone = useCallback((instanceId: string) => {
    send({ type: 'TAB_GONE', instanceId })
  }, [send])

  const handleTabClosed = useCallback((instanceId: string, tabId: number) => {
    closeTab(tabId)
    send({ type: 'TAB_CLOSED', instanceId, tabId })
  }, [send, closeTab])

  return (
    <div className="tab-field" onClick={handleClick}>
      {state.context.visible.map((vTab: VisibleTab) => (
        <FloatingTab
          key={vTab.instanceId}
          tab={vTab}
          instanceId={vTab.instanceId}
          x={vTab.x}
          y={vTab.y}
          onGone={() => handleTabGone(vTab.instanceId)}
          onClosed={() => handleTabClosed(vTab.instanceId, vTab.id)}
        />
      ))}
    </div>
  )
}
