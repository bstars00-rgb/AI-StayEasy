import { useSyncExternalStore } from 'react'
import type { Hotel } from '../types'
import { DEMO_HOTELS } from '../data/demoHotels'
import { DEMO_HOTELS_ENABLED } from './demo'
import { subscription, type Subscription } from './subscription'
import type { PlanId } from './plansI18n'

/**
 * Member perk vouchers — PROTOTYPE of the "perk wallet".
 *
 * Model: each subscription period the member has an allowance of perk vouchers (by plan)
 * and picks which participating hotel each one is for — a hotel they are about to visit,
 * the same one again in a later period if they like. A voucher is valid for PERIOD_DAYS
 * from the day it is picked, lives on the member's phone and opens only for the signed-in
 * subscriber. At check-in hotel staff type the hotel's PIN on the member's phone and the
 * voucher is stamped used, once. No staff login, no booking system, no integration with
 * the hotel: the hotel is under contract and the PIN is the safeguard. Each hotel gives
 * one voucher per member per period; unpicked allowance does not carry over. The next
 * period brings a fresh allowance, which is what keeps the subscription useful.
 *
 * Everything here lives in THIS browser (localStorage). That is enough to show
 * the flow, but it cannot stop reuse across devices, and the PIN could be read from
 * the page source: the ledger and the PIN check have to move to a server. The
 * functions are shaped so that move is a swap of the storage layer, not a redesign.
 */

/** Days each issued batch is valid; the next batch follows. */
export const PERIOD_DAYS = 30

/** PROTOTYPE placeholder: vouchers issued per period for each plan. Real numbers are agreed with the hotels and priced later. */
export const VOUCHERS_PER_PERIOD: Record<PlanId, number> = { getaway: 1, voyager: 2, nomad: 3 }

export interface WalletVoucher {
  id: string
  email: string
  /** Member's name when issued — shown to hotel staff so a forwarded voucher is noticed. */
  name: string
  hotelSlug: string
  /** Start date of the period this voucher belongs to. */
  periodStart: string
  validFrom: string
  validUntil: string
  /** The secret part of the code (16 chars, Crockford base32). */
  token: string
  /** ISO timestamp it was redeemed at; absent while unused. */
  usedAt?: string
  /** Wrong PINs typed since the last success; the voucher locks for a while after too many. */
  failures?: number
  /** ISO timestamp until which PIN entry is locked. */
  lockedUntil?: string
}

export type WalletStatus = 'issued' | 'used' | 'expired' | 'void'

/** Hotels whose on-site perks are issued as vouchers (today: the demo chain, while its switch is on). */
export const perkHotels = (): Hotel[] => (DEMO_HOTELS_ENABLED ? DEMO_HOTELS.filter((h) => h.voucher?.redeem === 'onsite') : [])

// ---- dates (UTC calendar days, ISO YYYY-MM-DD) ----
const DAY = 86_400_000
const ms = (iso: string) => Date.parse(`${iso}T00:00:00Z`)
export const today = () => new Date().toISOString().slice(0, 10)
export const addDays = (iso: string, n: number) => new Date(ms(iso) + n * DAY).toISOString().slice(0, 10)
export const daysBetween = (a: string, b: string) => Math.floor((ms(b) - ms(a)) / DAY)

// ---- codes ----
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ' // Crockford base32: no I, L, O, U

function randomBytes(n: number): Uint8Array {
  const out = new Uint8Array(n)
  const c = (globalThis as { crypto?: Crypto }).crypto
  if (c?.getRandomValues) c.getRandomValues(out)
  else for (let i = 0; i < n; i++) out[i] = Math.floor(Math.random() * 256)
  return out
}

export function newToken(): string {
  const b = randomBytes(16)
  return Array.from(b, (x) => ALPHABET[x % 32]).join('')
}

/** Group a token for reading aloud or typing: XXXX-XXXX-XXXX-XXXX. */
export const formatToken = (t: string) => t.replace(/(.{4})(?=.)/g, '$1-')

/** Accept what a person types: case, dashes, spaces, and the look-alike letters Crockford folds. */
export const normalizeToken = (s: string) =>
  s
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1')

const newId = () => `v_${Array.from(randomBytes(6), (x) => ALPHABET[x % 32]).join('').toLowerCase()}`

// ---- storage ----
const KEY = 'stayeasy-wallet'

function readAll(): WalletVoucher[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? (v as WalletVoucher[]).filter((x) => x && typeof x.id === 'string' && typeof x.token === 'string') : []
  } catch {
    return []
  }
}

function writeAll(list: WalletVoucher[]) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* storage blocked */
  }
  listeners.forEach((l) => l())
}

const listeners = new Set<() => void>()

// ---- status ----
export function statusOf(v: WalletVoucher, sub: Subscription | null, now: string = today()): WalletStatus {
  if (v.usedAt) return 'used'
  if (!sub) return 'void' // cancelled: unused vouchers stop working
  if (now > v.validUntil) return 'expired'
  return 'issued'
}

/**
 * PROTOTYPE: the PIN of every demo hotel. A real hotel sets its own in the partner
 * portal, and it is checked on a server — shipping it in the page, as here, only works
 * because the hotels are fictional.
 */
export const DEMO_PIN = '1234'
export const MAX_PIN_TRIES = 3
export const LOCK_MINUTES = 15

const hotelPin = (_hotelSlug: string) => DEMO_PIN

export type RedeemState = 'ok' | 'used' | 'expired' | 'void' | 'not_found' | 'wrong_pin' | 'locked'
export interface RedeemResult {
  state: RedeemState
  voucher?: WalletVoucher
  /** After a wrong PIN: how many tries remain before the voucher locks. */
  triesLeft?: number
}

