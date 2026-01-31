// CDN URL for large assets (video, audio)
const CDN_URL = 'https://utabia.com'

// Large assets that come from CDN in production/extension
const cdnAssets = [
  'waves-background.mp4',
  'piano%20shop%20in%20san%20sebastian.m4a',
  'pew.wav',
  'crunch.wav',
  'raye.gif'
]

const isDev = import.meta.env.DEV
const isExtension = typeof chrome !== 'undefined' && chrome.runtime?.id

export const getAssetUrl = (filename: string): string => {
  // In dev mode, use local files from public/
  if (isDev) {
    return `/${filename}`
  }

  // In extension or production, use CDN for large assets
  if (isExtension && cdnAssets.includes(filename)) {
    return `${CDN_URL}/${filename}`
  }

  // Fallback to relative path
  const basePath = import.meta.env.BASE_URL || './'
  return `${basePath}${filename}`
}
