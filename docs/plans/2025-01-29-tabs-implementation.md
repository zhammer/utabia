# Tabs Chrome Extension Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Chrome extension that provides a meditative, game-like experience for closing browser tabs with 8-bit aesthetics over ambient ocean waves.

**Architecture:** React app bundled as a Chrome extension. XState manages tab queue and floating tab lifecycles. Chrome tabs API provides real-time tab data. YouTube iframe for background video. Canvas or DOM for laser/disintegration effects.

**Tech Stack:** React, TypeScript, XState, Vite, Chrome Extension Manifest V3

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

**Step 1: Initialize package.json**

```bash
cd /Users/zhammer/code/me/tabs/.worktrees/implement-tabs
npm init -y
```

**Step 2: Install dependencies**

```bash
npm install react react-dom xstate @xstate/react
npm install -D typescript @types/react @types/react-dom vite @vitejs/plugin-react
```

**Step 3: Create tsconfig.json**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

**Step 4: Create vite.config.ts**

Create `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})
```

**Step 5: Create index.html**

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tabs</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 6: Create src/main.tsx**

Create `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

**Step 7: Create src/App.tsx**

Create `src/App.tsx`:

```tsx
export default function App() {
  return <div>Tabs</div>
}
```

**Step 8: Create src/index.css**

Create `src/index.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}
```

**Step 9: Verify dev server runs**

```bash
npx vite --open
```

Expected: Browser opens, shows "Tabs" text on black background.

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold React + TypeScript + Vite project"
```

---

## Task 2: Chrome Extension Manifest

**Files:**
- Create: `public/manifest.json`
- Create: `src/background.ts`
- Modify: `vite.config.ts`

**Step 1: Create public/manifest.json**

Create `public/manifest.json`:

```json
{
  "manifest_version": 3,
  "name": "Tabs",
  "version": "1.0.0",
  "description": "A meditative experience for closing browser tabs",
  "permissions": ["tabs"],
  "action": {
    "default_title": "Open Tabs"
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}
```

**Step 2: Create placeholder icons**

We'll use simple placeholder icons for now. Create `public/icon16.png`, `public/icon48.png`, `public/icon128.png` as 1x1 pixel PNGs or skip for now (Chrome will use defaults).

```bash
mkdir -p public
# Icons can be added later - Chrome will show default
```

**Step 3: Create src/background.ts**

Create `src/background.ts`:

```typescript
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('index.html') })
})
```

**Step 4: Update vite.config.ts for extension build**

Modify `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.ts')
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
})
```

**Step 5: Build and verify**

```bash
npm run build
ls dist/
```

Expected: `index.html`, `main.js`, `background.js`, `assets/` folder

**Step 6: Add build script to package.json**

Verify `package.json` has build script (Vite adds it by default). If not:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

**Step 7: Test extension in Chrome**

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` folder
5. Click the extension icon
6. Should open new tab with "Tabs" text

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Chrome extension manifest and background script"
```

---

## Task 3: Waves Background Component

**Files:**
- Create: `src/components/WavesBackground.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css`

**Step 1: Create WavesBackground component**

Create `src/components/WavesBackground.tsx`:

```tsx
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
```

**Step 2: Add WavesBackground styles to index.css**

Add to `src/index.css`:

```css
.waves-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.waves-background iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -50%);
  border: none;
}
```

**Step 3: Update App to use WavesBackground**

Modify `src/App.tsx`:

```tsx
import WavesBackground from './components/WavesBackground'

export default function App() {
  return (
    <div className="app">
      <WavesBackground />
    </div>
  )
}
```

**Step 4: Add app styles**

Add to `src/index.css`:

```css
.app {
  width: 100%;
  height: 100%;
  position: relative;
}
```

**Step 5: Test in dev mode**

```bash
npm run dev
```

Expected: Ocean waves video plays in background (may need to click for audio due to autoplay restrictions).

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add WavesBackground component with YouTube embed"
```

---

## Task 4: Entry Screen for Autoplay

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`

**Step 1: Add entry state to App**

Modify `src/App.tsx`:

```tsx
import { useState } from 'react'
import WavesBackground from './components/WavesBackground'

export default function App() {
  const [entered, setEntered] = useState(false)

  if (!entered) {
    return (
      <div className="entry-screen" onClick={() => setEntered(true)}>
        <div className="entry-text">click to enter</div>
      </div>
    )
  }

  return (
    <div className="app">
      <WavesBackground />
    </div>
  )
}
```

