import { describe, it, expect } from 'vitest'
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
import { buildVoucherSvg } from '../lib/voucher'
import { countries, liveMarkets, getCountry } from '../data/countries'
import { guides, getGuide } from '../data/guides'
import { officialLink, isPlaceholderUrl } from '../lib/officialLink'
import { partnerAccounts } from '../lib/partnerAccounts'
import { partnerDrafts } from '../lib/partnerDrafts'
import { concierge } from '../lib/messages'
import { conciergeStrings, REQUEST_KEYS } from '../lib/conciergeI18n'
import { translatePhrase } from '../lib/translate'

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
  it('has 32 hotels across 6 cities with unique ids and slugs', () => {
    expect(hotels).toHaveLength(32)
    expect(new Set(hotels.map((h) => h.id)).size).toBe(32)
    expect(new Set(hotels.map((h) => h.slug)).size).toBe(32)
    expect(hotels.filter((h) => h.city === 'Da Nang')).toHaveLength(12)
    expect(hotels.filter((h) => h.city === 'Ho Chi Minh City')).toHaveLength(4)
    expect(hotels.filter((h) => h.city === 'Nha Trang')).toHaveLength(4)
    expect(hotels.filter((h) => h.city === 'Phu Quoc')).toHaveLength(4)
    expect(hotels.filter((h) => h.city === 'Hoi An')).toHaveLength(4)
    expect(hotels.filter((h) => h.city === 'Hanoi')).toHaveLength(4)
  })

  it('every required field is populated', () => {
    for (const h of hotels) {
      expect(h.name.length).toBeGreaterThan(0)
      expect(h.officialWebsiteUrl).toMatch(/^https?:\/\//)
      expect(h.imageUrl).toContain('images.unsplash.com') // real photography, no placeholders
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

describe('filterable travel conditions', () => {
  it('every hotel has normalized conditions with sane values', () => {
    for (const h of hotels) {
      const c = h.conditions
      expect([3, 4, 5]).toContain(c.starRating)
      expect(c.stayEasyScore).toBeGreaterThanOrEqual(7.5)
      expect(c.stayEasyScore).toBeLessThanOrEqual(9.7)
      expect(typeof c.freeCancellation).toBe('boolean')
      expect(typeof c.beachfront).toBe('boolean')
      expect(c.walkToBeachMin).toBeGreaterThanOrEqual(0)
    }
  })

  it('common area + travel-style combos return at least one hotel', () => {
    // Regression: "My Khe Beach + Couple" used to be empty.
    const myKheCouple = hotels.filter((h) => h.area === 'My Khe Beach' && h.tags.includes('Couple'))
    expect(myKheCouple.length).toBeGreaterThan(0)
  })

  it('conditions are deterministic and discriminating (filters return subsets)', () => {
    const pools = hotels.filter((h) => h.conditions.pool)
    const beach = hotels.filter((h) => h.conditions.beachfront)
    const top = hotels.filter((h) => h.conditions.stayEasyScore >= 9)
    expect(pools.length).toBeGreaterThan(0)
    expect(pools.length).toBeLessThan(hotels.length)
    expect(beach.length).toBeGreaterThan(0)
    expect(top.length).toBeGreaterThan(0)
    // Beachfront hotels are at/near the beach.
    for (const h of beach) expect(h.conditions.walkToBeachMin).toBeLessThanOrEqual(3)
  })
})

describe('partner account approval workflow', () => {
  it('registers as pending, blocks sign-in until approved, then grants a listing', () => {
    partnerAccounts.clear()
    partnerDrafts.clear()
    const acc = partnerAccounts.register({ email: 'gm@hotel.example', password: 'secret1', hotelName: 'Test Harbor Hotel', city: 'Da Nang', createdAt: '2026-06-17' })
    expect(acc).not.toBeNull()

    // Pending → sign-in blocked
    expect(partnerAccounts.authenticate('gm@hotel.example', 'secret1')).toMatchObject({ ok: false, reason: 'pending' })
    // Wrong password → invalid
    expect(partnerAccounts.authenticate('gm@hotel.example', 'nope')).toMatchObject({ ok: false, reason: 'invalid' })

    // Approve → creates a listing and grants access
    partnerAccounts.approve(acc!.id)
    const res = partnerAccounts.authenticate('gm@hotel.example', 'secret1')
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.account.status).toBe('Approved')
      expect(res.account.hotelSlug).toBeTruthy()
    }
    // Listing was created as a draft
    expect(partnerDrafts.getAll().some((d) => d.hotel.name === 'Test Harbor Hotel')).toBe(true)

    // Duplicate email is rejected
    expect(partnerAccounts.register({ email: 'gm@hotel.example', password: 'x', hotelName: 'Dup', city: '', createdAt: '2026-06-17' })).toBeNull()

    partnerAccounts.clear()
    partnerDrafts.clear()
  })
})

describe('concierge / direct-stay inbox', () => {
  it('translates structured requests across languages by key', () => {
    for (const k of REQUEST_KEYS) {
      for (const loc of [conciergeStrings.en, conciergeStrings.ko, conciergeStrings.vi, conciergeStrings.zh, conciergeStrings.ja]) {
        expect(loc.request[k].length).toBeGreaterThan(0)
      }
    }
    // Same key, different language = a real translation.
    expect(conciergeStrings.ko.request.airportPickup).not.toBe(conciergeStrings.en.request.airportPickup)
  })

  it('opens a guest thread and accepts a hotel reply', () => {
    concierge.clear()
    const th = concierge.open({
      hotelSlug: 'an-bang-beach-resort', guestName: 'Min', bookingRef: 'ABC123',
      guestLang: 'ko', requests: ['airportPickup', 'lateCheckout'], note: '늦게 도착해요', createdAt: '2026-06-18T00:00:00Z',
    })
    expect(concierge.forHotel('an-bang-beach-resort')).toHaveLength(1)
    expect(th.messages).toHaveLength(1)
    concierge.addMessage(th.id, 'hotel', 'See you then', 'en', '2026-06-18T01:00:00Z')
    expect(concierge.forHotel('an-bang-beach-resort')[0].messages).toHaveLength(2)
    concierge.clear()
  })

  it('translates known free-text phrases across languages (demo dictionary)', () => {
    const t = translatePhrase('늦게 도착해요.', 'ko', 'en')
    expect(t.translated).toBe(true)
    expect(t.text).toBe('We will arrive late.')
    // Unknown text is returned unchanged.
    expect(translatePhrase('xyzzy', 'ko', 'en')).toEqual({ text: 'xyzzy', translated: false })
  })
})

describe('outbound official links', () => {
  it('never resolves to a dead placeholder (.example) link', () => {
    for (const h of hotels) {
      const link = officialLink(h)
      expect(link).not.toContain('.example')
      expect(link).toMatch(/^https?:\/\//)
      // Placeholder catalogue URLs fall back to a real web search.
      if (isPlaceholderUrl(h.officialWebsiteUrl)) {
        expect(link).toContain('google.com/search')
        expect(link).toContain(encodeURIComponent(h.name))
      } else {
        expect(link).toBe(h.officialWebsiteUrl)
      }
    }
  })
})

describe('editorial guides', () => {
  it('has original guides with unique slugs and substantial content', () => {
    expect(guides.length).toBeGreaterThanOrEqual(8)
    expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length)
    for (const g of guides) {
      expect(getGuide(g.slug)).toBe(g)
      expect(g.title.length).toBeGreaterThan(0)
      expect(g.intro.length).toBeGreaterThan(80)
      expect(g.sections.length).toBeGreaterThanOrEqual(2)
      expect(['Direct booking', 'City guide', 'Planning']).toContain(g.category)
    }
  })

  it('has no demo/sample/prototype wording in hotel names', () => {
    for (const h of hotels) {
      expect(h.name).not.toMatch(/sample|demo|mock|prototype|fictional/i)
    }
  })
})

describe('Asia market roadmap', () => {
  it('has Vietnam live and other Asian markets on the roadmap', () => {
    expect(countries.length).toBeGreaterThanOrEqual(10)
    expect(liveMarkets.map((c) => c.name)).toEqual(['Vietnam'])
    expect(new Set(countries.map((c) => c.slug)).size).toBe(countries.length)
    for (const c of countries) {
      expect(['Southeast Asia', 'East Asia', 'South Asia']).toContain(c.region)
      expect(c.cities.length).toBeGreaterThan(0)
    }
  })

  it('every hotel and destination carries a country (Vietnam at launch)', () => {
    for (const h of hotels) {
      expect(getCountry(h.country), h.slug).toBeDefined()
      expect(h.country).toBe('Vietnam')
    }
  })
})

describe('direct-booking vouchers', () => {
  const withVouchers = hotels.filter((h) => h.voucher)

  it('only sponsored hotels carry vouchers and codes are unique', () => {
    expect(withVouchers).toHaveLength(8)
    for (const h of withVouchers) {
      expect(h.isSponsored, `${h.slug} has a voucher but is not sponsored`).toBe(true)
      expect(h.voucher!.code).toMatch(/^[A-Z0-9]+$/)
      expect(h.voucher!.discountLabel.length).toBeGreaterThan(0)
      expect(h.voucher!.validUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
    expect(new Set(withVouchers.map((h) => h.voucher!.code)).size).toBe(withVouchers.length)
  })

  it('renders a self-contained SVG coupon carrying the code', () => {
    const h = getHotel('an-bang-beach-resort')!
    const svg = buildVoucherSvg(h, { heading: 'Voucher', validUntilLabel: 'Valid until', footer: 'Use on official site' })
    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg).toContain(h.voucher!.code)
    expect(svg).toContain('STAYEASY VIETNAM')
  })

  it('returns an empty string for a hotel without a voucher', () => {
    const h = hotels.find((x) => !x.voucher)!
    expect(buildVoucherSvg(h, { heading: '', validUntilLabel: '', footer: '' })).toBe('')
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
  it('manages every hotel as a single partner registry with valid plans/statuses', () => {
    // Unified model: one partner record per listed hotel (no hotels/partners split).
    expect(partners).toHaveLength(hotels.length)
    for (const p of partners) {
      expect(['Starter', 'Growth', 'Campaign']).toContain(p.plan)
      expect(['Active', 'Pending', 'Paused', 'Listed']).toContain(p.status)
    }
    // Free 'Listed' hotels carry no fee; paid plans do.
    for (const p of partners) {
      if (p.status === 'Listed') expect(p.monthlyFee).toBe(0)
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

describe('async data repo (mock-backed)', () => {
  it('resolves the full catalogue and a single hotel', async () => {
    const all = await repo.allHotels()
    expect(all).toHaveLength(32)
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
