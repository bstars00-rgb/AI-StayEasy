import { Link, Navigate, useNavigate } from 'react-router-dom'
import { findInCatalogue } from '../data/mockRepo'
import { partners } from '../data/adminData'
import { Logo } from '../components/Logo'
import { ClicksTrend } from '../components/ClicksTrend'
import { partnerAuth, usePartnerSession } from '../lib/partnerAuth'
import { useHotelEdits } from '../lib/hotelEdits'
import { useDocumentMeta } from '../lib/useDocumentMeta'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-sand-50 p-4 ring-1 ring-black/5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-600/60">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-ink-900">{value}</p>
    </div>
  )
}

/** Booking-intent funnel: View → Voucher unlock → Official-site click. The
 *  demo derives counts from the 30-day clicks; with GA4 connected these are
 *  read from the real `hotel_view` / `voucher_unlock` / `official_site_click`
 *  events instrumented across the site. */
function FunnelStep({ label, value, hint, pct }: { label: string; value: number; hint: string; pct: number }) {
  return (
    <div className="rounded-xl bg-sand-50 p-3 ring-1 ring-black/5">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold text-ink-800">{label}</p>
        <p className="text-lg font-extrabold text-ink-900">{value.toLocaleString()}</p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/5">
        <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.max(6, pct)}%` }} />
      </div>
      <p className="mt-1 text-[11px] text-ink-600/55">{hint}</p>
    </div>
  )
}

export default function PartnerPortalPage() {
  useDocumentMeta('Partner portal — StayEasy', 'Manage your StayEasy listing.')
  const navigate = useNavigate()
  const session = usePartnerSession()
  useHotelEdits() // re-render after an edit is saved

  if (!session) return <Navigate to="/partner/login" replace />

  const hotel = findInCatalogue(session.slug)
  const partner = partners.find((p) => p.slug === session.slug)

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-black/5 bg-white/90 px-4 backdrop-blur sm:px-6">
        <Logo size={32} textClass="text-base" />
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-ink-700/70 sm:inline">{session.propertyName}</span>
          <button
            onClick={() => { partnerAuth.logout(); navigate('/partner/login') }}
            className="rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-ink-800"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-4 sm:p-6">
        <p className="text-sm text-ink-700/60">Partner portal</p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink-900">{session.propertyName}</h1>
        {hotel && <p className="mt-1 text-ink-700/75">{hotel.positioningLine}</p>}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat label="Plan" value={partner?.plan ?? 'Starter'} />
          <Stat label="Status" value={partner?.status ?? 'Listed'} />
          <Stat label="Clicks (30d)" value={(partner?.clicks30d ?? 0).toLocaleString()} />
        </div>

        <div className="mt-4 rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
          <ClicksTrend slug={session.slug} total={partner?.clicks30d ?? 0} />
        </div>

        {hotel && (() => {
          // Demo funnel from 30-day clicks (the official-site-click event).
          const clicks = partner?.clicks30d ?? 0
          const views = Math.round(clicks * 6.2)
          const unlocks = Math.round(clicks * 1.6)
          return (
            <div className="mt-4 rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold text-ink-900">Marketing insights</h2>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">GA4</span>
              </div>
              <p className="mt-1 text-sm text-ink-700/75">What travelers do on your page, and what to put front and center.</p>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-600/60">Booking-intent funnel · 30 days</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                <FunnelStep label="Views" value={views} hint="Travelers who opened your page" pct={100} />
                <FunnelStep label="Voucher unlocks" value={unlocks} hint="Signed in for your direct-booking voucher" pct={Math.round((unlocks / Math.max(views, 1)) * 100)} />
                <FunnelStep label="Official-site clicks" value={clicks} hint="Headed to your booking site" pct={Math.round((clicks / Math.max(views, 1)) * 100)} />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-600/60">What travelers want from you</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {hotel.tags.map((tg) => (
                      <span key={tg} className="rounded-full bg-sand-50 px-2.5 py-1 text-xs font-medium text-ink-700 ring-1 ring-black/5">{tg}</span>
                    ))}
                  </div>
                  {hotel.bestFor.length > 0 && (
                    <p className="mt-2 text-xs text-ink-600/65">Best for: {hotel.bestFor.slice(0, 3).join(' · ')}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-600/60">Lead your marketing with</p>
                  <ul className="mt-2 space-y-1.5">
                    {[hotel.mainReason, ...hotel.officialBenefits].filter(Boolean).slice(0, 3).map((b) => (
                      <li key={b} className="flex items-start gap-1.5 text-xs text-ink-800"><span className="text-brand-600">★</span> {b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-4 rounded-xl bg-sand-50 px-3 py-2 text-[11px] text-ink-600/65 ring-1 ring-black/5">
                🧪 Funnel figures are demo estimates. Connect GA4 (set VITE_GA_ID) and these fill with live <code>hotel_view</code>, <code>voucher_unlock</code> and <code>official_site_click</code> events — including top search terms and demand by traveler type.
              </p>
            </div>
          )
        })()}

        <div className="mt-4 rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
          <h2 className="font-bold text-ink-900">Your listing</h2>
          <p className="mt-1 text-sm text-ink-700/75">Keep your description, official benefits, photo, and voucher up to date — changes appear on your public page right away.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/partner/edit" className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Edit your listing</Link>
            {hotel && (
              <Link to={`/hotels/${hotel.slug}`} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-800 ring-1 ring-black/10 hover:bg-sand-50">View public page ↗</Link>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
          <h2 className="font-bold text-ink-900">Official booking benefits</h2>
          {hotel && hotel.officialBenefits.length > 0 ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {hotel.officialBenefits.map((b) => (
                <li key={b} className="flex items-start gap-2 rounded-xl bg-sand-50 px-3 py-2 text-sm text-ink-800 ring-1 ring-black/5">
                  <span className="text-brand-600">✓</span> {b}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-ink-600/70">No benefits yet — add them in your listing.</p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-ink-600/55">🧪 Demo portal — edits are saved in your browser. A real build syncs to the partner backend for the whole team.</p>
      </main>
    </div>
  )
}
