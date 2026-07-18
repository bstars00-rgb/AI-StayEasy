import type { Hotel } from '../types'
import type { PartnerSearchInsightsResponse, SearchQueryRow } from '../api/contract'
import { endpoints } from '../api/contract'

/**
 * "How travelers find you on Google" — per-hotel Google Search Console data
 * shown in the partner portal.
 *
 * In production a backend (server/) calls the Search Console Search Analytics
 * API with a service account, filtered to this hotel's page URL, and returns
 * the shape below. Until that's wired we synthesize realistic demo data,
 * deterministically from the hotel so the panel is stable and reviewable.
 * Set VITE_API_URL to switch the whole app to the real backend.
 */
const apiUrl = import.meta.env.VITE_API_URL as string | undefined

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/** Plausible Google search terms a traveler would use to reach this hotel. */
function mockQueries(hotel: Hotel): string[] {
  const name = hotel.name.toLowerCase()
  const city = hotel.city.toLowerCase()
  const tagTerm: Record<string, string> = {
    Family: 'family resort',
    Couple: 'romantic hotel',
    Business: 'business hotel',
    Beach: 'beachfront hotel',
    'Long Stay': 'serviced apartment',
    'Korean-friendly': 'korean friendly hotel',
  }
  const tags = hotel.tags.map((t) => tagTerm[t]).filter(Boolean)
  const out = [
    name, // brand search
    `${name} official site`,
    `${city} ${tags[0] ?? 'hotel'}`,
    `best ${tags[0] ?? 'hotels'} in ${city}`,
    `${city} ${tags[1] ?? 'hotel'} deals`,
    `${name} booking`,
    hotel.koreanFriendly ? `${city} 호텔 추천` : `${city} hotels near beach`,
    `${city} ${hotel.hotelType.toLowerCase()}`,
  ]
  // De-dupe while preserving order.
  return [...new Set(out)].slice(0, 7)
}

function mockInsights(hotel: Hotel): PartnerSearchInsightsResponse {
  const rangeDays = 28
  const queries = mockQueries(hotel)
  const rows: SearchQueryRow[] = queries.map((query, i) => {
    const h = hash(`${hotel.slug}:${query}`)
    // Brand/early terms get more impressions; deeper terms taper off.
    const impressions = Math.max(8, Math.round((1200 / (i + 1.4)) * (0.6 + (h % 80) / 100)))
    const ctr = Math.min(0.42, 0.04 + ((h >>> 3) % 30) / 100 + (i === 0 ? 0.12 : 0))
    const clicks = Math.max(0, Math.round(impressions * ctr))
    const position = Math.round((1.5 + i * 1.3 + ((h >>> 5) % 25) / 10) * 10) / 10
    return { query, clicks, impressions, ctr: Math.round(ctr * 1000) / 1000, position }
  })
  const totalClicks = rows.reduce((n, r) => n + r.clicks, 0)
  const totalImpr = rows.reduce((n, r) => n + r.impressions, 0)
  return {
    slug: hotel.slug,
    rangeDays,
    totals: {
      clicks: totalClicks,
      impressions: totalImpr,
      ctr: totalImpr ? Math.round((totalClicks / totalImpr) * 1000) / 1000 : 0,
      position: rows.length ? Math.round((rows.reduce((n, r) => n + r.position, 0) / rows.length) * 10) / 10 : 0,
    },
    topQueries: rows.sort((a, b) => b.clicks - a.clicks),
    source: 'mock',
  }
}

export async function getSearchInsights(slug: string, hotel?: Hotel): Promise<PartnerSearchInsightsResponse> {
  if (apiUrl) {
    const res = await fetch(`${apiUrl}${endpoints.partnerSearchInsights(slug)}`, { credentials: 'include' })
    if (!res.ok) throw new Error(`search-insights ${res.status}`)
    return (await res.json()) as PartnerSearchInsightsResponse
  }
  if (!hotel) throw new Error('mock search-insights needs the hotel record')
  return mockInsights(hotel)
}
