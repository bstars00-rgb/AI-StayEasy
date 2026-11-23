import type { FastifyInstance } from 'fastify'
import { PLACE_IDS } from '../../src/data/placeIds'
import { PLACES_LANG, parseReviewSummary } from '../../src/lib/googleReviews'

/**
 * GET /api/v1/hotels/:slug/review-summary?lang=ko
 *
 * Relays Google's AI review summary (Places API (New), field `reviewSummary`)
 * for one hotel. Google's policy forbids pre-fetching, caching or storing
 * Places content, so this is a pure pass-through: no DB, no memory cache,
 * `cache-control: no-store`. Only the place ID (src/data/placeIds.ts) is kept.
 *
 *   404 not_available   no verified place ID, or Google has no summary for it
 *   503 not_configured  GOOGLE_PLACES_API_KEY is not set
 *
 * The browser never sees the key and never supplies a place ID — it sends our
 * hotel slug, which keeps the key from being used as a general Places proxy.
 */
const PLACES_URL = 'https://places.googleapis.com/v1/places'
const TIMEOUT_MS = 4000

// Minimal per-IP limiter so a script can't burn the Places quota (billed per call).
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 30
const hits = new Map<string, { n: number; reset: number }>()
function limited(ip: string): boolean {
  const now = Date.now()
  const h = hits.get(ip)
  if (!h || now > h.reset) {
    hits.set(ip, { n: 1, reset: now + WINDOW_MS })
    if (hits.size > 5000) for (const [k, v] of hits) if (now > v.reset) hits.delete(k)
    return false
  }
  return ++h.n > MAX_PER_WINDOW
}

export function registerReviewSummary(app: FastifyInstance, v: string): void {
  app.get<{ Params: { slug: string }; Querystring: { lang?: string } }>(`${v}/hotels/:slug/review-summary`, async (req, reply) => {
    reply.header('cache-control', 'no-store')
    const key = process.env.GOOGLE_PLACES_API_KEY
    if (!key) return reply.code(503).send({ code: 'not_configured', message: 'review summaries are not configured' })
    if (limited(req.ip)) return reply.code(429).send({ code: 'rate_limited', message: 'too many requests' })

    const { slug } = req.params
    const placeId = Object.prototype.hasOwnProperty.call(PLACE_IDS, slug) ? PLACE_IDS[slug] : undefined
    if (!placeId) return reply.code(404).send({ code: 'not_available', message: 'no review summary for this hotel' })

    const lang = (req.query.lang ?? 'en') as keyof typeof PLACES_LANG
    const languageCode = PLACES_LANG[lang] ?? PLACES_LANG.en

    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(`${PLACES_URL}/${encodeURIComponent(placeId)}?languageCode=${encodeURIComponent(languageCode)}`, {
        headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'reviewSummary' },
        signal: ctl.signal,
      })
      if (!res.ok) {
        // Log status only — never the key or the response body.
        app.log.warn({ slug, status: res.status }, 'places review summary failed')
        return reply.code(404).send({ code: 'not_available', message: 'no review summary for this hotel' })
      }
      const dto = parseReviewSummary(((await res.json()) as { reviewSummary?: unknown }).reviewSummary)
      return dto ?? reply.code(404).send({ code: 'not_available', message: 'no review summary for this hotel' })
    } catch (err) {
      app.log.warn({ slug, err: (err as Error).name }, 'places review summary error')
      return reply.code(404).send({ code: 'not_available', message: 'no review summary for this hotel' })
    } finally {
      clearTimeout(timer)
    }
  })
}
