import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Hotel } from '../types'
import { en, type Locale } from './locales/en'
import { ko } from './locales/ko'
import { vi } from './locales/vi'
import { zh } from './locales/zh'
import { ja } from './locales/ja'
import { hotelContent } from './hotelContent'

export type Lang = 'en' | 'ko' | 'vi' | 'zh' | 'ja'

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
]

const locales: Record<Lang, Locale> = { en, ko, vi, zh, ja }

const STORAGE_KEY = 'stayeasy-lang'

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null
  if (saved && saved in locales) return saved
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

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore storage errors */
    }
  }, [lang])

  const value = useMemo<I18nValue>(() => ({ lang, setLang: setLangState, t: locales[lang] }), [lang])

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

/** Merges translated text fields over the canonical (English) hotel record. */
export function localizeHotel(hotel: Hotel, lang: Lang): Hotel {
  if (lang === 'en') return hotel
  const tx = hotelContent[lang]?.[hotel.id]
  return tx ? { ...hotel, ...tx } : hotel
}
