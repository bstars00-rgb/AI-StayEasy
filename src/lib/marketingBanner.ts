import { useSyncExternalStore } from 'react'

/**
 * A homepage marketing banner the team controls from the admin — a place to run
 * promo messages ("Book direct and save", campaign pushes, etc.) without a code
 * change. DEMO storage in localStorage; a real build serves this from the CMS so
 * every visitor sees the same banner. Single free-text (not auto-translated).
 */
export interface MarketingBanner {
  enabled: boolean
  eyebrow: string
  title: string
  body: string
  ctaLabel: string
  /** Internal path ("/destinations/da-nang") or full URL. */
  ctaHref: string
}

const KEY = 'stayeasy-marketing-banner'

const DEFAULT: MarketingBanner = {
  enabled: true,
  eyebrow: 'StayEasy',
  title: 'Book direct. Stay easy.',
  body: 'Compare Vietnam hotels with honest guides and book on the official site — no commission, official-website perks.',
  ctaLabel: 'Explore Da Nang hotels',
  ctaHref: '/destinations/da-nang',
}

function read(): MarketingBanner {
  if (typeof localStorage === 'undefined') return DEFAULT
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    return v && typeof v === 'object' ? { ...DEFAULT, ...v } : DEFAULT
  } catch {
    return DEFAULT
  }
}

let state: MarketingBanner = read()
const listeners = new Set<() => void>()

export const marketingBanner = {
  get: () => state,
  set(patch: Partial<MarketingBanner>) {
    state = { ...state, ...patch }
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(KEY, JSON.stringify(state))
      } catch {
        /* ignore */
      }
    }
    listeners.forEach((l) => l())
  },
  subscribe(l: () => void) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

export function useMarketingBanner(): MarketingBanner {
  return useSyncExternalStore(marketingBanner.subscribe, marketingBanner.get, () => DEFAULT)
}
