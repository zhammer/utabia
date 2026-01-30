import { createMachine, assign, fromCallback } from 'xstate'
import { TabInfo } from '../types'

export interface VisibleTab extends TabInfo {
  instanceId: string
  x: number
  y: number
}

export interface AppContext {
  queue: TabInfo[]
  visible: VisibleTab[]
  maxVisible: number
}

export type AppEvent =
  | { type: 'SET_TABS'; tabs: TabInfo[] }
  | { type: 'ADD_TAB'; tab: TabInfo }
  | { type: 'REMOVE_TAB'; tabId: number }
  | { type: 'SPAWN_TAB' }
  | { type: 'TAB_GONE'; instanceId: string }
  | { type: 'TAB_CLOSED'; instanceId: string; tabId: number }

function randomPosition() {
  // Keep tabs away from edges
  const padding = 0.15
  return {
    x: padding + Math.random() * (1 - 2 * padding),
    y: padding + Math.random() * (1 - 2 * padding)
  }
}

function generateInstanceId() {
  return Math.random().toString(36).substring(2, 9)
}

const spawnTimerLogic = fromCallback(({ sendBack }) => {
  const interval = setInterval(() => {
    sendBack({ type: 'SPAWN_TAB' })
  }, 3000)
  return () => clearInterval(interval)
})

export const appMachine = createMachine({
  id: 'app',
  initial: 'running',
  context: {
    queue: [],
    visible: [],
    maxVisible: 4
  } as AppContext,
  states: {
    running: {
      invoke: {
        id: 'spawnTimer',
        src: spawnTimerLogic
      },
      on: {
        SET_TABS: {
          actions: assign({
            queue: ({ event }) => [...event.tabs].sort(() => Math.random() - 0.5)
          })
        },
        ADD_TAB: {
          actions: assign({
            queue: ({ context, event }) => [...context.queue, event.tab]
          })
        },
        REMOVE_TAB: {
          actions: assign({
            queue: ({ context, event }) => context.queue.filter(t => t.id !== event.tabId),
            visible: ({ context, event }) => context.visible.filter(t => t.id !== event.tabId)
          })
        },
        SPAWN_TAB: {
          actions: assign(({ context }) => {
            if (context.visible.length >= context.maxVisible || context.queue.length === 0) {
              return context
            }

            // Find a tab from queue that isn't already visible
            const visibleIds = new Set(context.visible.map(v => v.id))
            const available = context.queue.filter(t => !visibleIds.has(t.id))

            if (available.length === 0) return context

            const tab = available[Math.floor(Math.random() * available.length)]
            const pos = randomPosition()

            return {
              ...context,
              visible: [...context.visible, {
                ...tab,
                instanceId: generateInstanceId(),
                x: pos.x,
                y: pos.y
              }]
            }
          })
        },
        TAB_GONE: {
          actions: assign({
            visible: ({ context, event }) => context.visible.filter(t => t.instanceId !== event.instanceId)
          })
        },
        TAB_CLOSED: {
          actions: assign({
            visible: ({ context, event }) => context.visible.filter(t => t.instanceId !== event.instanceId),
            queue: ({ context, event }) => context.queue.filter(t => t.id !== event.tabId)
          })
        }
      }
    }
  }
})
