import { useState } from 'react'
import type { Hotel } from '../types'
import { useLang } from '../i18n'
import { voucherStrings } from '../lib/voucherI18n'
import { downloadVoucher } from '../lib/voucher'
import { officialLink } from '../lib/officialLink'
import { useGuest } from '../lib/guestAuth'
import { Link, useLocation } from 'react-router-dom'

/**
 * Direct-booking discount voucher. The customer copies the code or downloads a
 * branded SVG coupon, then redeems it on the hotel's official website — StayEasy
 * never processes the booking or payment.
 */
export function VoucherCard({ hotel }: { hotel: Hotel }) {
  const { lang } = useLang()
  const s = voucherStrings[lang]
  const guest = useGuest()
  const location = useLocation()
  const [copied, setCopied] = useState(false)
  const v = hotel.voucher

  // Hotel offers no voucher → an honest notice (not nothing).
  if (!v) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
        <p className="flex items-center gap-2 font-bold text-ink-900">🎟️ {s.noVoucherTitle}</p>
        <p className="mt-1 text-sm text-ink-700/75">{s.noVoucherText}</p>
      </div>
    )
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(v.code)
    } catch {
      /* clipboard blocked — code is still visible to copy manually */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const download = () =>
    downloadVoucher(hotel, {
      heading: s.title,
      validUntilLabel: s.validUntil,
      footer: s.couponFooter,
    })

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-brand-200">
      <div className="bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-4 text-white">
        <p className="flex items-center gap-2 text-base font-bold">
          🎟️ {s.title}
          <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">★ {s.memberBadge}</span>
        </p>
        <p className="mt-0.5 text-sm text-white/85">{s.subtitle}</p>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-lg font-extrabold text-brand-700">{v.discountLabel}</p>

        {guest ? (
          <>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/50">{s.codeLabel}</p>
              <div className="mt-1 flex items-stretch gap-2">
                <code className="flex-1 rounded-xl bg-brand-50 px-4 py-3 text-center font-mono text-xl font-extrabold tracking-[0.2em] text-brand-700 ring-1 ring-brand-200">
                  {v.code}
                </code>
                <button type="button" onClick={copy} aria-label={s.copy} className="shrink-0 rounded-xl bg-ink-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-ink-800">
                  {copied ? `✓ ${s.copied}` : s.copy}
                </button>
              </div>
            </div>

            <dl className="space-y-1.5 rounded-xl bg-sand-50 p-3 text-sm ring-1 ring-black/5">
              <div className="flex gap-2">
                <dt className="shrink-0 font-semibold text-ink-700/60">{s.termsLabel}:</dt>
                <dd className="text-ink-800">{v.terms}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 font-semibold text-ink-700/60">{s.validUntil}:</dt>
                <dd className="text-ink-800">{v.validUntil}</dd>
              </div>
            </dl>

            <p className="rounded-xl bg-brand-50 px-3 py-2.5 text-xs font-medium text-brand-800 ring-1 ring-brand-100">
              {v.redeem === 'onsite'
                ? `📲 ${s.howToUseOnsite}`
                : `🎟️ ${v.fieldLabel ? s.howToUseNamed.replace('{field}', v.fieldLabel) : s.howToUse}`}
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={download} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-ink-900 ring-1 ring-black/10 transition-colors hover:bg-sand-50">
                ⬇ {s.download}
              </button>
              <a href={officialLink(hotel)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
                {s.useOnSite} ↗
              </a>
            </div>

            <p className="text-xs text-ink-700/55">{s.note}</p>
          </>
        ) : (
          <div className="rounded-xl bg-sand-50 p-4 text-center ring-1 ring-black/5">
            <div className="text-2xl" aria-hidden>🔒</div>
            <p className="mt-1 text-sm text-ink-700/80">{s.unlockNote}</p>
            <Link
              to={`/signin?next=${encodeURIComponent(location.pathname + location.search)}`}
              className="mt-3 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              {s.unlock} →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
