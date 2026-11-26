// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { hotels } from '../data/hotels'
import { LANGS, type Lang } from '../i18n'
import { en } from '../i18n/locales/en'
import { ko } from '../i18n/locales/ko'
import { vi as viLocale } from '../i18n/locales/vi'
import { zh } from '../i18n/locales/zh'
import { ja } from '../i18n/locales/ja'
import { brochureFile, brochureStrings } from '../lib/brochureI18n'
import figures from '../../scripts/brochure/figures.json'
import content from '../../scripts/brochure/content.json'

const LOCALES = { en, ko, vi: viLocale, zh, ja }
const CODES = LANGS.map((l) => l.code)

/** Every key path of an object, so two languages can be compared field by field. */
function shape(value: unknown, path = ''): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => shape(v, `${path}[${i}]`))
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([k, v]) => shape(v, `${path}.${k}`))
  return [path]
}

describe('company profile figures', () => {
  it('match the hotel catalogue', () => {
    expect(figures.languages).toBe(CODES.length)
    expect(figures.cities.map((c) => c.city).sort()).toEqual([...new Set(hotels.map((h) => h.city))].sort())
  })

  it('never caps the offer at the size of the catalogue', () => {
    // The profile is for every hotel in the country: no total and no per-city hotel count.
    expect(Object.keys(figures).sort()).toEqual(['cities', 'languages'])
    for (const c of figures.cities) expect(Object.keys(c).sort()).toEqual(['city', 'name'])
    expect(JSON.stringify(content)).not.toContain(String(hotels.length))
  })

  it('use the same city names as the site, in every language', () => {
    for (const c of figures.cities) {
      for (const lang of CODES) {
        const names = LOCALES[lang].enums.city as Record<string, string>
        expect((c.name as Record<Lang, string>)[lang], `${c.city} (${lang})`).toBe(names[c.city] ?? c.city)
      }
    }
  })
})

describe('company profile files', () => {
  it('has the same content fields in every site language', () => {
    expect(Object.keys(content).sort()).toEqual([...CODES].sort())
    for (const lang of CODES) {
      expect(shape(content[lang]).sort(), lang).toEqual(shape(content.en).sort())
      expect(Object.values(brochureStrings[lang]).every((v) => v.trim().length > 0), lang).toBe(true)
    }
  })

  it('ships a PDF for every site language', () => {
    for (const lang of CODES) {
      const file = resolve(process.cwd(), 'public/brochure', brochureFile(lang))
      expect(existsSync(file), file).toBe(true)
      expect(readFileSync(file).subarray(0, 5).toString()).toBe('%PDF-')
    }
  })
})

beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = (q: string) =>
      ({ matches: false, media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false }) as unknown as MediaQueryList
  }
  window.scrollTo = () => {}
  if (!('IntersectionObserver' in window)) {
    // @ts-expect-error minimal stub
    window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return [] } }
  }
})

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  vi.unstubAllEnvs()
  vi.resetModules()
})

/** The business-model switch is read once at module load, so each case re-imports the app. */
async function openAbout(lang: Lang, bm: boolean) {
  window.localStorage.setItem('stayeasy-lang', lang)
  vi.stubEnv('VITE_ENABLE_BM', bm ? 'true' : '')
  vi.resetModules()
  const [{ default: App }, { I18nProvider }, { MemoryRouter }] = await Promise.all([import('../App'), import('../i18n'), import('react-router-dom')])
  render(
    <I18nProvider>
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    </I18nProvider>,
  )
  await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
}

describe('company profile on the site', () => {
  it('offers the PDF of the current language on the About page and in the footer', async () => {
    await openAbout('ko', true)
    for (const id of ['brochure-download', 'brochure-footer-link']) {
      const link = await screen.findByTestId(id)
      expect(link.getAttribute('href')).toBe('/brochure/stayeasy-company-profile-ko.pdf')
      expect(link.getAttribute('download')).toBe('stayeasy-company-profile-ko.pdf')
    }
    expect(screen.getByTestId('brochure-download').textContent).toContain(brochureStrings.ko.button)
  })

  it('follows the language: Vietnamese visitors get the Vietnamese file', async () => {
    await openAbout('vi', true)
    expect((await screen.findByTestId('brochure-download')).getAttribute('href')).toBe('/brochure/stayeasy-company-profile-vi.pdf')
  })

  it('stays hidden while the business-model switch is off', async () => {
    await openAbout('en', false)
    await screen.findAllByRole('heading', { level: 1 })
    expect(screen.queryByTestId('brochure-download')).toBeNull()
    expect(screen.queryByTestId('brochure-footer-link')).toBeNull()
  })
})
