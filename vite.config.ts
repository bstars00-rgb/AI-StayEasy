import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'node:fs'

// GitHub Pages serves this project at https://bstars00-rgb.github.io/AI-StayEasy/
// so assets must be served from that sub-path. The workflow sets GITHUB_PAGES=true.
// Local dev and Vercel keep base '/'.
const base = process.env.GITHUB_PAGES === 'true' ? '/AI-StayEasy/' : '/'

// SPA fallback for GitHub Pages: copy index.html -> 404.html so client-side
// routes (e.g. /AI-StayEasy/hotels/xyz) resolve on a hard refresh.
function spa404Fallback() {
  return {
    name: 'spa-404-fallback',
    closeBundle() {
      if (existsSync('dist/index.html')) {
        copyFileSync('dist/index.html', 'dist/404.html')
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [react(), spa404Fallback()],
})
