import type { Lang } from '../i18n'

/**
 * Currencies offered in the savings calculator. No conversion happens: the
 * visitor types the rate in whatever currency the official site shows, and the
 * result comes back in that same currency.
 */
export const CURRENCIES = ['KRW', 'USD', 'VND', 'JPY', 'CNY'] as const
export type Currency = (typeof CURRENCIES)[number]

export const DEFAULT_CURRENCY: Record<Lang, Currency> = { ko: 'KRW', en: 'USD', vi: 'VND', ja: 'JPY', zh: 'CNY' }

const LOCALE: Record<Lang, string> = { ko: 'ko-KR', en: 'en-US', vi: 'vi-VN', ja: 'ja-JP', zh: 'zh-CN' }

/** Parse what a visitor typed ("120", "1,200", "120.5"); anything unusable is 0. */
export function parseAmount(input: string): number {
  const n = Number(input.replace(/[^\d.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n : 0
}

/** Amount saved = rate x nights x pct%, rounded to a whole unit. */
export function savingsFor(rate: number, nights: number, pct: number): number {
  if (!(rate > 0) || !(nights > 0)) return 0
  return Math.round((rate * nights * pct) / 100)
}

export function formatMoney(amount: number, currency: Currency, lang: Lang): string {
  return new Intl.NumberFormat(LOCALE[lang], { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

/** Free nights are worth the rate for each free night, and only once the stay is long enough. */
export function freeNightsSaving(rate: number, nights: number, minNights: number, freeNights: number): number {
  if (!(rate > 0) || nights < minNights) return 0
  return Math.round(rate * freeNights)
}
