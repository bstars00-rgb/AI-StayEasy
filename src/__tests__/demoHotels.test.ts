// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { hotels } from '../data/hotels'
import { DEMO_HOTELS, DEMO_TEXT, DEMO_BENEFIT_VALUE } from '../data/demoHotels'
import { benefitValue, isPercent } from '../data/benefitValue'
import { destinations } from '../data/destinations'
import { repo } from '../data/repo'
import { localizeHotel } from '../i18n'
import { officialLink } from '../lib/officialLink'
import { AREA } from '../lib/geo'
import { benefitValueStrings } from '../lib/benefitValueI18n'
import { demoStrings } from '../lib/demoI18n'
import type { Lang } from '../i18n'

const LANGS: Lang[] = ['en', 'ko', 'vi', 'zh', 'ja']
const OTHER: Exclude<Lang, 'en'>[] = ['ko', 'vi', 'zh', 'ja']

describe('Lunas Park Hotel demo chain', () => {
  it('has one hotel for each live city', () => {
    const live = destinations.filter((d) => d.available).map((d) => d.city).sort()
    expect(DEMO_HOTELS.map((h) => h.city).sort()).toEqual(live)
    expect(DEMO_HOTELS.length).toBe(10)
    for (const h of DEMO_HOTELS) expect(h.name, h.slug).toMatch(/^Lunas Park Hotel /)
  })

  it('is fictional and says so, with no stars or cancellation claims', () => {
    for (const h of DEMO_HOTELS) {
      expect(h.isDemo, h.slug).toBe(true)
      expect(h.shortDescription, h.slug).toMatch(/fictional/i)
      expect(h.conditions.starRating, h.slug).toBeUndefined()
      expect(h.conditions.freeCancellation, h.slug).toBe(false)
      expect(h.freeCancellationVerified, h.slug).toBeUndefined()
    }
  })

  it('never enters the verified catalogue, and is off by default', async () => {
    const real = new Set(hotels.map((h) => h.slug))
    for (const h of DEMO_HOTELS) expect(real.has(h.slug), h.slug).toBe(false)
    expect(hotels.some((h) => h.isDemo)).toBe(false)
    // Switch off (the test default): the repo serves only the real catalogue.
    const served = await repo.allHotels()
    expect(served.some((h) => h.isDemo)).toBe(false)
    expect(served.length).toBe(hotels.length)
    expect(benefitValue(DEMO_HOTELS[0].slug)).toBeUndefined()
  })

  it('stays out of the sitemap and the pre-rendered routes', () => {
    for (const f of ['scripts/gen-sitemap.mjs', 'scripts/gen-static-routes.mjs']) {
      expect(readFileSync(f, 'utf8'), f).not.toMatch(/demoHotels|lunas-park/i)
    }
  })

  it('links to an explanation page instead of any booking site', () => {
    for (const h of DEMO_HOTELS) {
      expect(officialLink(h), h.slug).toMatch(/demo-hotel$/)
      expect(officialLink(h), h.slug).not.toMatch(/google\.com|lunasparkhotel/)
    }
  })

  it('places every hotel at a known area of its own city', () => {
    for (const h of DEMO_HOTELS) expect(AREA[`${h.city}|${h.area}`], h.slug).toBeTruthy()
  })
})

