import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { partners, campaigns, inquiries, overviewKpis, clicksByCity, feeByPlan } from '../data/adminData'
import type { Partner, Campaign } from '../data/adminData'
import { hotels } from '../data/hotels'
import { campaignDrafts, useCampaignDrafts } from '../lib/campaignDrafts'
import { usePartnerDrafts } from '../lib/partnerDrafts'
import type { HotelDraft } from '../lib/partnerDrafts'
import { countries, getCountry, liveMarkets, roadmapMarkets } from '../data/countries'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { LogoMark } from '../components/Logo'
import { partnerAccounts, usePartnerAccounts } from '../lib/partnerAccounts'
import { MediaManager } from '../components/admin/MediaManager'
import { MarketingEditor } from '../components/admin/MarketingEditor'

type Section = 'overview' | 'partners' | 'media' | 'marketing' | 'approvals' | 'campaigns' | 'inquiries'

const NAV: { key: Section; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: '📊' },
  { key: 'partners', label: 'Partners', icon: '🤝' },
  { key: 'media', label: 'Images', icon: '🖼️' },
  { key: 'marketing', label: 'Marketing', icon: '📣' },
  { key: 'approvals', label: 'Approvals', icon: '✅' },
  { key: 'campaigns', label: 'Campaigns', icon: '🎯' },
  { key: 'inquiries', label: 'Inquiries', icon: '📨' },
]

