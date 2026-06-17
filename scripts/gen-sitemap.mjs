// Generates dist/sitemap.xml and dist/robots.txt after the Vite build.
// URLs use SITE_URL (set this to your custom domain for production).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.GITHUB_PAGES === 'true' ? 'https://bstars00-rgb.github.io/AI-StayEasy' : 'http://localhost:4173')
).replace(/\/$/, '')

const pathPrefix = new URL(SITE_URL).pathname.replace(/\/$/, '') // '' or '/AI-StayEasy'

/** Pull every `slug: '...'` literal out of a data source file. */
function slugsFrom(file) {
  if (!existsSync(file)) return []
  const src = readFileSync(file, 'utf8')
  return [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
}

const hotelSlugs = slugsFrom('src/data/hotels.ts')
const destinationSlugs = slugsFrom('src/data/destinations.ts')
const guideSlugs = slugsFrom('src/data/guides.ts')

const staticPaths = [
  '/', '/destinations/vietnam', '/guides', '/guides/direct-booking',
  '/partners', '/about', '/privacy', '/terms', '/contact', '/search',
]

const paths = [
  ...staticPaths,
  ...destinationSlugs.map((s) => `/destinations/${s}`),
  ...hotelSlugs.map((s) => `/hotels/${s}`),
  ...guideSlugs.map((s) => `/guides/${s}`),
]

// De-dupe (e.g. da-nang appears as a destination)
const unique = [...new Set(paths)]
const today = (process.env.BUILD_DATE || '2026-06-16').slice(0, 10)

const urls = unique
  .map((p) => `  <url>\n    <loc>${SITE_URL}${p === '/' ? '' : p}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

const robots = `User-agent: *
Allow: /
Disallow: ${pathPrefix}/admin
Disallow: ${pathPrefix}/dashboard
Disallow: ${pathPrefix}/partner

Sitemap: ${SITE_URL}/sitemap.xml
`

writeFileSync('dist/sitemap.xml', sitemap)
writeFileSync('dist/robots.txt', robots)

// ads.txt — required by AdSense once approved. Set VITE_ADSENSE_CLIENT (or
// ADSENSE_CLIENT) to "ca-pub-XXXX" and the correct line is emitted; otherwise a
// harmless placeholder comment is written.
const adsClient = process.env.VITE_ADSENSE_CLIENT || process.env.ADSENSE_CLIENT || ''
const pub = adsClient.replace(/^ca-/, '')
const adsTxt = pub
  ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
  : '# Add your AdSense line after approval, e.g.:\n# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n'
writeFileSync('dist/ads.txt', adsTxt)

console.log(`sitemap.xml: ${unique.length} URLs · robots.txt + ads.txt written · SITE_URL=${SITE_URL}`)
