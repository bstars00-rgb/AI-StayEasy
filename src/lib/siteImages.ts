import { useSyncExternalStore } from 'react'

/**
 * Editable site imagery (home hero tiles) — DEMO storage in localStorage, so an
 * operator can swap the placeholder emoji tiles for real photos without a code
 * change. A real build syncs these through the admin backend / object storage;
 * for now an uploaded file is kept as a data URL in this browser only.
 *
 * `hero` holds up to 4 image sources (URL or data URL); an empty slot falls back
 * to the decorative emoji tile.
 */
export interface SiteImages {
  hero: (string | undefined)[]
}

const KEY = 'stayeasy-site-images'
const EMPTY: SiteImages = { hero: [] }

function read(): SiteImages {
  if (typeof localStorage === 'undefined') return EMPTY
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    return v && Array.isArray(v.hero) ? { hero: v.hero } : EMPTY
  } catch {
    return EMPTY
  }
}

let state: SiteImages = read()
const listeners = new Set<() => void>()

function commit(next: SiteImages) {
  state = next
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* quota (large data URLs) — ignore in demo */
    }
  }
  listeners.forEach((l) => l())
}

export const siteImages = {
  get: () => state,
  /** Set (or clear, with undefined) the hero image at slot `i` (0–3). */
  setHero(i: number, src: string | undefined) {
    const hero = [...state.hero]
    while (hero.length < 4) hero.push(undefined)
    hero[i] = src && src.trim() ? src.trim() : undefined
    commit({ hero })
  },
  subscribe(l: () => void) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

export function useSiteImages(): SiteImages {
  return useSyncExternalStore(siteImages.subscribe, siteImages.get, () => EMPTY)
}
