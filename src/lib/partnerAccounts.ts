import { useSyncExternalStore } from 'react'
import type { Hotel, City, Area } from '../types'
import { deriveConditions } from '../data/hotels'
import { partnerDrafts } from './partnerDrafts'

/**
 * Partner accounts (DEMO auth — no backend, passwords stored in plaintext in
 * localStorage; a real build hashes server-side). A hotel self-registers with
 * email + password; the account lands in the admin console as "Pending" and
 * must be approved before it can sign in. On approval a starter listing is
 * created so the partner has something to edit in the portal.
 */
export type AccountStatus = 'Pending' | 'Approved' | 'Rejected'

export interface PartnerAccount {
  id: string
  email: string
  password: string
  hotelName: string
  city: string
  status: AccountStatus
  /** Listing slug, assigned on approval. */
  hotelSlug?: string
  createdAt: string
}

const KEY = 'stayeasy-partner-accounts'
const EMPTY: PartnerAccount[] = []
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function read(): PartnerAccount[] {
  if (typeof localStorage === 'undefined') return EMPTY
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v : EMPTY
  } catch {
    return EMPTY
  }
}

/** A ready-to-use, pre-approved demo account so the portal can be tried without
 *  going through sign-up + approval first. Seeded only when no accounts exist. */
const DEMO_ACCOUNT: PartnerAccount = {
  id: 'demo',
  email: 'demo@stayeasy.com',
  password: 'demo1234',
  hotelName: 'An Bang Beach Resort & Spa',
  city: 'Da Nang',
  status: 'Approved',
  hotelSlug: 'an-bang-beach-resort',
  createdAt: '2026-06-17',
}

let accounts: PartnerAccount[] = read()
// Always ensure the demo account exists, even if the browser already has other
// accounts from earlier testing — so demo@stayeasy.com always works.
if (!accounts.some((a) => a.email.toLowerCase() === DEMO_ACCOUNT.email)) {
  accounts = [DEMO_ACCOUNT, ...accounts]
}
const listeners = new Set<() => void>()

function commit(next: PartnerAccount[]) {
  accounts = next
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(KEY, JSON.stringify(accounts))
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((l) => l())
}

/** Builds a minimal starter listing for an approved partner to fill in. */
function createListing(account: PartnerAccount): string {
  const slug = `${slugify(account.hotelName)}-${account.id}`
  const base: Omit<Hotel, 'conditions'> = {
    id: `acc-${account.id}`,
    slug,
    name: account.hotelName.trim(),
    country: 'Vietnam',
    city: (account.city || 'Da Nang') as City,
    area: 'City Center' as Area,
    hotelType: 'City hotel',
    priceTier: 'mid',
    shortDescription: '',
    positioningLine: '',
    bestFor: [],
    notIdealFor: [],
    mainReason: '',
    thingsToCheck: [],
    tags: [],
    facilities: [],
    officialBenefits: [],
    roomGuide: { couples: '', families: '', longStay: '', checkBeforeBooking: '' },
    locationGuide: { nearby: '', airportDistance: '', gettingAround: '', nearbyFood: '' },
    cancellationChecklist: ['Confirm the cancellation policy on the official website'],
    imageUrl: `https://picsum.photos/seed/stayeasy-${slug}/800/600`,
    officialWebsiteUrl: '',
    isSponsored: false,
    similarHotelSlugs: [],
    heroColor: 'from-brand-500 to-accent-500',
    emoji: '🏨',
    koreanFriendly: false,
  }
  const hotel: Hotel = { ...base, conditions: deriveConditions(base) }
  partnerDrafts.add({ hotel, plan: 'Starter', contactEmail: account.email, createdAt: account.createdAt })
  return slug
}

export const partnerAccounts = {
  all: () => accounts,
  pending: () => accounts.filter((a) => a.status === 'Pending'),
  findByEmail: (email: string) => accounts.find((a) => a.email.toLowerCase() === email.toLowerCase()),

  /** Self-registration. Returns the new account, or null if the email exists. */
  register(input: { email: string; password: string; hotelName: string; city: string; createdAt: string }): PartnerAccount | null {
    if (accounts.some((a) => a.email.toLowerCase() === input.email.toLowerCase())) return null
    const account: PartnerAccount = {
      id: `${accounts.length + 1}-${slugify(input.hotelName).slice(0, 8) || 'hotel'}`,
      email: input.email.trim(),
      password: input.password,
      hotelName: input.hotelName.trim(),
      city: input.city,
      status: 'Pending',
      createdAt: input.createdAt,
    }
    commit([account, ...accounts])
    return account
  },

  approve(id: string) {
    commit(
      accounts.map((a) => {
        if (a.id !== id || a.status === 'Approved') return a
        const hotelSlug = a.hotelSlug ?? createListing(a)
        return { ...a, status: 'Approved', hotelSlug }
      }),
    )
  },

  reject(id: string) {
    commit(accounts.map((a) => (a.id === id ? { ...a, status: 'Rejected' } : a)))
  },

  /** Sets a new password for an existing account (demo password reset).
   *  Returns false if no account has that email. */
  resetPassword(email: string, newPassword: string): boolean {
    const exists = accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())
    if (!exists) return false
    commit(accounts.map((a) => (a.email.toLowerCase() === email.toLowerCase() ? { ...a, password: newPassword } : a)))
    return true
  },

  /** Returns 'ok' with the account, or a reason string. */
  authenticate(email: string, password: string): { ok: true; account: PartnerAccount } | { ok: false; reason: 'invalid' | 'pending' | 'rejected' } {
    const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())
    if (!account || account.password !== password) return { ok: false, reason: 'invalid' }
    if (account.status === 'Pending') return { ok: false, reason: 'pending' }
    if (account.status === 'Rejected') return { ok: false, reason: 'rejected' }
    return { ok: true, account }
  },

  clear: () => commit([]),
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

export function usePartnerAccounts(): PartnerAccount[] {
  return useSyncExternalStore(partnerAccounts.subscribe, partnerAccounts.all, () => EMPTY)
}
