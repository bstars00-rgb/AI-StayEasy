import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useLang, useT } from '../i18n'
import { accountStrings } from '../lib/accountI18n'
import { memberStrings, fill } from '../lib/memberI18n'
import { plansStrings } from '../lib/plansI18n'
import { guestAuth, useGuest } from '../lib/guestAuth'
import { subscription, useSubscription } from '../lib/subscription'
import { useWishlist } from '../lib/wishlist'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const Card = ({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) => (
  <section id={id} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
    <h2 className="text-base font-extrabold text-ink-900">{title}</h2>
    <div className="mt-3">{children}</div>
  </section>
)

/** "My page": profile, subscription management, member vouchers, account actions. */
export default function AccountPage() {
  const { lang } = useLang()
  const t = useT()
  const as = accountStrings[lang]
  const m = memberStrings[lang].mypage
  const ps = plansStrings[lang]
  useDocumentMeta(`${m.title} — StayEasy`, 'Your StayEasy profile and subscription.')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const guest = useGuest()
  const sub = useSubscription(guest?.email)
  const { count } = useWishlist()
  const [askCancel, setAskCancel] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [askDelete, setAskDelete] = useState(false)

  if (!guest) return <Navigate to="/signin?next=/account" replace />

  const planName = sub ? ps.plans[sub.plan].name : ''
  const periodLabel = sub ? ps.periods[sub.period].label : ''
  const justSubscribed = params.get('subscribed') === '1' && !!sub && !cancelled

  const cancelSub = () => {
    subscription.cancel(guest.email)
    setAskCancel(false)
    setCancelled(true)
  }

  const deleteAccount = () => {
    guestAuth.deleteAccount()
    navigate('/', { replace: true })
  }

  const btn = 'rounded-full px-4 py-2 text-sm font-semibold transition-colors'

  return (
    <div className="container-page max-w-2xl py-10">
      <nav className="mb-4 text-sm text-ink-700/60">
        <Link to="/" className="hover:text-brand-700">{t.common.home}</Link> <span className="px-1">/</span> {m.title}
      </nav>
      <h1 className="text-2xl font-extrabold text-ink-900">{m.title}</h1>

      {justSubscribed && sub && (
        <p role="status" className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800 ring-1 ring-brand-100">
          ✓ {fill(m.subDone, { plan: planName, period: periodLabel })}
        </p>
      )}
      {cancelled && (
        <p role="status" className="mt-4 rounded-2xl bg-sand-100 px-4 py-3 text-sm font-semibold text-ink-800 ring-1 ring-black/5">
          {m.subCancelled}
        </p>
      )}

      <div className="mt-5 space-y-5">
        {/* Profile */}
        <section className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
          {guest.picture ? (
            <img src={guest.picture} alt="" className="h-14 w-14 rounded-full" />
          ) : (
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-600 text-xl font-bold text-white">{guest.name.charAt(0).toUpperCase()}</span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-extrabold text-ink-900">
              {guest.name} <span className="ml-1 rounded-full bg-brand-50 px-2 py-0.5 align-middle text-xs font-semibold text-brand-700">{as.member}</span>
            </p>
            <p className="truncate text-sm text-ink-600/70">{as.signedInAs} {guest.email}</p>
            <p className="text-xs text-ink-600/55">{m.joined} {guest.joinedAt}</p>
          </div>
          <button onClick={() => guestAuth.signOut()} className={`${btn} shrink-0 text-ink-700 ring-1 ring-black/10 hover:bg-sand-50`}>{as.signOut}</button>
        </section>

        {/* Subscription */}
        <Card id="subscription" title={m.subTitle}>
          {sub ? (
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight text-ink-900">{planName}</span>
                <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-sm font-semibold text-ink-700">{periodLabel}</span>
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 ring-1 ring-amber-200">{m.subStatus}</span>
              </div>
              <p className="mt-1 text-sm text-ink-700/80">{ps.plans[sub.plan].kicker}</p>
              <p className="mt-3 text-xs text-ink-700/65">{m.subRequested} {sub.requestedAt} · {ps.periods[sub.period].hint}</p>
              <p className="mt-2 rounded-xl bg-sand-50 px-3 py-2 text-xs text-ink-700/80 ring-1 ring-black/5">{m.subStatusNote}</p>

              {askCancel ? (
                <div className="mt-4 rounded-xl bg-rose-50 p-3 ring-1 ring-rose-100">
                  <p className="text-sm font-semibold text-rose-900">{m.subCancelAsk}</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={cancelSub} className={`${btn} bg-rose-600 text-white hover:bg-rose-700`}>{m.subCancelYes}</button>
                    <button onClick={() => setAskCancel(false)} className={`${btn} text-ink-700 ring-1 ring-black/10 hover:bg-white`}>{m.subCancelNo}</button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to="/plans" className={`${btn} bg-ink-900 text-white hover:bg-ink-800`}>{m.subChange}</Link>
                  <button onClick={() => setAskCancel(true)} className={`${btn} text-ink-700 ring-1 ring-black/10 hover:bg-sand-50`}>{m.subCancel}</button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-ink-700/80">{m.subNone}</p>
              <Link to="/plans" className={`${btn} mt-3 inline-block bg-brand-600 text-white hover:bg-brand-700`}>{m.subNoneCta}</Link>
            </div>
          )}
        </Card>

        {/* Member-only vouchers — hotels supply these; none exist yet, and none are invented. */}
        <Card title={m.voucherTitle}>
          <p className="text-sm text-ink-700/80">{m.voucherEmpty}</p>
          <Link to="/destinations/da-nang" className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline">{m.voucherCta} →</Link>
        </Card>

        <Card title={m.wishlist}>
          <Link to="/wishlist" className="text-sm font-semibold text-brand-700 hover:underline">{m.wishlist} ({count}) →</Link>
        </Card>

        {/* Account management */}
        <Card title={m.manageTitle}>
          {askDelete ? (
            <div className="rounded-xl bg-rose-50 p-3 ring-1 ring-rose-100">
              <p className="text-sm font-semibold text-rose-900">{m.deleteAsk}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={deleteAccount} className={`${btn} bg-rose-600 text-white hover:bg-rose-700`}>{m.deleteYes}</button>
                <button onClick={() => setAskDelete(false)} className={`${btn} text-ink-700 ring-1 ring-black/10 hover:bg-white`}>{m.deleteNo}</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAskDelete(true)} className="text-sm font-semibold text-rose-700 hover:underline">{m.deleteBtn}</button>
          )}
        </Card>
      </div>
    </div>
  )
}