**Step 2: Add entry screen styles**

Add to `src/index.css`:

```css
.entry-screen {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  cursor: pointer;
}

.entry-text {
  color: #FFD700;
  font-family: monospace;
  font-size: 24px;
  text-transform: lowercase;
  letter-spacing: 4px;
}
```

**Step 3: Test entry flow**

```bash
npm run dev
```

Expected: Shows "click to enter", clicking reveals waves video with audio.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add entry screen for audio autoplay"
```

---

## Task 5: Chrome Tabs Hook

**Files:**
- Create: `src/hooks/useTabs.ts`
- Create: `src/types.ts`

**Step 1: Create types file**

Create `src/types.ts`:

```typescript
export interface TabInfo {
  id: number
  title: string
  favIconUrl?: string
  url?: string
}
```

**Step 2: Create useTabs hook**

Create `src/hooks/useTabs.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react'
import { TabInfo } from '../types'

export function useTabs() {
  const [tabs, setTabs] = useState<TabInfo[]>([])

  // Fetch all tabs
  const fetchTabs = useCallback(async () => {
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      // Dev mode fallback
      setTabs([
        { id: 1, title: 'Example Tab 1', favIconUrl: 'https://www.google.com/favicon.ico' },
        { id: 2, title: 'Example Tab 2', favIconUrl: 'https://github.com/favicon.ico' },
        { id: 3, title: 'Another Tab Here', favIconUrl: 'https://twitter.com/favicon.ico' },
      ])
      return
    }

    const allTabs = await chrome.tabs.query({})
    const currentTab = await chrome.tabs.getCurrent()

    // Exclude the Tabs extension page itself
    const filteredTabs = allTabs
      .filter(tab => tab.id !== currentTab?.id && tab.id !== undefined)
      .map(tab => ({
        id: tab.id!,
        title: tab.title || 'Untitled',
        favIconUrl: tab.favIconUrl,
        url: tab.url
      }))

    setTabs(filteredTabs)
  }, [])

  // Close a tab
  const closeTab = useCallback(async (tabId: number) => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      await chrome.tabs.remove(tabId)
    }
    setTabs(prev => prev.filter(t => t.id !== tabId))
  }, [])

  // Listen for tab events
  useEffect(() => {
    fetchTabs()

    if (typeof chrome === 'undefined' || !chrome.tabs) return

    const handleCreated = (tab: chrome.tabs.Tab) => {
      if (tab.id === undefined) return
      setTabs(prev => [...prev, {
        id: tab.id!,
        title: tab.title || 'Untitled',
        favIconUrl: tab.favIconUrl,
        url: tab.url
      }])
    }

    const handleUpdated = (tabId: number, _changes: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
      setTabs(prev => prev.map(t =>
        t.id === tabId
          ? { ...t, title: tab.title || 'Untitled', favIconUrl: tab.favIconUrl, url: tab.url }
          : t
      ))
    }

    const handleRemoved = (tabId: number) => {
      setTabs(prev => prev.filter(t => t.id !== tabId))
    }

    chrome.tabs.onCreated.addListener(handleCreated)
    chrome.tabs.onUpdated.addListener(handleUpdated)
    chrome.tabs.onRemoved.addListener(handleRemoved)

    return () => {
      chrome.tabs.onCreated.removeListener(handleCreated)
      chrome.tabs.onUpdated.removeListener(handleUpdated)
      chrome.tabs.onRemoved.removeListener(handleRemoved)
    }
  }, [fetchTabs])

  return { tabs, closeTab }
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add useTabs hook for Chrome tabs API"
```

---

## Task 6: Floating Tab State Machine

**Files:**
- Create: `src/machines/floatingTabMachine.ts`

**Step 1: Create the floating tab machine**

Create `src/machines/floatingTabMachine.ts`:

```typescript
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
        500: 'closed'
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
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add floating tab state machine"
```

---

## Task 7: App State Machine

**Files:**
- Create: `src/machines/appMachine.ts`

**Step 1: Create the app machine**

Create `src/machines/appMachine.ts`:

```typescript
import { createMachine, assign } from 'xstate'
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
        src: () => (callback) => {
          const interval = setInterval(() => {
            callback({ type: 'SPAWN_TAB' })
          }, 3000)
          return () => clearInterval(interval)
        }
      },
      on: {
        SET_TABS: {
          actions: assign({
            queue: (_, event) => [...event.tabs].sort(() => Math.random() - 0.5)
          })
        },
        ADD_TAB: {
          actions: assign({
            queue: (context, event) => [...context.queue, event.tab]
          })
        },
        REMOVE_TAB: {
          actions: assign({
            queue: (context, event) => context.queue.filter(t => t.id !== event.tabId),
            visible: (context, event) => context.visible.filter(t => t.id !== event.tabId)
          })
        },
        SPAWN_TAB: {
          actions: assign((context) => {
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
            visible: (context, event) => context.visible.filter(t => t.instanceId !== event.instanceId)
          })
        },
        TAB_CLOSED: {
          actions: assign({
            visible: (context, event) => context.visible.filter(t => t.instanceId !== event.instanceId),
            queue: (context, event) => context.queue.filter(t => t.id !== event.tabId)
          })
        }
      }
    }
  }
})
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add app state machine for tab queue management"
```

---

## Task 8: FloatingTab Component

**Files:**
- Create: `src/components/FloatingTab.tsx`
- Modify: `src/index.css`

**Step 1: Create FloatingTab component**

Create `src/components/FloatingTab.tsx`:

```tsx
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
}

