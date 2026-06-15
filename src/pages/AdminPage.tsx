import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { hotels } from '../data/hotels'
import { partners, campaigns, inquiries, overviewKpis, clicksByCity } from '../data/adminData'
import { useDocumentMeta } from '../lib/useDocumentMeta'

type Section = 'overview' | 'hotels' | 'partners' | 'campaigns' | 'inquiries'

const NAV: { key: Section; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: '📊' },
  { key: 'hotels', label: 'Hotels', icon: '🏨' },
  { key: 'partners', label: 'Partners', icon: '🤝' },
  { key: 'campaigns', label: 'Campaigns', icon: '📣' },
  { key: 'inquiries', label: 'Inquiries', icon: '📨' },
]

function statusClass(s: string): string {
  if (['Active', 'Live', 'Won'].includes(s)) return 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'
  if (['Pending', 'Scheduled', 'Contacted', 'New'].includes(s)) return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
  return 'bg-ink-900/5 text-ink-600 ring-1 ring-black/10'
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600/70 ${className}`}>{children}</th>
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`p-3 text-sm text-ink-800 ${className}`}>{children}</td>
}

export default function AdminPage() {
  useDocumentMeta('Back-office — StayEasy Admin', 'Operator console for StayEasy Vietnam (demo).')
  const [section, setSection] = useState<Section>('overview')
  const [navOpen, setNavOpen] = useState(false)
  const [hotelQuery, setHotelQuery] = useState('')
  const [inqFilter, setInqFilter] = useState<'All' | 'New' | 'Contacted' | 'Won' | 'Lost'>('All')

  const filteredHotels = useMemo(
    () =>
      hotels.filter(
        (h) =>
          !hotelQuery ||
          h.name.toLowerCase().includes(hotelQuery.toLowerCase()) ||
          h.city.toLowerCase().includes(hotelQuery.toLowerCase()),
      ),
    [hotelQuery],
  )
  const filteredInquiries = inquiries.filter((i) => inqFilter === 'All' || i.status === inqFilter)
  const maxCityClicks = Math.max(...clicksByCity.map((c) => c.clicks), 1)

  const sectionTitle = NAV.find((n) => n.key === section)?.label ?? ''

  return (
    <div className="flex min-h-screen bg-sand-50 font-sans text-ink-800">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-ink-900 text-white transition-transform lg:static lg:translate-x-0 ${
          navOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 px-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-lg">🏨</span>
          <div className="leading-tight">
            <div className="font-display font-extrabold">StayEasy</div>
            <div className="text-[11px] uppercase tracking-wider text-brand-300">Back-office</div>
          </div>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => {
                setSection(n.key)
                setNavOpen(false)
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                section === n.key ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span aria-hidden>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 space-y-2 p-4">
          <Link to="/" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white">
            ← Back to site
          </Link>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/70">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-500/20 text-brand-200">OP</span>
            <div className="leading-tight">
              <div className="font-semibold text-white">Operator (demo)</div>
              <div className="text-white/50">global_ops</div>
            </div>
          </div>
        </div>
      </aside>

      {navOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setNavOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-black/5 bg-white/85 px-4 backdrop-blur sm:px-6">
          <button
            className="grid h-10 w-10 place-items-center rounded-lg text-ink-900 hover:bg-sand-100 lg:hidden"
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <h1 className="text-lg font-extrabold text-ink-900">{sectionTitle}</h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 sm:inline">
              🧪 Demo · mock data
            </span>
            <Link to="/dashboard" className="rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-ink-800">
              Partner view
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {/* ---- Overview ---- */}
          {section === 'overview' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {overviewKpis.map((k) => (
                  <div key={k.label} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{k.icon}</span>
                      <span className="pill bg-brand-50 text-brand-700">{k.delta}</span>
                    </div>
                    <div className="mt-3 text-2xl font-extrabold text-ink-900">{k.value}</div>
                    <div className="text-sm text-ink-600/80">{k.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 lg:col-span-2">
                  <h2 className="font-bold text-ink-900">Official-site clicks by city (30d)</h2>
                  <div className="mt-4 space-y-3">
                    {clicksByCity.map((c) => (
                      <div key={c.city}>
                        <div className="flex justify-between text-sm">
                          <span className="text-ink-700/80">{c.city}</span>
                          <span className="font-semibold text-ink-900">{c.clicks.toLocaleString()}</span>
                        </div>
                        <div className="mt-1 h-2.5 rounded-full bg-sand-100">
                          <div className="h-2.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${(c.clicks / maxCityClicks) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
                  <h2 className="font-bold text-ink-900">Latest inquiries</h2>
                  <div className="mt-3 space-y-2">
                    {inquiries.slice(0, 5).map((i) => (
                      <div key={i.id} className="flex items-center justify-between rounded-xl bg-sand-50 px-3 py-2 ring-1 ring-black/5">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-ink-900">{i.hotel}</div>
                          <div className="text-xs text-ink-600/70">{i.city} · {i.planInterest}</div>
                        </div>
                        <span className={`pill ${statusClass(i.status)}`}>{i.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---- Hotels ---- */}
          {section === 'hotels' && (
            <div className="rounded-2xl bg-white shadow-card ring-1 ring-black/5">
              <div className="flex flex-col gap-3 border-b border-black/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-bold text-ink-900">{filteredHotels.length} hotels</h2>
                <input
                  value={hotelQuery}
                  onChange={(e) => setHotelQuery(e.target.value)}
                  placeholder="Search hotels or cities…"
                  className="w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 sm:w-72"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px]">
                  <thead className="bg-sand-50">
                    <tr><Th>Hotel</Th><Th>City</Th><Th>Type</Th><Th>Tier</Th><Th>Sponsored</Th><Th>Status</Th></tr>
                  </thead>
                  <tbody>
                    {filteredHotels.map((h) => (
                      <tr key={h.id} className="border-t border-black/5 hover:bg-sand-50/50">
                        <Td className="font-medium text-ink-900">{h.name.replace(' (Sample)', '')}</Td>
                        <Td>{h.city}</Td>
                        <Td className="text-ink-600">{h.hotelType}</Td>
                        <Td><span className="pill bg-sand-100 text-ink-700 capitalize">{h.priceTier}</span></Td>
                        <Td>{h.isSponsored ? <span className="pill bg-accent-50 text-accent-700 ring-1 ring-accent-200">★ Sponsored</span> : <span className="text-ink-600/50">—</span>}</Td>
                        <Td><span className="pill bg-brand-50 text-brand-700 ring-1 ring-brand-200">Published</span></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---- Partners ---- */}
          {section === 'partners' && (
            <div className="rounded-2xl bg-white shadow-card ring-1 ring-black/5">
              <div className="border-b border-black/5 p-4"><h2 className="font-bold text-ink-900">{partners.length} partners</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead className="bg-sand-50">
                    <tr><Th>Hotel</Th><Th>City</Th><Th>Plan</Th><Th>Monthly</Th><Th>Clicks (30d)</Th><Th>Since</Th><Th>Status</Th></tr>
                  </thead>
                  <tbody>
                    {partners.map((p) => (
                      <tr key={p.id} className="border-t border-black/5 hover:bg-sand-50/50">
                        <Td className="font-medium text-ink-900">{p.name}</Td>
                        <Td>{p.city}</Td>
                        <Td><span className="pill bg-brand-50 text-brand-700">{p.plan}</span></Td>
                        <Td>{p.monthlyFee ? `$${p.monthlyFee.toLocaleString()}` : 'Free'}</Td>
                        <Td>{p.clicks30d.toLocaleString()}</Td>
                        <Td className="text-ink-600">{p.since}</Td>
                        <Td><span className={`pill ${statusClass(p.status)}`}>{p.status}</span></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---- Campaigns ---- */}
          {section === 'campaigns' && (
            <div className="rounded-2xl bg-white shadow-card ring-1 ring-black/5">
              <div className="border-b border-black/5 p-4"><h2 className="font-bold text-ink-900">{campaigns.length} sponsored campaigns</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead className="bg-sand-50">
                    <tr><Th>Hotel</Th><Th>Slot</Th><Th>Period</Th><Th>Impressions</Th><Th>Clicks</Th><Th>CTR</Th><Th>Status</Th></tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c) => (
                      <tr key={c.id} className="border-t border-black/5 hover:bg-sand-50/50">
                        <Td className="font-medium text-ink-900">{c.hotel}</Td>
                        <Td><span className="pill bg-accent-50 text-accent-700">{c.slot}</span></Td>
                        <Td className="text-ink-600">{c.period}</Td>
                        <Td>{c.impressions.toLocaleString()}</Td>
                        <Td>{c.clicks.toLocaleString()}</Td>
                        <Td className="font-semibold text-ink-900">{c.ctr}</Td>
                        <Td><span className={`pill ${statusClass(c.status)}`}>{c.status}</span></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---- Inquiries ---- */}
          {section === 'inquiries' && (
            <div className="rounded-2xl bg-white shadow-card ring-1 ring-black/5">
              <div className="flex flex-col gap-3 border-b border-black/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-bold text-ink-900">{filteredInquiries.length} inquiries</h2>
                <div className="flex flex-wrap gap-1.5">
                  {(['All', 'New', 'Contacted', 'Won', 'Lost'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setInqFilter(f)}
                      className={`pill border ${inqFilter === f ? 'border-ink-900 bg-ink-900 text-white' : 'border-black/10 bg-white text-ink-700 hover:bg-sand-50'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px]">
                  <thead className="bg-sand-50">
                    <tr><Th>Hotel</Th><Th>City</Th><Th>Contact</Th><Th>Plan interest</Th><Th>Date</Th><Th>Status</Th></tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.map((i) => (
                      <tr key={i.id} className="border-t border-black/5 hover:bg-sand-50/50">
                        <Td className="font-medium text-ink-900">{i.hotel}</Td>
                        <Td>{i.city}</Td>
                        <Td className="text-ink-600">{i.contact}</Td>
                        <Td><span className="pill bg-brand-50 text-brand-700">{i.planInterest}</span></Td>
                        <Td className="text-ink-600">{i.date}</Td>
                        <Td><span className={`pill ${statusClass(i.status)}`}>{i.status}</span></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
