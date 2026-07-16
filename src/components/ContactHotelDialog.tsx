import { useMemo } from 'react'
import type { Hotel } from '../types'
import { useLang } from '../i18n'
import { conciergeStrings } from '../lib/conciergeI18n'
import { contactStrings } from '../lib/contactI18n'
import { resolveChannels } from '../lib/contact'
import { trackEvent } from '../lib/analytics'

/**
 * "Contact the hotel" — a simple launcher for the hotel's OWN messaging
 * channels (chat apps first, then email/phone, website last). StayEasy does
 * not sit in the middle: no message composing, no relay — it just opens the
 * hotel's channel so the traveler talks to them directly.
 */
export function ContactHotelDialog({ hotel, onClose }: { hotel: Hotel; onClose: () => void }) {
  const { lang } = useLang()
  const c = contactStrings[lang]
  const s = conciergeStrings[lang]

  const channels = useMemo(() => resolveChannels(hotel, '', c), [hotel, c])
  const hasChat = channels.some((ch) => ch.chat)
  const hasDirect = channels.some((ch) => ch.key !== 'website')

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-card sm:rounded-3xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-ink-900">{c.title}</h2>
            <p className="text-sm text-ink-700/70">{c.subtitle}</p>
            <p className="mt-1 text-xs text-ink-600/60">{hotel.name}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={s.close} className="grid h-8 w-8 place-items-center rounded-lg text-ink-600 hover:bg-sand-100">✕</button>
        </div>

        {hasChat && <p className="mt-4 text-xs text-brand-700">💬 {c.recommended}</p>}
        {!hasDirect && <p className="mt-4 text-xs text-ink-600/60">{c.noChannels}</p>}

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {channels.map((ch) => (
            <a
              key={ch.key}
              href={ch.href}
              target={ch.key === 'phone' ? undefined : '_blank'}
              rel="noopener noreferrer"
              onClick={() => trackEvent('contact_click', { hotel_slug: hotel.slug, city: hotel.city, hotel_type: hotel.hotelType, channel: ch.key, lang })}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ring-1 transition-colors ${
                ch.chat ? 'bg-brand-50 text-brand-800 ring-brand-200 hover:bg-brand-100' : 'bg-white text-ink-800 ring-black/10 hover:bg-sand-50'
              }`}
              title={ch.key === 'phone' ? c.phoneNote : undefined}
            >
              <span aria-hidden>{ch.icon}</span> {ch.label}
            </a>
          ))}
        </div>

        {hasChat && <p className="mt-3 text-xs text-ink-600/55">{c.chatNote}</p>}
        <p className="mt-2 text-center text-xs text-ink-600/55">{c.disclaimer}</p>
      </div>
    </div>
  )
}
