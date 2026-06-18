import type { Hotel } from '../types'
import type { Lang } from '../i18n'
import { conciergeStrings } from './conciergeI18n'
import type { RequestKey } from './conciergeI18n'
import { translatePhrase } from './translate'
import { officialLink } from './officialLink'

export interface ResolvedChannel {
  key: string
  label: string
  icon: string
  href: string
  /** Whether this channel's link carries the pre-written message. */
  prefill: boolean
  chat: boolean
}

const digits = (s: string) => s.replace(/[^0-9]/g, '')
const tel = (s: string) => s.replace(/[^0-9+]/g, '')

/** Writes the guest's requests + note as one message in the hotel's language. */
export function composeMessage(requests: RequestKey[], note: string, guestLang: Lang, hotelLang: Lang): string {
  const lines: string[] = []
  if (requests.length) lines.push(requests.map((k) => conciergeStrings[hotelLang].request[k]).join(', '))
  if (note.trim()) lines.push(translatePhrase(note.trim(), guestLang, hotelLang).text)
  return lines.join('\n')
}

/**
 * Resolves a hotel's contact channels into ready-to-open links. Chat apps come
 * first (easiest across languages); the official website is always last as a
 * fallback. WhatsApp and email carry the pre-written message; the rest just open
 * the channel (the guest pastes the copied message).
 */
export function resolveChannels(
  hotel: { contact?: Hotel['contact']; officialWebsiteUrl: string; name: string; city: string },
  message: string,
  t: { website: string; email: string; phone: string },
): ResolvedChannel[] {
  const c = hotel.contact ?? {}
  const enc = encodeURIComponent(message)
  const out: ResolvedChannel[] = []

  if (c.whatsapp) out.push({ key: 'whatsapp', label: 'WhatsApp', icon: '🟢', chat: true, prefill: !!message, href: `https://wa.me/${digits(c.whatsapp)}${message ? `?text=${enc}` : ''}` })
  if (c.zalo) out.push({ key: 'zalo', label: 'Zalo', icon: '🔵', chat: true, prefill: false, href: `https://zalo.me/${digits(c.zalo)}` })
  if (c.kakao) out.push({ key: 'kakao', label: 'KakaoTalk', icon: '🟡', chat: true, prefill: false, href: c.kakao })
  if (c.line) out.push({ key: 'line', label: 'LINE', icon: '🟢', chat: true, prefill: false, href: `https://line.me/R/ti/p/${encodeURIComponent(c.line)}` })
  if (c.messenger) out.push({ key: 'messenger', label: 'Messenger', icon: '🔵', chat: true, prefill: false, href: `https://m.me/${c.messenger}` })
  if (c.email) out.push({ key: 'email', label: t.email, icon: '✉️', chat: false, prefill: !!message, href: `mailto:${c.email}${message ? `?subject=${encodeURIComponent('Guest request via StayEasy')}&body=${enc}` : ''}` })
  if (c.phone) out.push({ key: 'phone', label: t.phone, icon: '📞', chat: false, prefill: false, href: `tel:${tel(c.phone)}` })

  out.push({ key: 'website', label: t.website, icon: '🌐', chat: false, prefill: false, href: officialLink(hotel) })
  return out
}
