import { describe, it, expect } from 'vitest'
import { hotels } from '../data/hotels'
import { ATTRACTIONS } from '../data/attractions'
import { COORDS } from '../lib/geo'
import { haversineKm, nearbyAttractions, formatDistance, mapsLink } from '../lib/nearby'
import { nearbyStrings } from '../lib/nearbyI18n'
import type { Lang } from '../i18n'

const LANGS: Lang[] = ['en', 'ko', 'vi', 'zh', 'ja']

describe('haversineKm', () => {
  it('measures one degree of longitude on the equator as ~111 km', () => {
    expect(haversineKm([0, 0], [0, 1])).toBeCloseTo(111.19, 1)
  })
  it('is zero for the same point and symmetric', () => {
    expect(haversineKm([16.05, 108.2], [16.05, 108.2])).toBe(0)
    const a = haversineKm([16.05, 108.2], [16.1, 108.3])
    expect(haversineKm([16.1, 108.3], [16.05, 108.2])).toBeCloseTo(a, 9)
  })
})

describe('nearbyAttractions — checked against the catalogue, not a sample', () => {
  it('every hotel gets its own city’s places, nearest first', () => {
    for (const h of hotels) {
      const { items } = nearbyAttractions(h, 'en')
      expect(items.length, `${h.slug} has no attractions in ${h.city}`).toBeGreaterThan(0)
      for (const p of items) {
        expect(ATTRACTIONS.find((a) => a.id === p.id)?.city, `${h.slug} lists ${p.id} from another city`).toBe(h.city)
      }
      for (let i = 1; i < items.length; i++) {
        expect(items[i].km, `${h.slug} is not sorted nearest-first`).toBeGreaterThanOrEqual(items[i - 1].km)
      }
    }
  })

  it('keeps every distance inside a plausible same-city range (catches swapped lat/lng or a wrong city)', () => {
    for (const h of hotels) {
      for (const p of nearbyAttractions(h, 'en').items) {
        expect(p.km, `${h.slug} → ${p.id} = ${p.km.toFixed(0)} km`).toBeLessThan(70)
      }
    }
  })

  it('flags an unconfirmed pin exactly when the hotel has no street-level coordinates', () => {
    for (const h of hotels) {
      expect(nearbyAttractions(h, 'en').pinConfirmed, h.slug).toBe(h.slug in COORDS)
    }
  })

  it('resolves names in the requested language', () => {
    const olalani = hotels.find((h) => h.slug === 'olalani-resort-condotel')!
    expect(nearbyAttractions(olalani, 'ko').items.some((p) => p.name === '미케 비치')).toBe(true)
    expect(nearbyAttractions(olalani, 'en').items[0].name).toBe('My Khe Beach')
  })
})

describe('attraction data and strings', () => {
  it('has unique ids and a name in all five languages', () => {
    expect(new Set(ATTRACTIONS.map((a) => a.id)).size).toBe(ATTRACTIONS.length)
    for (const a of ATTRACTIONS) for (const l of LANGS) expect(a.name[l]?.trim(), `${a.id}/${l}`).toBeTruthy()
  })

  it('labels every category used by an attraction in every language', () => {
    const used = new Set(ATTRACTIONS.map((a) => a.category))
    for (const l of LANGS) for (const c of used) expect(nearbyStrings[l].category[c]?.trim(), `${l}/${c}`).toBeTruthy()
  })

  it('has every nearby string filled in for every language', () => {
    const keys = Object.keys(nearbyStrings.en) as (keyof typeof nearbyStrings.en)[]
    for (const l of LANGS) for (const k of keys) expect(nearbyStrings[l][k], `${l}/${k}`).toBeTruthy()
  })
})

describe('formatDistance / mapsLink', () => {
  it('formats metres under 1 km, one decimal under 10 km, whole km beyond', () => {
    expect(formatDistance(0.43)).toBe('400 m')
    expect(formatDistance(0.01)).toBe('100 m')
    expect(formatDistance(2.34)).toBe('2.3 km')
    expect(formatDistance(27.6)).toBe('28 km')
  })
  it('builds a coordinate map link', () => {
    expect(mapsLink(16.06, 108.247)).toBe('https://www.google.com/maps/search/?api=1&query=16.06,108.247')
  })
})
