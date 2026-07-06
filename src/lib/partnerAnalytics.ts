/**
 * Partner analytics — the report-grade numbers a hotel shows its GM/owner.
 *
 * Derived from the GA4 events instrumented across the site (hotel_view,
 * voucher_unlock, voucher_download, official_site_click, contact_click) with
 * their hotel/city/lang/device dimensions. Until the GA4 Data API backend is
 * wired, figures are demo estimates generated deterministically from the hotel
 * so the dashboard is stable and presentable; `source` says which.
 */

/** A metric plus its period-over-period change (% points for rates). */
export interface KpiDelta {
  value: number
  /** Percent change vs the previous equal period (e.g. +12 = up 12%). */
  deltaPct: number
}

/** One slice of a breakdown (by language / source / device). */
export interface SplitRow {
  key: string
  pct: number
}

export interface PartnerAnalytics {
  rangeDays: number
  source: 'mock' | 'ga4'
  kpis: {
    views: KpiDelta
    unlocks: KpiDelta
    officialClicks: KpiDelta
    contactClicks: KpiDelta
    /** Conversion = official-site clicks ÷ views, as a percentage. */
    convRate: KpiDelta
  }
  /** Last 14 days: views and the official-site clicks they produced. */
  trend: { views: number; clicks: number }[]
  /** Share of interest by traveler language (keys are Lang codes). */
  byLanguage: SplitRow[]
  /** How travelers arrived (keys: organic | direct | referral | social). */
  bySource: SplitRow[]
  /** Device split (keys: mobile | desktop | tablet). */
  byDevice: SplitRow[]
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/** Deterministic delta in the range roughly -15%..+29%, leaning positive. */
function delta(slug: string, metric: string): number {
  return (hash(`${slug}:${metric}:d`) % 45) - 15
}

/** Normalize integer weights to sum exactly 100. */
function toPct(rows: { key: string; w: number }[]): SplitRow[] {
  const total = rows.reduce((n, r) => n + r.w, 0) || 1
  const out = rows.map((r) => ({ key: r.key, pct: Math.round((r.w / total) * 100) }))
  const drift = 100 - out.reduce((n, r) => n + r.pct, 0)
  if (out.length) out[0] = { ...out[0], pct: out[0].pct + drift }
  return out.sort((a, b) => b.pct - a.pct)
}

export function getPartnerAnalytics(slug: string, baseClicks: number, koreanFriendly = false): PartnerAnalytics {
  const h = hash(slug)
  const officialClicks = Math.max(1, baseClicks)
  // Views-per-click varies per hotel (≈4.8–8.7) so the conversion rate spreads
  // realistically across ~11.5%–20.8% — otherwise every hotel would sit at a
  // fixed ratio and peer benchmarking would be meaningless.
  const viewsPer = 4.8 + (h % 40) / 10
  const views = Math.round(officialClicks * viewsPer)
  const unlocks = Math.round(officialClicks * 1.6)
  const contactClicks = Math.round(officialClicks * 0.45)
  const convRate = views ? Math.round((officialClicks / views) * 1000) / 10 : 0

  // 14-day trend (views with daily variation; clicks ≈ conversion of that day).
  const perDay = views / 14
  const trend = Array.from({ length: 14 }, (_, i) => {
    const hv = hash(`${slug}-v${i}`)
    const dayViews = Math.max(1, Math.round(perDay * (0.6 + (hv % 90) / 100)))
    const rate = 0.13 + ((hv >> 4) % 8) / 100
    return { views: dayViews, clicks: Math.max(0, Math.round(dayViews * rate)) }
  })

  const byLanguage = toPct([
    { key: 'ko', w: (koreanFriendly ? 42 : 14) + (h % 12) },
    { key: 'en', w: 30 + ((h >> 2) % 12) },
    { key: 'vi', w: 18 + ((h >> 4) % 10) },
    { key: 'zh', w: 10 + ((h >> 6) % 8) },
    { key: 'ja', w: 7 + ((h >> 8) % 7) },
  ])

  const bySource = toPct([
    { key: 'organic', w: 48 + (h % 12) },
    { key: 'direct', w: 26 + ((h >> 3) % 8) },
    { key: 'referral', w: 12 + ((h >> 5) % 8) },
    { key: 'social', w: 6 + ((h >> 7) % 6) },
  ])

  const byDevice = toPct([
    { key: 'mobile', w: 60 + (h % 12) },
    { key: 'desktop', w: 26 + ((h >> 3) % 10) },
    { key: 'tablet', w: 5 + ((h >> 6) % 5) },
  ])

  const k = (value: number, metric: string): KpiDelta => ({ value, deltaPct: delta(slug, metric) })

  return {
    rangeDays: 30,
    source: 'mock',
    kpis: {
      views: k(views, 'views'),
      unlocks: k(unlocks, 'unlocks'),
      officialClicks: k(officialClicks, 'clicks'),
      contactClicks: k(contactClicks, 'contact'),
      convRate: { value: convRate, deltaPct: delta(slug, 'conv') },
    },
    trend,
    byLanguage,
    bySource,
    byDevice,
  }
}
