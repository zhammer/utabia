// https://coolors.co/925e78-bd93bd-f2edeb-f05365-fabc2a

import { createMachine, assign, fromCallback } from "xstate";
import { TabInfo } from "../types";

export interface VisibleTab extends TabInfo {
  instanceId: string;
  x: number;
  y: number;
}

export interface AppContext {
  queue: TabInfo[];
  visible: VisibleTab[];
  maxVisible: number;
  hasHadTabs: boolean;
}

export type AppEvent =
  | { type: "SET_TABS"; tabs: TabInfo[] }
  | { type: "ADD_TAB"; tab: TabInfo }
  | { type: "REMOVE_TAB"; tabId: number }
  | { type: "SPAWN_TAB" }
  | { type: "TAB_GONE"; instanceId: string }
  | { type: "TAB_CLOSED"; instanceId: string; tabId: number }
  | { type: "SHOW_MESSAGE" };

function randomPosition(existingTabs: VisibleTab[]) {
  const paddingX = 0.1;
  const paddingTop = 0.08;
  const maxY = 0.45; // Tabs only in top half
  const minDistance = 0.2; // Minimum distance between tabs (as fraction of screen)

  // Try to find a position that's far from existing tabs
  let bestPos = { x: 0, y: 0 };
  let bestMinDist = -1;

  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = {
      x: paddingX + Math.random() * (1 - 2 * paddingX),
      y: paddingTop + Math.random() * (maxY - paddingTop),
    };

    // Find minimum distance to any existing tab
    let minDist = Infinity;
    for (const tab of existingTabs) {
      const dx = candidate.x - tab.x;
      const dy = candidate.y - tab.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      minDist = Math.min(minDist, dist);
    }

    // If no existing tabs or this is far enough, use it
    if (existingTabs.length === 0 || minDist >= minDistance) {
      return candidate;
    }

    // Track best position found so far
    if (minDist > bestMinDist) {
      bestMinDist = minDist;
      bestPos = candidate;
    }
  }

  return bestPos;
}

function generateInstanceId() {
  return Math.random().toString(36).substring(2, 9);
}

const spawnTimerLogic = fromCallback(({ sendBack }) => {
  const interval = setInterval(() => {
    sendBack({ type: "SPAWN_TAB" });
  }, 5e3);
  return () => clearInterval(interval);
});

const utabiaTimerLogic = fromCallback(({ sendBack }) => {
  const timeout = setTimeout(() => {
    sendBack({ type: "SHOW_MESSAGE" });
  }, 10e3);
  return () => clearTimeout(timeout);
});

export const appMachine = createMachine({
  id: "app",
  initial: "running",
  context: {
    queue: [],
    visible: [],
    maxVisible: 4,
    hasHadTabs: false,
  } as AppContext,
  states: {
    running: {
      invoke: {
        id: "spawnTimer",
        src: spawnTimerLogic,
      },
      always: {
        target: "utabia",
        guard: ({ context }) =>
          context.hasHadTabs &&
          context.queue.length === 0 &&
          context.visible.length === 0,
      },
      on: {
        SET_TABS: {
          actions: assign({
            queue: ({ event }) =>
              [...event.tabs].sort(() => Math.random() - 0.5),
            hasHadTabs: ({ context, event }) =>
              context.hasHadTabs || event.tabs.length > 0,
          }),
        },
        ADD_TAB: {
          actions: assign({
            queue: ({ context, event }) => [...context.queue, event.tab],
          }),
        },
        REMOVE_TAB: {
          actions: assign({
            queue: ({ context, event }) =>
              context.queue.filter((t) => t.id !== event.tabId),
            visible: ({ context, event }) =>
              context.visible.filter((t) => t.id !== event.tabId),
          }),
        },
        SPAWN_TAB: {
          actions: assign(({ context }) => {
            if (
              context.visible.length >= context.maxVisible ||
              context.queue.length === 0
            ) {
              return context;
            }

            // Find a tab from queue that isn't already visible
            const visibleIds = new Set(context.visible.map((v) => v.id));
            const available = context.queue.filter(
              (t) => !visibleIds.has(t.id)
            );

            if (available.length === 0) return context;

            const tab = available[Math.floor(Math.random() * available.length)];
            const pos = randomPosition(context.visible);

            return {
              ...context,
              visible: [
                ...context.visible,
                {
                  ...tab,
                  instanceId: generateInstanceId(),
                  x: pos.x,
                  y: pos.y,
                },
              ],
            };
          }),
        },
        TAB_GONE: {
          actions: assign({
            visible: ({ context, event }) =>
              context.visible.filter((t) => t.instanceId !== event.instanceId),
          }),
        },
        TAB_CLOSED: {
          actions: assign({
            visible: ({ context, event }) =>
              context.visible.filter((t) => t.instanceId !== event.instanceId),
            queue: ({ context, event }) =>
              context.queue.filter((t) => t.id !== event.tabId),
          }),
        },
      },
    },
    utabia: {
      initial: "waiting",
      on: {
        SET_TABS: {
          target: "running",
          guard: ({ event }) => event.tabs.length > 0,
          actions: assign({
            queue: ({ event }) =>
              [...event.tabs].sort(() => Math.random() - 0.5),
          }),
        },
      },
      states: {
        waiting: {
          invoke: {
            id: "utabiaTimer",
            src: utabiaTimerLogic,
          },
          on: {
            SHOW_MESSAGE: "showingMessage",
          },
        },
        showingMessage: {},
      },
    },
  },
});