export default function FloatingTab({ tab, instanceId, x, y, onGone, onClosed }: FloatingTabProps) {
  const [state, send] = useMachine(floatingTabMachine, {
    context: {
      tabId: tab.id,
      x,
      y,
      opacity: 0
    }
  })

  useEffect(() => {
    if (state.matches('gone')) {
      onGone()
    } else if (state.matches('closed')) {
      onClosed()
    }
  }, [state.value, onGone, onClosed])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (state.matches('hovering')) {
      send({ type: 'HIT' })
    }
  }

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
      onClick={handleClick}
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
```

**Step 2: Add FloatingTab styles**

Add to `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.floating-tab {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 12px 16px;
  background: #333;
  border: 4px solid #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2);
  cursor: pointer;
  animation: float 4s ease-in-out infinite, fadeIn 1s ease-out forwards;
  opacity: 0;
  z-index: 10;
  image-rendering: pixelated;
}

.floating-tab.fading-in {
  animation: float 4s ease-in-out infinite, fadeIn 1s ease-out forwards;
}

.floating-tab.fading-out {
  animation: float 4s ease-in-out infinite, fadeOut 1s ease-out forwards;
}

.floating-tab.disintegrating {
  animation: disintegrate 0.5s ease-out forwards;
}

.tab-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tab-favicon {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
}

