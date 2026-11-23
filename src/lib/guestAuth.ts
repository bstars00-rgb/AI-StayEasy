import { useSyncExternalStore } from 'react'
import { subscription } from './subscription'

/**
 * Guest (traveler) account — DEMO (localStorage, no backend). Nothing here is
 * sent to a server: the profile lives in this browser only. Real Google sign-in
 * activates when VITE_GOOGLE_CLIENT_ID is set (see googleAuth.ts); otherwise the
 * email form is used. A production build verifies the Google credential and
 * keeps accounts server-side.
 *
 * Signing up grants NO voucher or discount. Member vouchers come from hotels
 * (Hotel.voucher), and until a hotel supplies one there is nothing to show — a
 * StayEasy-minted "10% off" code that no hotel honors would be a made-up benefit.
 */
export interface GuestSession {
  email: string
  name: string
  picture?: string
  /** ISO date (YYYY-MM-DD) the account was created. */
  joinedAt: string
}

const KEY = 'stayeasy-guest'

function read(): GuestSession | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (!v || typeof v !== 'object' || !v.email) return null
    // Sessions saved before the welcome voucher was removed carry extra fields; keep only ours.
    return { email: v.email, name: v.name || String(v.email).split('@')[0], picture: v.picture, joinedAt: v.joinedAt || new Date().toISOString().slice(0, 10) }
  } catch {
    return null
  }
}

let session: GuestSession | null = read()
const listeners = new Set<() => void>()

function commit(next: GuestSession | null) {
  session = next
  if (typeof localStorage !== 'undefined') {
    try {
      if (next) localStorage.setItem(KEY, JSON.stringify(next))
      else localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((l) => l())
}

export const guestAuth = {
  get: () => session,
  /** Create the account (first time) or sign back in (same email keeps its profile). */
  signIn(input: { email: string; name?: string; picture?: string }) {
    const email = input.email.trim().toLowerCase()
    if (!email) return
    if (session?.email === email) return
    commit({
      email,
      name: input.name?.trim() || email.split('@')[0],
      picture: input.picture,
      joinedAt: new Date().toISOString().slice(0, 10),
    })
  },
  signOut: () => commit(null),
  /** Remove this account's data from the browser: its subscription request, then the session. */
  deleteAccount() {
    if (session) subscription.cancel(session.email)
    commit(null)
  },
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

export function useGuest(): GuestSession | null {
  return useSyncExternalStore(guestAuth.subscribe, guestAuth.get, () => null)
}
