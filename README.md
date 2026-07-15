# StayEasy Vietnam 🏨🇻🇳

> **StayEasy helps travelers choose better hotels and book directly with each hotel.**
> Compare Vietnam hotels through clear content and official-booking benefits — then book on the hotel's own official website.

StayEasy Vietnam is a **Direct Booking Platform (DBP)** — a hotel content & guide site, **not an OTA**. It never processes bookings, takes payment, or charges hotels a booking commission. Every hotel detail page routes the traveler to the hotel's **official website** with a clear **"Book on Official Website"** call to action.

> ⚠️ **StayEasy does not process hotel reservations or payments. Final booking is completed on each hotel's official website.**

This repository is the **frontend web app** (React + Vite + TypeScript + Tailwind). Hotel content is served from a local catalogue (no live backend required); a parked Fastify + Prisma backend scaffold lives in [`server/`](./server).

**Live:** https://bstars00-rgb.github.io/AI-StayEasy/

---

## 🚦 Current state (2026-07)

- **Launch-first strategy is content, not revenue.** The site currently runs as a pure audience/content product. **All monetization surfaces are hidden behind a single switch** (`VITE_ENABLE_BM`, off by default) — see [Business model](#-business-model-gated-off-by-default).
- **40 hotels across 6 cities.** **Da Nang (20) are real, verified listings** (data checked against each hotel's official website). The other cities' listings are being converted from sample to real the same way.
- **5 languages**, PWA-installable, SEO pre-rendered, GA4-instrumented, interactive maps.

---

## ✨ Features

- **AI hotel search** — describe your trip in natural language (any of the 5 languages); an **on-device** rule-based engine ranks hotels with human-readable reasons. No backend, no API key.
- **Suitability-first hotel cards & detail** — who it's for, official-booking benefit, room/location guides, cancellation checklist, similar hotels.
- **StayEasy Distinction** — a scarce, Michelin-style editorial mark (*Choice* = one per city; *Recommended* = a select few). Most hotels carry no mark — that scarcity is the point. Official **star ratings (3–5★)** show next to the hotel name.
- **At-a-glance amenity grid** — structured amenities as minimal line icons.
- **Property-type filter** — Resort / Beach hotel / Boutique / Apartment / Hostel / B&B / … per city.
- **Maps** — interactive Leaflet/OpenStreetMap on the detail page (single hotel) and a List/Map toggle on city lists. *(Coordinates are approximate — area centre + jitter — pending real GPS.)*
- **Hotel community** — a members-only per-hotel discussion thread; signed-out visitors see a gate that lets them create an account. Mock auth + storage (localStorage).
- **Wishlist** — save hotels (localStorage), navbar count badge.
- **Partner area** — hotel partner landing + a report-grade analytics **portal** (`/dashboard`) with benchmark, listing-completeness score and action cards.
- **Back-office** (`/admin`) — operator console (overview, hotels, partners, campaigns, inquiries, media, marketing banner).
- **i18n** — full UI + hotel content in **English, 한국어, Tiếng Việt, 中文, 日本語**, with a language switcher, `<html lang>` sync and per-page localized SEO/OG meta.
- **PWA** — installable (manifest + service worker), mobile-responsive.
- **SEO** — per-route pre-rendered HTML (200-indexable), sitemap, robots, OG images, JSON-LD.

---

## 💰 Business model (gated off by default)

Revenue is **advertising / content / sponsorship — never commission**. All of it is hidden behind `VITE_ENABLE_BM` (see [`src/lib/bm.ts`](./src/lib/bm.ts)) so the site can grow an audience first:

- discount vouchers (consumer), display ads (AdSense), "Sponsored" placement, and the consumer member sign-in are all hidden while the switch is off;
- the partner **pricing tiers** (Starter / Growth / Campaign) and paid-product menu are hidden too.

Set `VITE_ENABLE_BM=true` to bring the whole business model back. **Never set it in the deployed environment** until monetization is intended.

---

## 🧭 Key routes

| Route | Page |
|-------|------|
| `/` | Home — photo hero, AI search, featured destinations & hotels |
| `/destinations/vietnam` | Vietnam overview (destination cards + Asia map) |
| `/destinations/:citySlug` | City hotel list — filters (area / travel type / property type / features) + **List/Map toggle** |
| `/hotels/:slug` | Hotel detail — summary, official benefits, amenity grid, room/location guides, **map**, **community**, Book-on-Official CTA |
| `/guides/:slug`, `/guides` | Direct-booking & travel guides |
| `/partners` | Hotel partner landing |
| `/dashboard` · `/partner/*` | Partner portal + listing editor (member) |
| `/admin`, `/admin/hotels/:slug/edit` | Operator back-office |
| `/about` · legal pages | Positioning + legal |

---

## 🛠️ Tech stack

- **React 18.3** + **TypeScript** (strict) · **Vite 5** · **Tailwind CSS 3** · **React Router 6**
- **Leaflet 1.9 / OpenStreetMap** (maps, lazy-loaded) · **Vitest** (smoke + render tests)
- Local **catalogue** in `src/data/` (40 hotels) + a `repo` abstraction; parked **Fastify + Prisma (SQLite)** backend in `server/`

---

## 🚀 Getting started (local)

**Prerequisites:** Node.js 18+ and npm.

```bash
npm install
npm run dev        # Vite dev server (http://localhost:5173)
npm run lint       # TypeScript type-check (tsc --noEmit)
npm test           # Vitest
npm run build      # tsc -b + vite build + SEO asset generation (sitemap/og/icons/static-routes)
npm run preview    # serve the production build

# GitHub Pages build (sets base '/AI-StayEasy/' + basename):
GITHUB_PAGES=true npm run build
```

### Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check, build to `dist/`, then generate sitemap / OG image / PWA icons / pre-rendered routes |
| `npm run preview` | Serve the production build |
| `npm run lint` | TypeScript type-check only |
| `npm test` | Run the Vitest suite |

---

## ⚙️ Environment variables

Every feature below is **off / no-op until its variable is set** (`.env` is gitignored; see [`.env.example`](./.env.example) for the full template). **Do not commit real values.**

| Variable | Purpose |
|---|---|
| `VITE_ENABLE_BM` | Business-model master switch (vouchers, ads, sponsored, member sign-in, pricing). **Off by default — keep off in production.** |
| `VITE_GA_ID` | Google Analytics 4 measurement ID (SPA page_view + intent events) |
| `VITE_GOOGLE_CLIENT_ID` | Google sign-in (real OAuth instead of the demo identity) — *not yet set* |
| `VITE_ADSENSE_CLIENT` | AdSense publisher ID (ads render only when set + BM on) |
| `VITE_API_URL` | Backend base URL — when set, the repo layer can read from the API instead of the in-browser catalogue |
| `VITE_CONTACT_EMAIL` | Public contact address for legal/footer |
| `SITE_URL`, `GITHUB_PAGES` | Build-time: canonical URL + Pages base path |
| `DATABASE_URL` | `server/` only (Prisma) |

---

## 📁 Project structure

```
AI-StayEasy/
├─ index.html                 # includes the Search Console verification meta
├─ .github/workflows/deploy.yml  # GitHub Pages auto-deploy on push to main
├─ public/                    # favicon, PWA manifest, sw.js, og-image
├─ scripts/                   # gen-sitemap / gen-og / gen-icons / gen-static-routes (.mjs)
├─ docs/                      # planning docs (backend, partner portal, app concept, adsense, search console)
├─ server/                    # parked Fastify + Prisma backend scaffold (SQLite, unbuilt/undeployed)
└─ src/
   ├─ main.tsx / App.tsx      # entry + routes
   ├─ data/                   # hotels.ts (40-hotel catalogue) + repo abstraction
   ├─ i18n/                   # locales/* (UI) + hotelContent/* (hotel text, keyed by hotel id)
   ├─ lib/                    # bm, distinction, propertyType, geo, community, analytics, searchEngine, partnerAuth …
   ├─ components/             # reusable UI (+ admin/)
   └─ pages/                  # Home, list, detail, guides, partners, portal, admin, about, legal, 404
```

---

## ☁️ Deploy

### GitHub Pages (primary)
CI at [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) builds and publishes on every push to `main`.
1. Repo → **Settings → Pages → Source → GitHub Actions**.
2. Push to `main` → live at **https://bstars00-rgb.github.io/AI-StayEasy/**.
3. The build sets `GITHUB_PAGES=true` (Vite `base: '/AI-StayEasy/'` + Router `basename`) and injects the GA4 id. `404.html` provides the SPA fallback.
4. **If you fork/rename or transfer the repo, the Pages URL changes** — update the base path and re-verify Search Console / GA4 (see below).

### Vercel (alternative)
[`vercel.json`](./vercel.json) sets the Vite framework + SPA rewrite; `render.yaml` is a parked option for the backend. Vercel keeps `base: '/'`.

---

## 🔗 External services & account dependencies

| Service | Use | Dependency |
|---|---|---|
| GitHub repo + Pages | source + hosting | repo `bstars00-rgb/AI-StayEasy` — **owned by a personal account**; transferring changes the Pages URL |
| Google Analytics 4 | traffic + intent events | property owned by the creating Google account |
| Google Search Console | indexing | verified via `index.html` meta tag |
| OpenStreetMap | map tiles | no account |
| Google OAuth / AdSense | sign-in / ads | not yet configured (BM roadmap) |

---

## ⚠️ Notes & disclaimers

- **Da Nang (20) hotels are real, verified listings** (data checked against official sites). Hotels in the other five cities are being converted from sample to real; until then their URLs/benefits may be placeholder.
- **No real bookings or payments occur here** — StayEasy always routes to the hotel's official website.
- Community posts, wishlist, partner accounts and guest sign-in are **localStorage demo data** (this browser only; no server).
- The `server/` backend is an **unbuilt scaffold** — not deployed.

---

## 🗺️ Roadmap

- Convert the remaining cities (HCMC / Nha Trang / Phu Quoc / Hoi An / Hanoi) to real verified hotels ✅ *(in progress)*
- Real per-hotel GPS coordinates for maps
- Real Google OAuth sign-in (`VITE_GOOGLE_CLIENT_ID`)
- Community real backend + deploy `server/` (SQLite → PostgreSQL) + switch to `VITE_API_URL`
- Search Console data → partner portal (server-side)
- Partner self-serve onboarding & billing (when BM is turned on)

A mobile-app concept (React Native + Expo sharing a `packages/core`) is drafted in [`docs/APP_CONCEPT.md`](docs/APP_CONCEPT.md).
