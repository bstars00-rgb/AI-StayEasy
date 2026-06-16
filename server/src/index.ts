import Fastify from 'fastify'
import cors from '@fastify/cors'

// Reuse the prototype's shared, framework-free catalogue + search engine.
// (When this graduates to a DB, swap these imports for Prisma queries — the
// response shapes already match src/api/contract.ts.)
import { hotels, getHotel, hotelsByCity } from '../../src/data/hotels'
import { destinations, getDestination } from '../../src/data/destinations'
import { recommend } from '../../src/lib/searchEngine'
import { partners, campaigns, inquiries, overviewKpis, clicksByCity } from '../../src/data/adminData'
import type { Hotel } from '../../src/types'

const V = '/api/v1'
const page = <T>(items: T[]) => ({ items, page: 1, pageSize: items.length, total: items.length })
const isHotel = (h: Hotel | undefined): h is Hotel => Boolean(h)

const app = Fastify({ logger: true })
await app.register(cors, { origin: true })

app.get('/health', async () => ({ ok: true, hotels: hotels.length, cities: destinations.length }))

// ---- Public: catalog ----
app.get(`${V}/cities`, async () => destinations)

app.get<{ Params: { slug: string } }>(`${V}/cities/:slug`, async (req, reply) => {
  const d = getDestination(req.params.slug)
  return d ?? reply.code(404).send({ code: 'not_found', message: 'city not found' })
})

app.get<{ Params: { slug: string } }>(`${V}/cities/:slug/hotels`, async (req) => {
  const d = getDestination(req.params.slug)
  return page(d ? hotelsByCity(d.city) : [])
})

app.get(`${V}/hotels`, async () => page(hotels))

app.get<{ Params: { slug: string } }>(`${V}/hotels/:slug`, async (req, reply) => {
  const h = getHotel(req.params.slug)
  return h ?? reply.code(404).send({ code: 'not_found', message: 'hotel not found' })
})

app.get<{ Params: { slug: string } }>(`${V}/hotels/:slug/similar`, async (req) => {
  const h = getHotel(req.params.slug)
  return h ? h.similarHotelSlugs.map(getHotel).filter(isHotel) : []
})

// ---- Public: AI recommend (same Recommendation shape as the on-device engine) ----
app.post<{ Body: { query?: string; limit?: number } }>(`${V}/recommend`, async (req) => {
  const { query = '', limit } = req.body ?? {}
  return recommend(String(query), hotels, limit)
})

// ---- Public: tracking + inquiries ----
app.post(`${V}/track`, async (req) => {
  app.log.info({ track: req.body }, 'click/impression')
  return { accepted: true }
})

app.post<{ Body: Record<string, unknown> }>(`${V}/inquiries`, async (req) => ({
  id: `iq_${Date.now()}`,
  status: 'New',
  ...(req.body ?? {}),
}))

// ---- Admin / back-office (auth omitted in scaffold — add RBAC before prod) ----
app.get(`${V}/admin/overview`, async () => ({ kpis: overviewKpis, clicksByCity }))
app.get(`${V}/admin/hotels`, async () => page(hotels))
app.get(`${V}/admin/partners`, async () => page(partners))
app.get(`${V}/admin/campaigns`, async () => page(campaigns))
app.get(`${V}/admin/inquiries`, async () => page(inquiries))

const port = Number(process.env.PORT ?? 8787)
app
  .listen({ port, host: '0.0.0.0' })
  .then(() => app.log.info(`StayEasy API on http://localhost:${port}${V}`))
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
