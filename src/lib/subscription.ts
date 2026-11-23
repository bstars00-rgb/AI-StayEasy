import { useSyncExternalStore } from 'react'
import { PLAN_IDS, PERIOD_IDS, type PlanId, type PeriodId } from './plansI18n'

/**
 * A traveler's subscription REQUEST — PROTOTYPE. There is no billing yet, so
 * "subscribing" records which plan and billing period the member asked for and
 * when; nothing is charged. Stored per account (keyed by email) in this browser
 * only. When billing exists this becomes the server's subscription record.
 */
export interface Subscription {
  plan: PlanId
  period: PeriodId
  /** ISO date (YYYY-MM-DD) the request was made or last changed. */
  requestedAt: string
  /** ISO date the member first subscribed. Changing plan or period keeps it, so it cannot restart the voucher periods. */
  startedAt: string
}

const key = (email: string) => `stayeasy-sub:${email.trim().toLowerCase()}`

function read(email: string): Subscription | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const v = JSON.parse(localStorage.getItem(key(email)) ?? 'null') as Partial<Subscription> | null
    return v && PLAN_IDS.includes(v.plan as PlanId) && PERIOD_IDS.includes(v.period as PeriodId)
      ? { plan: v.plan as PlanId, period: v.period as PeriodId, requestedAt: v.requestedAt ?? '', startedAt: v.startedAt ?? v.requestedAt ?? '' }
      : null
  } catch {
    return null
  }
}

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

export const subscription = {
  get: (email: string): Subscription | null => read(email),
  /** Request (or change to) a plan and period. */
  request(email: string, plan: PlanId, period: PeriodId): void {
    if (typeof localStorage === 'undefined') return
    const today = new Date().toISOString().slice(0, 10)
    const value: Subscription = { plan, period, requestedAt: today, startedAt: read(email)?.startedAt || today }
    try {
      localStorage.setItem(key(email), JSON.stringify(value))
    } catch {
      /* storage blocked */
    }
    notify()
  },
  /** Withdraw the request. */
  cancel(email: string): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.removeItem(key(email))
    } catch {
      /* storage blocked */
    }
    notify()
  },
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

/** Live subscription of the signed-in member; null when signed out or none requested. */
export function useSubscription(email: string | undefined): Subscription | null {
  // JSON string snapshot keeps getSnapshot referentially stable between reads.
  const raw = useSyncExternalStore(
    subscription.subscribe,
    () => (email ? JSON.stringify(read(email)) : 'null'),
    () => 'null',
  )
  return JSON.parse(raw) as Subscription | null
}
