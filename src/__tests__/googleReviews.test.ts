import { describe, it, expect } from 'vitest'
import { parseReviewSummary, safeGoogleUrl, PLACES_LANG, DEFAULT_DISCLOSURE } from '../lib/googleReviews'
import { googleReviewStrings } from '../lib/googleReviewI18n'
import { PLACE_IDS } from '../data/placeIds'
import { hotels } from '../data/hotels'
import type { Lang } from '../i18n'

const LANGS: Lang[] = ['en', 'ko', 'vi', 'zh', 'ja']

describe('parseReviewSummary', () => {
  it('maps Google’s reviewSummary, keeping the text untouched', () => {
    const dto = parseReviewSummary({
      text: { text: 'Guests praise the beach  and the staff.', languageCode: 'en' },
      disclosureText: { text: 'Summarized with Gemini', languageCode: 'en' },
      reviewsUri: 'https://www.google.com/maps/place/?q=place_id:abc',
      flagContentUri: 'https://www.google.com/local/review/rap/report?id=1',
    })
    expect(dto).toEqual({
      text: 'Guests praise the beach  and the staff.',
      textLang: 'en',
      disclosure: 'Summarized with Gemini',
      reviewsUri: 'https://www.google.com/maps/place/?q=place_id:abc',
      flagUri: 'https://www.google.com/local/review/rap/report?id=1',
    })
  })

  it('treats "no summary" as null, not an error', () => {
    expect(parseReviewSummary(undefined)).toBeNull()
    expect(parseReviewSummary({})).toBeNull()
    expect(parseReviewSummary({ text: { text: '   ' } })).toBeNull()
    expect(parseReviewSummary('nope')).toBeNull()
  })

  it('never shows a summary without the AI disclosure', () => {
    expect(parseReviewSummary({ text: { text: 'ok' } })?.disclosure).toBe(DEFAULT_DISCLOSURE)
  })

  it('tolerates a bare-string text field', () => {
    expect(parseReviewSummary({ text: 'plain' })?.text).toBe('plain')
  })

  it('drops links that are not HTTPS Google URLs', () => {
    const dto = parseReviewSummary({ text: { text: 'x' }, reviewsUri: 'javascript:alert(1)', flagContentUri: 'https://evil.example/google.com' })
    expect(dto?.reviewsUri).toBeUndefined()
    expect(dto?.flagUri).toBeUndefined()
  })
})

describe('safeGoogleUrl', () => {
  it('accepts Google maps hosts and short links only over https', () => {
    expect(safeGoogleUrl('https://www.google.com/maps')).toBeTruthy()
    expect(safeGoogleUrl('https://maps.google.com/?cid=1')).toBeTruthy()
    expect(safeGoogleUrl('https://www.google.co.kr/maps')).toBeUndefined()
    expect(safeGoogleUrl('https://google.tk/')).toBeUndefined()
    expect(safeGoogleUrl('https://maps.app.goo.gl/abc')).toBeTruthy()
    expect(safeGoogleUrl('http://www.google.com/maps')).toBeUndefined()
    expect(safeGoogleUrl('https://google.com.evil.example/')).toBeUndefined()
    expect(safeGoogleUrl('https://notgoogle.com/')).toBeUndefined()
    expect(safeGoogleUrl(42)).toBeUndefined()
  })
})

describe('config and copy', () => {
  it('maps every app language to a Places language code', () => {
    for (const l of LANGS) expect(PLACES_LANG[l], l).toBeTruthy()
  })
  it('has the label strings in every language', () => {
    for (const l of LANGS) for (const v of Object.values(googleReviewStrings[l])) expect(v.trim(), l).toBeTruthy()
  })
  it('only lists place IDs for real catalogue slugs', () => {
    const slugs = new Set(hotels.map((h) => h.slug))
    for (const [slug, id] of Object.entries(PLACE_IDS)) {
      expect(slugs.has(slug), `${slug} is not a hotel`).toBe(true)
      expect(id.trim().length, slug).toBeGreaterThan(10)
    }
  })
})
