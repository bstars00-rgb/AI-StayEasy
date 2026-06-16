import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { hotels } from '../data/hotels'
import type { PriceTier } from '../types'
import { partners, campaigns, inquiries, overviewKpis, clicksByCity, feeByPlan, PLANS } from '../data/adminData'
import type { Partner, Plan } from '../data/adminData'
import { useDocumentMeta } from '../lib/useDocumentMeta'

type Section = 'overview' | 'partners' | 'campaigns' | 'inquiries'

const NAV: { key: Section; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: '📊' },
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
  const [query, setQuery] = useState('')
  const [inqFilter, setInqFilter] = useState<'All' | 'New' | 'Contacted' | 'Won' | 'Lost'>('All')
  // Hotels registered through the back-office form (demo: in-memory only).
  const [extraPartners, setExtraPartners] = useState<Partner[]>([])
  const [showRegister, setShowRegister] = useState(false)

  const allPartners = useMemo(() => [...extraPartners, ...partners], [extraPartners])
  const filteredPartners = useMemo(
    () =>
      allPartners.filter(
        (p) =>
          !query ||
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.city.toLowerCase().includes(query.toLowerCase()),
      ),
    [allPartners, query],
  )
  const cityOptions = useMemo(() => [...new Set(hotels.map((h) => h.city))], [])
  const typeOptions = useMemo(() => [...new Set(hotels.map((h) => h.hotelType))], [])

  function registerPartner(f: RegisterFields) {
    const newPartner: Partner = {
      id: `new-${extraPartners.length + 1}`,
      name: f.name.trim(),
      slug: f.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      city: f.city,
      hotelType: f.type,
      tier: f.tier,
      plan: f.plan,
      monthlyFee: feeByPlan[f.plan],
      clicks30d: 0,
      sponsored: false,
      status: 'Pending',
      since: new Date().toISOString().slice(0, 7),
    }
    setExtraPartners((prev) => [newPartner, ...prev])
    setShowRegister(false)
    setSection('partners')
  }

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

          {/* ---- Partners (unified hotel + partner registry) ---- */}
          {section === 'partners' && (
            <div className="rounded-2xl bg-white shadow-card ring-1 ring-black/5">
              <div className="flex flex-col gap-3 border-b border-black/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold text-ink-900">{filteredPartners.length} partners</h2>
                  <p className="text-xs text-ink-600/70">Every listed hotel is managed here — paid plans and free ‘Listed’ hotels together.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search hotels or cities…"
                    className="w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 sm:w-64"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegister(true)}
                    className="shrink-0 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    + Register hotel
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px]">
                  <thead className="bg-sand-50">
                    <tr><Th>Hotel</Th><Th>City</Th><Th>Type</Th><Th>Plan</Th><Th>Monthly</Th><Th>Clicks (30d)</Th><Th>Sponsored</Th><Th>Status</Th><Th>Listing</Th></tr>
                  </thead>
                  <tbody>
                    {filteredPartners.map((p) => (
                      <tr key={p.id} className="border-t border-black/5 hover:bg-sand-50/50">
                        <Td className="font-medium text-ink-900">{p.name}</Td>
                        <Td>{p.city}</Td>
                        <Td className="text-ink-600">{p.hotelType}</Td>
                        <Td><span className="pill bg-brand-50 text-brand-700">{p.plan}</span></Td>
                        <Td>{p.monthlyFee ? `$${p.monthlyFee.toLocaleString()}` : 'Free'}</Td>
                        <Td>{p.clicks30d.toLocaleString()}</Td>
                        <Td>{p.sponsored ? <span className="pill bg-accent-50 text-accent-700 ring-1 ring-accent-200">★</span> : <span className="text-ink-600/40">—</span>}</Td>
                        <Td><span className={`pill ${statusClass(p.status)}`}>{p.status}</span></Td>
                        <Td>
                          {p.status === 'Pending' && p.id.startsWith('new-') ? (
                            <span className="text-ink-600/50">Draft</span>
                          ) : (
                            <Link to={`/hotels/${p.slug}`} className="text-brand-700 hover:underline">View ↗</Link>
                          )}
                        </Td>
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

      {showRegister && (
        <RegisterPartnerModal
          cityOptions={cityOptions}
          typeOptions={typeOptions}
          onClose={() => setShowRegister(false)}
          onSubmit={registerPartner}
        />
      )}
    </div>
  )
}

interface RegisterFields {
  name: string
  city: string
  type: string
  tier: PriceTier
  plan: Plan
  url: string
  contact: string
}

/** Hotel onboarding form. Demo only — no backend; submits into in-memory state. */
function RegisterPartnerModal({
  cityOptions,
  typeOptions,
  onClose,
  onSubmit,
}: {
  cityOptions: string[]
  typeOptions: string[]
  onClose: () => void
  onSubmit: (f: RegisterFields) => void
}) {
  const [f, setF] = useState<RegisterFields>({
    name: '',
    city: cityOptions[0] ?? 'Da Nang',
    type: typeOptions[0] ?? 'City hotel',
    tier: 'mid',
    plan: 'Growth',
    url: '',
    contact: '',
  })
  const set =
    (k: keyof RegisterFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF((prev) => ({ ...prev, [k]: e.target.value }))
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.name.trim()) return
    onSubmit(f)
  }

  const field = 'w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100'
  const label = 'text-xs font-semibold uppercase tracking-wide text-ink-600/70'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-card sm:rounded-3xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-ink-900">Register a hotel</h2>
            <p className="text-sm text-ink-600/70">Onboard a hotel as a partner. It starts as <b>Pending</b> until activated.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-ink-600 hover:bg-sand-100">✕</button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className={label} htmlFor="r-name">Hotel name *</label>
            <input id="r-name" value={f.name} onChange={set('name')} required placeholder="e.g. Riverside Pearl Hotel" className={`mt-1 ${field}`} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="r-city">City</label>
              <select id="r-city" value={f.city} onChange={set('city')} className={`mt-1 ${field}`}>
                {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="r-type">Hotel type</label>
              <select id="r-type" value={f.type} onChange={set('type')} className={`mt-1 ${field}`}>
                {typeOptions.map((tp) => <option key={tp} value={tp}>{tp}</option>)}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="r-tier">Price tier</label>
              <select id="r-tier" value={f.tier} onChange={set('tier')} className={`mt-1 ${field} capitalize`}>
                {(['budget', 'mid', 'premium'] as PriceTier[]).map((tr) => <option key={tr} value={tr}>{tr}</option>)}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="r-plan">Plan</label>
              <select id="r-plan" value={f.plan} onChange={set('plan')} className={`mt-1 ${field}`}>
                {PLANS.map((pl) => <option key={pl} value={pl}>{pl} {feeByPlan[pl] ? `($${feeByPlan[pl]}/mo)` : '(Free)'}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={label} htmlFor="r-url">Official website</label>
            <input id="r-url" value={f.url} onChange={set('url')} placeholder="https://hotel.example/booking" className={`mt-1 ${field}`} />
          </div>
          <div>
            <label className={label} htmlFor="r-contact">Contact email</label>
            <input id="r-contact" type="email" value={f.contact} onChange={set('contact')} placeholder="owner@hotel.example" className={`mt-1 ${field}`} />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-sand-100 px-4 py-2.5 text-sm font-semibold text-ink-800 hover:bg-sand-200">Cancel</button>
          <button type="submit" className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Register partner</button>
        </div>
        <p className="mt-3 text-center text-xs text-ink-600/60">🧪 Demo — saved in memory only (resets on reload).</p>
      </form>
    </div>
  )
}
