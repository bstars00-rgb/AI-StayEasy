// Rasterizes public/icon.svg into the PNG app icons a PWA needs (home-screen
// install, splash, Apple touch icon). Guarded: if resvg can't load, the build
// still succeeds — the manifest just falls back to the SVG favicon.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

try {
  const { Resvg } = await import('@resvg/resvg-js')
  const svg = readFileSync('public/icon.svg', 'utf8')
  const png = (w) =>
    new Resvg(svg, { fitTo: { mode: 'width', value: w }, background: '#15564A' }).render().asPng()

  mkdirSync('dist/icons', { recursive: true })
  writeFileSync('dist/icons/icon-192.png', png(192))
  writeFileSync('dist/icons/icon-512.png', png(512))
  writeFileSync('dist/apple-touch-icon.png', png(180))
  console.log('PWA icons generated (192, 512, apple-touch 180)')
} catch (e) {
  console.warn('gen-icons skipped:', e.message)
}