/** The subscription period (PERIOD_DAYS blocks from the first subscription date) that contains `now`. */
export interface PeriodInfo {
  index: number
  start: string
  /** Last day of the period; the allowance refreshes the day after. */
  end: string
}
export function periodOf(sub: Subscription, now: string = today()): PeriodInfo {
  const first = sub.startedAt || sub.requestedAt || now
  const index = Math.max(0, Math.floor(daysBetween(first, now) / PERIOD_DAYS))
  const start = addDays(first, index * PERIOD_DAYS)
  return { index, start, end: addDays(start, PERIOD_DAYS - 1) }
}

export interface Allowance {
  total: number
  picked: number
  left: number
  period: PeriodInfo
}
/** This period's allowance for a subscriber, given their vouchers. Changing plan mid-period only changes the total. */
export function allowanceOf(list: WalletVoucher[], sub: Subscription, now: string = today()): Allowance {
  const period = periodOf(sub, now)
  const total = VOUCHERS_PER_PERIOD[sub.plan]
  const picked = list.filter((v) => v.periodStart === period.start).length
  return { total, picked, left: Math.max(0, total - picked), period }
}

export type ClaimState = 'ok' | 'already' | 'none_left' | 'no_sub' | 'unknown_hotel'
export interface ClaimResult {
  state: ClaimState
  voucher?: WalletVoucher
}

export const wallet = {
  all: readAll,
  list: (email: string) => readAll().filter((v) => v.email === email.trim().toLowerCase()),

  /**
   * The member picks a hotel: one voucher is issued from this period's allowance. Refused
   * without a subscription, for a hotel that isn't in the program, when the member already
   * has this hotel's voucher for the period, or when the allowance is used up.
   */
  claim(email: string, name: string, sub: Subscription | null, hotelSlug: string, now: string = today(), pool: Hotel[] = perkHotels()): ClaimResult {
    if (!sub) return { state: 'no_sub' }
    if (!pool.some((h) => h.slug === hotelSlug)) return { state: 'unknown_hotel' }
    const e = email.trim().toLowerCase()
    const all = readAll()
    const period = periodOf(sub, now)
    const mine = all.filter((v) => v.email === e && v.periodStart === period.start)
    if (mine.some((v) => v.hotelSlug === hotelSlug)) return { state: 'already', voucher: mine.find((v) => v.hotelSlug === hotelSlug) }
    if (mine.length >= VOUCHERS_PER_PERIOD[sub.plan]) return { state: 'none_left' }
    const voucher: WalletVoucher = {
      id: newId(),
      email: e,
      name: name || e.split('@')[0],
      hotelSlug,
      periodStart: period.start,
      validFrom: now,
      validUntil: addDays(now, PERIOD_DAYS - 1),
      token: newToken(),
    }
    writeAll([...all, voucher])
    return { state: 'ok', voucher }
  },

  /** The voucher behind a link (id + secret), or null. Used by the voucher page. */
  open(id: string, token: string): WalletVoucher | null {
    const v = readAll().find((x) => x.id === id)
    return v && normalizeToken(v.token) === normalizeToken(token) ? v : null
  },

  /**
   * Hotel staff type the hotel's PIN on the member's phone: the voucher is stamped used,
   * once. A wrong PIN is counted; after MAX_PIN_TRIES the voucher locks for LOCK_MINUTES
   * so the PIN cannot be guessed. Used, expired and cancelled vouchers never redeem.
   */
  redeem(id: string, token: string, pin: string, now: Date = new Date()): RedeemResult {
    const v = wallet.open(id, token)
    if (!v) return { state: 'not_found' }
    const st = statusOf(v, subscription.get(v.email), now.toISOString().slice(0, 10))
    if (st !== 'issued') return { state: st, voucher: v }
    const iso = now.toISOString()
    if (v.lockedUntil && v.lockedUntil > iso) return { state: 'locked', voucher: v }

    const save = (next: WalletVoucher) => writeAll(readAll().map((x) => (x.id === next.id ? next : x)))
    if (pin.replace(/\D/g, '') !== hotelPin(v.hotelSlug)) {
      const failures = (v.failures ?? 0) + 1
      if (failures >= MAX_PIN_TRIES) {
        const next = { ...v, failures: 0, lockedUntil: new Date(now.getTime() + LOCK_MINUTES * 60_000).toISOString() }
        save(next)
        return { state: 'locked', voucher: next }
      }
      const next = { ...v, failures }
      save(next)
      return { state: 'wrong_pin', voucher: next, triesLeft: MAX_PIN_TRIES - failures }
    }
    const used: WalletVoucher = { ...v, usedAt: iso, failures: 0, lockedUntil: undefined }
    save(used)
    return { state: 'ok', voucher: used }
  },

  /** Remove a member's vouchers (account deletion). */
  clear(email: string) {
    const e = email.trim().toLowerCase()
    writeAll(readAll().filter((v) => v.email !== e))
  },

  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

/** Live list of the signed-in member's vouchers (newest period first). */
export function useWalletVouchers(email: string | undefined): WalletVoucher[] {
  const raw = useSyncExternalStore(
    wallet.subscribe,
    () => (email ? JSON.stringify(wallet.list(email)) : '[]'),
    () => '[]',
  )
  const list = JSON.parse(raw) as WalletVoucher[]
  return list.sort((a, b) => (a.periodStart < b.periodStart ? 1 : a.periodStart > b.periodStart ? -1 : 0))
}

// ---- links the vouchers carry ----
const origin = () => (typeof window === 'undefined' ? '' : window.location.origin)
const base = () => import.meta.env.BASE_URL

/** Where the member opens their voucher (the link in the email / KakaoTalk message). */
export const voucherLink = (v: WalletVoucher) => `${origin()}${base()}voucher/${v.id}?t=${v.token}`
