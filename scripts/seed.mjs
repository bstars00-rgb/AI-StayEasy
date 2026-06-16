// @ts-nocheck
/**
 * DB SEED TEMPLATE (design sketch) — runs on the *backend* side.
 *
 * Converts the prototype's bundled mock catalogue into relational rows:
 *   - City / Area
 *   - Hotel  (+ facilities, tags join rows)
 *   - HotelContent (one row per locale: en + ko/vi/zh/ja)
 *
 * It is intentionally NOT wired to a DB here (this is the web repo). In the
 * backend repo: `npm i -D tsx prisma` then `tsx scripts/seed.mjs` after pointing
 * the imports at the shared `packages/core` data, and replace the `emit()` stub
 * with Prisma `createMany`/`upsert`. See docs/BACKEND_PLAN.md §9.
 *
 * Run locally to preview the seed shape:
 *   npx tsx scripts/seed.mjs   # writes scripts/seed.preview.json
 */
import { writeFileSync } from 'node:fs'

// In the backend, import from the shared core package instead:
//   import { hotels } from '@stayeasy/core/data/hotels'
//   import { destinations } from '@stayeasy/core/data/destinations'
//   import { ko } from '@stayeasy/core/i18n/hotelContent/ko'  ... (vi, zh, ja)
import { hotels } from '../src/data/hotels.ts'
import { destinations } from '../src/data/destinations.ts'
import { ko } from '../src/i18n/hotelContent/ko.ts'
import { vi } from '../src/i18n/hotelContent/vi.ts'
import { zh } from '../src/i18n/hotelContent/zh.ts'
import { ja } from '../src/i18n/hotelContent/ja.ts'

const localeMaps = { ko, vi, zh, ja }
const LOCALES = ['en', 'ko', 'vi', 'zh', 'ja']

// Fields that make up a HotelContent row (translatable text).
const CONTENT_FIELDS = [
  'shortDescription', 'positioningLine', 'bestFor', 'notIdealFor', 'mainReason',
  'thingsToCheck', 'officialBenefits', 'roomGuide', 'locationGuide', 'cancellationChecklist',
]

function pickContent(src) {
  return Object.fromEntries(CONTENT_FIELDS.map((f) => [f, src[f]]))
}

function build() {
  const cities = destinations.map((d) => ({
    id: d.slug,
    slug: d.slug,
    name: d.city,
    available: d.available,
    heroColor: d.heroColor,
    emoji: d.emoji,
  }))

  // Unique (city, area) pairs from the catalogue.
  const areaSet = new Map()
  for (const h of hotels) areaSet.set(`${h.city}::${h.area}`, { city: h.city, key: h.area })
  const areas = [...areaSet.values()].map((a, i) => ({ id: `area_${i + 1}`, cityName: a.city, key: a.key }))

  const hotelRows = []
  const facilityRows = []
  const tagRows = []
  const contentRows = []

  for (const h of hotels) {
    hotelRows.push({
      id: h.id,
      slug: h.slug,
      cityName: h.city,
      area: h.area,
      hotelType: h.hotelType,
      priceTier: h.priceTier,
      isSponsored: h.isSponsored,
      koreanFriendly: h.koreanFriendly,
      officialWebsiteUrl: h.officialWebsiteUrl,
      imageUrl: h.imageUrl,
      heroColor: h.heroColor,
      emoji: h.emoji,
      status: 'published',
      similarHotelSlugs: h.similarHotelSlugs,
    })
    for (const f of h.facilities) facilityRows.push({ hotelId: h.id, key: f })
    for (const tag of h.tags) tagRows.push({ hotelId: h.id, key: tag })

    // en content lives on the canonical hotel record; others in the locale maps.
    contentRows.push({ hotelId: h.id, locale: 'en', ...pickContent(h) })
    for (const loc of ['ko', 'vi', 'zh', 'ja']) {
      const tx = localeMaps[loc][h.id]
      if (tx) contentRows.push({ hotelId: h.id, locale: loc, ...tx })
    }
  }

  return { cities, areas, hotels: hotelRows, facilities: facilityRows, tags: tagRows, content: contentRows }
}

function emit(seed) {
  // BACKEND: replace this with Prisma, e.g.
  //   await prisma.city.createMany({ data: seed.cities, skipDuplicates: true })
  //   await prisma.hotel.createMany({ data: seed.hotels })
  //   await prisma.hotelContent.createMany({ data: seed.content })
  //   ...facilities / tags join tables
  const counts = Object.fromEntries(Object.entries(seed).map(([k, v]) => [k, v.length]))
  writeFileSync(new URL('./seed.preview.json', import.meta.url), JSON.stringify(seed, null, 2))
  console.log('Seed preview written. Row counts:', counts)
  console.log(`Locales per hotel: up to ${LOCALES.length} (en + ko/vi/zh/ja, en-fallback for gaps).`)
}

emit(build())
