import { useSyncExternalStore } from 'react'
import type { Hotel } from '../types'

/**
 * Self-service content edits made by hotels through the partner portal.
 * Stored as a slug → partial-Hotel patch in localStorage (demo; a real build
 * would PUT these to the partner API). mockRepo merges these over the catalogue
 * so a hotel's edits appear on its public listing immediately.
 */
export type HotelPatch = Partial<
  Pick<
    Hotel,
    | 'shortDescription'
    | 'positioningLine'
    | 'mainReason'
    | 'facilities'
    | 'officialBenefits'
    | 'officialWebsiteUrl'
    | 'imageUrl'
    | 'gallery'
    | 'koreanFriendly'
    | 'voucher'
    | 'contact'
  >
>

const KEY = 'stayeasy-hotel-edits'
const EMPTY: Record<string, HotelPatch> = {}

function read(): Record<string, HotelPatch> {
  if (typeof localStorage === 'undefined') return EMPTY
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    return v && typeof v === 'object' ? v : EMPTY
  } catch {
    return EMPTY
  }
}

let edits: Record<string, HotelPatch> = read()
const listeners = new Set<() => void>()

function commit(next: Record<string, HotelPatch>) {
  edits = next
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(KEY, JSON.stringify(edits))
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((l) => l())
}

export const hotelEdits = {
  all: () => edits,
  get: (slug: string): HotelPatch => edits[slug] ?? {},
  set: (slug: string, patch: HotelPatch) => commit({ ...edits, [slug]: { ...edits[slug], ...patch } }),
  clear: () => commit({}),
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

/** Applies a hotel's self-service edits over its catalogue record. */
export function applyEdits(h: Hotel): Hotel {
  const patch = edits[h.slug]
  return patch ? { ...h, ...patch } : h
}

export function useHotelEdits(): Record<string, HotelPatch> {
  return useSyncExternalStore(hotelEdits.subscribe, hotelEdits.all, () => EMPTY)
}
