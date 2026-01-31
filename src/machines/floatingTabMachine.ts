import { createMachine, assign } from 'xstate'

export interface FloatingTabContext {
  tabId: number
  x: number
  y: number
  opacity: number
}

export type FloatingTabEvent =
  | { type: 'FADE_IN_COMPLETE' }
  | { type: 'TIMEOUT' }
  | { type: 'HIT' }
  | { type: 'DISINTEGRATION_COMPLETE' }

export const floatingTabMachine = createMachine({
  id: 'floatingTab',
  initial: 'fadingIn',
  context: {
    tabId: 0,
    x: 0,
    y: 0,
    opacity: 0
  } as FloatingTabContext,
  states: {
    fadingIn: {
      entry: assign({ opacity: 1 }),
      after: {
        1000: 'hovering'
      }
    },
    hovering: {
      after: {
        8000: 'fadingOut'
      },
      on: {
        HIT: 'disintegrating'
      }
    },
    fadingOut: {
      entry: assign({ opacity: 0 }),
      after: {
        1000: 'gone'
      }
    },
    disintegrating: {
      after: {
        900: 'closed'
      }
    },
    closed: {
      type: 'final'
    },
    gone: {
      type: 'final'
    }
  }
})
