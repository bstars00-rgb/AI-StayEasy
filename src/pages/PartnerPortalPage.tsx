import { Link, Navigate, useNavigate } from 'react-router-dom'
import { findInCatalogue } from '../data/mockRepo'
import { partners } from '../data/adminData'
import { Logo } from '../components/Logo'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { ClicksTrend } from '../components/ClicksTrend'
import { SearchInsightsPanel } from '../components/SearchInsightsPanel'
import { PartnerInsights } from '../components/PartnerInsights'
import { LANGS, useLang } from '../i18n'
import { partnerStrings } from '../lib/partnerI18n'
import { getPartnerAnalytics } from '../lib/partnerAnalytics'
import type { SplitRow } from '../lib/partnerAnalytics'
import { partnerAuth, usePartnerSession } from '../lib/partnerAuth'
import { useHotelEdits } from '../lib/hotelEdits'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6 ${className}`}>{children}</div>
)

/** Period-over-period change badge: ▲ up (good), ▼ down (bad). */
function Delta({ pct }: { pct: number }) {
  if (pct === 0) return <span className="text-[11px] font-semibold text-ink-500/60">—</span>
  const up = pct > 0
  return (
    <span className={`text-[11px] font-bold ${up ? 'text-emerald-600' : 'text-rose-500'}`}>
      {up ? '▲' : '▼'} {Math.abs(pct)}%
    </span>
  )
}

function Kpi({ label, value, deltaPct, hint }: { label: string; value: string; deltaPct: number; hint: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-600/60">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-2xl font-extrabold text-ink-900">{value}</p>
        <Delta pct={deltaPct} />
      </div>
      <p className="mt-0.5 text-[11px] text-ink-600/55">{hint}</p>
    </div>
  )
}

/** Horizontal share bars (audience / source / device). */
function SplitBars({ rows, label }: { rows: SplitRow[]; label: (key: string) => string }) {
  return (
    <div className="mt-3 space-y-2.5">
      {rows.map((r) => (
        <div key={r.key}>
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-ink-800">{label(r.key)}</span>
            <span className="tabular-nums font-semibold text-ink-700">{r.pct}%</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/5">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${r.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/** 14-day stacked bars: full bar = views, dark portion = official-site clicks. */
function TrendChart({ data, legendViews, legendClicks }: { data: { views: number; clicks: number }[]; legendViews: string; legendClicks: string }) {
  const max = Math.max(...data.map((d) => d.views), 1)
  return (
    <div>
      <div className="flex h-32 items-end gap-1" role="img" aria-label={`${legendViews} / ${legendClicks}`}>
        {data.map((d, i) => (
          <div key={i} className="relative flex-1" style={{ height: `${(d.views / max) * 100}%` }} title={`${d.views} · ${d.clicks}`}>
            <div className="absolute inset-0 rounded-t bg-brand-200" />
            <div className="absolute inset-x-0 bottom-0 rounded-t bg-brand-600" style={{ height: `${(d.clicks / Math.max(d.views, 1)) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-[11px] text-ink-600/70">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-brand-200" /> {legendViews}</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-brand-600" /> {legendClicks}</span>
      </div>
    </div>
  )
}

