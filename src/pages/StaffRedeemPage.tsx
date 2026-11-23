import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLang } from '../i18n'
import { walletStrings, fillW } from '../lib/walletI18n'
import { perkOf, whenText } from '../lib/walletView'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { formatToken, perkHotels, wallet, type InspectState, type Inspection } from '../lib/voucherWallet'

const HOTEL_KEY = 'stayeasy-staff-hotel'
const loadHotel = (slugs: string[]) => {
  try {
    const s = window.localStorage.getItem(HOTEL_KEY)
    if (s && slugs.includes(s)) return s
  } catch { /* storage unavailable */ }
  return slugs[0] ?? ''
}

/**
 * Demo of the hotel staff screen (scan the QR or type the code → check → mark as given).
 * Real hotels would use their partner portal, and the ledger would live on a server.
 * Without the demo switch there are no perk hotels, so it shows an empty state.
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
  const [result, setResult] = useState<Inspection | null>(null)
  const [done, setDone] = useState(false)

  if (hotels.length === 0) {
    return (
      <div className="container-page max-w-md py-16 text-center">
        <h1 className="text-xl font-extrabold text-ink-900">{s.title}</h1>
        <p className="mt-2 text-sm text-ink-700/80">{s.noHotels}</p>
      </div>
    )
  }

  const pickHotel = (slug: string) => {
    setHotel(slug)
    setResult(null)
    setDone(false)
    try { window.localStorage.setItem(HOTEL_KEY, slug) } catch { /* storage unavailable */ }
  }
  const check = () => { setDone(false); setResult(wallet.inspect(code, hotel)) }
  const confirm = () => {
    const r = wallet.redeem(code, hotel)
    setResult(r)
    setDone(r.state === 'valid')
  }
  const reset = () => { setCode(''); setResult(null); setDone(false) }

  const label: Record<InspectState, string> = {
    valid: s.valid, used: s.used, expired: s.expired, void: s.voidState, wrong_hotel: s.wrongHotel, not_found: s.notFound,
  }
  const v = result?.voucher
  const p = v ? perkOf(v, lang) : null
  const ok = result?.state === 'valid'

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
            onChange={(e) => { setCode(e.target.value); setResult(null); setDone(false) }}
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
          <p className={`text-base font-extrabold ${ok ? 'text-brand-800' : 'text-rose-900'}`}>{done ? s.done : label[result.state]}</p>
          {result.state === 'used' && v?.usedAt && <p className="mt-1 text-xs text-ink-700/70">{fillW(s.usedAt, { when: whenText(v.usedAt, lang) })}</p>}
          {v && result.state !== 'wrong_hotel' && (
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-ink-700/60">{s.perkLabel}</dt><dd className="font-semibold text-ink-900">{p?.label}</dd>
              <dt className="text-ink-700/60">{s.memberLabel}</dt><dd className="font-semibold text-ink-900">{v.name}</dd>
              <dt className="text-ink-700/60">{s.validUntilLabel}</dt><dd className="font-semibold text-ink-900">{v.validUntil}</dd>
              <dt className="text-ink-700/60">#</dt><dd className="font-mono text-xs text-ink-700">{formatToken(v.token)}</dd>
            </dl>
          )}
          {ok && !done && (
            <>
              {p?.eligibility && <p className="mt-3 text-xs font-semibold text-ink-800">{p.eligibility === 'guests' ? s.eligGuests : s.eligAnyone}</p>}
              <button onClick={confirm} className="mt-3 w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">{s.confirm}</button>
            </>
          )}
          {(done || !ok) && <button onClick={reset} className="mt-3 text-sm font-semibold text-ink-700 underline">{s.another}</button>}
        </div>
      )}

      <p className="mt-5 text-xs text-ink-700/60">{s.demoNote}</p>
    </div>
  )
}
