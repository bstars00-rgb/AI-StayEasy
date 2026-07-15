import { Link } from 'react-router-dom'
import { useLang, useT } from '../i18n'
import type { Hotel } from '../types'
import type { PartnerAnalytics } from '../lib/partnerAnalytics'
import { getBenchmark, getCompleteness, getInsights } from '../lib/partnerInsights'
import { insightStrings } from '../lib/insightsI18n'

/** Replace {token}s in a template with values (leaves unknown tokens intact). */
const fill = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`))

const TONE = {
  action: { bg: 'bg-amber-50', ring: 'ring-amber-200', chip: 'bg-amber-100 text-amber-700', icon: '→' },
  watch: { bg: 'bg-rose-50', ring: 'ring-rose-200', chip: 'bg-rose-100 text-rose-600', icon: '!' },
  good: { bg: 'bg-emerald-50', ring: 'ring-emerald-200', chip: 'bg-emerald-100 text-emerald-700', icon: '✓' },
} as const

/** One benchmark metric: your value vs the peer average, as paired mini-bars. */
function BenchRow({ label, youVal, peerVal, youNum, peerNum, youTag, peerTag }: {
  label: string; youVal: string; peerVal: string; youNum: number; peerNum: number; youTag: string; peerTag: string
}) {
  const max = Math.max(youNum, peerNum, 1)
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold text-ink-700/70">{label}</p>
      <div className="mt-1.5 space-y-1.5">
        {[
          { tag: youTag, val: youVal, w: (youNum / max) * 100, cls: 'bg-brand-600' },
          { tag: peerTag, val: peerVal, w: (peerNum / max) * 100, cls: 'bg-ink-300' },
        ].map((r) => (
          <div key={r.tag} className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-[11px] text-ink-600/70">{r.tag}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/5">
              <div className={`h-full rounded-full ${r.cls}`} style={{ width: `${Math.max(4, r.w)}%` }} />
            </div>
            <span className="w-16 shrink-0 text-right text-xs font-bold tabular-nums text-ink-900">{r.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Insights panel — turns the portal's raw analytics into a peer benchmark, a
 * listing-completeness gauge, and a few plain-language action cards. Everything
 * is computed on the client from the existing deterministic analytics.
 */
export function PartnerInsights({ hotel, analytics }: { hotel: Hotel; analytics: PartnerAnalytics }) {
  const { lang } = useLang()
  const t = useT()
  const s = insightStrings[lang]

  const bench = getBenchmark(hotel, analytics)
  const comp = getCompleteness(hotel)
  const insights = getInsights(hotel, analytics, bench, comp)

  const cityLabel = (t.enums.city as Record<string, string>)[hotel.city] ?? hotel.city
  const basisTpl = bench.basis === 'cityStar' ? s.basisCityStar : bench.basis === 'city' ? s.basisCity : s.basisCountry
  // starRating may be undefined; the cityStar template is only chosen when it exists.
  const basisText = fill(basisTpl, { n: bench.peers, star: hotel.conditions.starRating ?? '', city: cityLabel, country: hotel.country })

  const standLabel = bench.standing === 'above' ? s.above : bench.standing === 'below' ? s.below : s.onpar
  const standCls = bench.standing === 'above' ? 'bg-emerald-50 text-emerald-700' : bench.standing === 'below' ? 'bg-rose-50 text-rose-600' : 'bg-sand-100 text-ink-700'

  return (
    <section className="mt-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-600/60">{s.title}</h2>
      </div>
      <p className="mt-1 text-sm text-ink-700/70">{s.subtitle}</p>

      {/* Action cards */}
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((ins, i) => {
          const tone = TONE[ins.tone]
          return (
            <div key={i} className={`flex items-start gap-2.5 rounded-2xl ${tone.bg} p-3.5 ring-1 ${tone.ring}`}>
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold ${tone.chip}`}>{tone.icon}</span>
              <p className="text-sm leading-snug text-ink-800">{fill(s.rules[ins.key], ins.vars)}</p>
            </div>
          )
        })}
      </div>

      {/* Benchmark + completeness */}
      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-ink-900">{s.benchTitle}</h3>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${standCls}`}>{standLabel}</span>
          </div>
          <p className="mt-0.5 text-xs text-ink-600/70">{basisText}</p>
          <BenchRow
            label={s.convLabel}
            youTag={s.you} peerTag={s.peers}
            youVal={`${bench.yourConv}%`} peerVal={`${bench.peerConv}%`}
            youNum={bench.yourConv} peerNum={bench.peerConv}
          />
          <BenchRow
            label={s.viewsLabel}
            youTag={s.you} peerTag={s.peers}
            youVal={bench.yourViews.toLocaleString()} peerVal={bench.peerViews.toLocaleString()}
            youNum={bench.yourViews} peerNum={bench.peerViews}
          />
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-ink-900">{s.compTitle}</h3>
            <span className="text-sm font-extrabold text-ink-900">{fill(s.compPct, { n: comp.pct })}</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/5">
            <div className={`h-full rounded-full ${comp.pct >= 80 ? 'bg-emerald-500' : comp.pct >= 50 ? 'bg-brand-500' : 'bg-amber-500'}`} style={{ width: `${Math.max(4, comp.pct)}%` }} />
          </div>
          {comp.missing.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-600/55">{s.toFinish}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {comp.missing.map((k) => (
                  <span key={k} className="rounded-full bg-sand-50 px-2.5 py-1 text-xs font-medium text-ink-700 ring-1 ring-black/5">{s.items[k]}</span>
                ))}
              </div>
              <Link to="/partner/edit" className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline print:hidden">{s.fix}</Link>
            </div>
          ) : (
            <p className="mt-3 text-sm text-emerald-700">{s.compAllDone}</p>
          )}
        </div>
      </div>
    </section>
  )
}
