import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n'
import { walletStrings, fillW } from '../lib/walletI18n'
import { perkOf } from '../lib/walletView'
import { DeliveryPreview } from './DeliveryPreview'
import type { Subscription } from '../lib/subscription'
import { addDays, allowanceOf, perkHotels, statusOf, today, useWalletVouchers, wallet, type WalletStatus, type WalletVoucher } from '../lib/voucherWallet'

const PILL: Record<WalletStatus, string> = {
  issued: 'bg-brand-50 text-brand-800 ring-brand-100',
  used: 'bg-sand-100 text-ink-700 ring-black/5',
  expired: 'bg-sand-100 text-ink-600 ring-black/5',
  void: 'bg-rose-50 text-rose-800 ring-rose-100',
}

/**
 * My page section: the allowance for this period, the hotels the member can pick a
 * voucher for, and the vouchers they already hold. Picking a hotel issues one voucher
 * from the allowance (a server would also send it by email / KakaoTalk — here it is a
 * preview). The same hotel can be picked again in a later period.
 */
export function VoucherWallet({ email, name, sub }: { email: string; name: string; sub: Subscription | null }) {
  const { lang } = useLang()
  const w = walletStrings[lang].wallet
  const vouchers = useWalletVouchers(email)
  const [fresh, setFresh] = useState<WalletVoucher | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  if (!sub) {
    return (
      <div>
        <p className="text-sm text-ink-700/80">{w.needSub}</p>
        <Link to="/plans" className="mt-3 inline-block rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">{w.needSubCta}</Link>
      </div>
    )
  }

  const now = today()
  const allowance = allowanceOf(vouchers, sub, now)
  const inPeriod = (v: WalletVoucher) => v.periodStart === allowance.period.start
  const thisPeriod = vouchers.filter(inPeriod)
  const earlier = vouchers.filter((v) => !inPeriod(v))
  const have = new Set(thisPeriod.map((v) => v.hotelSlug))

  const pick = (slug: string) => {
    const r = wallet.claim(email, name, sub, slug)
    if (r.state === 'ok' && r.voucher) {
      setFresh(r.voucher)
      setShowPreview(false)
    }
  }

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
          {v.usedAt && <span className="rounded-full bg-white px-2 py-0.5 ring-1 ring-black/10">{fillW(w.usedOn, { date: v.usedAt.slice(0, 10) })}</span>}
          <Link to={`/voucher/${v.id}?t=${v.token}`} className="ml-auto font-semibold text-brand-700 hover:underline">{w.open} →</Link>
        </div>
      </li>
    )
  }

  return (
    <div>
      <p className="text-sm text-ink-700/80">{w.intro}</p>

      {fresh && (
        <div role="status" className="mt-3 rounded-xl bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800 ring-1 ring-brand-100">
          {fillW(w.newBatch, { hotel: perkOf(fresh, lang)?.hotel.name ?? fresh.hotelSlug })}{' '}
          <button onClick={() => setShowPreview((s) => !s)} className="ml-1 font-bold underline">{w.preview}</button>
        </div>
      )}
      {showPreview && fresh && <div className="mt-3"><DeliveryPreview vouchers={[fresh]} name={name} onClose={() => setShowPreview(false)} /></div>}

      <p className="mt-4 text-sm font-extrabold text-ink-900">{fillW(w.allowance, { left: allowance.left, total: allowance.total })}</p>
      <p className="text-xs text-ink-700/65">{fillW(w.nextBatch, { date: addDays(allowance.period.end, 1) })}</p>

      {thisPeriod.length > 0 && <ul className="mt-3 space-y-2">{thisPeriod.map(row)}</ul>}

      <p className="mt-5 text-xs font-bold text-ink-700/60">{w.pickTitle}</p>
      <p className="mt-1 text-xs text-ink-700/65">{w.pickIntro}</p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {perkHotels().map((h) => {
          const p = perkOf({ hotelSlug: h.slug }, lang)
          const owned = have.has(h.slug)
          return (
            <li key={h.slug} className="flex flex-col justify-between rounded-xl bg-white p-3 ring-1 ring-black/10">
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-ink-900">{p?.hotel.name}</p>
                <p className="text-xs text-ink-700/60">{p?.hotel.city}</p>
                <p className="mt-1 text-sm font-semibold text-brand-800">{p?.label}</p>
              </div>
              {owned ? (
                <span className="mt-2 inline-block text-xs font-semibold text-ink-700/70">✓ {w.inWallet}</span>
              ) : allowance.left > 0 ? (
                <button onClick={() => pick(h.slug)} className="mt-2 rounded-full bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700">{w.getBtn}</button>
              ) : (
                <span className="mt-2 inline-block text-xs font-semibold text-ink-700/50">{w.noneLeft}</span>
              )}
            </li>
          )
        })}
      </ul>

      {earlier.length > 0 && (
        <>
          <p className="mt-5 text-xs font-bold text-ink-700/60">{w.pastTitle}</p>
          <ul className="mt-2 space-y-2">{earlier.map(row)}</ul>
        </>
      )}

      <p className="mt-4 rounded-xl bg-sand-50 px-3 py-2 text-xs text-ink-700/75 ring-1 ring-black/5">{w.prototypeNote}</p>
    </div>
  )
}
