import { Link, Navigate, useNavigate } from 'react-router-dom'
import { findInCatalogue } from '../data/mockRepo'
import { partners } from '../data/adminData'
import { Logo } from '../components/Logo'
import { ClicksTrend } from '../components/ClicksTrend'
import { partnerAuth, usePartnerSession } from '../lib/partnerAuth'
import { useHotelEdits } from '../lib/hotelEdits'
import { useHotelThreads } from '../lib/messages'
import { useDocumentMeta } from '../lib/useDocumentMeta'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-sand-50 p-4 ring-1 ring-black/5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-600/60">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-ink-900">{value}</p>
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
  const threads = useHotelThreads(session.slug)

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

        <Link to="/partner/messages" className="mt-4 flex items-center justify-between rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5 transition-colors hover:bg-sand-50">
          <div>
            <p className="font-bold text-ink-900">💬 Guest messages</p>
            <p className="mt-0.5 text-sm text-ink-700/75">Translated requests from guests who booked direct.</p>
          </div>
          <div className="flex items-center gap-2">
            {threads.length > 0 && <span className="grid h-6 min-w-6 place-items-center rounded-full bg-accent-500 px-2 text-xs font-bold text-white">{threads.length}</span>}
            <span className="text-brand-700">→</span>
          </div>
        </Link>

        <div className="mt-4 rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
          <ClicksTrend slug={session.slug} total={partner?.clicks30d ?? 0} />
        </div>

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
