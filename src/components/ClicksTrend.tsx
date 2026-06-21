/**
 * A simple 14-day clicks trend bar chart. Values are derived deterministically
 * from the hotel slug (demo data) so the chart is stable across renders. A real
 * build would plot actual analytics.
 */
function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export function ClicksTrend({
  slug,
  total,
  t,
}: {
  slug: string
  total: number
  t: { title: string; daysAgo: string; today: string }
}) {
  const days = 14
  const base = Math.max(2, Math.round(total / days))
  const vals = Array.from({ length: days }, (_, i) => {
    const h = hash(`${slug}-d${i}`)
    return Math.max(1, Math.round(base * (0.5 + (h % 100) / 100)))
  })
  const max = Math.max(...vals, 1)
  const sum = vals.reduce((n, v) => n + v, 0)

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-600/60">{t.title}</p>
        <p className="text-sm font-bold text-ink-900">{sum.toLocaleString()}</p>
      </div>
      <div className="mt-3 flex h-24 items-end gap-1" role="img" aria-label={`Clicks trend, ${sum} total over 14 days`}>
        {vals.map((v, i) => (
          <div key={i} className="flex-1 rounded-t bg-brand-400" style={{ height: `${Math.max(6, (v / max) * 100)}%` }} title={`${v} clicks`} />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-ink-600/50">
        <span>{t.daysAgo}</span>
        <span>{t.today}</span>
      </div>
    </div>
  )
}
