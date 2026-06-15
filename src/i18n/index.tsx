import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Hotel } from '../types'
import { en, type Locale } from './locales/en'
import type { HotelContentMap } from './hotelContent/types'

export type Lang = 'en' | 'ko' | 'vi' | 'zh' | 'ja'

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
]

// English ships in the main bundle; the other languages are split into separate
// chunks and fetched on demand the first time they're selected.
const localeLoaders: Record<Lang, () => Promise<Locale>> = {
  en: () => Promise.resolve(en),
  ko: () => import('./locales/ko').then((m) => m.ko),
  vi: () => import('./locales/vi').then((m) => m.vi),
  zh: () => import('./locales/zh').then((m) => m.zh),
  ja: () => import('./locales/ja').then((m) => m.ja),
}
const hotelLoaders: Record<Lang, () => Promise<HotelContentMap>> = {
  en: () => Promise.resolve({}),
  ko: () => import('./hotelContent/ko').then((m) => m.ko),
  vi: () => import('./hotelContent/vi').then((m) => m.vi),
  zh: () => import('./hotelContent/zh').then((m) => m.zh),
  ja: () => import('./hotelContent/ja').then((m) => m.ja),
}

// Module-level caches so the synchronous localizeHotel() can read loaded content.
const localeCache: Partial<Record<Lang, Locale>> = { en }
const hotelCache: Partial<Record<Lang, HotelContentMap>> = { en: {} }

async function ensureLang(lang: Lang): Promise<void> {
  if (!localeCache[lang]) localeCache[lang] = await localeLoaders[lang]()
  if (!hotelCache[lang]) hotelCache[lang] = await hotelLoaders[lang]()
}

const STORAGE_KEY = 'stayeasy-lang'

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null
  if (saved && saved in localeLoaders) return saved
  const nav = window.navigator.language.toLowerCase()
  if (nav.startsWith('ko')) return 'ko'
  if (nav.startsWith('vi')) return 'vi'
  if (nav.startsWith('zh')) return 'zh'
  if (nav.startsWith('ja')) return 'ja'
  return 'en'
}

interface I18nValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: Locale
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang)
  const [, bump] = useState(0)

  useEffect(() => {
    let active = true
    document.documentElement.lang = lang
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore storage errors */
    }
    if (!localeCache[lang]) {
      ensureLang(lang).then(() => active && bump((n) => n + 1))
    }
    return () => {
      active = false
    }
  }, [lang])

  // Falls back to English until the selected language's chunk has loaded.
  const t = localeCache[lang] ?? en
  const value = useMemo<I18nValue>(() => ({ lang, setLang: setLangState, t }), [lang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

/** Returns the active locale dictionary. Usage: const t = useT(); t.home.heroTitle */
export function useT(): Locale {
  return useI18n().t
}

/** Returns the active language + setter. */
export function useLang() {
  const { lang, setLang } = useI18n()
  return { lang, setLang }
}

/**
 * Merges translated text fields over the canonical (English) hotel record.
 * Reads from the lazily-loaded cache; returns English until the chunk loads.
 */
export function localizeHotel(hotel: Hotel, lang: Lang): Hotel {
  if (lang === 'en') return hotel
  const tx = hotelCache[lang]?.[hotel.id]
  return tx ? { ...hotel, ...tx } : hotel
}
