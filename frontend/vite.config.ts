import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves 404.html for unknown paths — copy index so SPA routes work.
function spaFallback() {
  return {
    name: 'spa-fallback',
    closeBundle() {
      const index = resolve(__dirname, 'dist/index.html')
      copyFileSync(index, resolve(__dirname, 'dist/404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), spaFallback()],
})