describe('each demo hotel has its own voucher and benefit', () => {
  it('differs in code, headline and benefit statement', () => {
    const codes = DEMO_HOTELS.map((h) => h.voucher!.code)
    const labels = DEMO_HOTELS.map((h) => h.voucher!.discountLabel)
    const lines = DEMO_HOTELS.map((h) => h.officialBenefits[0])
    expect(new Set(codes).size).toBe(10)
    expect(new Set(labels).size).toBe(10)
    expect(new Set(lines).size).toBe(10)
  })

  it('keeps the voucher code out of every public text, so only signing in reveals it', () => {
    // The code is the member-only part. If a benefit line or summary prints it, the
    // lock on the voucher card unlocks nothing.
    for (const h of DEMO_HOTELS) {
      const code = h.voucher!.code
      for (const l of LANGS) {
        const t = localizeHotel(h, l)
        const everyPublicString = JSON.stringify({ ...t, voucher: undefined })
        expect(everyPublicString, `${h.slug}/${l}`).not.toContain(code)
      }
    }
  })

  it('every benefit is a perk with a stated value — never a price cut', () => {
    // Hotels don't discount their direct rate for members, so no percentage and no free night.
    for (const h of DEMO_HOTELS) {
      const v = DEMO_BENEFIT_VALUE[h.slug]
      expect(isPercent(v), h.slug).toBe(false)
      expect(isPercent(v) ? '' : v.kind, h.slug).toBe('amount')
      expect(h.voucher!.redeem, h.slug).toBe('onsite') // delivered as a wallet voucher, not a promo code
    }
    // ...and the wording says so in every language: no "% off", "discount" or "free night".
    const PRICE_CUT = /%|\boff\b|discount|free nights?|할인|무료\s*\d*\s*박|1박 무료|割引|オフ|無料|giảm|tặng 1 đêm|减|立减|免费\d*晚|免费1晚/i
    const strings = (h: (typeof DEMO_HOTELS)[number], l: (typeof OTHER)[number] | 'en') => {
      const text = l === 'en' ? { officialBenefits: h.officialBenefits, label: h.voucher!.discountLabel } : { officialBenefits: DEMO_TEXT[l][h.slug].officialBenefits, label: DEMO_TEXT[l][h.slug].voucher.discountLabel }
      return [text.officialBenefits[0], text.label]
    }
    for (const h of DEMO_HOTELS) {
      for (const l of ['en', ...OTHER] as const) {
        for (const line of strings(h, l)) expect(line, `${h.slug}/${l}`).not.toMatch(PRICE_CUT)
      }
    }
  })

  it('writes the figure into the hotel’s own benefit line', () => {
    for (const h of DEMO_HOTELS) {
      const v = DEMO_BENEFIT_VALUE[h.slug]
      const line = h.officialBenefits[v.line]
      expect(line, h.slug).toBeTruthy()
      if (isPercent(v)) {
        expect(line, h.slug).toContain(`${v.pct}%`)
        expect(!!v.upTo, h.slug).toBe(/\bup to\b/i.test(line))
      } else if (v.kind === 'nights') {
        expect(line, h.slug).toContain(`${v.minNights} nights`)
        expect(line, h.slug).toContain(`${v.freeNights} night free`)
      } else {
        expect(line, h.slug).toContain(`${v.currency} ${v.amount}`)
        expect(!!v.perNight, h.slug).toBe(/a night/i.test(line))
      }
    }
  })

  it('has a redeemable voucher: valid date, online or on-site, a headline', () => {
    for (const h of DEMO_HOTELS) {
      const v = h.voucher!
      expect(v.code, h.slug).toMatch(/^LUNAS-/)
      expect(v.validUntil, h.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(['online', 'onsite'], h.slug).toContain(v.redeem)
      expect(v.discountLabel.trim(), h.slug).toBeTruthy()
    }
  })
})

describe('translations', () => {
  it('cover every hotel in every language, index-parallel with English', () => {
    for (const h of DEMO_HOTELS) {
      for (const l of OTHER) {
        const t = DEMO_TEXT[l][h.slug]
        expect(t, `${h.slug}/${l}`).toBeTruthy()
        expect(t.officialBenefits.length, `${h.slug}/${l}`).toBe(h.officialBenefits.length)
        expect(t.bestFor.length, `${h.slug}/${l}`).toBe(h.bestFor.length)
        expect(t.thingsToCheck.length, `${h.slug}/${l}`).toBe(h.thingsToCheck.length)
        expect(t.voucher.code, `${h.slug}/${l}`).toBe(h.voucher!.code) // the code never changes with language
        expect(t.voucher.discountLabel.trim(), `${h.slug}/${l}`).toBeTruthy()
      }
    }
  })

  it('keep the same figure as English in the translated benefit line and voucher headline', () => {
    for (const h of DEMO_HOTELS) {
      const v = DEMO_BENEFIT_VALUE[h.slug]
      const figure = isPercent(v) ? String(v.pct) : v.kind === 'nights' ? String(v.minNights) : String(v.amount)
      for (const l of OTHER) {
        const t = localizeHotel(h, l)
        expect(t.officialBenefits[v.line], `${h.slug}/${l}`).toContain(figure)
        expect(t.voucher!.discountLabel, `${h.slug}/${l}`).toContain(figure)
        expect(t.shortDescription, `${h.slug}/${l}`).not.toBe(h.shortDescription)
      }
    }
  })

  it('has the demo labels and every new benefit string in every language', () => {
    for (const l of LANGS) {
      for (const v of Object.values(demoStrings[l])) expect(v.trim(), l).toBeTruthy()
      for (const [k, v] of Object.entries(benefitValueStrings[l])) expect(v.trim(), `${l}/${k}`).toBeTruthy()
      expect(benefitValueStrings[l].freeNights, l).toContain('{min}')
      expect(benefitValueStrings[l].freeNights, l).toContain('{free}')
      expect(benefitValueStrings[l].amountChip, l).toContain('{amount}')
      expect(benefitValueStrings[l].amountChipNight, l).toContain('{amount}')
      expect(benefitValueStrings[l].nightsNeed, l).toContain('{min}')
    }
  })
})
