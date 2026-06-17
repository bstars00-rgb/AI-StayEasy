import { useSyncExternalStore } from 'react'

/**
 * Partner-portal session (DEMO auth — no backend).
 *
 * A real build would authenticate against the partner API and issue a token.
 * Here we store which property is "signed in" so the portal can scope edits to
 * that hotel. The portal is noindex'd and separate from the public site; it can
 * later move to its own subdomain without changing this contract.
 */
export interface PartnerSession {
  slug: string
  propertyName: string
  email: string
}

const KEY = 'stayeasy-partner-session'

function read(): PartnerSession | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    return v && typeof v === 'object' && v.slug ? (v as PartnerSession) : null
  } catch {
    return null
  }
}

let session: PartnerSession | null = read()
const listeners = new Set<() => void>()

function commit(next: PartnerSession | null) {
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

export const partnerAuth = {
  get: () => session,
  login: (s: PartnerSession) => commit(s),
  logout: () => commit(null),
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

export function usePartnerSession(): PartnerSession | null {
  return useSyncExternalStore(partnerAuth.subscribe, partnerAuth.get, () => null)
}
