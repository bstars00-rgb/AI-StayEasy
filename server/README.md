# StayEasy Vietnam — Backend scaffold

A runnable **Fastify** server implementing [`../src/api/contract.ts`](../src/api/contract.ts).
It reuses the prototype's shared, framework-free catalogue (`../src/data/*`) and search
engine (`../src/lib/searchEngine.ts`) as an **in-memory** data source — no DB required to run.

> This is the contract-first scaffold. Graduating to PostgreSQL: run the seed
> (`scripts/seed.mjs`) into Prisma and swap the data imports in `src/index.ts`
> for queries. Response shapes already match the contract, so the frontend
> doesn't change. See [`../docs/BACKEND_PLAN.md`](../docs/BACKEND_PLAN.md).

## Run

```bash
cd server
npm install
npm run dev          # http://localhost:8787/api/v1
```

## Connect the frontend

```bash
# in the repo root
echo "VITE_API_URL=http://localhost:8787" > .env.local
npm run dev          # the app now reads from the API instead of bundled mocks
```

(`src/data/repo.ts` selects `apiRepo` automatically when `VITE_API_URL` is set.)

## Endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | liveness |
| GET | `/api/v1/cities` | destinations |
| GET | `/api/v1/cities/:slug` | one destination |
| GET | `/api/v1/cities/:slug/hotels` | hotels in a city (paginated) |
| GET | `/api/v1/hotels` | all hotels (paginated) |
| GET | `/api/v1/hotels/:slug` | hotel detail (canonical; client applies i18n) |
| GET | `/api/v1/hotels/:slug/similar` | similar hotels |
| POST | `/api/v1/recommend` | `{ query, limit? }` → ranked `Recommendation` |
| POST | `/api/v1/track` | click/impression event (logged) |
| POST | `/api/v1/inquiries` | partner lead |
| GET | `/api/v1/admin/overview` | KPIs + clicks-by-city |
| GET | `/api/v1/admin/{hotels,partners,campaigns,inquiries}` | back-office tables |

## TODO before production
- Auth + RBAC (operator/admin/partner) on `/admin` and `/partner`
- PostgreSQL + Prisma (replace in-memory imports)
- Per-locale content serving, rate limiting, click-event persistence for CPC
