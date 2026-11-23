import { describe, it, expect } from 'vitest'
import { hotels, HEADLINE_BENEFIT } from '../data/hotels'
import { BENEFIT_VALUE } from '../data/benefitValue'
import { localizeHotel } from '../i18n'
import { benefitValueStrings, withPct } from '../lib/benefitValueI18n'
import { parseAmount, savingsFor, formatMoney, DEFAULT_CURRENCY } from '../lib/savings'
import type { Lang } from '../i18n'

const LANGS: Lang[] = ['en', 'ko', 'vi', 'zh', 'ja']
const firstPct = (line: string) => Number(/(\d+(?:\.\d+)?)\s?%/.exec(line)?.[1])

describe('BENEFIT_VALUE matches what the hotel states, checked against the whole catalogue', () => {
  it('every entry repeats the percentage written in its own headline line', () => {
    for (const [slug, v] of Object.entries(BENEFIT_VALUE)) {
      const h = hotels.find((x) => x.slug === slug)
      expect(h, `${slug} is not a hotel`).toBeTruthy()
      const line = h!.officialBenefits[v.line]
      expect(line, `${slug} has no benefit line ${v.line}`).toBeTruthy()
      expect(HEADLINE_BENEFIT[slug], `${slug} is not a headline benefit`).toMatchObject({ line: v.line, kind: 'discount' })
      expect(firstPct(line), `${slug}: "${line}"`).toBe(v.pct)
      expect(!!v.upTo, `${slug} "up to" flag vs wording`).toBe(/\bup to\b/i.test(line))
    }
  })

  it('no headline line that states a percentage is missing from the table', () => {
    for (const [slug, head] of Object.entries(HEADLINE_BENEFIT)) {
      const line = hotels.find((h) => h.slug === slug)!.officialBenefits[head.line]
      if (/\d\s?%/.test(line)) expect(BENEFIT_VALUE[slug], `${slug} states "${line}" but has no figure`).toBeTruthy()
    }
  })

  it('the translated line shown next to the number contains that number, in every language', () => {
    for (const [slug, v] of Object.entries(BENEFIT_VALUE)) {
      const h = hotels.find((x) => x.slug === slug)!
      for (const l of LANGS) {
        expect(localizeHotel(h, l).officialBenefits[v.line], `${slug}/${l}`).toContain(String(v.pct))
      }
    }
  })
})

describe('savings math', () => {
  it('parses typed amounts and ignores junk', () => {
    expect(parseAmount('1,200')).toBe(1200)
    expect(parseAmount('120.5')).toBe(120.5)
    expect(parseAmount('abc')).toBe(0)
    expect(parseAmount('-5')).toBe(5) // a minus sign is not a number we keep
    expect(parseAmount('')).toBe(0)
  })
  it('saves rate x nights x percent', () => {
    expect(savingsFor(200, 3, 10)).toBe(60)
    expect(savingsFor(100000, 2, 15)).toBe(30000)
    expect(savingsFor(0, 3, 10)).toBe(0)
    expect(savingsFor(200, 0, 10)).toBe(0)
  })
  it('formats in the chosen currency without converting', () => {
    expect(formatMoney(60, 'USD', 'en')).toBe('$60')
    expect(formatMoney(30000, 'KRW', 'ko')).toContain('30,000')
    expect(DEFAULT_CURRENCY.ko).toBe('KRW')
  })
})

describe('copy', () => {
  it('has every string in every language, and the percentage templates carry {pct}', () => {
    for (const l of LANGS) {
      const s = benefitValueStrings[l]
      for (const [k, v] of Object.entries(s)) expect(v.trim(), `${l}/${k}`).toBeTruthy()
      expect(s.save, l).toContain('{pct}')
      expect(s.upTo, l).toContain('{pct}')
      expect(s.basis, l).toContain('{pct}')
      expect(withPct(s.save, 15), l).toContain('15')
    }
  })
})
