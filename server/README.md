# StayEasy Vietnam — Backend

A **Fastify + Prisma** API implementing [`../src/api/contract.ts`](../src/api/contract.ts).
The catalogue (cities, hotels) is **database-backed**; the search engine and admin
aggregates reuse the prototype's shared, framework-free modules (`../src/lib`, `../src/data`).

- **Local dev:** SQLite (zero setup) — seeded from the shared mock catalogue.
- **Production:** switch `provider` to PostgreSQL (one line) — see below.

> Architecture: [`../docs/BACKEND_PLAN.md`](../docs/BACKEND_PLAN.md). Contract: [`../src/api/contract.ts`](../src/api/contract.ts).

## Run locally

```bash
cd server
npm install
npm run db:setup     # prisma generate + db push + seed (creates prisma/dev.db)
npm run dev          # http://localhost:8787/api/v1   (GET /health)
```

## Connect the frontend

```bash
# in the repo root
echo "VITE_API_URL=http://localhost:8787" > .env.local
npm run dev          # src/data/repo.ts auto-selects apiRepo when VITE_API_URL is set
```

## Endpoints

| Method | Path | Source |
|---|---|---|
| GET | `/health` | DB counts |
| GET | `/api/v1/cities` · `/cities/:slug` · `/cities/:slug/hotels` | **DB** |
| GET | `/api/v1/hotels` · `/hotels/:slug` · `/hotels/:slug/similar` | **DB** |
| POST | `/api/v1/recommend` | engine over **DB** rows |
| POST | `/api/v1/track` · `/inquiries` | accept/log |
| GET | `/api/v1/admin/{overview,hotels,partners,campaigns,inquiries}` | DB + derived |

> Hotel responses are canonical (English); the frontend applies i18n client-side.
> Per-locale content serving (`HotelContent` table) is the next DB step.

## Move to PostgreSQL

1. `prisma/schema.prisma` → `provider = "postgresql"`
2. `DATABASE_URL` → your managed Postgres URL (see `.env.example`)
3. `npm run db:setup` (or `prisma migrate deploy` + `npm run db:seed`)

## Deploy

- **Docker:** `docker build -f server/Dockerfile -t stayeasy-api .` (build from repo root).
- **Render:** push to GitHub → New → Blueprint → pick this repo ([`../render.yaml`](../render.yaml) provisions the web service + Postgres). Set `CORS_ORIGIN` to your frontend origin, then point the frontend's `VITE_API_URL` at the deployed URL.

## TODO before production
- Auth + RBAC (operator/admin/partner) on `/admin` and `/partner`
- Prisma **migrations** (replace `db push`), `HotelContent` per-locale table
- Click-event persistence for CPC, rate limiting