.tab-title {
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  color: #fff;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0) translateX(0);
  }
  25% {
    transform: translate(-50%, -50%) translateY(-8px) translateX(4px);
  }
  50% {
    transform: translate(-50%, -50%) translateY(0) translateX(-4px);
  }
  75% {
    transform: translate(-50%, -50%) translateY(8px) translateX(2px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes disintegrate {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.5);
    filter: blur(8px);
  }
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add FloatingTab component with 8-bit styling"
```

---

## Task 9: TabField Component

**Files:**
- Create: `src/components/TabField.tsx`
- Modify: `src/index.css`

**Step 1: Create TabField component**

Create `src/components/TabField.tsx`:

```tsx
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
    const rect = e.currentTarget.getBoundingClientRect()
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
```

**Step 2: Add TabField styles**

Add to `src/index.css`:

```css
.tab-field {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  cursor: crosshair;
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add TabField component"
```

---

## Task 10: Laser Effect Component

**Files:**
- Create: `src/components/LaserEffect.tsx`
- Modify: `src/index.css`

**Step 1: Create LaserEffect component**

Create `src/components/LaserEffect.tsx`:

```tsx
import { useEffect, useState } from 'react'

interface LaserEffectProps {
  startX: number
  startY: number
  targetX: number
  targetY: number
  color: string
  onComplete: () => void
}

export default function LaserEffect({ startX, startY, targetX, targetY, color, onComplete }: LaserEffectProps) {
  const [position, setPosition] = useState({ x: startX, y: startY })

  // Calculate angle for 3D perspective effect
  const dx = targetX - startX
  const dy = targetY - startY
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  // Calculate distance for animation
  const distance = Math.sqrt(dx * dx + dy * dy)
  const duration = Math.min(300, distance * 0.3) // ms, faster for closer targets

  useEffect(() => {
    // Animate to target
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out
      const eased = 1 - Math.pow(1 - progress, 2)

      setPosition({
        x: startX + dx * eased,
        y: startY + dy * eased
      })

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setTimeout(onComplete, 50)
      }
    }

    requestAnimationFrame(animate)
  }, [startX, startY, targetX, targetY, dx, dy, duration, onComplete])

  // 3D skew based on angle - more vertical = more skew
  const skewAmount = Math.abs(Math.cos(angle * Math.PI / 180)) * 30

  return (
    <div
      className="laser"
      style={{
        left: position.x,
        top: position.y,
        backgroundColor: color,
        transform: `translate(-50%, -50%) rotate(${angle}deg) perspective(100px) rotateX(${skewAmount}deg)`,
      }}
    />
  )
}
```

**Step 2: Add Laser styles**

Add to `src/index.css`:

```css
.laser {
  position: fixed;
  width: 30px;
  height: 6px;
  z-index: 100;
  pointer-events: none;
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add LaserEffect component"
```

---

## Task 11: Laser Manager and Sound

**Files:**
- Create: `src/components/LaserManager.tsx`
- Create: `src/hooks/useLaserSound.ts`
- Modify: `src/App.tsx`

**Step 1: Create useLaserSound hook**

Create `src/hooks/useLaserSound.ts`:

```typescript
import { useCallback, useRef } from 'react'

// Simple 8-bit pew sound using Web Audio API
export function useLaserSound() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const playPew = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // 8-bit style square wave
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(880, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }, [])

  return { playPew }
}
```

**Step 2: Create LaserManager component**

Create `src/components/LaserManager.tsx`:

```tsx
import { useState, useCallback, useRef } from 'react'
import LaserEffect from './LaserEffect'
import { useLaserSound } from '../hooks/useLaserSound'

interface Laser {
  id: string
  startX: number
  startY: number
  targetX: number
  targetY: number
  color: string
  targetInstanceId?: string
}

interface LaserManagerProps {
  onHit: (instanceId: string) => void
  children: (shoot: (x: number, y: number, targetInstanceId?: string) => void) => React.ReactNode
}

const COLORS = ['#FF0000', '#00FF00', '#0088FF', '#FFFF00', '#FF00FF', '#00FFFF']

