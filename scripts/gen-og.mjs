// Rasterizes public/og-image.svg to dist/og-image.png (social scrapers need a
// raster image). Guarded: if resvg can't load, the build still succeeds and the
// SVG remains available as a fallback.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'

try {
  const { Resvg } = await import('@resvg/resvg-js')
  if (!existsSync('dist')) mkdirSync('dist')
  const svg = readFileSync('public/og-image.svg', 'utf8')
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: { loadSystemFonts: true, defaultFontFamily: 'sans-serif' },
  })
  writeFileSync('dist/og-image.png', resvg.render().asPng())
  console.log('og-image.png generated (1200x630)')
} catch (e) {
  console.warn('og-image.png skipped:', e.message)
}
