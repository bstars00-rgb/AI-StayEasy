import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n'
import { walletStrings, fillW } from '../lib/walletI18n'
import { perkOf } from '../lib/walletView'
import { DeliveryPreview } from './DeliveryPreview'
import type { Subscription } from '../lib/subscription'
import { addDays, PERIOD_DAYS, statusOf, today, useWalletVouchers, wallet, type WalletStatus, type WalletVoucher } from '../lib/voucherWallet'

const PILL: Record<WalletStatus, string> = {
  issued: 'bg-brand-50 text-brand-800 ring-brand-100',
  used: 'bg-sand-100 text-ink-700 ring-black/5',
  expired: 'bg-sand-100 text-ink-600 ring-black/5',
  void: 'bg-rose-50 text-rose-800 ring-rose-100',
}

/**
 * My page section: this period's perk vouchers, the next issue date and the
 * delivery preview. Vouchers are issued here on open (a server would issue and
 * send them on the period's first day).
 */
export function VoucherWallet({ email, name, sub }: { email: string; name: string; sub: Subscription | null }) {
  const { lang } = useLang()
  const w = walletStrings[lang].wallet
  const vouchers = useWalletVouchers(email)
  const [fresh, setFresh] = useState<WalletVoucher[]>([])
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const got = wallet.ensureBatch(email, name, sub)
    if (got.length) setFresh(got)
  }, [email, name, sub])

  if (!sub) {
    return (
      <div>
        <p className="text-sm text-ink-700/80">{w.needSub}</p>
        <Link to="/plans" className="mt-3 inline-block rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">{w.needSubCta}</Link>
      </div>
    )
  }

  const now = today()
  const current = vouchers[0]?.periodStart
  const thisPeriod = vouchers.filter((v) => v.periodStart === current)
  const past = vouchers.filter((v) => v.periodStart !== current)
  const nextDate = current ? addDays(current, PERIOD_DAYS) : ''

  const row = (v: WalletVoucher) => {
    const p = perkOf(v, lang)
    const st = statusOf(v, sub, now)
    return (
      <li key={v.id} className="rounded-xl bg-sand-50 p-3 ring-1 ring-black/5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-ink-900">{p?.hotel.name ?? v.hotelSlug}</p>
            <p className="text-sm font-semibold text-brand-800">{p?.label}</p>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${PILL[st]}`}>{w.status[st]}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-700/70">
          <span>{fillW(w.validUntil, { date: v.validUntil })}</span>
          {v.bookingRef && <span className="rounded-full bg-white px-2 py-0.5 ring-1 ring-black/10">{fillW(w.bookedWith, { ref: v.bookingRef })}</span>}
          <Link to={`/voucher/${v.id}?t=${v.token}`} className="ml-auto font-semibold text-brand-700 hover:underline">{w.open} →</Link>
        </div>
      </li>
    )
  }

  return (
    <div>
      <p className="text-sm text-ink-700/80">{w.intro}</p>

      {fresh.length > 0 && (
        <div role="status" className="mt-3 rounded-xl bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800 ring-1 ring-brand-100">
          {fillW(w.newBatch, { n: fresh.length })}{' '}
          <button onClick={() => setShowPreview((s) => !s)} className="ml-1 font-bold underline">{w.preview}</button>
        </div>
      )}
      {showPreview && fresh.length > 0 && <div className="mt-3"><DeliveryPreview vouchers={fresh} name={name} onClose={() => setShowPreview(false)} /></div>}

      {thisPeriod.length > 0 && (
        <>
          <p className="mt-4 text-xs font-bold text-ink-700/60">{w.title} · {fillW(w.period, { from: thisPeriod[0].validFrom, to: thisPeriod[0].validUntil })}</p>
          <ul className="mt-2 space-y-2">{thisPeriod.map(row)}</ul>
          <p className="mt-2 text-xs text-ink-700/65">{fillW(w.nextBatch, { date: nextDate })}</p>
        </>
      )}

      {past.length > 0 && (
        <>
          <p className="mt-4 text-xs font-bold text-ink-700/60">{w.pastTitle}</p>
          <ul className="mt-2 space-y-2">{past.map(row)}</ul>
        </>
      )}

      <p className="mt-4 rounded-xl bg-sand-50 px-3 py-2 text-xs text-ink-700/75 ring-1 ring-black/5">{w.prototypeNote}</p>
      <Link to="/staff/redeem" className="mt-2 inline-block text-xs font-semibold text-ink-700/70 hover:underline">{w.staffLink}</Link>
    </div>
  )
}
