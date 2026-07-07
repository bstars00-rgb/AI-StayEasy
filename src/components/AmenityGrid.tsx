import type { ReactNode } from 'react'
import type { HotelConditions } from '../types'
import { useLang } from '../i18n'
import { filterStrings, type ConditionKey } from '../lib/filterI18n'
import { amenityExtra, type AmenityExtraKey } from '../lib/amenityI18n'

type AmenityKey = ConditionKey | AmenityExtraKey

/** Minimal line icons (24×24, stroke = currentColor) — no emoji, at-a-glance. */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const ICONS: Record<AmenityKey, ReactNode> = {
  freeWifi: <><path d="M2 8.5a15 15 0 0 1 20 0" {...S} /><path d="M5 12a10 10 0 0 1 14 0" {...S} /><path d="M8.5 15.5a5 5 0 0 1 7 0" {...S} /><circle cx="12" cy="19" r="1" fill="currentColor" /></>,
  breakfastIncluded: <><path d="M4 8h12v4a6 6 0 0 1-12 0z" {...S} /><path d="M16 9h2a2 2 0 0 1 0 4h-2" {...S} /><path d="M7 3v2M10 3v2M13 3v2" {...S} /></>,
  pool: <><path d="M3 18c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2" {...S} /><path d="M7 15V6a2 2 0 0 1 4 0M13 13V6a2 2 0 0 1 4 0" {...S} /></>,
  beachfront: <><path d="M12 4a8 8 0 0 1 6 6H6a8 8 0 0 1 6-6z" {...S} /><path d="M12 4v16" {...S} /><path d="M3 20h18" {...S} /></>,
  spa: <><path d="M12 13c0-4 3-7 3-7s-1 5-3 7zM12 13c0-4-3-7-3-7s1 5 3 7z" {...S} /><path d="M12 13c3-1 6-1 8 1-3 2-6 1-8-1zM12 13c-3-1-6-1-8 1 3 2 6 1 8-1z" {...S} /></>,
  gym: <><path d="M4 9v6M7 7v10M17 7v10M20 9v6" {...S} /><path d="M7 12h10" {...S} /></>,
  familyFriendly: <><circle cx="8" cy="7" r="2" {...S} /><circle cx="16" cy="7" r="2" {...S} /><path d="M4 19v-2a4 4 0 0 1 8 0v2M12 19v-2a4 4 0 0 1 8 0v2" {...S} /></>,
  petFriendly: <><circle cx="6" cy="11" r="1.6" {...S} /><circle cx="10.5" cy="8" r="1.6" {...S} /><circle cx="15" cy="8" r="1.6" {...S} /><circle cx="18" cy="11" r="1.6" {...S} /><path d="M8 15c0-2 2-3 4-3s4 1 4 3-2 4-4 4-4-2-4-4z" {...S} /></>,
  freeParking: <><rect x="4" y="4" width="16" height="16" rx="3" {...S} /><path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9" {...S} /></>,
  freeAirportShuttle: <><path d="M3 16V9a2 2 0 0 1 2-2h8l5 4v5" {...S} /><path d="M3 16h2M18 16h3" {...S} /><circle cx="7.5" cy="16.5" r="1.8" {...S} /><circle cx="16.5" cy="16.5" r="1.8" {...S} /></>,
  twentyFourHourFrontDesk: <><circle cx="12" cy="12" r="8" {...S} /><path d="M12 8v4l3 2" {...S} /></>,
  freeCancellation: <><circle cx="12" cy="12" r="8" {...S} /><path d="M8.5 12.5l2.5 2.5 4.5-5" {...S} /></>,
  accessible: <><circle cx="12" cy="5" r="1.6" {...S} /><path d="M9 8h4v5h3l2 5" {...S} /><path d="M13 13a5 5 0 1 1-4-2.5" {...S} /></>,
  nonSmoking: <><circle cx="12" cy="12" r="9" {...S} /><path d="M5.6 5.6l12.8 12.8" {...S} /><path d="M6 13h10v2H6z" {...S} /></>,
}

/** Ordered so the most-looked-for amenities lead. */
const ORDER: AmenityKey[] = [
  'freeWifi', 'breakfastIncluded', 'pool', 'beachfront', 'spa', 'gym',
  'familyFriendly', 'petFriendly', 'freeParking', 'freeAirportShuttle',
  'twentyFourHourFrontDesk', 'freeCancellation', 'accessible', 'nonSmoking',
]

const EXTRA_KEYS: AmenityExtraKey[] = ['freeWifi', 'gym', 'twentyFourHourFrontDesk', 'nonSmoking']
const isExtra = (k: AmenityKey): k is AmenityExtraKey => (EXTRA_KEYS as string[]).includes(k)

/**
 * At-a-glance amenity grid driven by a hotel's structured conditions — every
 * hotel renders the same clean icon set, so travelers can scan amenities in one
 * look. Only amenities the hotel actually has are shown.
 */
export function AmenityGrid({ conditions }: { conditions: HotelConditions }) {
  const { lang } = useLang()
  const label = (k: AmenityKey) => (isExtra(k) ? amenityExtra[lang][k] : filterStrings[lang].cond[k])
  const present = ORDER.filter((k) => Boolean((conditions as unknown as Record<string, boolean>)[k]))

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {present.map((k) => (
        <div key={k} className="flex items-center gap-2.5 rounded-xl bg-sand-50 px-3 py-2.5 ring-1 ring-black/5">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand-600" aria-hidden>{ICONS[k]}</svg>
          <span className="text-sm font-medium text-ink-800">{label(k)}</span>
        </div>
      ))}
    </div>
  )
}
