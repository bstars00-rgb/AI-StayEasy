/**
 * Partner insights — turns the raw analytics into (a) a peer benchmark, (b) a
 * listing-completeness score, and (c) a short list of plain-language "what to do
 * next" cards. All derived on the client from the existing deterministic mock
 * analytics + the hotel catalogue, so it stays stable and needs no backend.
 * When the GA4 backend lands, only getPartnerAnalytics() changes underneath.
 */
import type { Hotel } from '../types'
import { hotels } from '../data/hotels'
import { partners } from '../data/adminData'
import { getPartnerAnalytics, type PartnerAnalytics } from './partnerAnalytics'

const round1 = (n: number) => Math.round(n * 10) / 10
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

// ── Peer benchmark ────────────────────────────────────────────────
export interface Benchmark {
  /** How many peer hotels were compared. */
  peers: number
  /** The comparison basis actually used (widens if too few exact peers). */
  basis: 'cityStar' | 'city' | 'country'
  peerConv: number
  peerViews: number
  yourConv: number
  yourViews: number
  /** Your conversion rate relative to peers, in whole %. */
  convDiffPct: number
  standing: 'above' | 'onpar' | 'below'
}

function analyticsFor(h: Hotel): PartnerAnalytics {
  const p = partners.find((x) => x.slug === h.slug)
  return getPartnerAnalytics(h.slug, p?.clicks30d ?? 0, h.koreanFriendly)
}

export function getBenchmark(hotel: Hotel, self: PartnerAnalytics): Benchmark {
  const star = hotel.conditions.starRating
  const sameCityStar = hotels.filter((h) => h.slug !== hotel.slug && h.city === hotel.city && h.conditions.starRating === star)
  const sameCity = hotels.filter((h) => h.slug !== hotel.slug && h.city === hotel.city)
  const sameCountry = hotels.filter((h) => h.slug !== hotel.slug && h.country === hotel.country)

  let basis: Benchmark['basis'] = 'cityStar'
  let peers = sameCityStar
  if (peers.length < 3) { basis = 'city'; peers = sameCity }
  if (peers.length < 3) { basis = 'country'; peers = sameCountry }

  const peerA = peers.map(analyticsFor)
  const peerConv = round1(avg(peerA.map((a) => a.kpis.convRate.value)))
  const peerViews = Math.round(avg(peerA.map((a) => a.kpis.views.value)))
  const yourConv = self.kpis.convRate.value
  const yourViews = self.kpis.views.value

  const convDiffPct = peerConv ? Math.round(((yourConv - peerConv) / peerConv) * 100) : 0
  const standing: Benchmark['standing'] = convDiffPct >= 8 ? 'above' : convDiffPct <= -8 ? 'below' : 'onpar'

  return { peers: peers.length, basis, peerConv, peerViews, yourConv, yourViews, convDiffPct, standing }
}

// ── Listing completeness ──────────────────────────────────────────
export type CompletenessKey =
  | 'photo' | 'gallery' | 'description' | 'positioning' | 'benefits'
  | 'facilities' | 'tags' | 'bestFor' | 'roomGuide' | 'locationGuide' | 'contact' | 'website'

export interface Completeness {
  pct: number
  done: CompletenessKey[]
  missing: CompletenessKey[]
}

export function getCompleteness(hotel: Hotel): Completeness {
  const c = hotel.contact
  const hasContact = !!(c && (c.email || c.phone || c.whatsapp || c.zalo || c.kakao || c.line || c.messenger))
  const checks: Record<CompletenessKey, boolean> = {
    photo: !!hotel.imageUrl,
    gallery: (hotel.gallery?.length ?? 0) >= 3,
    description: hotel.shortDescription.trim().length > 40,
    positioning: hotel.positioningLine.trim().length > 10,
    benefits: hotel.officialBenefits.length >= 2,
    facilities: hotel.facilities.length >= 4,
    tags: hotel.tags.length >= 1,
    bestFor: hotel.bestFor.length >= 2,
    roomGuide: !!(hotel.roomGuide.couples && hotel.roomGuide.families && hotel.roomGuide.longStay),
    locationGuide: !!(hotel.locationGuide.nearby && hotel.locationGuide.airportDistance && hotel.locationGuide.gettingAround),
    contact: hasContact,
    website: !!hotel.officialWebsiteUrl,
  }
  const keys = Object.keys(checks) as CompletenessKey[]
  const done = keys.filter((k) => checks[k])
  const missing = keys.filter((k) => !checks[k])
  return { pct: Math.round((done.length / keys.length) * 100), done, missing }
}

// ── Actionable insights ───────────────────────────────────────────
export type InsightTone = 'good' | 'action' | 'watch'
export type InsightKey =
  | 'highConv' | 'lowConv' | 'mobileHeavy' | 'koreanAudience'
  | 'strongOrganic' | 'completeListing' | 'viewsUp' | 'viewsDown'
  | 'addBenefits' | 'allGood'

export interface Insight {
  tone: InsightTone
  key: InsightKey
  vars: Record<string, string | number>
}

/** Rank so the most important cards surface first. */
const TONE_RANK: Record<InsightTone, number> = { action: 0, watch: 1, good: 2 }

export function getInsights(hotel: Hotel, a: PartnerAnalytics, b: Benchmark, comp: Completeness): Insight[] {
  const out: Insight[] = []
  const mobile = a.byDevice.find((d) => d.key === 'mobile')?.pct ?? 0
  const ko = a.byLanguage.find((l) => l.key === 'ko')?.pct ?? 0
  const organic = a.bySource.find((s) => s.key === 'organic')?.pct ?? 0

  if (b.standing === 'below') out.push({ tone: 'action', key: 'lowConv', vars: { you: b.yourConv, peer: b.peerConv } })
  else if (b.standing === 'above') out.push({ tone: 'good', key: 'highConv', vars: { you: b.yourConv, peer: b.peerConv } })

  if (comp.pct < 80) out.push({ tone: 'action', key: 'completeListing', vars: { n: comp.pct } })
  if (mobile >= 60) out.push({ tone: 'action', key: 'mobileHeavy', vars: { n: mobile } })
  if (ko >= 25 && !hotel.koreanFriendly) out.push({ tone: 'action', key: 'koreanAudience', vars: { n: ko } })
  if (hotel.officialBenefits.length < 2) out.push({ tone: 'action', key: 'addBenefits', vars: {} })

  if (a.kpis.views.deltaPct >= 10) out.push({ tone: 'good', key: 'viewsUp', vars: { n: a.kpis.views.deltaPct } })
  else if (a.kpis.views.deltaPct <= -10) out.push({ tone: 'watch', key: 'viewsDown', vars: { n: Math.abs(a.kpis.views.deltaPct) } })
  if (organic >= 45) out.push({ tone: 'good', key: 'strongOrganic', vars: { n: organic } })

  if (!out.length) out.push({ tone: 'good', key: 'allGood', vars: {} })

  return out.sort((x, y) => TONE_RANK[x.tone] - TONE_RANK[y.tone]).slice(0, 5)
}
