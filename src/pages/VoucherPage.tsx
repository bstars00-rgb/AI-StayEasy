import { useEffect, useState, useSyncExternalStore } from 'react'
import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { useLang } from '../i18n'
import { walletStrings, fillW } from '../lib/walletI18n'
import { perkOf, whenText } from '../lib/walletView'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { useGuest } from '../lib/guestAuth'
import { useSubscription } from '../lib/subscription'
import { DEMO_PIN, LOCK_MINUTES, statusOf, wallet, type RedeemResult } from '../lib/voucherWallet'

/**
 * The page behind the link in the email / KakaoTalk message — the voucher the member
 * shows on their phone at check-in. It opens only for the signed-in subscriber who owns
 * it (a forwarded link or a screenshot gets nobody in), and it carries a live clock so a
 * screenshot is easy to spot. Hotel staff confirm use by typing the hotel's PIN on this
 * screen; the voucher is then stamped used, once.
 */
export default function VoucherPage() {
  const { lang } = useLang()
  const s = walletStrings[lang]
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const token = params.get('t') ?? ''
  const location = useLocation()
  const guest = useGuest()
  const sub = useSubscription(guest?.email)
  useDocumentMeta(`${s.voucher.title} — StayEasy`, 'Member perk voucher.')

  // Re-read when the ledger changes (this tab or another).
  const raw = useSyncExternalStore(wallet.subscribe, () => JSON.stringify(wallet.open(id, token)), () => 'null')
  const v = JSON.parse(raw) as ReturnType<typeof wallet.open>

  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const [pinOpen, setPinOpen] = useState(false)
  const [pin, setPin] = useState('')
  const [result, setResult] = useState<RedeemResult | null>(null)

  // Sign-in first: the link works for the subscriber, not for whoever holds it.
  if (!guest) return <Navigate to={`/signin?next=${encodeURIComponent(location.pathname + location.search)}`} replace />

  if (!v || v.email !== guest.email) {
    return (
      <div className="container-page max-w-md py-16 text-center">
        <h1 className="text-xl font-extrabold text-ink-900">{s.voucher.notFound}</h1>
        <p className="mt-2 text-sm text-ink-700/80">{s.voucher.notFoundText}</p>
        <Link to="/account" className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline">← {s.wallet.title}</Link>
      </div>
    )
  }

  const st = statusOf(v, sub, now.toISOString().slice(0, 10))
  if (st === 'void') {
    return (
      <div className="container-page max-w-md py-16 text-center">
        <h1 className="text-xl font-extrabold text-ink-900">{s.voucher.title}</h1>
        <p className="mt-2 text-sm text-ink-700/80">{s.voucher.subscribersOnly}</p>
        <Link to="/plans" className="mt-4 inline-block rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">{s.wallet.needSubCta}</Link>
      </div>
    )
  }

  const p = perkOf(v, lang)
  const live = st === 'issued'
  const lockedLeft = v.lockedUntil && v.lockedUntil > now.toISOString() ? Math.max(1, Math.ceil((Date.parse(v.lockedUntil) - now.getTime()) / 60_000)) : 0

  const confirm = (e: React.FormEvent) => {
    e.preventDefault()
    const r = wallet.redeem(id, token, pin)
    setResult(r)
    setPin('')
    if (r.state === 'ok') setPinOpen(false)
  }
  const note =
    lockedLeft > 0 || result?.state === 'locked'
      ? fillW(s.voucher.pinLocked, { m: lockedLeft || LOCK_MINUTES })
      : result?.state === 'wrong_pin'
        ? fillW(s.voucher.pinWrong, { n: result.triesLeft ?? 0 })
        : ''

  return (
    <div className="container-page max-w-md py-10">
      <div className={`rounded-3xl bg-white p-6 text-center shadow-card ring-1 ring-black/5 ${live ? '' : 'opacity-80'}`}>
        <p className="text-xs font-bold uppercase tracking-wide text-ink-700/50">{s.voucher.title}</p>
        <h1 className="mt-1 text-xl font-extrabold text-ink-900">{p?.hotel.name ?? v.hotelSlug}</h1>
        <p className="mt-1 text-lg font-extrabold text-brand-800">{p?.label}</p>

        <p className={`mt-4 inline-block rounded-full px-4 py-1.5 text-sm font-bold ring-1 ${live ? 'bg-brand-50 text-brand-800 ring-brand-100' : 'bg-sand-100 text-ink-700 ring-black/5'}`}>
          {st === 'used' ? `✓ ${s.wallet.status.used}` : s.wallet.status[st]}
        </p>
        {v.usedAt && <p className="mt-1 text-xs text-ink-700/70">{fillW(s.voucher.usedAt, { when: whenText(v.usedAt, lang) })}</p>}

        {live && (
          <p aria-label={s.voucher.now} className="mt-4 font-mono text-2xl font-extrabold tabular-nums text-ink-900">
            {[now.getHours(), now.getMinutes(), now.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':')}
          </p>
        )}

        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-left text-sm">
          <dt className="text-ink-700/60">{s.voucher.member}</dt><dd className="font-semibold text-ink-900">{v.name}</dd>
          <dt className="text-ink-700/60">{s.voucher.validUntil}</dt><dd className="font-semibold text-ink-900">{v.validUntil}</dd>
          <dt className="text-ink-700/60">{s.voucher.codeLabel}</dt><dd className="font-mono text-xs text-ink-700">{v.id.slice(2).toUpperCase()}</dd>
        </dl>

        {live && (
          <>
            <p className="mt-4 text-sm font-semibold text-ink-800">{s.voucher.showStaff}</p>
            {pinOpen ? (
              <form onSubmit={confirm} className="mt-3 rounded-2xl bg-sand-50 p-4 text-left ring-1 ring-black/5">
                <p className="text-sm font-extrabold text-ink-900">{s.voucher.pinTitle}</p>
                <label className="mt-2 block text-sm font-semibold text-ink-800">
                  {s.voucher.pinLabel}
                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={8}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder={s.voucher.pinPh}
                    disabled={lockedLeft > 0}
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-center font-mono text-lg tracking-[0.4em] disabled:opacity-50"
                  />
                </label>
                {note && <p role="alert" className="mt-2 text-sm font-semibold text-rose-700">{note}</p>}
                <p className="mt-2 text-xs text-ink-700/60">{fillW(s.voucher.demoPin, { pin: DEMO_PIN })}</p>
                <div className="mt-3 flex gap-2">
                  <button type="submit" disabled={pin.length < 4 || lockedLeft > 0} className="flex-1 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-40">{s.voucher.pinConfirm}</button>
                  <button type="button" onClick={() => { setPinOpen(false); setPin(''); setResult(null) }} className="rounded-full px-4 py-2.5 text-sm font-semibold text-ink-700 ring-1 ring-black/10 hover:bg-white">{s.voucher.pinCancel}</button>
                </div>
              </form>
            ) : (
              <button onClick={() => setPinOpen(true)} className="mt-3 w-full rounded-full bg-ink-900 px-4 py-3 text-sm font-semibold text-white hover:bg-ink-800">{s.voucher.useBtn}</button>
            )}
            <Link to={`/hotels/${v.hotelSlug}`} className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline">{s.voucher.bookCta} →</Link>
          </>
        )}
        <p className="mt-4 text-xs text-ink-700/60">{s.voucher.note}</p>
      </div>
    </div>
  )
}
