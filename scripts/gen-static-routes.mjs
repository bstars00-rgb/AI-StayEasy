// Pre-renders a real, crawlable HTML file for every public route.
//
// The app is a Vite SPA on GitHub Pages. Without this step a deep link like
// /hotels/an-bang-beach-resort hits the 404.html fallback and is served with a
// 404 status — a "soft 404" that Google indexes poorly, which starves Search
// Console of per-hotel query data. By writing dist/<route>/index.html (a copy of
// the built shell with a route-specific <title> + canonical), GitHub Pages serves
// each route with a 200; Googlebot then runs the JS for full content. The
// existing 404.html stays as the fallback for anything not pre-rendered.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.GITHUB_PAGES === 'true' ? 'https://bstars00-rgb.github.io/AI-StayEasy' : 'http://localhost:4173')
).replace(/\/$/, '')

const shellPath = 'dist/index.html'
if (!existsSync(shellPath)) {
  console.error('gen-static-routes: dist/index.html not found — run the build first.')
  process.exit(1)
}
const shell = readFileSync(shellPath, 'utf8')

/** Pull every `slug: '...'` literal out of a data source file. */
function slugsFrom(file) {
  if (!existsSync(file)) return []
  return [...readFileSync(file, 'utf8').matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
}

const staticPaths = [
  '/destinations/vietnam', '/guides', '/guides/direct-booking',
  '/partners', '/about', '/privacy', '/terms', '/contact', '/search',
]
const paths = [
  ...staticPaths,
  ...slugsFrom('src/data/destinations.ts').map((s) => `/destinations/${s}`),
  ...slugsFrom('src/data/hotels.ts').map((s) => `/hotels/${s}`),
  ...slugsFrom('src/data/guides.ts').map((s) => `/guides/${s}`),
]
const unique = [...new Set(paths)].filter((p) => p && p !== '/')

/** 'an-bang-beach-resort' -> 'An Bang Beach Resort' (a fallback title; the app
 *  overrides it with the precise localized title once the JS runs). */
function humanize(route) {
  const seg = route.split('/').filter(Boolean).pop() || ''
  return seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const titleRe = /<title>[\s\S]*?<\/title>/

let written = 0
for (const route of unique) {
  const canonical = `${SITE_URL}${route}`
  const title = `${humanize(route)} — StayEasy`
  const html = shell
    .replace(titleRe, `<title>${title}</title>`)
    .replace('</head>', `  <link rel="canonical" href="${canonical}" />\n  </head>`)

  // Write a flat `<route>.html` (not `<route>/index.html`): GitHub Pages serves
  // the extension-less URL with a 200 directly, so the no-trailing-slash URL —
  // the one in the sitemap, the canonical tag, and the router — matches exactly.
  // A directory/index.html would 301-redirect /foo to /foo/ and break that match.
  const outPath = `dist${route}.html`
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, html)
  written++
}

console.log(`gen-static-routes: wrote ${written} pre-rendered route files (200-indexable).`)
