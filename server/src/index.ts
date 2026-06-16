import Fastify from 'fastify'
import cors from '@fastify/cors'

import { prisma, toDestination, toHotel } from './db'
import { recommend } from '../../src/lib/searchEngine'
import { partners, campaigns, inquiries, overviewKpis, clicksByCity } from '../../src/data/adminData'

const V = '/api/v1'
const page = <T>(items: T[]) => ({ items, page: 1, pageSize: items.length, total: items.length })

const app = Fastify({ logger: true })

// CORS: in production set CORS_ORIGIN to a comma-separated allowlist
// (e.g. "https://bstars00-rgb.github.io"); defaults to open for local dev.
const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()) : true
await app.register(cors, { origin: corsOrigin })

app.get('/health', async () => ({
  ok: true,
  hotels: await prisma.hotel.count(),
  cities: await prisma.city.count(),
}))

// ---- Public: catalog (DB-backed) ----
app.get(`${V}/cities`, async () => {
  const rows = await prisma.city.findMany({ orderBy: { name: 'asc' } })
  return rows.map(toDestination)
})

app.get<{ Params: { slug: string } }>(`${V}/cities/:slug`, async (req, reply) => {
  const row = await prisma.city.findUnique({ where: { slug: req.params.slug } })
  return row ? toDestination(row) : reply.code(404).send({ code: 'not_found', message: 'city not found' })
})

app.get<{ Params: { slug: string } }>(`${V}/cities/:slug/hotels`, async (req) => {
  const city = await prisma.city.findUnique({ where: { slug: req.params.slug } })
  if (!city) return page([])
  const rows = await prisma.hotel.findMany({ where: { cityId: city.id }, include: { city: true } })
  return page(rows.map(toHotel))
})

app.get(`${V}/hotels`, async () => {
  const rows = await prisma.hotel.findMany({ include: { city: true } })
  return page(rows.map(toHotel))
})

app.get<{ Params: { slug: string } }>(`${V}/hotels/:slug`, async (req, reply) => {
  const row = await prisma.hotel.findUnique({ where: { slug: req.params.slug }, include: { city: true } })
  return row ? toHotel(row) : reply.code(404).send({ code: 'not_found', message: 'hotel not found' })
})

app.get<{ Params: { slug: string } }>(`${V}/hotels/:slug/similar`, async (req) => {
  const row = await prisma.hotel.findUnique({ where: { slug: req.params.slug } })
  if (!row) return []
  const slugs: string[] = JSON.parse(row.similarSlugsJson)
  const rows = await prisma.hotel.findMany({ where: { slug: { in: slugs } }, include: { city: true } })
  return rows.map(toHotel)
})

// ---- Public: AI recommend (runs the shared engine over the DB catalogue) ----
app.post<{ Body: { query?: string; limit?: number } }>(`${V}/recommend`, async (req) => {
  const { query = '', limit } = req.body ?? {}
  const rows = await prisma.hotel.findMany({ include: { city: true } })
  return recommend(String(query), rows.map(toHotel), limit)
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

// ---- Admin / back-office (derived from the same catalogue; add RBAC before prod) ----
app.get(`${V}/admin/overview`, async () => ({ kpis: overviewKpis, clicksByCity }))
app.get(`${V}/admin/hotels`, async () => {
  const rows = await prisma.hotel.findMany({ include: { city: true } })
  return page(rows.map(toHotel))
})
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
