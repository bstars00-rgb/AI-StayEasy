import { useSyncExternalStore } from 'react'
import type { Hotel } from '../types'
import { DEMO_HOTELS } from '../data/demoHotels'
import { DEMO_HOTELS_ENABLED } from './demo'
import { subscription, type Subscription } from './subscription'
import type { PlanId } from './plansI18n'

/**
 * Member perk vouchers — PROTOTYPE of the "perk wallet".
 *
 * Model: each subscription period the member is issued on-site perk vouchers
 * (breakfast, spa, transfer...) that hotels have agreed to honor. A voucher does
 * not depend on any booking: the member shows its QR at the hotel, staff confirm
 * it, and the server marks it used so the same QR can never be used twice. The
 * next period brings new vouchers, which is what keeps the subscription useful.
 *
 * Everything here lives in THIS browser (localStorage). That is enough to show
 * the flow, but it cannot actually stop reuse: the ledger has to live on a server
 * the hotel's phone can reach. The functions are shaped so that move is a swap of
 * the storage layer, not a redesign.
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
  /** The guest's booking number at the hotel, recorded by staff when the perk was given. */
  bookingRef?: string
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

/**
 * A hotel booking number as staff type it: spaces and case don't matter. Hotels'
 * formats differ, so the only rule is "something that looks like a reference".
 */
export const normalizeRef = (s: string) => s.trim().toUpperCase().replace(/\s+/g, '')
export const isBookingRef = (s: string) => /^[0-9A-Z][0-9A-Z\-_/]{3,39}$/.test(normalizeRef(s))

const newId = () => `v_${Array.from(randomBytes(6), (x) => ALPHABET[x % 32]).join('').toLowerCase()}`

const hash = (s: string) => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

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

/** Why a staff check fails, or 'valid'. */
export type InspectState = 'valid' | 'used' | 'expired' | 'void' | 'wrong_hotel' | 'not_found' | 'booking_missing' | 'booking_reused'
export interface Inspection {
  state: InspectState
  voucher?: WalletVoucher
}

export const wallet = {
  all: readAll,
  list: (email: string) => readAll().filter((v) => v.email === email.trim().toLowerCase()),

  /**
   * Issue this period's vouchers for a subscriber — idempotent. Periods run in
   * PERIOD_DAYS blocks from the member's FIRST subscription date, so changing plan
   * or re-opening the page cannot restart them. Hotels rotate by member and period.
   */
  ensureBatch(email: string, name: string, sub: Subscription | null, now: string = today(), pool: Hotel[] = perkHotels()): WalletVoucher[] {
    if (!sub || pool.length === 0) return []
    const e = email.trim().toLowerCase()
    const idx = Math.max(0, Math.floor(daysBetween(sub.startedAt || sub.requestedAt || now, now) / PERIOD_DAYS))
    const periodStart = addDays(sub.startedAt || sub.requestedAt || now, idx * PERIOD_DAYS)
    const all = readAll()
    const have = all.filter((v) => v.email === e && v.periodStart === periodStart)
    const quota = VOUCHERS_PER_PERIOD[sub.plan]
    const base = hash(e) + idx * quota
    const issued: WalletVoucher[] = []
    for (let k = 0; k < quota; k++) {
      const hotel = pool[(base + k) % pool.length]
      if (have.some((v) => v.hotelSlug === hotel.slug) || issued.some((v) => v.hotelSlug === hotel.slug)) continue
      issued.push({
        id: newId(),
        email: e,
        name: name || e.split('@')[0],
        hotelSlug: hotel.slug,
        periodStart,
        validFrom: periodStart,
        validUntil: addDays(periodStart, PERIOD_DAYS - 1),
        token: newToken(),
      })
    }
    if (issued.length) writeAll([...all, ...issued])
    return issued
  },

  /** The voucher behind a link (id + secret), or null. Used by the voucher page. */
  open(id: string, token: string): WalletVoucher | null {
    const v = readAll().find((x) => x.id === id)
    return v && normalizeToken(v.token) === normalizeToken(token) ? v : null
  },

  /** What staff see after scanning or typing a code — no change is made. */
  inspect(code: string, hotelSlug: string, now: string = today()): Inspection {
    const t = normalizeToken(code)
    const v = t ? readAll().find((x) => normalizeToken(x.token) === t) : undefined
    if (!v) return { state: 'not_found' }
    if (v.hotelSlug !== hotelSlug) return { state: 'wrong_hotel' }
    const s = statusOf(v, subscription.get(v.email), now)
    return { state: s === 'issued' ? 'valid' : s, voucher: v }
  },

  /**
   * Staff confirm the perk was given for a booking: marks the voucher used, once, and
   * records the booking number. The perk belongs to a booking, so a missing number is
   * refused, and one booking number can only ever earn one voucher at a hotel.
   */
  redeem(code: string, hotelSlug: string, bookingRef: string, now: string = today()): Inspection {
    const r = wallet.inspect(code, hotelSlug, now)
    if (r.state !== 'valid' || !r.voucher) return r
    if (!isBookingRef(bookingRef)) return { state: 'booking_missing', voucher: r.voucher }
    const ref = normalizeRef(bookingRef)
    const all = readAll()
    if (all.some((x) => x.hotelSlug === hotelSlug && x.bookingRef === ref)) return { state: 'booking_reused', voucher: r.voucher }
    const used: WalletVoucher = { ...r.voucher, usedAt: new Date().toISOString(), bookingRef: ref }
    writeAll(all.map((x) => (x.id === used.id ? used : x)))
    return { state: 'valid', voucher: used }
  },

  /** What a hotel has given so far (newest first) — the count it can show its own management. */
  redemptions: (hotelSlug: string): WalletVoucher[] =>
    readAll()
      .filter((v) => v.hotelSlug === hotelSlug && v.usedAt)
      .sort((a, b) => (a.usedAt! < b.usedAt! ? 1 : -1)),

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

/** Live list of what a hotel has given so far (the staff screen's history). */
export function useWalletLedger(hotelSlug: string): WalletVoucher[] {
  const raw = useSyncExternalStore(
    wallet.subscribe,
    () => JSON.stringify(wallet.redemptions(hotelSlug)),
    () => '[]',
  )
  return JSON.parse(raw) as WalletVoucher[]
}

// ---- links the vouchers carry ----
const origin = () => (typeof window === 'undefined' ? '' : window.location.origin)
const base = () => import.meta.env.BASE_URL

/** Where the member opens their voucher (the link in the email / KakaoTalk message). */
export const voucherLink = (v: WalletVoucher) => `${origin()}${base()}voucher/${v.id}?t=${v.token}`

/** What the QR encodes: the hotel staff screen with the code filled in. */
export const redeemLink = (v: WalletVoucher) => `${origin()}${base()}staff/redeem?c=${v.token}`