export default function PartnerPortalPage() {
  useDocumentMeta('Partner portal — StayEasy', 'Manage your StayEasy listing.')
  const { lang } = useLang()
  const t = partnerStrings[lang]
  const r = t.report
  const navigate = useNavigate()
  const session = usePartnerSession()
  useHotelEdits() // re-render after an edit is saved

  if (!session) return <Navigate to="/partner/login" replace />

  const hotel = findInCatalogue(session.slug)
  const partner = partners.find((p) => p.slug === session.slug)
  const a = getPartnerAnalytics(session.slug, partner?.clicks30d ?? 0, hotel?.koreanFriendly)

  const langLabel = (code: string) => {
    const l = LANGS.find((x) => x.code === code)
    return l ? `${l.flag} ${l.label}` : code
  }
  const srcLabel = (k: string) => ({ organic: r.srcOrganic, direct: r.srcDirect, referral: r.srcReferral, social: r.srcSocial }[k] ?? k)
  const devLabel = (k: string) => ({ mobile: r.devMobile, desktop: r.devDesktop, tablet: r.devTablet }[k] ?? k)

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-black/5 bg-white/90 px-4 backdrop-blur sm:px-6 print:hidden">
        <Link to="/" aria-label="StayEasy home" className="rounded-lg hover:opacity-80">
          <Logo size={32} textClass="text-base" />
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-ink-700/70 sm:inline">{session.propertyName}</span>
          <LanguageSwitcher />
          <button
            onClick={() => { partnerAuth.logout(); navigate('/partner/login') }}
            className="rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-ink-800"
          >
            {t.signOut}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        {/* Title + period + print */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-ink-700/60">{t.portal.kicker}</p>
            <h1 className="mt-1 text-2xl font-extrabold text-ink-900 sm:text-3xl">{session.propertyName}</h1>
            {hotel && <p className="mt-1 text-ink-700/75">{hotel.positioningLine}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">{t.portal.plan}: {partner?.plan ?? 'Starter'}</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">{t.portal.status}: {partner?.status ?? 'Listed'}</span>
              <span className="text-ink-600/60">{r.periodLabel.replace('{n}', String(a.rangeDays))}</span>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 ring-1 ring-black/10 hover:bg-sand-50 print:hidden"
          >
            🖨 {r.print}
          </button>
        </div>

        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">{r.demoBanner}</p>

        {/* KPI row */}
        <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink-600/60">{r.overview}</h2>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Kpi label={t.portal.views} value={a.kpis.views.value.toLocaleString()} deltaPct={a.kpis.views.deltaPct} hint={r.viewsHint} />
          <Kpi label={t.portal.unlocks} value={a.kpis.unlocks.value.toLocaleString()} deltaPct={a.kpis.unlocks.deltaPct} hint={r.unlocksHint} />
          <Kpi label={t.portal.officialClicks} value={a.kpis.officialClicks.value.toLocaleString()} deltaPct={a.kpis.officialClicks.deltaPct} hint={r.officialClicksHint} />
          <Kpi label={r.contactClicks} value={a.kpis.contactClicks.value.toLocaleString()} deltaPct={a.kpis.contactClicks.deltaPct} hint={r.contactClicksHint} />
          <Kpi label={r.convRate} value={`${a.kpis.convRate.value}%`} deltaPct={a.kpis.convRate.deltaPct} hint={r.convRateHint} />
        </div>

        {/* Insights: benchmark, completeness, and action cards */}
        {hotel && <PartnerInsights hotel={hotel} analytics={a} />}

        {/* Trend + funnel */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <h2 className="font-bold text-ink-900">{r.trendTitle}</h2>
            <div className="mt-4"><TrendChart data={a.trend} legendViews={r.legendViews} legendClicks={r.legendClicks} /></div>
          </Card>
          <Card>
            <h2 className="font-bold text-ink-900">{t.portal.funnelTitle}</h2>
            <div className="mt-3 space-y-2">
              {([
                { label: t.portal.views, value: a.kpis.views.value, hint: t.portal.viewsHint, pct: 100 },
                { label: t.portal.unlocks, value: a.kpis.unlocks.value, hint: t.portal.unlocksHint, pct: Math.round((a.kpis.unlocks.value / Math.max(a.kpis.views.value, 1)) * 100) },
                { label: t.portal.officialClicks, value: a.kpis.officialClicks.value, hint: t.portal.officialClicksHint, pct: Math.round((a.kpis.officialClicks.value / Math.max(a.kpis.views.value, 1)) * 100) },
              ]).map((s) => (
                <div key={s.label} className="rounded-xl bg-sand-50 p-3 ring-1 ring-black/5">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-semibold text-ink-800">{s.label}</p>
                    <p className="text-lg font-extrabold text-ink-900">{s.value.toLocaleString()}</p>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/5">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.max(6, s.pct)}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] text-ink-600/55">{s.hint}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Breakdowns: language / source / device */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card>
            <h2 className="font-bold text-ink-900">{r.audienceTitle}</h2>
            <p className="text-xs text-ink-600/70">{r.audienceSub}</p>
            <SplitBars rows={a.byLanguage} label={langLabel} />
          </Card>
          <Card>
            <h2 className="font-bold text-ink-900">{r.sourcesTitle}</h2>
            <SplitBars rows={a.bySource} label={srcLabel} />
          </Card>
          <Card>
            <h2 className="font-bold text-ink-900">{r.devicesTitle}</h2>
            <SplitBars rows={a.byDevice} label={devLabel} />
          </Card>
        </div>

        {/* 14-day official-site clicks (kept) + marketing levers */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card>
            <ClicksTrend slug={session.slug} total={partner?.clicks30d ?? 0} t={t.trend} />
          </Card>
          {hotel && (
            <Card>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold text-ink-900">{t.portal.marketing}</h2>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">GA4</span>
              </div>
              <p className="mt-1 text-sm text-ink-700/75">{t.portal.marketingSub}</p>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-600/60">{t.portal.wantTitle}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {hotel.tags.map((tg) => (
                    <span key={tg} className="rounded-full bg-sand-50 px-2.5 py-1 text-xs font-medium text-ink-700 ring-1 ring-black/5">{tg}</span>
                  ))}
                </div>
                {hotel.bestFor.length > 0 && <p className="mt-2 text-xs text-ink-600/65">{t.portal.bestFor} {hotel.bestFor.slice(0, 3).join(' · ')}</p>}
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-600/60">{t.portal.leadWith}</p>
                <ul className="mt-2 space-y-1.5">
                  {[hotel.mainReason, ...hotel.officialBenefits].filter(Boolean).slice(0, 3).map((b) => (
                    <li key={b} className="flex items-start gap-1.5 text-xs text-ink-800"><span className="text-brand-600">★</span> {b}</li>
                  ))}
                </ul>
              </div>
            </Card>
          )}
        </div>

        {/* Search Console */}
        {hotel && <div className="mt-4"><SearchInsightsPanel hotel={hotel} /></div>}

        {/* Listing management + benefits */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="font-bold text-ink-900">{t.portal.yourListing}</h2>
            <p className="mt-1 text-sm text-ink-700/75">{t.portal.yourListingSub}</p>
            <div className="mt-4 flex flex-wrap gap-2 print:hidden">
              <Link to="/partner/edit" className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">{t.portal.editListing}</Link>
              {hotel && <Link to={`/hotels/${hotel.slug}`} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-800 ring-1 ring-black/10 hover:bg-sand-50">{t.portal.viewPublic}</Link>}
            </div>
          </Card>
          <Card>
            <h2 className="font-bold text-ink-900">{t.portal.officialBenefits}</h2>
            {hotel && hotel.officialBenefits.length > 0 ? (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {hotel.officialBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 rounded-xl bg-sand-50 px-3 py-2 text-sm text-ink-800 ring-1 ring-black/5">
                    <span className="text-brand-600">✓</span> {b}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ink-600/70">{t.portal.noBenefits}</p>
            )}
          </Card>
        </div>

        <p className="mt-6 text-center text-xs text-ink-600/55">{t.portal.demoPortalNote}</p>
      </main>
    </div>
  )
}
