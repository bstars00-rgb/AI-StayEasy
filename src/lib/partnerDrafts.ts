import { useSyncExternalStore } from 'react'
import type { Hotel } from '../types'
import type { Plan } from '../data/adminData'

/**
 * Hotels registered through the back-office onboarding form. Stores the FULL
 * hotel record (everything that appears on the public listing) plus the partner
 * plan + contact. Persisted to localStorage so a registration survives the
 * navigation back to the Partners list and a page refresh. Demo only — no backend.
 */
export interface HotelDraft {
  hotel: Hotel
  plan: Plan
  contactEmail: string
  /** ISO timestamp string (YYYY-MM-DD…) set by the caller. */
  createdAt: string
}

const KEY = 'stayeasy-partner-drafts'
const EMPTY: HotelDraft[] = []

function read(): HotelDraft[] {
  if (typeof localStorage === 'undefined') return EMPTY
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v : EMPTY
  } catch {
    return EMPTY
  }
}

let drafts: HotelDraft[] = read()
const listeners = new Set<() => void>()

function commit(next: HotelDraft[]) {
  drafts = next
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(KEY, JSON.stringify(drafts))
    } catch {
      /* ignore quota/availability errors */
    }
  }
  listeners.forEach((l) => l())
}

export const partnerDrafts = {
  getAll: () => drafts,
  add: (d: HotelDraft) => commit([d, ...drafts]),
  clear: () => commit([]),
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

/** Reactive view of the registered hotel drafts. */
export function usePartnerDrafts(): HotelDraft[] {
  return useSyncExternalStore(partnerDrafts.subscribe, partnerDrafts.getAll, () => EMPTY)
}
