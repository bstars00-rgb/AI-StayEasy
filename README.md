# StayEasy Vietnam 🏨🇻🇳

> **StayEasy helps travelers choose better hotels and book directly with hotels.**
> Compare Vietnam hotels through clear content and official booking benefits — then book on each hotel's official website.

StayEasy Vietnam is a **direct-booking content & support platform**. It is **not an OTA**: it does not process bookings or take payment, and it never charges hotels a booking commission. Every hotel detail page guides travelers to the hotel's **official website** with a clear **"Book on Official Website"** call to action.

> ⚠️ **StayEasy does not process hotel reservations or payments. Final booking is completed through each hotel's official website.**

This repository is a working **MVP frontend prototype** built with React + Vite + TypeScript + Tailwind CSS. All hotel data is mocked locally — there is no backend, no payment, and no real booking engine.

---

## 💡 Concept & business model

- **Position:** a trustworthy hotel content & comparison platform that helps travelers understand hotels and book **directly** with them. It does **not** compete head-on with OTAs — it complements them.
- **What it is _not_:** Agoda / Booking.com / Expedia. We don't sell rooms or hold reservations.
- **Revenue = advertising, content & exposure — never commission:**
  1. Free hotel listing
  2. Paid official-booking guide pages
  3. Premium content production
  4. Featured (top) hotel placement
  5. Official-booking click advertising (CPC)
  6. Seasonal campaign advertising
- **Transparency:** any paid placement is clearly labeled **"Sponsored"**.
- **Market:** Vietnam hotels — launching in **Da Nang**, then Ho Chi Minh City, Nha Trang, and Phu Quoc.
- **Audience:** Korean, English-speaking, and international travelers planning a Vietnam trip.

The product focus is **trust and suitability** (not lowest price): official-website benefits, family/couple/business/beach/long-stay fit, location, room guide, cancellation policy, breakfast, pool, and practical travel info.

---

## 🧭 Pages & routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Home** | Hero, **AI hotel search**, featured destinations, featured hotels, "StayEasy is not an OTA" explainer |
| `/search` | **AI Search** | Natural-language hotel recommender — describe your trip in any language, get ranked matches with reasons |
| `/destinations/vietnam` | **Vietnam overview** | Destination cards, travel-style guide, balanced direct-booking explanation |
| `/destinations/da-nang` | **Da Nang hotel list** | Filter bar (Area / Travel type / Features / Official benefits) + suitability-first cards + "how to choose" |
| `/hotels/:slug` | **Hotel detail** | StayEasy summary, official benefits, room guide, location guide, facilities, cancellation checklist, prominent **Book on Official Website** CTA, similar hotels, disclaimer |
| `/guides/direct-booking` | **Direct booking guide** | Neutral OTA-vs-direct comparison table, when each is better, pre-booking checklist |
| `/partners` | **Hotel partner page** | Value prop, 6 products, plans (Starter / Growth / Campaign), sample report, mock contact form |
| `/dashboard` | **Mock hotel dashboard** | Partner-facing: period selector, KPI cards, traffic & traveler charts, content table, recommendations |
| `/admin` | **Back-office (operator console)** | Sidebar shell with Overview / Hotels / Partners / Campaigns / Inquiries — its own chrome, mock data |
| `/about` | **About** | Position + business model summary |

**Destinations live:** Da Nang (12), Ho Chi Minh City (4), Nha Trang (4), Phu Quoc (4) — 24 sample hotels across 4 cities, via a city-parameterized list route `/destinations/:citySlug`.

> Legacy routes (`/da-nang`, `/vietnam`, `/booking-guide`, `/hotel/:slug`) redirect to their new paths. `vercel.json` adds a SPA rewrite so deep links resolve on refresh.

---

## 🛠️ Tech stack

- **React 18** + **TypeScript** (strict)
- **Vite 5** (dev server & build)
- **Tailwind CSS 3** (mobile-first design system)
- **React Router 6** (client-side routing)
- **Vitest** smoke tests (data integrity, locale parity, AI search, hotel localization)
- Local **mock data** in `src/data/` — **12 sample Da Nang hotels**, no backend, no API, no payment

### 🌐 Languages (i18n)
Full UI + hotel content in **5 languages** — English, 한국어, Tiếng Việt, 中文, 日本語 — with a navbar language switcher, `localStorage` persistence, `<html lang>` sync, and per-page localized SEO/OG meta. Source in `src/i18n/` (`locales/*` for UI, `hotelContent/*` for hotel text).

