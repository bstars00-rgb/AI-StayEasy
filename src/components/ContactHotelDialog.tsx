import { useMemo, useState } from 'react'
import type { Hotel } from '../types'
import { useLang } from '../i18n'
import { conciergeStrings, REQUEST_KEYS } from '../lib/conciergeI18n'
import type { RequestKey } from '../lib/conciergeI18n'
import { contactStrings } from '../lib/contactI18n'
import { composeMessage, resolveChannels } from '../lib/contact'
import { trackEvent } from '../lib/analytics'

const inputCls = 'w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

export function ContactHotelDialog({ hotel, onClose }: { hotel: Hotel; onClose: () => void }) {
  const { lang } = useLang()
  const c = contactStrings[lang]
  const s = conciergeStrings[lang]
  const hotelLang = hotel.contact?.lang ?? 'en'
  const [picked, setPicked] = useState<RequestKey[]>([])
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)

  const message = useMemo(() => composeMessage(picked, note, lang, hotelLang), [picked, note, lang, hotelLang])
  const channels = useMemo(() => resolveChannels(hotel, message, c), [hotel, message, c])
  const hasDirect = channels.some((ch) => ch.key !== 'website')

  const toggle = (k: RequestKey) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]))
  const copy = async () => {
    try { await navigator.clipboard.writeText(message) } catch { /* clipboard blocked */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-card sm:rounded-3xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-ink-900">{c.title}</h2>
            <p className="text-sm text-ink-700/70">{c.subtitle}</p>
            <p className="mt-1 text-xs text-ink-600/60">{hotel.name}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={s.close} className="grid h-8 w-8 place-items-center rounded-lg text-ink-600 hover:bg-sand-100">✕</button>
        </div>

        {/* Build a translated message */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">{s.requestsLabel}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {REQUEST_KEYS.map((k) => (
              <button type="button" key={k} onClick={() => toggle(k)} className={`pill border ${picked.includes(k) ? 'border-brand-600 bg-brand-600 text-white' : 'border-black/10 bg-white text-ink-700 hover:bg-sand-50'}`}>
                {s.request[k]}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-3 block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">{s.noteLabel}</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder={s.notePh} className={`mt-1 ${inputCls}`} />
        </label>

        {message && (
          <div className="mt-3 rounded-xl bg-sand-50 p-3 ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-ink-700/60">🌐 {c.previewLabel}</p>
              <button type="button" onClick={copy} className="text-xs font-semibold text-brand-700 hover:underline">{copied ? c.copied : c.copy}</button>
            </div>
            <p className="mt-1 whitespace-pre-line text-sm text-ink-800">{message}</p>
          </div>
        )}

        {/* Channels */}
        {hasDirect && <p className="mt-4 text-xs text-brand-700">💡 {c.recommended}</p>}
        {!hasDirect && <p className="mt-4 text-xs text-ink-600/60">{c.noChannels}</p>}
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {channels.map((ch) => (
            <a
              key={ch.key}
              href={ch.href}
              target={ch.key === 'phone' ? undefined : '_blank'}
              rel="noopener noreferrer"
              onClick={() => trackEvent('contact_click', { hotel_slug: hotel.slug, city: hotel.city, hotel_type: hotel.hotelType, channel: ch.key, lang })}
              className={`flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-semibold ring-1 transition-colors ${
                ch.chat ? 'bg-brand-50 text-brand-800 ring-brand-200 hover:bg-brand-100' : 'bg-white text-ink-800 ring-black/10 hover:bg-sand-50'
              }`}
              title={ch.key === 'phone' ? c.phoneNote : undefined}
            >
              <span><span aria-hidden>{ch.icon}</span> {ch.label}</span>
              {ch.prefill && <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] text-white">✓ msg</span>}
            </a>
          ))}
        </div>

        <p className="mt-3 text-center text-xs text-ink-600/55">StayEasy doesn’t process bookings or host the chat — you contact the hotel directly.</p>
      </div>
    </div>
  )
}
