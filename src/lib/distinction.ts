import type { Hotel } from '../types'
import { hotels } from '../data/hotels'

/**
 * StayEasy Distinction — a scarce, Michelin-style editorial mark, NOT a numeric
 * score on every hotel. Trust comes from rarity: most listed hotels carry no
 * distinction at all.
 *
 * Awarded by ranking hotels within their city by our editorial score, then
 * applying a published, deterministic rule:
 *   - "StayEasy Choice": the single best hotel in a city (rank #1) that clears a
 *     quality floor. Exactly one per city at most — that is the headline mark.
 *   - "Recommended": the runner-up (rank #2), and only in cities big enough to
 *     be a real contest (RECOMMEND_MIN_CITY+ hotels). A rare second mark.
 *   - Everything else: no mark.
 *
 * This keeps distinctions scarce (well under half the catalogue) and easy to
 * trust: a mark means "the one we'd pick here", not a number every hotel gets.
 */
export type Distinction = 'choice' | 'recommended' | null

const CHOICE_MIN = 9.0
const RECOMMEND_MIN = 9.0
const RECOMMEND_MIN_CITY = 5

function build(list: Hotel[]): Record<string, Distinction> {
  const byCity = new Map<string, Hotel[]>()
  for (const h of list) {
    const arr = byCity.get(h.city) ?? []
    arr.push(h)
    byCity.set(h.city, arr)
  }
  const out: Record<string, Distinction> = {}
  for (const group of byCity.values()) {
    const ranked = [...group].sort(
      (a, b) => b.conditions.stayEasyScore - a.conditions.stayEasyScore || a.slug.localeCompare(b.slug),
    )
    const n = ranked.length
    ranked.forEach((h, i) => {
      const s = h.conditions.stayEasyScore
      if (i === 0 && s >= CHOICE_MIN) out[h.slug] = 'choice'
      else if (i === 1 && n >= RECOMMEND_MIN_CITY && s >= RECOMMEND_MIN) out[h.slug] = 'recommended'
      else out[h.slug] = null
    })
  }
  return out
}

const MAP = build(hotels)

/** The distinction for a hotel slug (null = listed, no mark). */
export function distinctionOf(slug: string): Distinction {
  return MAP[slug] ?? null
}

/** How many hotels hold each distinction — used to prove scarcity in copy/tests. */
export function distinctionCounts(): { choice: number; recommended: number; total: number } {
  let choice = 0
  let recommended = 0
  for (const v of Object.values(MAP)) {
    if (v === 'choice') choice++
    else if (v === 'recommended') recommended++
  }
  return { choice, recommended, total: hotels.length }
}