function statusClass(s: string): string {
  if (['Active', 'Live', 'Won'].includes(s)) return 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'
  if (['Pending', 'Scheduled', 'Contacted', 'New'].includes(s)) return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
  return 'bg-ink-900/5 text-ink-600 ring-1 ring-black/10'
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600/70 ${className}`}>{children}</th>
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`p-3 text-sm text-ink-800 ${className}`}>{children}</td>
}

/** Maps a registered hotel draft to a Partner row for the unified registry. */
function draftToPartner(d: HotelDraft, i: number): Partner {
  return {
    id: `draft-${i}-${d.hotel.slug}`,
    name: d.hotel.name,
    slug: d.hotel.slug,
    country: d.hotel.country,
    city: d.hotel.city,
    hotelType: d.hotel.hotelType,
    tier: d.hotel.priceTier,
    plan: d.plan,
    monthlyFee: feeByPlan[d.plan],
    clicks30d: 0,
    sponsored: d.hotel.isSponsored,
    status: 'Pending',
    since: d.createdAt.slice(0, 7),
  }
}

export default function AdminPage() {
  useDocumentMeta('Back-office — StayEasy Admin', 'Operator console for StayEasy Vietnam (demo).')
  const [searchParams] = useSearchParams()
  const initialSection = (NAV.find((n) => n.key === searchParams.get('tab'))?.key ?? 'overview') as Section
  const [section, setSection] = useState<Section>(initialSection)
  const [navOpen, setNavOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [inqFilter, setInqFilter] = useState<'All' | 'New' | 'Contacted' | 'Won' | 'Lost'>('All')
  const [camp, setCamp] = useState({ slug: hotels[0]?.slug ?? '', slot: 'Homepage hero', period: '', status: 'Scheduled' as Campaign['status'] })

  // Hotels registered through the onboarding page (persisted in localStorage).
  const drafts = usePartnerDrafts()
  const draftCampaigns = useCampaignDrafts()
  const accounts = usePartnerAccounts()
  const pendingCount = accounts.filter((a) => a.status === 'Pending').length
  const allPartners = useMemo(() => [...drafts.map(draftToPartner), ...partners], [drafts])
  const filteredPartners = useMemo(
    () =>
      allPartners.filter(
        (p) =>
          !query ||
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.city.toLowerCase().includes(query.toLowerCase()) ||
          p.country.toLowerCase().includes(query.toLowerCase()),
      ),
    [allPartners, query],
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
          <LogoMark size={36} />
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
              {n.key === 'approvals' && pendingCount > 0 && (
                <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1.5 text-[11px] font-bold text-white">{pendingCount}</span>
              )}
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

              {/* Markets — Asia expansion roadmap */}
              <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-bold text-ink-900">Markets — Asia roadmap</h2>
                  <span className="text-sm text-ink-600/70">{liveMarkets.length} live · {roadmapMarkets.length} coming</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {countries.map((c) => (
                    <span
                      key={c.slug}
                      title={`${c.name} — ${c.region}`}
                      className={`pill ${c.available ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200' : 'bg-sand-100 text-ink-600'}`}
                    >
                      {c.flag} {c.name}{c.available ? ` · ${c.hotelCount}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---- Partners (unified hotel + partner registry) ---- */}
          {section === 'media' && <MediaManager />}

          {section === 'marketing' && <MarketingEditor />}

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
                  <Link
                    to="/admin/register"
                    className="shrink-0 rounded-xl bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    + Register hotel
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1020px]">
                  <thead className="bg-sand-50">
                    <tr><Th>Hotel</Th><Th>Country</Th><Th>City</Th><Th>Type</Th><Th>Plan</Th><Th>Monthly</Th><Th>Clicks (30d)</Th><Th>Sponsored</Th><Th>Status</Th><Th>Content</Th><Th>Listing</Th></tr>
                  </thead>
                  <tbody>
                    {filteredPartners.map((p) => (
                      <tr key={p.id} className="border-t border-black/5 hover:bg-sand-50/50">
                        <Td className="font-medium text-ink-900">{p.name}</Td>
                        <Td>{getCountry(p.country)?.flag ?? '🏳️'} {p.country}</Td>
                        <Td>{p.city}</Td>
                        <Td className="text-ink-600">{p.hotelType}</Td>
                        <Td><span className="pill bg-brand-50 text-brand-700">{p.plan}</span></Td>
                        <Td>{p.monthlyFee ? `$${p.monthlyFee.toLocaleString()}` : 'Free'}</Td>
                        <Td>{p.clicks30d.toLocaleString()}</Td>
                        <Td>{p.sponsored ? <span className="pill bg-accent-50 text-accent-700 ring-1 ring-accent-200">★</span> : <span className="text-ink-600/40">—</span>}</Td>
                        <Td><span className={`pill ${statusClass(p.status)}`}>{p.status}</span></Td>
                        <Td>
                          <Link to={`/admin/hotels/${p.slug}/edit`} className="font-semibold text-brand-700 hover:underline">Edit</Link>
                        </Td>
                        <Td>
                          <Link to={`/hotels/${p.slug}`} className="text-brand-700 hover:underline">
                            {p.id.startsWith('draft-') ? 'Preview ↗' : 'View ↗'}
                          </Link>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---- Approvals (partner account requests) ---- */}
          {section === 'approvals' && (
            <div className="rounded-2xl bg-white shadow-card ring-1 ring-black/5">
              <div className="border-b border-black/5 p-4">
                <h2 className="font-bold text-ink-900">{accounts.length} partner account{accounts.length === 1 ? '' : 's'}</h2>
                <p className="text-xs text-ink-600/70">Hotels that signed up with email + password. Approve to grant portal access and create their listing.</p>
              </div>
              {accounts.length === 0 ? (
                <div className="p-10 text-center text-sm text-ink-600/70">No account requests yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px]">
                    <thead className="bg-sand-50">
                      <tr><Th>Hotel</Th><Th>Email</Th><Th>City</Th><Th>Requested</Th><Th>Status</Th><Th>Action</Th></tr>
                    </thead>
                    <tbody>
                      {accounts.map((a) => (
                        <tr key={a.id} className="border-t border-black/5 hover:bg-sand-50/50">
                          <Td className="font-medium text-ink-900">{a.hotelName}</Td>
                          <Td className="text-ink-600">{a.email}</Td>
                          <Td>{a.city || '—'}</Td>
                          <Td className="text-ink-600">{a.createdAt}</Td>
                          <Td><span className={`pill ${statusClass(a.status === 'Approved' ? 'Active' : a.status === 'Pending' ? 'Pending' : 'Lost')}`}>{a.status}</span></Td>
                          <Td>
                            {a.status === 'Pending' ? (
                              <div className="flex gap-2">
                                <button onClick={() => partnerAccounts.approve(a.id)} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700">Approve</button>
                                <button onClick={() => partnerAccounts.reject(a.id)} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 ring-1 ring-black/10 hover:bg-sand-50">Reject</button>
                              </div>
                            ) : a.status === 'Approved' && a.hotelSlug ? (
                              <Link to={`/hotels/${a.hotelSlug}`} className="text-brand-700 hover:underline">View listing ↗</Link>
                            ) : (
                              <span className="text-ink-600/40">—</span>
                            )}
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ---- Campaigns ---- */}
          {section === 'campaigns' && (() => {
            const allCampaigns = [...draftCampaigns, ...campaigns]
            const createCampaign = (e: React.FormEvent) => {
              e.preventDefault()
              const h = hotels.find((x) => x.slug === camp.slug)
              if (!h || !camp.period.trim()) return
              campaignDrafts.add({ hotel: h.name, city: h.city, slot: camp.slot, period: camp.period.trim(), status: camp.status })
              setCamp((c) => ({ ...c, period: '' }))
            }
            return (
              <div className="space-y-4">
                <form onSubmit={createCampaign} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5 sm:p-5">
                  <h2 className="font-bold text-ink-900">New campaign</h2>
                  <p className="mt-0.5 text-xs text-ink-600/70">Book a sponsored placement for a hotel. Delivery (impressions/clicks) fills in once it runs.</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <label className="lg:col-span-2"><span className="text-xs font-semibold text-ink-600/70">Hotel</span>
                      <select value={camp.slug} onChange={(e) => setCamp((c) => ({ ...c, slug: e.target.value }))} className="mt-1 w-full rounded-lg border border-black/10 bg-sand-50 px-3 py-2 text-sm outline-none focus:border-brand-400">
                        {hotels.map((h) => <option key={h.slug} value={h.slug}>{h.name} · {h.city}</option>)}
                      </select>
                    </label>
                    <label><span className="text-xs font-semibold text-ink-600/70">Slot</span>
                      <select value={camp.slot} onChange={(e) => setCamp((c) => ({ ...c, slot: e.target.value }))} className="mt-1 w-full rounded-lg border border-black/10 bg-sand-50 px-3 py-2 text-sm outline-none focus:border-brand-400">
                        {['Homepage hero', 'Homepage featured', 'City top', 'Search top', 'Detail sidebar'].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </label>
                    <label><span className="text-xs font-semibold text-ink-600/70">Period</span>
                      <input value={camp.period} onChange={(e) => setCamp((c) => ({ ...c, period: e.target.value }))} placeholder="Jul–Aug 2026" className="mt-1 w-full rounded-lg border border-black/10 bg-sand-50 px-3 py-2 text-sm outline-none focus:border-brand-400" />
                    </label>
                    <label><span className="text-xs font-semibold text-ink-600/70">Status</span>
                      <select value={camp.status} onChange={(e) => setCamp((c) => ({ ...c, status: e.target.value as Campaign['status'] }))} className="mt-1 w-full rounded-lg border border-black/10 bg-sand-50 px-3 py-2 text-sm outline-none focus:border-brand-400">
                        {(['Scheduled', 'Live', 'Ended'] as const).map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </label>
                  </div>
                  <button type="submit" className="mt-3 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">+ Add campaign</button>
                </form>

                <div className="rounded-2xl bg-white shadow-card ring-1 ring-black/5">
                  <div className="border-b border-black/5 p-4"><h2 className="font-bold text-ink-900">{allCampaigns.length} sponsored campaigns</h2></div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px]">
                      <thead className="bg-sand-50">
                        <tr><Th>Hotel</Th><Th>Slot</Th><Th>Period</Th><Th>Impressions</Th><Th>Clicks</Th><Th>CTR</Th><Th>Status</Th><Th></Th></tr>
                      </thead>
                      <tbody>
                        {allCampaigns.map((c) => (
                          <tr key={c.id} className="border-t border-black/5 hover:bg-sand-50/50">
                            <Td className="font-medium text-ink-900">{c.hotel}</Td>
                            <Td><span className="pill bg-accent-50 text-accent-700">{c.slot}</span></Td>
                            <Td className="text-ink-600">{c.period}</Td>
                            <Td>{c.impressions.toLocaleString()}</Td>
                            <Td>{c.clicks.toLocaleString()}</Td>
                            <Td className="font-semibold text-ink-900">{c.ctr}</Td>
                            <Td><span className={`pill ${statusClass(c.status)}`}>{c.status}</span></Td>
                            <Td>{c.id.startsWith('camp-draft-') && <button onClick={() => campaignDrafts.remove(c.id)} className="text-xs font-semibold text-rose-600 hover:underline">Remove</button>}</Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          })()}

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