### 🤖 AI hotel search
A natural-language recommender (`src/lib/searchEngine.ts`) that runs **entirely on-device** — no backend, no API key. It parses a free-text request in any of the 5 languages into weighted intent signals, scores each hotel, and ranks results with human-readable reasons. The same interface can later be backed by a real LLM via a serverless proxy.

### Reusable components (`src/components/`)
`Button` · `HotelCard` · `HotelImage` · `SponsoredBadge` · `Facilities` · `AISearch` · `LanguageSwitcher` · `ErrorBoundary` · `Navbar` · `Footer` · `Layout` · `SectionHeading` · `TrustStrip`

> Hotel images use placeholder photos with a branded gradient + emoji fallback, so the prototype still renders cleanly offline if an image fails to load.

---

## 🚀 Getting started (local)

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
# open the printed URL (default http://localhost:5173)

# 3. Type-check (no emit)
npm run lint

# 4. Production build + local preview
npm run build
npm run preview
```

### Scripts

| Command | What it does |
|---------|--------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | TypeScript type-check only (`tsc --noEmit`) |

### Project structure

```
stayeasy-vietnam/
├─ index.html
├─ vite.config.ts
├─ tailwind.config.js
├─ vercel.json
├─ public/favicon.svg
└─ src/
   ├─ main.tsx              # app entry + router
   ├─ App.tsx               # routes + legacy redirects
   ├─ index.css             # Tailwind layers + component classes
   ├─ types/index.ts        # Hotel / Destination / TravelStyle types
   ├─ data/                 # hotels (12), destinations, travel styles
   ├─ lib/facilities.ts     # facility → icon helper
   ├─ components/           # reusable UI
   └─ pages/                # Home, Vietnam, list, detail, guide, partners, dashboard, about, 404
```

---

## ☁️ Deploy to GitHub + Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "StayEasy Vietnam MVP prototype"
git branch -M main
git remote add origin https://github.com/<your-username>/stayeasy-vietnam.git
git push -u origin main
```

### 2. Deploy on Vercel

**Option A — Dashboard (recommended)**
1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repo.
2. Vercel auto-detects **Vite**. Defaults are correct:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. Click **Deploy**. Every push to `main` redeploys automatically.

**Option B — Vercel CLI**
```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

The included [`vercel.json`](./vercel.json) sets the Vite framework and adds a SPA rewrite so deep links like `/hotels/an-bang-beach-resort` resolve correctly on refresh.

---

## 🐙 Deploy to GitHub Pages (GitHub Actions)

This repo includes a Pages workflow at [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

1. In the repo, go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
2. Push to `main`. The workflow builds with the Pages base path and publishes automatically.
3. The site goes live at **https://bstars00-rgb.github.io/AI-StayEasy/**.

Notes:
- The build sets `GITHUB_PAGES=true`, which makes Vite use `base: '/AI-StayEasy/'` and React Router use the matching `basename`. Local dev and Vercel keep `base: '/'`.
- `vite.config.ts` copies `index.html` → `404.html` so client-side routes resolve on a hard refresh (GitHub Pages SPA fallback).
- If you fork/rename the repo, update the `base` path in `vite.config.ts` to match the new repo name.

---

## ⚠️ Prototype disclaimer

This is a demonstration prototype. Hotels, official-website URLs, benefits, dashboard analytics, and the partner contact form are **all fictional sample data** (hotel names are suffixed "(Sample)"). No real bookings, payments, or data submissions occur.

**StayEasy does not process hotel reservations or payments. Final booking is completed through each hotel's official website.**

---

## 📱 Mobile app concept

A mobile app concept (positioning, features, IA, AI strategy, tech stack with web-code reuse, MVP roadmap) is drafted in **[docs/APP_CONCEPT.md](docs/APP_CONCEPT.md)**. Recommended approach: React Native + Expo sharing a `packages/core` (data, types, i18n, search engine, design tokens) with this web app.

## 🗺️ Roadmap ideas

- Korean / English language toggle (i18n)
- Real hotel imagery & CMS-driven content
- Additional cities (HCMC, Nha Trang, Phu Quoc)
- Map view & geo-filtering
- Partner self-serve onboarding & billing
- Real analytics pipeline for the hotel dashboard
