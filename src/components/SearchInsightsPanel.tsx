import type { Hotel } from '../types'
import { useAsync } from '../lib/useAsync'
import { getSearchInsights } from '../lib/searchInsights'

/**
 * "How travelers find you on Google" — Google Search Console data for the
 * partner's own hotel page: which search terms surface it, with impressions,
 * clicks, CTR and average position. Demo data until the backend + service
 * account are wired (see docs/SEARCH_CONSOLE_PLAN.md).
 */
function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-sand-50 p-3 ring-1 ring-black/5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-600/60">{label}</p>
      <p className="mt-0.5 text-lg font-extrabold text-ink-900">{value}</p>
      {sub && <p className="text-[11px] text-ink-600/55">{sub}</p>}
    </div>
  )
}

export function SearchInsightsPanel({ hotel }: { hotel: Hotel }) {
  const { data, loading } = useAsync(() => getSearchInsights(hotel.slug, hotel), [hotel.slug])

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold text-ink-900">How travelers find you on Google</h2>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
          {data?.source === 'search-console' ? 'Search Console' : 'Demo'}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-700/75">The Google searches that surface your StayEasy page — last {data?.rangeDays ?? 28} days.</p>

      {loading || !data ? (
        <div className="mt-4 h-24 animate-pulse rounded-xl bg-sand-50" />
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Metric label="Impressions" value={data.totals.impressions.toLocaleString()} sub="times shown on Google" />
            <Metric label="Clicks" value={data.totals.clicks.toLocaleString()} sub="visits from search" />
            <Metric label="CTR" value={`${(data.totals.ctr * 100).toFixed(1)}%`} sub="clicks ÷ impressions" />
            <Metric label="Avg. position" value={data.totals.position.toFixed(1)} sub="1 = top of results" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-600/60">Top search terms</p>
          <div className="mt-2 overflow-x-auto rounded-xl ring-1 ring-black/5">
            <table className="w-full min-w-[20rem] text-left text-sm">
              <thead className="bg-sand-50 text-[11px] uppercase tracking-wide text-ink-600/60">
                <tr>
                  <th className="px-3 py-2 font-semibold">Query</th>
                  <th className="px-3 py-2 text-right font-semibold">Impr.</th>
                  <th className="px-3 py-2 text-right font-semibold">Clicks</th>
                  <th className="hidden px-3 py-2 text-right font-semibold sm:table-cell">CTR</th>
                  <th className="hidden px-3 py-2 text-right font-semibold sm:table-cell">Pos.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {data.topQueries.map((r) => (
                  <tr key={r.query} className="bg-white">
                    <td className="px-3 py-2 font-medium text-ink-800">{r.query}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-ink-700">{r.impressions.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right tabular-nums font-semibold text-ink-900">{r.clicks.toLocaleString()}</td>
                    <td className="hidden px-3 py-2 text-right tabular-nums text-ink-700 sm:table-cell">{(r.ctr * 100).toFixed(1)}%</td>
                    <td className="hidden px-3 py-2 text-right tabular-nums text-ink-700 sm:table-cell">{r.position.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.source === 'mock' && (
            <p className="mt-4 rounded-xl bg-sand-50 px-3 py-2 text-[11px] text-ink-600/65 ring-1 ring-black/5">
              🧪 Demo figures. Live Google Search Console data appears here once the StayEasy backend is connected with a service account — your page is already verified and Google is collecting data now.
            </p>
          )}
        </>
      )}
    </div>
  )
}
