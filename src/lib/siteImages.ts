import { useSyncExternalStore } from 'react'

/**
 * Editable site imagery — a flat map of slot-id → image source (URL or data URL)
 * so an operator can replace the homepage's placeholder emoji tiles with real
 * photos from the admin Images tab. Slot ids are stable strings (e.g.
 * 'hero-1', 'dest-da-nang'); see ADMIN media manager for the labelled registry.
 *
 * DEMO storage: kept in localStorage (uploads become data URLs in this browser
 * only). A real build syncs these to shared object storage.
 */
export type SiteImageMap = Record<string, string>

const KEY = 'stayeasy-site-images'
const EMPTY: SiteImageMap = {}

function read(): SiteImageMap {
  if (typeof localStorage === 'undefined') return EMPTY
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    // Back-compat: an earlier shape stored { hero: [...] }.
    if (v && Array.isArray(v.hero)) {
      const m: SiteImageMap = {}
      v.hero.forEach((src: string | undefined, i: number) => { if (src) m[`hero-${i + 1}`] = src })
      return m
    }
    return v && typeof v === 'object' ? (v as SiteImageMap) : EMPTY
  } catch {
    return EMPTY
  }
}

let state: SiteImageMap = read()
const listeners = new Set<() => void>()

function commit(next: SiteImageMap) {
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
  all: () => state,
  get: (id: string): string | undefined => state[id],
  /** Set (or clear, with falsy) the image for slot `id`. */
  set(id: string, src: string | undefined) {
    if (src && src.trim()) {
      commit({ ...state, [id]: src.trim() })
    } else {
      const next = { ...state }
      delete next[id]
      commit(next)
    }
  },
  subscribe(l: () => void) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

export function useSiteImages(): SiteImageMap {
  return useSyncExternalStore(siteImages.subscribe, siteImages.all, () => EMPTY)
}
