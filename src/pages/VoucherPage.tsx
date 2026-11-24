import { useSyncExternalStore } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useLang } from '../i18n'
import { walletStrings, fillW } from '../lib/walletI18n'
import { perkOf, whenText } from '../lib/walletView'
import { QrSvg } from '../components/QrSvg'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { subscription } from '../lib/subscription'
import { formatToken, redeemLink, statusOf, wallet } from '../lib/voucherWallet'

/** The page behind the link in the email / KakaoTalk message. Needs the id and the secret. */
export default function VoucherPage() {
  const { lang } = useLang()
  const s = walletStrings[lang]
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  useDocumentMeta(`${s.voucher.title} — StayEasy`, 'Member perk voucher.')

  // Re-read when the ledger changes (staff marking it used in another tab).
  const raw = useSyncExternalStore(wallet.subscribe, () => JSON.stringify(wallet.open(id, params.get('t') ?? '')), () => 'null')
  const v = JSON.parse(raw) as ReturnType<typeof wallet.open>

  if (!v) {
    return (
      <div className="container-page max-w-md py-16 text-center">
        <h1 className="text-xl font-extrabold text-ink-900">{s.voucher.notFound}</h1>
        <p className="mt-2 text-sm text-ink-700/80">{s.voucher.notFoundText}</p>
        <Link to="/account" className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline">← {s.wallet.title}</Link>
      </div>
    )
  }

  const p = perkOf(v, lang)
  const st = statusOf(v, subscription.get(v.email))
  const live = st === 'issued'

  return (
    <div className="container-page max-w-md py-10">
      <div className="rounded-3xl bg-white p-6 text-center shadow-card ring-1 ring-black/5">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-700/50">{s.voucher.title}</p>
        <h1 className="mt-1 text-xl font-extrabold text-ink-900">{p?.hotel.name ?? v.hotelSlug}</h1>
        <p className="mt-1 text-base font-bold text-brand-800">{p?.label}</p>

        <div className={`mx-auto mt-5 w-56 rounded-2xl p-3 ring-1 ring-black/10 ${live ? 'bg-white' : 'bg-sand-100 opacity-40'}`}>
          <QrSvg text={redeemLink(v)} label={`QR ${formatToken(v.token)}`} className="w-full" />
        </div>
        <p className="mt-3 text-xs text-ink-700/60">{s.voucher.codeLabel}</p>
        <p className="font-mono text-lg font-extrabold tracking-wider text-ink-900">{formatToken(v.token)}</p>

        <p className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-bold ring-1 ${live ? 'bg-brand-50 text-brand-800 ring-brand-100' : 'bg-sand-100 text-ink-700 ring-black/5'}`}>
          {s.wallet.status[st]}
        </p>
        {v.usedAt && <p className="mt-1 text-xs text-ink-700/70">{fillW(s.voucher.usedAt, { when: whenText(v.usedAt, lang) })}</p>}

        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-left text-sm">
          <dt className="text-ink-700/60">{s.voucher.member}</dt><dd className="font-semibold text-ink-900">{v.name}</dd>
          <dt className="text-ink-700/60">{s.voucher.validUntil}</dt><dd className="font-semibold text-ink-900">{v.validUntil}</dd>
          {v.bookingRef && (<><dt className="text-ink-700/60">{s.voucher.bookingLabel}</dt><dd className="font-semibold text-ink-900">{v.bookingRef}</dd></>)}
        </dl>
        {live && (
          <>
            <p className="mt-4 text-sm font-semibold text-ink-800">{s.voucher.showStaff}</p>
            <p className="mt-2 text-xs text-ink-700/70">{s.voucher.howTo}</p>
            <Link to={`/hotels/${v.hotelSlug}`} className="mt-3 inline-block rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">{s.voucher.bookCta} →</Link>
          </>
        )}
        <p className="mt-3 text-xs text-ink-700/60">{s.voucher.note}</p>
      </div>
    </div>
  )
}
