import { hotels } from './hotels'
import type { PriceTier, Country } from '../types'

/**
 * Mock data for the operator back-office. Derived deterministically from the
 * hotel catalogue so it stays in sync as cities/hotels are added. No backend —
 * a future API would replace these computed values.
 */
function seed(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}
const pick = <T>(s: string, arr: T[]): T => arr[seed(s) % arr.length]
const between = (s: string, min: number, max: number) => min + (seed(s) % (max - min + 1))

const cleanName = (n: string) => n.replace(' (Sample)', '')

export type Plan = 'Starter' | 'Growth' | 'Campaign'
export const PLANS: Plan[] = ['Starter', 'Growth', 'Campaign']
const planByTier: Record<PriceTier, Plan> = { premium: 'Campaign', mid: 'Growth', budget: 'Starter' }
export const feeByPlan: Record<Plan, number> = { Starter: 0, Growth: 390, Campaign: 1200 }

export type PartnerStatus = 'Active' | 'Pending' | 'Paused' | 'Listed'

export interface Partner {
  id: string
  name: string
  slug: string
  country: Country
  city: string
  hotelType: string
  tier: PriceTier
  plan: Plan
  monthlyFee: number
  clicks30d: number
  sponsored: boolean
  status: PartnerStatus
  since: string
}

/**
 * Unified partner registry — EVERY listed hotel is a partner record. Hotels with
 * a commercial relationship (sponsored or Korean-friendly) get a paid plan and an
 * Active/Pending/Paused status; the rest are 'Listed' on the free Starter tier.
 * There is no separate "hotels" vs "partners" split — this single list is the
 * back-office source of truth.
 */
export const partners: Partner[] = hotels.map((h) => {
  const commercial = h.isSponsored || h.koreanFriendly
  const plan: Plan = commercial ? planByTier[h.priceTier] : 'Starter'
  const status: PartnerStatus = commercial
    ? pick(h.id + 'st', ['Active', 'Active', 'Active', 'Pending', 'Paused'] as const)
    : 'Listed'
  return {
    id: h.id,
    name: cleanName(h.name),
    slug: h.slug,
    country: h.country,
    city: h.city,
    hotelType: h.hotelType,
    tier: h.priceTier,
    plan,
    monthlyFee: status === 'Listed' ? 0 : feeByPlan[plan],
    clicks30d: commercial ? between(h.id + 'clk', 180, 1450) : between(h.id + 'clk', 20, 180),
    sponsored: h.isSponsored,
    status,
    since: `2026-0${1 + (seed(h.id) % 6)}`,
  }
})

export interface Campaign {
  id: string
  hotel: string
  city: string
  slot: string
  period: string
  impressions: number
  clicks: number
  ctr: string
  status: 'Live' | 'Scheduled' | 'Ended'
}

export const campaigns: Campaign[] = hotels
  .filter((h) => h.isSponsored)
  .map((h) => {
    const impressions = between(h.id + 'imp', 8000, 42000)
    const clicks = between(h.id + 'clk2', 600, 3400)
    return {
      id: h.id,
      hotel: cleanName(h.name),
      city: h.city,
      slot: pick(h.id + 'slot', ['Home featured', 'City top placement', 'Sponsored article', 'CPC official-click']),
      period: pick(h.id + 'per', ['Jun 1 – Jun 30', 'Jun 15 – Jul 15', 'Jul 1 – Jul 31']),
      impressions,
      clicks,
      ctr: `${((clicks / impressions) * 100).toFixed(1)}%`,
      status: pick(h.id + 'cst', ['Live', 'Live', 'Scheduled', 'Ended'] as const),
    }
  })

export interface Inquiry {
  id: string
  hotel: string
  city: string
  contact: string
  planInterest: Plan
  date: string
  status: 'New' | 'Contacted' | 'Won' | 'Lost'
}

export const inquiries: Inquiry[] = [
  { id: 'iq1', hotel: 'Riverside Pearl Hotel', city: 'Da Nang', contact: 'minju@riversidepearl.example', planInterest: 'Growth', date: '2026-06-14', status: 'New' },
  { id: 'iq2', hotel: 'Saigon Sky Suites', city: 'Ho Chi Minh City', contact: 'linh@saigonsky.example', planInterest: 'Campaign', date: '2026-06-13', status: 'Contacted' },
  { id: 'iq3', hotel: 'My Khe Wave Hotel', city: 'Da Nang', contact: 'owner@mykhewave.example', planInterest: 'Starter', date: '2026-06-12', status: 'New' },
  { id: 'iq4', hotel: 'Nha Trang Bayfront Resort', city: 'Nha Trang', contact: 'sales@ntbayfront.example', planInterest: 'Campaign', date: '2026-06-11', status: 'Won' },
  { id: 'iq5', hotel: 'Phu Quoc Sunset Villas', city: 'Phu Quoc', contact: 'hello@pqsunset.example', planInterest: 'Growth', date: '2026-06-10', status: 'Contacted' },
  { id: 'iq6', hotel: 'District 1 Capsule Stay', city: 'Ho Chi Minh City', contact: 'team@d1capsule.example', planInterest: 'Starter', date: '2026-06-09', status: 'Lost' },
  { id: 'iq7', hotel: 'Han Riverside Boutique', city: 'Da Nang', contact: 'gm@hanboutique.example', planInterest: 'Growth', date: '2026-06-08', status: 'Won' },
  { id: 'iq8', hotel: 'An Bang Surf Lodge', city: 'Da Nang', contact: 'stay@anbangsurf.example', planInterest: 'Starter', date: '2026-06-07', status: 'New' },
]

// ---- Overview aggregates ----
const totalClicks = partners.reduce((n, p) => n + p.clicks30d, 0)
const mrr = partners.filter((p) => p.status === 'Active').reduce((n, p) => n + p.monthlyFee, 0)

export const overviewKpis = [
  { label: 'Hotels listed', value: hotels.length.toString(), delta: '+4', icon: '🏨' },
  { label: 'Active partners', value: partners.filter((p) => p.status === 'Active').length.toString(), delta: '+3', icon: '🤝' },
  { label: 'Live campaigns', value: campaigns.filter((c) => c.status === 'Live').length.toString(), delta: '+1', icon: '📣' },
  { label: 'Official-site clicks (30d)', value: totalClicks.toLocaleString(), delta: '+18%', icon: '↗️' },
  { label: 'Monthly recurring (mock)', value: `$${mrr.toLocaleString()}`, delta: '+12%', icon: '💳' },
  { label: 'New inquiries', value: inquiries.filter((i) => i.status === 'New').length.toString(), delta: '+2', icon: '📨' },
]

export const clicksByCity = (() => {
  const map = new Map<string, number>()
  for (const p of partners) map.set(p.city, (map.get(p.city) ?? 0) + p.clicks30d)
  return [...map.entries()].map(([city, clicks]) => ({ city, clicks })).sort((a, b) => b.clicks - a.clicks)
})()
