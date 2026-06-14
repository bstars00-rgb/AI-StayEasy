import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'

type Period = 'Last 7 days' | 'Last 30 days' | 'This month'
const periods: Period[] = ['Last 7 days', 'Last 30 days', 'This month']

// Sample figures scale with the selected period (mock only).
const factor: Record<Period, number> = { 'Last 7 days': 1, 'Last 30 days': 4.1, 'This month': 3.6 }

export default function DashboardPage() {
  const t = useT()
  useDocumentMeta(t.dashboard.metaTitle, t.dashboard.metaDesc)
  const [period, setPeriod] = useState<Period>('Last 7 days')
  const f = factor[period]

  const periodLabel: Record<Period, string> = {
    'Last 7 days': t.dashboard.period7,
    'Last 30 days': t.dashboard.period30,
    'This month': t.dashboard.periodMonth,
  }

  const kpis = [
    { icon: '👀', label: t.dashboard.kpiViews, base: 4480, delta: '+12%', fixed: undefined as string | undefined },
    { icon: '↗️', label: t.dashboard.kpiClicks, base: 770, delta: '+23%', fixed: undefined as string | undefined },
    { icon: '🎯', label: t.dashboard.kpiCtr, base: -1, delta: '+1.4pt', fixed: '17.2%' },
    { icon: '📣', label: t.dashboard.kpiImpressions, base: 9900, delta: '+18%', fixed: undefined as string | undefined },
    { icon: '🧑‍🤝‍🧑', label: t.dashboard.kpiTraveler, base: -1, delta: '', fixed: 'Family' },
    { icon: '🌍', label: t.dashboard.kpiMarket, base: -1, delta: '', fixed: '🇰🇷 Korea' },
  ].map((k) => ({ ...k, value: k.fixed ?? Math.round(k.base * f).toLocaleString() }))

  const trafficSources = [
    { src: t.dashboard.src.organic, pct: 34 },
    { src: t.dashboard.src.stayeasy, pct: 28 },
    { src: t.dashboard.src.sponsored, pct: 19 },
    { src: t.dashboard.src.social, pct: 12 },
    { src: t.dashboard.src.direct, pct: 7 },
  ]
  const maxSource = Math.max(...trafficSources.map((s) => s.pct))

  const travelerInterest = [
    { type: t.enums.travelStyle.Family, pct: 42 },
    { type: t.enums.travelStyle.Couple, pct: 24 },
    { type: t.enums.travelStyle.Beach, pct: 18 },
    { type: t.enums.travelStyle.Business, pct: 9 },
    { type: t.enums.travelStyle['Long Stay'], pct: 7 },
  ]

  const content = [
    { title: t.dashboard.content.c1, views: '5,210', clicks: '980', ctr: '18.8%', status: 'Published' },
    { title: t.dashboard.content.c2, views: '3,940', clicks: '910', ctr: '23.1%', status: 'Published' },
    { title: t.dashboard.content.c3, views: '2,180', clicks: '300', ctr: '13.8%', status: 'Published' },
    { title: t.dashboard.content.c4, views: '—', clicks: '—', ctr: '—', status: 'Draft' },
  ]

  const recommendations = [
    { icon: '🇰🇷', t: t.dashboard.reco.r1t, d: t.dashboard.reco.r1d },
    { icon: '🕑', t: t.dashboard.reco.r2t, d: t.dashboard.reco.r2d },
    { icon: '🔘', t: t.dashboard.reco.r3t, d: t.dashboard.reco.r3d },
    { icon: '☀️', t: t.dashboard.reco.r4t, d: t.dashboard.reco.r4d },
  ]

  return (
    <div className="bg-sand-100/60">
      <div className="container-page py-8">
        {/* 1. Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-ink-700/60">{t.dashboard.subtitle}</p>
            <h1 className="text-2xl font-extrabold text-ink-900">{t.dashboard.hotelName}</h1>
          </div>
          <div className="inline-flex rounded-full bg-white p-1 shadow-card ring-1 ring-black/5">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${period === p ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-sand-50'}`}
              >
                {periodLabel[p]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          {t.dashboard.demoNotice}
        </div>

        {/* 2. KPI cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{k.icon}</span>
                {k.delta && <span className="pill bg-brand-50 text-brand-700">{k.delta}</span>}
              </div>
              <div className="mt-3 text-2xl font-extrabold text-ink-900">{k.value}</div>
              <div className="text-sm text-ink-700/70">{k.label}</div>
            </div>
          ))}
        </div>

        {/* 3 & 4. Chart blocks: traffic sources + traveler interest */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
            <h3 className="font-bold text-ink-900">{t.dashboard.trafficTitle}</h3>
            <div className="mt-4 space-y-3">
              {trafficSources.map((s) => (
                <div key={s.src}>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-700/80">{s.src}</span>
                    <span className="font-semibold text-ink-900">{s.pct}%</span>
                  </div>
                  <div className="mt-1 h-2.5 rounded-full bg-sand-100">
                    <div className="h-2.5 rounded-full bg-brand-500" style={{ width: `${(s.pct / maxSource) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
            <h3 className="font-bold text-ink-900">{t.dashboard.interestTitle}</h3>
            <div className="mt-4 flex h-44 items-end gap-3">
              {travelerInterest.map((tv) => (
                <div key={tv.type} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400" style={{ height: `${tv.pct * 2}%` }} title={`${tv.type}: ${tv.pct}%`} />
                  </div>
                  <span className="text-[11px] font-semibold text-ink-900">{tv.pct}%</span>
                  <span className="text-[10px] text-ink-700/60">{tv.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Content performance table */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5">
          <div className="border-b border-black/5 p-5">
            <h3 className="font-bold text-ink-900">{t.dashboard.contentTitle}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-sand-50 text-xs uppercase tracking-wide text-ink-700/60">
                  <th className="p-4">{t.dashboard.colTitle}</th>
                  <th className="p-4">{t.dashboard.colViews}</th>
                  <th className="p-4">{t.dashboard.colClicks}</th>
                  <th className="p-4">{t.dashboard.colCtr}</th>
                  <th className="p-4">{t.dashboard.colStatus}</th>
                </tr>
              </thead>
              <tbody>
                {content.map((c) => (
                  <tr key={c.title} className="border-t border-black/5">
                    <td className="p-4 font-medium text-ink-900">{c.title}</td>
                    <td className="p-4 text-ink-700/80">{c.views}</td>
                    <td className="p-4 text-ink-700/80">{c.clicks}</td>
                    <td className="p-4 text-ink-700/80">{c.ctr}</td>
                    <td className="p-4">
                      <span className={`pill ${c.status === 'Published' ? 'bg-brand-50 text-brand-700' : 'bg-amber-100 text-amber-800'}`}>{c.status === 'Published' ? t.dashboard.published : t.dashboard.draft}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. Recommendations */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <h3 className="font-bold text-ink-900">🤖 {t.dashboard.recoTitle}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {recommendations.map((r) => (
              <div key={r.t} className="flex gap-3 rounded-xl bg-sand-50 p-4 ring-1 ring-black/5">
                <span className="text-xl">{r.icon}</span>
                <div>
                  <p className="font-semibold text-ink-900">{r.t}</p>
                  <p className="text-sm text-ink-700/80">{r.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. CTA */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-ink-900 p-6 text-white sm:flex-row sm:p-8">
          <div>
            <h3 className="text-lg font-extrabold">{t.dashboard.upgradeTitle}</h3>
            <p className="text-sm text-white/75">{t.dashboard.upgradeText}</p>
          </div>
          <Link to="/partners" className="rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-400">
            {t.dashboard.upgradeBtn}
          </Link>
        </div>
      </div>
    </div>
  )
}
