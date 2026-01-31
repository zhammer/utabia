import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? './' : '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html'),
        background: resolve(__dirname, 'src/background.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep background.js at root for Chrome extension
          if (chunkInfo.name === 'background') {
            return '[name].js'
          }
          return 'assets/[name]-[hash].js'
        }
      }
    }
  }
}))
