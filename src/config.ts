// CDN URL for large assets (video, audio)
// In development, use local files. In production extension, use CDN.
const CDN_URL = 'https://utabia.vercel.app'

// Check if running as Chrome extension
const isExtension = typeof chrome !== 'undefined' && chrome.runtime?.id

// For extension builds, use CDN for large assets
// For web (landing page), use relative paths
export const getAssetUrl = (filename: string): string => {
  // Large assets that should come from CDN in extension
  const cdnAssets = [
    'waves-background.mp4',
    'piano%20shop%20in%20san%20sebastian.m4a',
    'pew.wav',
    'crunch.wav',
    'raye.gif'
  ]

  if (isExtension && cdnAssets.includes(filename)) {
    return `${CDN_URL}/${filename}`
  }

  // Use local/relative path
  const basePath = import.meta.env.BASE_URL || './'
  return `${basePath}${filename}`
}
