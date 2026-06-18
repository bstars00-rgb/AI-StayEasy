import { useSyncExternalStore } from 'react'

/**
 * Guest (traveler) sign-in — DEMO (localStorage, no backend). Signing in grants
 * a one-time member welcome voucher usable on a direct booking. Real Google
 * sign-in activates when VITE_GOOGLE_CLIENT_ID is set (see googleAuth.ts);
 * otherwise an email demo flow is used.
 */
export interface GuestSession {
  email: string
  name: string
  picture?: string
  welcomeCode: string
  discountLabel: string
  validUntil: string
  joinedAt: string
}

const KEY = 'stayeasy-guest'

function read(): GuestSession | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    return v && typeof v === 'object' && v.email ? (v as GuestSession) : null
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

/** Deterministic member voucher code from the email, so re-login is stable. */
function welcomeCode(email: string): string {
  let h = 0
  for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) >>> 0
  return `STAY-${h.toString(36).toUpperCase().slice(0, 6).padStart(6, '0')}`
}

export const guestAuth = {
  get: () => session,
  signIn(input: { email: string; name?: string; picture?: string }) {
    const email = input.email.trim().toLowerCase()
    if (!email) return
    // Keep the existing welcome voucher if the same guest signs back in.
    if (session?.email === email) return
    const now = Date.now()
    commit({
      email,
      name: input.name?.trim() || email.split('@')[0],
      picture: input.picture,
      welcomeCode: welcomeCode(email),
      discountLabel: '10% off your direct booking',
      validUntil: new Date(now + 30 * 86400000).toISOString().slice(0, 10),
      joinedAt: new Date(now).toISOString().slice(0, 10),
    })
  },
  signOut: () => commit(null),
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
