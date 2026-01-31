// CDN URL for large assets (video, audio)
const CDN_URL = 'https://utabia.com'

// Large assets that should come from CDN
const cdnAssets = [
  'waves-background.mp4',
  'piano%20shop%20in%20san%20sebastian.m4a',
  'pew.wav',
  'crunch.wav',
  'raye.gif'
]

export const getAssetUrl = (filename: string): string => {
  // Always load large assets from CDN
  if (cdnAssets.includes(filename)) {
    return `${CDN_URL}/${filename}`
  }

  // Use local/relative path for other assets
  const basePath = import.meta.env.BASE_URL || './'
  return `${basePath}${filename}`
}
