import { useSyncExternalStore } from 'react'

/**
 * Wishlist store — saved hotel ids persisted to localStorage, no backend.
 * SSR-safe (guards localStorage) and subscribable for live UI updates.
 */
const KEY = 'stayeasy-wishlist'
const EMPTY: string[] = []

function read(): string[] {
  if (typeof localStorage === 'undefined') return EMPTY
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v : EMPTY
  } catch {
    return EMPTY
  }
}

let ids: string[] = read()
const listeners = new Set<() => void>()

function commit(next: string[]) {
  ids = next
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids))
    } catch {
      /* ignore quota/availability errors */
    }
  }
  listeners.forEach((l) => l())
}

export const wishlist = {
  get: () => ids,
  has: (id: string) => ids.includes(id),
  toggle: (id: string) => commit(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]),
  remove: (id: string) => commit(ids.filter((x) => x !== id)),
  clear: () => commit([]),
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

/** Reactive view of the wishlist. Returns the saved ids + helpers. */
export function useWishlist() {
  const list = useSyncExternalStore(wishlist.subscribe, wishlist.get, () => EMPTY)
  return {
    ids: list,
    count: list.length,
    has: (id: string) => list.includes(id),
    toggle: wishlist.toggle,
    remove: wishlist.remove,
    clear: wishlist.clear,
  }
}
