import { useSyncExternalStore } from 'react'
import type { Campaign } from '../data/adminData'

/**
 * Sponsored campaigns created by an operator in the admin Campaigns tab.
 * DEMO storage in localStorage (a real build POSTs to the ads/campaign API).
 * New campaigns start with zero delivery; impressions/clicks fill in once live.
 */
const KEY = 'stayeasy-campaign-drafts'
const EMPTY: Campaign[] = []

function read(): Campaign[] {
  if (typeof localStorage === 'undefined') return EMPTY
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v : EMPTY
  } catch {
    return EMPTY
  }
}

let drafts: Campaign[] = read()
const listeners = new Set<() => void>()

function commit(next: Campaign[]) {
  drafts = next
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((l) => l())
}

let seq = 0

export const campaignDrafts = {
  all: () => drafts,
  add(input: { hotel: string; city: string; slot: string; period: string; status: Campaign['status'] }) {
    const campaign: Campaign = {
      id: `camp-draft-${drafts.length}-${(seq += 1)}`,
      hotel: input.hotel,
      city: input.city,
      slot: input.slot,
      period: input.period,
      impressions: 0,
      clicks: 0,
      ctr: '0%',
      status: input.status,
    }
    commit([campaign, ...drafts])
  },
  remove(id: string) {
    commit(drafts.filter((c) => c.id !== id))
  },
  subscribe(l: () => void) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

export function useCampaignDrafts(): Campaign[] {
  return useSyncExternalStore(campaignDrafts.subscribe, campaignDrafts.all, () => EMPTY)
}
