import { describe, it, expect } from 'vitest'
import { en } from '../i18n/locales/en'
import { ko } from '../i18n/locales/ko'
import { vi } from '../i18n/locales/vi'
import { zh } from '../i18n/locales/zh'
import { ja } from '../i18n/locales/ja'
import { hotels, getHotel, HEADLINE_BENEFIT, headlineBenefit } from '../data/hotels'
import { localizeHotel } from '../i18n'
import { recommend, COMING_SOON, CITY_SIGNALS } from '../lib/searchEngine'
import { hotelLatLng, AREA, COORDS } from '../lib/geo'
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
import { conciergeStrings, REQUEST_KEYS } from '../lib/conciergeI18n'
import { translatePhrase } from '../lib/translate'
import { composeMessage, resolveChannels } from '../lib/contact'
import { guestAuth } from '../lib/guestAuth'
import { getPartnerAnalytics } from '../lib/partnerAnalytics'
import { getBenchmark, getCompleteness, getInsights } from '../lib/partnerInsights'
import { insightStrings } from '../lib/insightsI18n'
import { distinctionOf, distinctionCounts } from '../lib/distinction'
import { scoreStrings } from '../lib/scoreI18n'
import { destinations } from '../data/destinations'
import { jsonLdString } from '../components/JsonLd'
import { community } from '../lib/community'
import { ko as koHotelContent } from '../i18n/hotelContent/ko'
import { ja as jaHotelContent } from '../i18n/hotelContent/ja'
import { vi as viHotelContent } from '../i18n/hotelContent/vi'
import { zh as zhHotelContent } from '../i18n/hotelContent/zh'

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
  it('has 110 hotels across 10 cities with unique ids and slugs', () => {
    expect(hotels).toHaveLength(110)
    expect(new Set(hotels.map((h) => h.id)).size).toBe(110)
    expect(new Set(hotels.map((h) => h.slug)).size).toBe(110)
    // No two hotels share the same listing photo (stock, but never duplicated).
    expect(new Set(hotels.map((h) => h.imageUrl)).size).toBe(110)
    expect(hotels.filter((h) => h.city === 'Da Nang')).toHaveLength(20)
    expect(hotels.filter((h) => h.city === 'Ho Chi Minh City')).toHaveLength(10)
    expect(hotels.filter((h) => h.city === 'Nha Trang')).toHaveLength(10)
    expect(hotels.filter((h) => h.city === 'Phu Quoc')).toHaveLength(10)
    expect(hotels.filter((h) => h.city === 'Hoi An')).toHaveLength(10)
    expect(hotels.filter((h) => h.city === 'Hanoi')).toHaveLength(10)
    expect(hotels.filter((h) => h.city === 'Hue')).toHaveLength(10)
    expect(hotels.filter((h) => h.city === 'Da Lat')).toHaveLength(10)
    expect(hotels.filter((h) => h.city === 'Sapa')).toHaveLength(10)
    expect(hotels.filter((h) => h.city === 'Ha Long Bay')).toHaveLength(10)
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

  it('headline benefits point at substantive lines, never boilerplate', () => {
    // The card shows a benefit box ONLY for hotels in HEADLINE_BENEFIT. The
    // R7 review found 84 of 110 cards presenting "book on the official
    // website" in the same UI as a verified perk. These guards keep the map
    // honest: every entry must resolve, and the line it selects must carry
    // more than the two boilerplate shapes every entry has (a "book direct
    // on the official website" opener and a "reserve directly" contact line).
    for (const [slug, idx] of Object.entries(HEADLINE_BENEFIT)) {
      const h = getHotel(slug)
      expect(h, `${slug} in HEADLINE_BENEFIT is not in the catalogue`).toBeDefined()
      const line = h!.officialBenefits[idx]
      expect(line, `${slug}[${idx}] is out of range`).toBeDefined()
      expect(line, `${slug} headline is a bare book-direct line`).not.toMatch(
        // "for member rates" is NOT in this pattern: that suffix carries the
        // chain's member-pricing claim (Lotte phrases it without a dash).
        /^Book direct (on|with) the (property's )?official (website|site)( \([^)]+\))?( at [\w.]+)?('s booking page)?( for the best available rate)?$/,
      )
      expect(line, `${slug} headline is a contact line, not a benefit`).not.toMatch(/^Reserve directly/)
    }
    // The roadmap metric: hotels with a verified direct-booking advantage.
    // Raising this number (via real partner benefits) is the goal — a new
    // city that only adds tautology hotels should not move it.
    expect(Object.keys(HEADLINE_BENEFIT)).toHaveLength(41)
    expect(hotels.filter((h) => headlineBenefit(h)).length).toBe(41)
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
    let starred = 0
    for (const h of hotels) {
      const c = h.conditions
      // Star class only when the verified description states one; else hidden.
      if (c.starRating !== undefined) {
        expect([3, 4, 5]).toContain(c.starRating)
        starred++
      }
      expect(c.stayEasyScore).toBeGreaterThanOrEqual(7.5)
      expect(c.stayEasyScore).toBeLessThanOrEqual(9.7)
      expect(typeof c.freeCancellation).toBe('boolean')
      expect(typeof c.beachfront).toBe('boolean')
      expect(c.walkToBeachMin).toBeGreaterThanOrEqual(0)
      // Integrity: unverifiable attributes must never be claimed.
      expect(c.petFriendly).toBe(false)
      expect(c.accessible).toBe(false)
      expect(c.twentyFourHourFrontDesk).toBe(false)
      expect(c.nonSmoking).toBe(false)
    }
    expect(starred).toBeGreaterThan(0)
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

describe('guest sign-in + member voucher', () => {
  it('issues a deterministic member voucher on sign-in', () => {
    guestAuth.signOut()
    guestAuth.signIn({ email: 'Traveler@Gmail.com', name: 'Traveler' })
    const g = guestAuth.get()!
    expect(g.email).toBe('traveler@gmail.com') // normalized
    expect(g.welcomeCode).toMatch(/^STAY-[A-Z0-9]{6}$/)
    expect(g.discountLabel.length).toBeGreaterThan(0)
    expect(g.validUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    const code = g.welcomeCode
    guestAuth.signOut()
    guestAuth.signIn({ email: 'traveler@gmail.com' })
    expect(guestAuth.get()!.welcomeCode).toBe(code) // same guest → same code
    guestAuth.signOut()
  })
})

describe('contact-channel routing (no hosted inbox)', () => {
  it('composes the guest request in the hotel’s language', () => {
    // Korean guest, Vietnamese hotel → request rendered in Vietnamese.
    const msg = composeMessage(['airportPickup', 'lateCheckout'], '늦게 도착해요.', 'ko', 'vi')
    expect(msg).toContain(conciergeStrings.vi.request.airportPickup)
    expect(msg).toContain('Chúng tôi sẽ đến muộn.') // free-text translated via dictionary
  })

  it('builds deep links to the hotel’s own channels (StayEasy hosts nothing)', () => {
    const labels = { website: 'Official website', email: 'Email', phone: 'Call' }
    const hotel = { contact: { whatsapp: '+84 905 123 456', email: 'a@h.example', phone: '+84905123456' }, officialWebsiteUrl: 'https://h.example', name: 'H', city: 'Da Nang' }
    const ch = resolveChannels(hotel, 'hello', labels)
    const wa = ch.find((c) => c.key === 'whatsapp')!
    expect(wa.href).toBe('https://wa.me/84905123456?text=hello')
    expect(ch.find((c) => c.key === 'email')!.href).toContain('mailto:a@h.example')
    expect(ch.find((c) => c.key === 'phone')!.href).toBe('tel:+84905123456')
    // Website is always present as a fallback.
    expect(ch.some((c) => c.key === 'website')).toBe(true)
  })

  it('resolves Zalo / Messenger deep links, chat channels first', () => {
    const labels = { website: 'Official website', email: 'Email', phone: 'Call' }
    const hotel = { contact: { zalo: '0975883110', messenger: 'SomeHotel', phone: '+842363000000' }, officialWebsiteUrl: 'https://h.example', name: 'H', city: 'Da Nang' }
    const ch = resolveChannels(hotel, '', labels)
    expect(ch.find((c) => c.key === 'zalo')!.href).toBe('https://zalo.me/0975883110')
    expect(ch.find((c) => c.key === 'messenger')!.href).toBe('https://m.me/SomeHotel')
    // Chat channels come before phone and website.
    const keys = ch.map((c) => c.key)
    expect(keys.indexOf('zalo')).toBeLessThan(keys.indexOf('phone'))
    expect(keys.indexOf('messenger')).toBeLessThan(keys.indexOf('website'))
  })

  it('at least some hotels carry a verified chat channel', () => {
    const withChat = hotels.filter((h) => {
      const c = h.contact
      return c && (c.whatsapp || c.zalo || c.kakao || c.line || c.messenger)
    })
    expect(withChat.length).toBeGreaterThan(0)
    // And no chat number is merely the front-desk landline (integrity check):
    // WhatsApp/Zalo aren't registered on a hotel's landline, so a "chat" value
    // equal to the front-desk phone would be a fabricated channel.
    for (const h of withChat) {
      const phoneDigits = (h.contact!.phone ?? '').replace(/[^0-9]/g, '')
      if (!phoneDigits) continue
      if (h.contact!.whatsapp) expect(h.contact!.whatsapp.replace(/[^0-9]/g, '')).not.toBe(phoneDigits)
      // A bare-number Zalo (no zalo.me URL) must also differ from the landline.
      const zalo = h.contact!.zalo
      if (zalo && !/[a-z]/i.test(zalo)) expect(zalo.replace(/[^0-9]/g, '')).not.toBe(phoneDigits)
    }
  })

  it('keeps the structured-request dictionary translating across languages', () => {
    for (const k of REQUEST_KEYS) {
      for (const loc of [conciergeStrings.en, conciergeStrings.ko, conciergeStrings.vi, conciergeStrings.zh, conciergeStrings.ja]) {
        expect(loc.request[k].length).toBeGreaterThan(0)
      }
    }
    expect(translatePhrase('늦게 도착해요.', 'ko', 'en')).toEqual({ text: 'We will arrive late.', translated: true })
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

  // Real, verified listings carry NO fabricated vouchers — so `withVouchers` is
  // normally empty. The invariant still holds: any hotel that DID carry a
  // voucher must be sponsored, with a valid, unique code.
  it('any hotel carrying a voucher is sponsored, with a valid unique code', () => {
    for (const h of withVouchers) {
      expect(h.isSponsored, `${h.slug} has a voucher but is not sponsored`).toBe(true)
      expect(h.voucher!.code).toMatch(/^[A-Z0-9]+$/)
      expect(h.voucher!.discountLabel.length).toBeGreaterThan(0)
      expect(h.voucher!.validUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
    expect(new Set(withVouchers.map((h) => h.voucher!.code)).size).toBe(withVouchers.length)
  })

  it('renders a self-contained SVG coupon carrying the code', () => {
    // Synthetic voucher fixture — the catalogue no longer ships demo vouchers.
    const h = { ...hotels[0], voucher: { code: 'TESTCODE10', discountLabel: '10% off your direct booking', terms: 'Show this code on the official website.', validUntil: '2026-12-31' } }
    const svg = buildVoucherSvg(h, { heading: 'Voucher', validUntilLabel: 'Valid until', footer: 'Use on official site' })
    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg).toContain('TESTCODE10')
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

  // The parity test above compares locales against EACH OTHER, so a city missing
  // from all five passes it — which is exactly how six launched cities shipped
  // with English destination copy in every language. These two compare the
  // locales against the CATALOGUE instead, which is the thing that grows.
  const allLocales = { en, ko, vi, zh, ja }

  it('every destination has card copy in every locale', () => {
    for (const [name, loc] of Object.entries(allLocales)) {
      const covered = Object.keys((loc as unknown as { destText: Record<string, unknown> }).destText)
      const missing = destinations.map((d) => d.slug).filter((s) => !covered.includes(s))
      expect(missing, `locale "${name}" is missing destText for`).toEqual([])
    }
  })

  it('every city has a translated name in every locale', () => {
    for (const [name, loc] of Object.entries(allLocales)) {
      const labels = (loc as unknown as { enums: { city: Record<string, string> } }).enums.city
      const missing = destinations.map((d) => d.city).filter((c) => !labels[c])
      expect(missing, `locale "${name}" is missing city labels for`).toEqual([])
    }
  })

  it('every roadmap country has a translated name in every locale', () => {
    // Same catalogue-axis rule as the city test: AsiaMap falls back `?? name`
    // to English, so a country added to countries.ts without labels renders
    // in English on all four translated pages while the suite stays green.
    for (const [name, loc] of Object.entries(allLocales)) {
      const labels = (loc as unknown as { enums: { country: Record<string, string> } }).enums.country
      const missing = countries.map((c) => c.name).filter((n) => !labels[n])
      expect(missing, `locale "${name}" is missing country labels for`).toEqual([])
    }
  })
})

describe('map pins', () => {
  // These assert on the AREA axis, not the city axis. A city-axis check
  // ("is the pin inside its own city?") is structurally incapable of failing
  // when the area lookup breaks, because the fallback IS the city centre —
  // which is how `AREA[h.area]` shipped against a `"<City>|<Area>"` table with
  // every entry unreachable and a scripted city-box check reporting success.
  const km = (a: [number, number], b: [number, number]) => {
    const dLat = (a[0] - b[0]) * 111
    const dLng = (a[1] - b[1]) * 111 * Math.cos((a[0] * Math.PI) / 180)
    return Math.hypot(dLat, dLng)
  }

  it('every area a hotel lives in has a centre defined', () => {
    const missing = [...new Set(hotels.map((h) => `${h.city}|${h.area}` as const))].filter((k) => !AREA[k])
    expect(missing).toEqual([])
  })

  it('a hotel without real coordinates lands on its area centre, not its city centre', () => {
    // Only the fallback path is asserted: a hotel WITH real coordinates may sit
    // kilometres from its area centre and that's correct (Da Nang's 'Resort
    // Area' is a long stretch of coast). The fallback path is where the bug
    // lives, and there the pin must be area centre + jitter (±350m).
    const strays = hotels
      .filter((h) => !COORDS[h.slug])
      .map((h) => ({ slug: h.slug, area: `${h.city}|${h.area}` as const, d: km(hotelLatLng(h), AREA[`${h.city}|${h.area}`]!) }))
      .filter((x) => x.d > 0.6)
      .map((x) => `${x.slug} is ${x.d.toFixed(1)}km from ${x.area}`)
    expect(strays).toEqual([])
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

  it('city intents are hard filters across all live cities', () => {
    // Derived from CITY_SIGNALS and the catalogue, not a hand-picked sample:
    // the old version queried 3 fixed cities, so city #11 could ship with its
    // signal entirely unwired and this test would stay green. Same wrong-axis
    // trap as the i18n and geo tests — iterate the thing that grows.
    const liveCities = new Set(hotels.map((h) => h.city))
    expect(Object.keys(CITY_SIGNALS).length).toBe(liveCities.size)
    for (const [signal, city] of Object.entries(CITY_SIGNALS)) {
      expect(liveCities.has(city), `${signal} maps to non-live city ${city}`).toBe(true)
      const rec = recommend(`${city} hotel`, hotels)
      expect(rec.detected, `"${city} hotel" should detect ${signal}`).toContain(signal)
      expect(rec.results.length, `"${city} hotel" returned nothing`).toBeGreaterThan(0)
      expect(rec.results.every((r) => r.hotel.city === city), `"${city} hotel" leaked another city`).toBe(true)
    }

    // Non-English names keep working (spot checks on top of the sweep).
    const hanoi = recommend('하노이 시내 호텔', hotels)
    expect(hanoi.detected).toEqual(expect.arrayContaining(['hanoi', 'city']))
    expect(hanoi.results.every((r) => r.hotel.city === 'Hanoi')).toBe(true)
    const saigon = recommend('サイゴンのビジネスホテル', hotels)
    expect(saigon.results.every((r) => r.hotel.city === 'Ho Chi Minh City')).toBe(true)
  })

  it('matches unaccented Vietnamese typing (diacritic-insensitive)', () => {
    const rec = recommend('khach san gia dinh gan bien', hotels)
    expect(rec.detected).toEqual(expect.arrayContaining(['family', 'beach']))
    expect(rec.results.length).toBeGreaterThan(0)
  })

  it('does not misfire golf on Saigon (both spellings) yet keeps real golf', () => {
    for (const q of ['saigon hotel', 'sài gòn hotel', 'sai gon']) {
      const rec = recommend(q, hotels)
      expect(rec.detected, q).not.toContain('golf')
      expect(rec.detected, q).toContain('hcmc')
      expect(rec.results.every((r) => r.hotel.city === 'Ho Chi Minh City')).toBe(true)
    }
    expect(recommend('resort with golf', hotels).detected).toContain('golf')
    expect(recommend('sân gôn', hotels).detected).toContain('golf')
  })

  it('city match does not inflate the match % (city excluded from scoring)', () => {
    const withCity = recommend('da nang spa', hotels)
    const noCity = recommend('spa', hotels)
    // "da nang spa" and "spa" both score only on spa → same top pct, not doubled.
    expect(withCity.results[0].pct).toBe(noCity.results[0].pct)
  })

  it('flags a coming-soon destination instead of a wrong-city match', () => {
    const rec = recommend('ninh binh quiet hotel', hotels)
    expect(rec.comingSoon).toBe('Ninh Binh')
    expect(rec.generic).toBe(true)
    expect(rec.results.length).toBeGreaterThan(0)
  })

  it('every live city is absent from COMING_SOON', () => {
    // Launching a city means deleting it from COMING_SOON. Forgetting that
    // leaves the search engine answering "not available yet" for a city whose
    // hotels are right there — the exact bug Da Lat and Sapa each nearly hit.
    const liveCities = new Set(hotels.map((h) => h.city))
    for (const soon of COMING_SOON) {
      expect(liveCities.has(soon.name as never), `${soon.name} is live but still in COMING_SOON`).toBe(false)
    }
  })

  it('a city stops being flagged coming-soon once it goes live', () => {
    // Regression: Da Lat was a coming-soon destination until its launch. Now it
    // must hard-filter like any other live city instead of returning the
    // "not available yet" answer.
    const rec = recommend('da lat quiet hotel', hotels)
    expect(rec.comingSoon).toBeUndefined()
    expect(rec.results.length).toBeGreaterThan(0)
    expect(rec.results.every((r) => r.hotel.city === 'Da Lat')).toBe(true)
  })

  it('does not invert "비싼"(expensive) into budget intent', () => {
    expect(recommend('비싼 호텔', hotels).detected).not.toContain('budget')
    expect(recommend('저렴한 호텔', hotels).detected).toContain('budget')
  })

  it('an understood-but-unmatched intent (golf) falls back, never a dead end', () => {
    const rec = recommend('resort with golf', hotels)
    expect(rec.detected).toContain('golf')
    expect(rec.results.length).toBeGreaterThan(0) // fallback list, not empty
    expect(rec.generic).toBe(true)
  })

  it('does not rank by raw id order (no Da Nang bias in generic results)', () => {
    const rec = recommend('', hotels)
    const cities = new Set(rec.results.map((r) => r.hotel.city))
    // Editorial tie-break spreads the default list across cities instead of
    // returning h01..h06 (all Da Nang) like the old id sort did.
    expect(cities.size).toBeGreaterThan(1)
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
    // No real hotel is marked sponsored (no paid relationship), so this is 0 —
    // the derivation invariant (one campaign per sponsored hotel) still holds.
    const sponsored = hotels.filter((h) => h.isSponsored).length
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
    expect(all).toHaveLength(110)
    const h = await repo.getHotel('olalani-resort-condotel')
    expect(h?.slug).toBe('olalani-resort-condotel')
  })

  it('resolves destinations, city hotels, and recommendations', async () => {
    expect((await repo.listDestinations()).length).toBeGreaterThan(12)
    expect((await repo.listHotelsByCity('Da Nang'))).toHaveLength(20)
    const rec = await repo.recommend('family beach hotel with a pool')
    expect(rec.results.length).toBeGreaterThan(0)
  })
})

describe('wishlist store', () => {
  it('toggles, dedupes, removes, and clears', () => {
    wishlist.clear()
    expect(wishlist.get()).toEqual([])
    wishlist.toggle('olalani-resort-condotel')
    wishlist.toggle('son-tra-hillside-retreat')
    expect(wishlist.has('olalani-resort-condotel')).toBe(true)
    expect(wishlist.get()).toHaveLength(2)
    wishlist.toggle('olalani-resort-condotel') // toggle off
    expect(wishlist.has('olalani-resort-condotel')).toBe(false)
    wishlist.remove('son-tra-hillside-retreat')
    expect(wishlist.get()).toEqual([])
  })
})

describe('API contract', () => {
  it('builds versioned endpoint paths', () => {
    expect(API_BASE).toBe('/api/v1')
    expect(endpoints.hotel('olalani-resort-condotel')).toBe('/api/v1/hotels/olalani-resort-condotel')
    expect(endpoints.cityHotels('da-nang')).toBe('/api/v1/cities/da-nang/hotels')
  })
})

describe('search insights (mock)', () => {
  it('returns deterministic, internally-consistent Search Console data per hotel', async () => {
    const { getSearchInsights } = await import('../lib/searchInsights')
    const hotel = getHotel('olalani-resort-condotel')!
    const a = await getSearchInsights(hotel.slug, hotel)
    const b = await getSearchInsights(hotel.slug, hotel)

    expect(a.source).toBe('mock')
    expect(a.slug).toBe(hotel.slug)
    expect(a.topQueries.length).toBeGreaterThan(0)
    // Deterministic across calls.
    expect(b.topQueries.map((q) => q.query)).toEqual(a.topQueries.map((q) => q.query))
    // Sorted by clicks, desc.
    const clicks = a.topQueries.map((q) => q.clicks)
    expect([...clicks].sort((x, y) => y - x)).toEqual(clicks)
    // Totals sum the rows.
    expect(a.totals.clicks).toBe(a.topQueries.reduce((n, q) => n + q.clicks, 0))
    expect(a.totals.impressions).toBe(a.topQueries.reduce((n, q) => n + q.impressions, 0))
  })

  it('never renders a negative CTR, position or split weight for any hotel', async () => {
    // hash() returns a uint32; a SIGNED shift (`h >> 3`) reinterprets seeds
    // past 2^31 as negative, making `% n` negative too — geo.ts shipped this
    // exact bug as a ~1km westward pin bias, and the same pattern lived here
    // as a negative CTR for roughly half of all slugs. The sweep is `>>>`
    // everywhere; this iterates every hotel because the sign flip only shows
    // on seeds past 2^31 — a single-hotel spot check can silently miss it.
    const { getSearchInsights } = await import('../lib/searchInsights')
    for (const h of hotels) {
      const ins = await getSearchInsights(h.slug, h)
      for (const q of ins.topQueries) {
        expect(q.ctr, `${h.slug} "${q.query}" ctr`).toBeGreaterThanOrEqual(0)
        expect(q.position, `${h.slug} "${q.query}" position`).toBeGreaterThan(0)
      }
      const pa = getPartnerAnalytics(h.slug, 300, h.koreanFriendly)
      for (const split of [pa.byLanguage, pa.bySource, pa.byDevice]) {
        for (const row of split) expect(row.pct, `${h.slug} ${row.key}`).toBeGreaterThanOrEqual(0)
      }
    }
  })
})

describe('partner insights (benchmark / completeness / actions)', () => {
  const a = getPartnerAnalytics('olalani-resort-condotel', 400, false)

  it('varies conversion rate across hotels so benchmarks are meaningful', () => {
    const rates = hotels.slice(0, 8).map((h) => getPartnerAnalytics(h.slug, 300).kpis.convRate.value)
    expect(new Set(rates).size).toBeGreaterThan(1)
  })

  it('benchmarks against peers and classifies standing', () => {
    const h = getHotel('olalani-resort-condotel')!
    const b = getBenchmark(h, a)
    expect(b.peers).toBeGreaterThan(0)
    expect(['above', 'onpar', 'below']).toContain(b.standing)
    expect(b.peerConv).toBeGreaterThan(0)
  })

  it('scores listing completeness between 0 and 100', () => {
    const c = getCompleteness(getHotel('olalani-resort-condotel')!)
    expect(c.pct).toBeGreaterThanOrEqual(0)
    expect(c.pct).toBeLessThanOrEqual(100)
    expect(c.done.length + c.missing.length).toBe(12)
  })

  it('always returns at least one actionable insight with a known key', () => {
    const h = getHotel('olalani-resort-condotel')!
    const ins = getInsights(h, a, getBenchmark(h, a), getCompleteness(h))
    expect(ins.length).toBeGreaterThan(0)
    expect(ins.length).toBeLessThanOrEqual(5)
    for (const lang of ['en', 'ko', 'vi', 'zh', 'ja'] as const) {
      for (const i of ins) expect(typeof insightStrings[lang].rules[i.key]).toBe('string')
    }
  })
})

describe('StayEasy Distinction (Michelin-style scarcity)', () => {
  it('awards a mark to only a small minority of hotels', () => {
    const c = distinctionCounts()
    const distinguished = c.choice + c.recommended
    // Scarcity is the whole point: most hotels carry no mark.
    expect(distinguished).toBeLessThan(c.total / 2)
    expect(c.choice).toBeGreaterThan(0)
  })

  it('gives at most one "Choice" per city', () => {
    const choiceCities = hotels.filter((h) => distinctionOf(h.slug) === 'choice').map((h) => h.city)
    expect(new Set(choiceCities).size).toBe(choiceCities.length)
  })

  it('every distinction resolves to a labelled tier in all languages', () => {
    for (const h of hotels) {
      const d = distinctionOf(h.slug)
      expect([null, 'choice', 'recommended']).toContain(d)
    }
    for (const lang of ['en', 'ko', 'vi', 'zh', 'ja'] as const) {
      expect(scoreStrings[lang].choice.length).toBeGreaterThan(0)
      expect(scoreStrings[lang].recommended.length).toBeGreaterThan(0)
    }
  })
})

describe('hotel community store (localStorage mock)', () => {
  it('adds, lists newest-first, and removes posts per hotel', () => {
    const slug = 'test-community-hotel'
    community.posts(slug).forEach((p) => community.remove(slug, p.id))
    community.add(slug, 'Mina', 'Great sea view rooms on high floors.')
    community.add(slug, '', 'Ask for a late checkout — they were flexible.')
    const posts = community.posts(slug)
    expect(posts.length).toBe(2)
    // Empty author is allowed (UI substitutes a fallback label).
    expect(posts.some((p) => p.body.includes('late checkout'))).toBe(true)
    community.remove(slug, posts[0].id)
    expect(community.posts(slug).length).toBe(1)
  })

  it('ignores blank posts', () => {
    const slug = 'test-community-blank'
    community.add(slug, 'x', '   ')
    expect(community.posts(slug).length).toBe(0)
  })
})

describe('hotel counts are derived from the catalogue (no drift)', () => {
  it('each destination hotelCount equals its real hotels', () => {
    for (const d of destinations) {
      const real = hotels.filter((h) => h.city === d.city).length
      expect(d.hotelCount, `${d.city} count`).toBe(real)
    }
    // Da Nang really is 20 now (was hardcoded 12).
    expect(destinations.find((d) => d.city === 'Da Nang')?.hotelCount).toBe(20)
  })

  it('Vietnam market hotelCount equals the whole catalogue', () => {
    const vn = countries.find((c) => c.name === 'Vietnam')
    expect(vn?.hotelCount).toBe(hotels.filter((h) => h.country === 'Vietnam').length)
    expect(vn?.hotelCount).toBe(110)
  })
})

describe('JSON-LD injection safety', () => {
  it('escapes </script> and line separators, still parses back', () => {
    const out = jsonLdString({ name: '</scr' + 'ipt><img src=x onerror=alert(1)>' })
    expect(out.includes('</scr' + 'ipt>')).toBe(false)
    expect(out.includes('\\u003c')).toBe(true)
    expect(JSON.parse(out).name).toBe('</scr' + 'ipt><img src=x onerror=alert(1)>')
  })
})

describe('hotel content locale parity (regression guard)', () => {
  // House rule: every catalogue hotel must have complete content in all 4
  // non-English locales. This guards the rule so a future hotel addition that
  // skips a locale fails fast instead of shipping a desynced page.
  const locales = { ko: koHotelContent, ja: jaHotelContent, vi: viHotelContent, zh: zhHotelContent }

  it('every hotel has complete content in ko/ja/vi/zh', () => {
    for (const [name, map] of Object.entries(locales)) {
      for (const h of hotels) {
        const c = map[h.id]
        expect(c, `${name}.ts is missing hotel ${h.id} (${h.slug})`).toBeTruthy()
        expect(c.shortDescription.trim().length, `${name} ${h.id} shortDescription empty`).toBeGreaterThan(10)
        expect(c.positioningLine.trim().length, `${name} ${h.id} positioningLine empty`).toBeGreaterThan(5)
        expect(c.bestFor.length, `${name} ${h.id} bestFor empty`).toBeGreaterThan(0)
        // Exact length, not just non-empty: headlineBenefit() selects a card
        // line BY INDEX into the localized array, so a locale that drops one
        // line shifts every index after it and silently shows the wrong
        // benefit (e.g. a phone number) in that language only.
        expect(c.officialBenefits.length, `${name} ${h.id} officialBenefits length differs from English`).toBe(h.officialBenefits.length)
        expect(c.cancellationChecklist.length, `${name} ${h.id} cancellationChecklist`).toBeGreaterThan(0)
      }
    }
  })

  it('no orphan locale entries (content for hotels that no longer exist)', () => {
    const ids = new Set(hotels.map((h) => h.id))
    for (const [name, map] of Object.entries(locales)) {
      const orphans = Object.keys(map).filter((k) => !ids.has(k))
      expect(orphans, `${name}.ts has orphan ids: ${orphans.join(', ')}`).toHaveLength(0)
    }
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