export default function LaserManager({ onHit, children }: LaserManagerProps) {
  const [lasers, setLasers] = useState<Laser[]>([])
  const colorIndexRef = useRef(0)
  const { playPew } = useLaserSound()

  const shoot = useCallback((targetX: number, targetY: number, targetInstanceId?: string) => {
    const startX = window.innerWidth / 2
    const startY = window.innerHeight

    const color = COLORS[colorIndexRef.current % COLORS.length]
    colorIndexRef.current++

    const laser: Laser = {
      id: Math.random().toString(36).substring(2, 9),
      startX,
      startY,
      targetX,
      targetY,
      color,
      targetInstanceId
    }

    setLasers(prev => [...prev, laser])
    playPew()
  }, [playPew])

  const handleLaserComplete = useCallback((laser: Laser) => {
    setLasers(prev => prev.filter(l => l.id !== laser.id))
    if (laser.targetInstanceId) {
      onHit(laser.targetInstanceId)
    }
  }, [onHit])

  return (
    <>
      {children(shoot)}
      {lasers.map(laser => (
        <LaserEffect
          key={laser.id}
          startX={laser.startX}
          startY={laser.startY}
          targetX={laser.targetX}
          targetY={laser.targetY}
          color={laser.color}
          onComplete={() => handleLaserComplete(laser)}
        />
      ))}
    </>
  )
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add LaserManager and pew sound"
```

---

## Task 12: Wire Everything Together

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/TabField.tsx`

**Step 1: Update App.tsx to integrate all components**

Modify `src/App.tsx`:

```tsx
import { useState, useCallback, useRef } from 'react'
import WavesBackground from './components/WavesBackground'
import TabField from './components/TabField'
import LaserManager from './components/LaserManager'

export default function App() {
  const [entered, setEntered] = useState(false)
  const tabFieldRef = useRef<{ hitTab: (instanceId: string) => void } | null>(null)

  const handleHit = useCallback((instanceId: string) => {
    tabFieldRef.current?.hitTab(instanceId)
  }, [])

  if (!entered) {
    return (
      <div className="entry-screen" onClick={() => setEntered(true)}>
        <div className="entry-text">click to enter</div>
      </div>
    )
  }

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
```

**Step 2: Update TabField to expose hitTab via ref**

Modify `src/components/TabField.tsx`:

```tsx
import { useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from 'react'
import { useMachine } from '@xstate/react'
import { appMachine, VisibleTab } from '../machines/appMachine'
import { useTabs } from '../hooks/useTabs'
import FloatingTab from './FloatingTab'

interface TabFieldProps {
  onShoot: (x: number, y: number, targetInstanceId?: string) => void
}

export interface TabFieldHandle {
  hitTab: (instanceId: string) => void
}

const TabField = forwardRef<TabFieldHandle, TabFieldProps>(({ onShoot }, ref) => {
  const { tabs, closeTab } = useTabs()
  const [state, send] = useMachine(appMachine)
  const floatingTabRefs = useRef<Map<string, { hit: () => void }>>(new Map())

  useImperativeHandle(ref, () => ({
    hitTab: (instanceId: string) => {
      floatingTabRefs.current.get(instanceId)?.hit()
    }
  }), [])

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
    floatingTabRefs.current.delete(instanceId)
    send({ type: 'TAB_GONE', instanceId })
  }, [send])

  const handleTabClosed = useCallback((instanceId: string, tabId: number) => {
    floatingTabRefs.current.delete(instanceId)
    closeTab(tabId)
    send({ type: 'TAB_CLOSED', instanceId, tabId })
  }, [send, closeTab])

  const registerFloatingTab = useCallback((instanceId: string, handle: { hit: () => void }) => {
    floatingTabRefs.current.set(instanceId, handle)
  }, [])

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
          onRegister={(handle) => registerFloatingTab(vTab.instanceId, handle)}
        />
      ))}
    </div>
  )
})

TabField.displayName = 'TabField'

export default TabField
```

**Step 3: Update FloatingTab to support hit registration**

Modify `src/components/FloatingTab.tsx`:

```tsx
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
  const [state, send] = useMachine(floatingTabMachine, {
    context: {
      tabId: tab.id,
      x,
      y,
      opacity: 0
    }
  })

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
```

**Step 4: Test the full experience**

```bash
npm run dev
```

Expected: Click to enter, waves play, tabs fade in and float, clicking shoots lasers, hitting tabs makes them disintegrate.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: wire up all components for full experience"
```

---

## Task 13: Build and Test as Extension

**Files:**
- Modify: `vite.config.ts` (if needed)

**Step 1: Build for production**

```bash
npm run build
```

**Step 2: Copy manifest to dist**

The public folder should automatically copy to dist. Verify:

```bash
ls dist/
```

Should include `manifest.json`.

**Step 3: Load extension in Chrome**

1. Open `chrome://extensions/`
2. Reload the extension (or load unpacked if first time)
3. Click extension icon
4. Full experience should work with real tabs

**Step 4: Test tab closing**

1. Open several browser tabs
2. Open Tabs extension
3. Wait for tabs to appear
4. Shoot a tab
5. Verify the actual browser tab closes

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: finalize build configuration"
```

---

## Task 14: Polish and Iteration Points

This task is for tuning based on how things look/feel:

- **Laser origin:** If bottom-center looks odd, try other origins (cursor position, off-screen edges)
- **Tab density:** Adjust `maxVisible` in appMachine and spawn interval timing
- **Animation timing:** Tweak fade durations, hover duration, laser travel speed
- **Disintegration effect:** The current CSS blur/scale is a placeholder; could implement pixel scatter with canvas
- **Visual polish:** Adjust colors, glow intensity, font sizes

These are iterative changes based on testing - not a single commit.

---

## Summary

After completing all tasks, you will have:

1. A React + TypeScript + XState Chrome extension
2. YouTube background with ocean waves (audio enabled)
3. Floating 8-bit styled tabs that fade in/out
4. Colorful rectangle lasers fired on click
5. Tabs disintegrate when hit by lasers
6. Real browser tabs close when shot
7. Retro "pew" sound effect

The extension provides a meditative, game-like experience for closing browser tabs.
