import { useSyncExternalStore } from 'react'

/**
 * Admin-configurable navbar "featured destination" link. The team picks the city
 * (e.g. Da Nang → Phu Quoc); the navbar shows a localized "{city} trip" label
 * that links to that city's page. DEMO storage in localStorage.
 */
const KEY = 'stayeasy-featured-city'
const DEFAULT = 'da-nang'

function read(): string {
  if (typeof localStorage === 'undefined') return DEFAULT
  try {
    return localStorage.getItem(KEY) || DEFAULT
  } catch {
    return DEFAULT
  }
}

let slug = read()
const listeners = new Set<() => void>()

export const siteNav = {
  getFeaturedCity: () => slug,
  setFeaturedCity(next: string) {
    slug = next || DEFAULT
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(KEY, slug)
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

export function useFeaturedCity(): string {
  return useSyncExternalStore(siteNav.subscribe, siteNav.getFeaturedCity, () => DEFAULT)
}
