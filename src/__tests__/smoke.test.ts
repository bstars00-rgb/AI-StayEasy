import { describe, it, expect } from 'vitest'
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { I18nProvider } from '../i18n'
import { en } from '../i18n/locales/en'
import { ko } from '../i18n/locales/ko'
import { vi } from '../i18n/locales/vi'
import { zh } from '../i18n/locales/zh'
import { ja } from '../i18n/locales/ja'
import { hotels, getHotel } from '../data/hotels'
import { localizeHotel } from '../i18n'
import { recommend } from '../lib/searchEngine'
import { partners, campaigns, inquiries, overviewKpis, clicksByCity } from '../data/adminData'
import { endpoints, API_BASE } from '../api/contract'
import { repo } from '../data/repo'
import { wishlist } from '../lib/wishlist'

/** Collects the sorted set of key-paths (leaves = strings/arrays) of an object. */
function shapePaths(obj: unknown, prefix = ''): string[] {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .flatMap((k) => shapePaths((obj as Record<string, unknown>)[k], prefix ? `${prefix}.${k}` : k))
  }
  return [prefix]
}

describe('hotel data integrity', () => {
  it('has 24 hotels across 4 cities with unique ids and slugs', () => {
    expect(hotels).toHaveLength(24)
    expect(new Set(hotels.map((h) => h.id)).size).toBe(24)
    expect(new Set(hotels.map((h) => h.slug)).size).toBe(24)
    expect(hotels.filter((h) => h.city === 'Da Nang')).toHaveLength(12)
    expect(hotels.filter((h) => h.city === 'Ho Chi Minh City')).toHaveLength(4)
    expect(hotels.filter((h) => h.city === 'Nha Trang')).toHaveLength(4)
    expect(hotels.filter((h) => h.city === 'Phu Quoc')).toHaveLength(4)
  })

  it('every required field is populated', () => {
    for (const h of hotels) {
      expect(h.name.length).toBeGreaterThan(0)
      expect(h.officialWebsiteUrl).toMatch(/^https?:\/\//)
      expect(h.facilities.length).toBeGreaterThan(0)
      expect(h.bestFor.length).toBeGreaterThan(0)
      expect(h.officialBenefits.length).toBeGreaterThan(0)
      expect(h.cancellationChecklist.length).toBeGreaterThan(0)
    }
  })

  it('every similarHotelSlugs entry resolves to a real hotel', () => {
    for (const h of hotels) {
      for (const slug of h.similarHotelSlugs) {
        expect(getHotel(slug), `${h.slug} → ${slug}`).toBeDefined()
      }
    }
  })
})

describe('i18n locale parity', () => {
  const enPaths = shapePaths(en)
  const locales = { ko, vi, zh, ja }

  it('every locale exposes the exact same key structure as English', () => {
    for (const [name, loc] of Object.entries(locales)) {
      expect(shapePaths(loc), `locale "${name}" key structure`).toEqual(enPaths)
    }
  })

  it('every locale declares its own language name', () => {
    expect(new Set([en.langName, ko.langName, vi.langName, zh.langName, ja.langName]).size).toBe(5)
  })
})

describe('AI search engine', () => {
  it('detects intents from an English query and ranks matches with reasons', () => {
    const rec = recommend('family beach hotel with a kids pool', hotels)
    expect(rec.generic).toBe(false)
    expect(rec.detected).toEqual(expect.arrayContaining(['family', 'beach', 'kids', 'pool']))
    expect(rec.results.length).toBeGreaterThan(0)
    // top result should satisfy the core intent and carry reasons
    expect(rec.results[0].reasons.length).toBeGreaterThan(0)
    expect(rec.results[0].pct).toBeGreaterThan(0)
  })

  it('expands composite intents (honeymoon → couple + quiet + spa)', () => {
    const rec = recommend('a honeymoon resort', hotels)
    expect(rec.detected).toEqual(expect.arrayContaining(['couple', 'quiet', 'spa']))
  })

  it('understands queries in other languages (Korean)', () => {
    const rec = recommend('가족 해변 수영장 한국어', hotels)
    expect(rec.detected).toEqual(expect.arrayContaining(['family', 'beach', 'pool', 'korean']))
    expect(rec.results.length).toBeGreaterThan(0)
  })

  it('falls back to a generic list for an empty query', () => {
    const rec = recommend('', hotels)
    expect(rec.generic).toBe(true)
    expect(rec.results.length).toBeGreaterThan(0)
  })

  it('matches budget/luxury via price tier', () => {
    const cheap = recommend('cheap budget hotel', hotels)
    expect(cheap.detected).toContain('budget')
    expect(cheap.results[0].hotel.priceTier).toBe('budget')

    const lux = recommend('luxury 5-star resort', hotels)
    expect(lux.detected).toContain('luxury')
    expect(lux.results[0].hotel.priceTier).toBe('premium')
  })

  it('detects place-name intents (Hoi An)', () => {
    const rec = recommend('hotel near Hoi An', hotels)
    expect(rec.detected).toContain('hoian')
    expect(rec.results.every((r) => r.hotel.priceTier)).toBe(true)
  })
})

describe('back-office data', () => {
  it('derives partners with valid plans and statuses', () => {
    expect(partners.length).toBeGreaterThan(0)
    for (const p of partners) {
      expect(['Starter', 'Growth', 'Campaign']).toContain(p.plan)
      expect(['Active', 'Pending', 'Paused']).toContain(p.status)
    }
  })

  it('derives campaigns only from sponsored hotels', () => {
    const sponsored = hotels.filter((h) => h.isSponsored).length
    expect(sponsored).toBeGreaterThan(0)
    expect(campaigns).toHaveLength(sponsored)
  })

  it('populates overview KPIs and clicks-by-city', () => {
    expect(overviewKpis).toHaveLength(6)
    for (const k of overviewKpis) expect(k.value.length).toBeGreaterThan(0)
    expect(clicksByCity.length).toBeGreaterThan(0)
  })

  it('has inquiries with valid statuses', () => {
    expect(inquiries.length).toBeGreaterThan(0)
    for (const i of inquiries) expect(['New', 'Contacted', 'Won', 'Lost']).toContain(i.status)
  })
})

describe('page render smoke (initial render, no throw)', () => {
  const renderAt = (path: string) =>
    renderToString(h(I18nProvider, null, h(MemoryRouter, { initialEntries: [path] }, h(App))))

  const routes = [
    '/', '/search', '/wishlist', '/wishlist?ids=an-bang-beach-resort,son-tra-hillside-retreat',
    '/destinations/vietnam', '/destinations/da-nang',
    '/destinations/hanoi', '/hotels/an-bang-beach-resort', '/guides/direct-booking',
    '/partners', '/dashboard', '/admin', '/about', '/no-such-page',
  ]
  for (const path of routes) {
    it(`renders ${path}`, () => {
      expect(() => renderAt(path)).not.toThrow()
    })
  }
})

describe('async data repo (mock-backed)', () => {
  it('resolves the full catalogue and a single hotel', async () => {
    const all = await repo.allHotels()
    expect(all).toHaveLength(24)
    const h = await repo.getHotel('an-bang-beach-resort')
    expect(h?.slug).toBe('an-bang-beach-resort')
  })

  it('resolves destinations, city hotels, and recommendations', async () => {
    expect((await repo.listDestinations()).length).toBeGreaterThan(12)
    expect((await repo.listHotelsByCity('Da Nang'))).toHaveLength(12)
    const rec = await repo.recommend('family beach hotel with a pool')
    expect(rec.results.length).toBeGreaterThan(0)
  })
})

describe('wishlist store', () => {
  it('toggles, dedupes, removes, and clears', () => {
    wishlist.clear()
    expect(wishlist.get()).toEqual([])
    wishlist.toggle('an-bang-beach-resort')
    wishlist.toggle('son-tra-hillside-retreat')
    expect(wishlist.has('an-bang-beach-resort')).toBe(true)
    expect(wishlist.get()).toHaveLength(2)
    wishlist.toggle('an-bang-beach-resort') // toggle off
    expect(wishlist.has('an-bang-beach-resort')).toBe(false)
    wishlist.remove('son-tra-hillside-retreat')
    expect(wishlist.get()).toEqual([])
  })
})

describe('API contract', () => {
  it('builds versioned endpoint paths', () => {
    expect(API_BASE).toBe('/api/v1')
    expect(endpoints.hotel('an-bang-beach-resort')).toBe('/api/v1/hotels/an-bang-beach-resort')
    expect(endpoints.cityHotels('da-nang')).toBe('/api/v1/cities/da-nang/hotels')
  })
})

describe('hotel localization', () => {
  it('returns the canonical record for English', () => {
    expect(localizeHotel(hotels[0], 'en')).toBe(hotels[0])
  })

  it('returns a usable localized record for other languages', () => {
    const h = localizeHotel(hotels[0], 'ko')
    expect(typeof h.shortDescription).toBe('string')
    expect(h.shortDescription.length).toBeGreaterThan(0)
    expect(h.slug).toBe(hotels[0].slug)
  })
})
