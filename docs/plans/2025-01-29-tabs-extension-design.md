# Tabs - Chrome Extension Design

A meditative, game-like Chrome extension for closing browser tabs.

## Concept

Click the extension icon to open a full-page ambient experience. Ocean waves play in the background with audio. Your browser tabs appear as floating 8-bit styled cards that fade in, bob gently, and fade out if ignored.

Click anywhere to shoot a laser. If it hits a floating tab, the tab disintegrates into scattering pixels and the actual browser tab closes. Miss and the laser flies off into infinity.

The experience is unhurried. You close what you want, ignore what you want. The waves keep playing.

## User Experience

### The Flow
1. Click extension icon → new tab opens with the Tabs experience
2. Ocean waves video plays (with audio)
3. Tabs from your browser fade in as floating 8-bit cards
4. Cards bob gently (up/down, left/right drift - no rotation)
5. After some time, unclicked cards fade out (browser tab stays open, card may reappear later)
6. Click anywhere → laser fires toward click position
7. If laser hits a card → disintegration effect → browser tab closes
8. If laser misses → flies off into the void

### Visual Design

**Floating Tabs:**
- Glowing yellow pixelated border
- Gray body (old-school arcade feel)
- Pixelated favicon (scaled up, `image-rendering: pixelated`)
- Retro pixel font for title (e.g., "Press Start 2P")
- Subtle glow lifts cards off the dark background

**Laser:**
- Simple solid rectangle (no trail, no glow, no pixelated edges)
- Rotated on 3D axis to appear shooting "into" the screen
- Cycles through colors (red, blue, green, yellow) based on shot sequence
- Rapid fire = colorful stream of rectangles flying into infinity
- Origin point TBD during implementation (starting with bottom-center, will iterate)

**Disintegration:**
- Tab breaks into square pixels
- Pixels scatter outward with randomness
- Fade out as they disperse
- Silent (no sound effect)

**Sound:**
- "Pew" sound on laser fire (short 8-bit synth blip)
- Ocean waves audio from background video

**Background:**
- YouTube embed: https://www.youtube.com/watch?v=bn9F19Hi1Lk
- Starts at 1 hour mark
- Looped, controls hidden, audio enabled
- Full viewport, unclickable (clicks pass through to play area)

## Technical Architecture

### Tech Stack
- Chrome Extension (Manifest V3)
- React + TypeScript
- XState for state management
- Vite for bundling

### Chrome Extension Structure

**Permissions:**
- `tabs` - query tabs, close tabs, listen to tab events

**Behavior:**
- Extension icon click → opens `chrome-extension://[id]/index.html` in new tab
- Background service worker handles the icon click

### State Management (XState)

**App Machine:**
- Manages tab queue, visible tabs, polling new tabs onto screen
- Subscribes to Chrome tab events (`onCreated`, `onUpdated`, `onRemoved`)

**FloatingTab Machine:**
```
fadingIn → hovering → fadingOut → (returns to queue)
              ↓
        disintegrating → closed
```

**Laser:**
- Independent of tab state
- Fired on any click in the play area
- If click coordinates intersect a FloatingTab, that tab receives a "hit" event on laser arrival

### Tab Queue Management
- Initial fetch of all open tabs on load, shuffled into queue
- Chrome events (`onCreated`, `onUpdated`, `onRemoved`) keep queue in sync
- Timer periodically picks tabs from queue to display (density tuned by feel, roughly 2-4 visible)

### Components

| Component | Responsibility |
|-----------|----------------|
| `App` | Top-level container, hosts state machine |
| `WavesBackground` | YouTube iframe embed, full viewport |
| `TabField` | Play area, handles click events, renders floating tabs and lasers |
| `FloatingTab` | Individual tab card, owns its state machine |
| `LaserEffect` | Animated rectangle from origin to target |
| `DisintegrationEffect` | Pixel scatter animation |

### File Structure

```
/tabs
  /extension
    manifest.json
    background.js
  /src
    /components
      App.tsx
      WavesBackground.tsx
      TabField.tsx
      FloatingTab.tsx
      LaserEffect.tsx
      DisintegrationEffect.tsx
    /machines
      appMachine.ts
      floatingTabMachine.ts
    /hooks
      useTabs.ts
    /assets
      pew.mp3
    index.tsx
    index.html
  package.json
  tsconfig.json
  vite.config.ts
```

## Open Questions / Iteration Points

- **Laser origin:** Starting with bottom-center, but may adjust based on what looks/feels best
- **Tab density:** Will tune how many tabs appear on screen based on visual testing
- **Timing:** Fade in/out durations, hover duration, laser travel time - all tunable
- **YouTube fallback:** If YouTube embed proves problematic (autoplay, terms), may need self-hosted video

## Browser Autoplay Consideration

Browsers restrict autoplay with audio. May need a "Click to enter" splash screen that initiates the experience and allows audio to play.
