import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLang } from '../i18n'
import { walletStrings, fillW } from '../lib/walletI18n'
import { perkOf, whenText } from '../lib/walletView'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { formatToken, isBookingRef, perkHotels, wallet, useWalletLedger, type InspectState, type Inspection } from '../lib/voucherWallet'

const HOTEL_KEY = 'stayeasy-staff-hotel'
const loadHotel = (slugs: string[]) => {
  try {
    const s = window.localStorage.getItem(HOTEL_KEY)
    if (s && slugs.includes(s)) return s
  } catch { /* storage unavailable */ }
  return slugs[0] ?? ''
}

/**
 * Demo of the hotel staff screen: scan the QR or type the code, enter the guest's
 * booking number, mark the perk as given. The perk belongs to a booking, so the booking
 * number is required and each number works once per hotel. Real hotels would use their
 * partner portal, and the ledger would live on a server. Without the demo switch there
 * are no perk hotels, so it shows an empty state.
 */
export default function StaffRedeemPage() {
  const { lang } = useLang()
  const s = walletStrings[lang].staff
  useDocumentMeta(`${s.title} — StayEasy`, 'Hotel staff voucher check.')
  const [params] = useSearchParams()
  const hotels = perkHotels()
  const slugs = hotels.map((h) => h.slug)
  const [hotel, setHotel] = useState(() => loadHotel(slugs))
  const [code, setCode] = useState(params.get('c') ?? '')
  const [booking, setBooking] = useState('')
  const [result, setResult] = useState<Inspection | null>(null)
  const [done, setDone] = useState(false)
  const given = useWalletLedger(hotel)

  if (hotels.length === 0) {
    return (
      <div className="container-page max-w-md py-16 text-center">
        <h1 className="text-xl font-extrabold text-ink-900">{s.title}</h1>
        <p className="mt-2 text-sm text-ink-700/80">{s.noHotels}</p>
      </div>
    )
  }

  const clear = () => { setResult(null); setDone(false) }
  const pickHotel = (slug: string) => {
    setHotel(slug)
    clear()
    try { window.localStorage.setItem(HOTEL_KEY, slug) } catch { /* storage unavailable */ }
  }
  const check = () => { setDone(false); setResult(wallet.inspect(code, hotel)) }
  const confirm = () => {
    const r = wallet.redeem(code, hotel, booking)
    setResult(r)
    setDone(r.state === 'valid')
  }
  const reset = () => { setCode(''); setBooking(''); clear() }

  const label: Record<InspectState, string> = {
    valid: s.valid, used: s.used, expired: s.expired, void: s.voidState, wrong_hotel: s.wrongHotel, not_found: s.notFound,
    booking_missing: s.bookingNeeded, booking_reused: s.bookingReused,
  }
  const v = result?.voucher
  const p = v ? perkOf(v, lang) : null
  const ok = result?.state === 'valid'
  // Keep the card open while the staff member fixes the booking number.
  const retry = result?.state === 'booking_missing' || result?.state === 'booking_reused'
  const canGive = (ok || retry) && !done
  const refOk = isBookingRef(booking)

  return (
    <div className="container-page max-w-md py-10">
      <h1 className="text-2xl font-extrabold text-ink-900">{s.title}</h1>
      <p className="mt-1 text-sm text-ink-700/80">{s.intro}</p>

      <div className="mt-5 space-y-3 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
        <label className="block text-sm font-semibold text-ink-800">
          {s.hotelLabel}
          <select value={hotel} onChange={(e) => pickHotel(e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm">
            {hotels.map((h) => <option key={h.slug} value={h.slug}>{h.name}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold text-ink-800">
          {s.codeLabel}
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value); clear() }}
            onKeyDown={(e) => { if (e.key === 'Enter') check() }}
            placeholder={s.codePh}
            autoCapitalize="characters"
            spellCheck={false}
            className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 font-mono text-sm tracking-wider"
          />
        </label>
        <button onClick={check} disabled={!code.trim()} className="w-full rounded-full bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-40">{s.check}</button>
      </div>

      {result && (
        <div role="status" className={`mt-4 rounded-2xl p-5 ring-1 ${ok ? 'bg-brand-50 ring-brand-100' : 'bg-rose-50 ring-rose-100'}`}>
          <p className={`text-base font-extrabold ${ok || done ? 'text-brand-800' : 'text-rose-900'}`}>{done ? s.done : label[result.state]}</p>
          {result.state === 'used' && v?.usedAt && <p className="mt-1 text-xs text-ink-700/70">{fillW(s.usedAt, { when: whenText(v.usedAt, lang) })}</p>}
          {v && result.state !== 'wrong_hotel' && (
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-ink-700/60">{s.perkLabel}</dt><dd className="font-semibold text-ink-900">{p?.label}</dd>
              <dt className="text-ink-700/60">{s.memberLabel}</dt><dd className="font-semibold text-ink-900">{v.name}</dd>
              <dt className="text-ink-700/60">{s.validUntilLabel}</dt><dd className="font-semibold text-ink-900">{v.validUntil}</dd>
              <dt className="text-ink-700/60">#</dt><dd className="font-mono text-xs text-ink-700">{formatToken(v.token)}</dd>
              {v.bookingRef && (<><dt className="text-ink-700/60">{s.bookingLabel}</dt><dd className="font-semibold text-ink-900">{v.bookingRef}</dd></>)}
            </dl>
          )}
          {canGive && (
            <>
              <p className="mt-3 text-xs font-semibold text-ink-800">{s.verifyNote}</p>
              <label className="mt-2 block text-sm font-semibold text-ink-800">
                {s.bookingLabel}
                <input
                  value={booking}
                  onChange={(e) => { setBooking(e.target.value); if (retry) setResult({ state: 'valid', voucher: result.voucher }) }}
                  placeholder={s.bookingPh}
                  spellCheck={false}
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 font-mono text-sm tracking-wide"
                />
              </label>
              {!refOk && <p className="mt-1 text-xs text-ink-700/65">{s.bookingNeeded}</p>}
              <button onClick={confirm} disabled={!refOk} className="mt-3 w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-40">{s.confirm}</button>
            </>
          )}
          {(done || (!ok && !retry)) && <button onClick={reset} className="mt-3 text-sm font-semibold text-ink-700 underline">{s.another}</button>}
        </div>
      )}

      <section className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-black/5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-extrabold text-ink-900">{s.historyTitle}</h2>
          <span className="text-xs font-semibold text-ink-700/70">{fillW(s.historyCount, { n: given.length })}</span>
        </div>
        {given.length === 0 ? (
          <p className="mt-2 text-xs text-ink-700/60">{s.historyEmpty}</p>
        ) : (
          <ul className="mt-2 divide-y divide-black/5 text-xs text-ink-800">
            {given.slice(0, 20).map((g) => (
              <li key={g.id} className="flex flex-wrap justify-between gap-x-3 py-1.5">
                <span>{whenText(g.usedAt!, lang)} · {g.name}</span>
                <span className="font-mono">{g.bookingRef}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-5 text-xs text-ink-700/60">{s.demoNote}</p>
    </div>
  )
}
