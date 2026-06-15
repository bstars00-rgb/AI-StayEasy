import { describe, it, expect } from 'vitest'
import { en } from '../i18n/locales/en'
import { ko } from '../i18n/locales/ko'
import { vi } from '../i18n/locales/vi'
import { zh } from '../i18n/locales/zh'
import { ja } from '../i18n/locales/ja'
import { hotels, getHotel } from '../data/hotels'
import { localizeHotel } from '../i18n'
import { recommend } from '../lib/searchEngine'

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
  it('has 16 hotels (Da Nang + Ho Chi Minh City) with unique ids and slugs', () => {
    expect(hotels).toHaveLength(16)
    expect(new Set(hotels.map((h) => h.id)).size).toBe(16)
    expect(new Set(hotels.map((h) => h.slug)).size).toBe(16)
    expect(hotels.filter((h) => h.city === 'Da Nang')).toHaveLength(12)
    expect(hotels.filter((h) => h.city === 'Ho Chi Minh City')).toHaveLength(4)
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
