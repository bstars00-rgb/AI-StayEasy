import type { Hotel } from '../types'
import type { Lang } from '../i18n'
import { localizeHotel } from '../i18n'
import { DEMO_HOTELS } from '../data/demoHotels'
import type { WalletVoucher } from './voucherWallet'

const LOCALE: Record<Lang, string> = { en: 'en-US', ko: 'ko-KR', ja: 'ja-JP', vi: 'vi-VN', zh: 'zh-CN' }

/** What a voucher is, in the viewer's language: the hotel and the perk headline. */
export function perkOf(v: Pick<WalletVoucher, 'hotelSlug'>, lang: Lang): { hotel: Hotel; label: string } | null {
  const base = DEMO_HOTELS.find((h) => h.slug === v.hotelSlug)
  if (!base) return null
  const h = localizeHotel(base, lang)
  return { hotel: h, label: h.voucher?.discountLabel ?? '' }
}

/** A timestamp for people: local date and time in the viewer's language. */
export const whenText = (iso: string, lang: Lang) => new Date(iso).toLocaleString(LOCALE[lang], { dateStyle: 'medium', timeStyle: 'short' })
