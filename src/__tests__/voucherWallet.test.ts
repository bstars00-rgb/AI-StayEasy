// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { DEMO_HOTELS } from '../data/demoHotels'
import { subscription } from '../lib/subscription'
import {
  wallet, newToken, formatToken, normalizeToken, addDays, daysBetween, statusOf, perkHotels,
  PERIOD_DAYS, VOUCHERS_PER_PERIOD, DEMO_PIN, MAX_PIN_TRIES, LOCK_MINUTES, type WalletVoucher,
} from '../lib/voucherWallet'
import type { PlanId, PeriodId } from '../lib/plansI18n'

const POOL = DEMO_HOTELS.filter((h) => h.voucher?.redeem === 'onsite')
const START = '2026-12-01'

/** Write a subscription with a fixed start date (the store itself stamps "today"). */
const setSub = (email: string, plan: PlanId, startedAt = START, period: PeriodId = 'monthly') =>
  window.localStorage.setItem(`stayeasy-sub:${email}`, JSON.stringify({ plan, period, requestedAt: startedAt, startedAt }))

const sub = (email: string) => subscription.get(email)!

beforeEach(() => window.localStorage.clear())

describe('codes', () => {
  it('makes long, distinct, readable tokens', () => {
    const seen = new Set(Array.from({ length: 200 }, newToken))
    expect(seen.size).toBe(200)
    for (const t of seen) expect(t).toMatch(/^[0-9A-HJKMNP-TV-Z]{16}$/)
    expect(formatToken('ABCD1234EFGH5678')).toBe('ABCD-1234-EFGH-5678')
  })

  it('accepts what a person types: case, dashes, spaces and look-alike letters', () => {
    expect(normalizeToken('abcd-1234 efgh-5678')).toBe('ABCD1234EFGH5678')
    expect(normalizeToken('O0ILo1')).toBe('001101')
  })

  it('does dates in whole UTC days', () => {
    expect(addDays('2026-12-01', 29)).toBe('2026-12-30')
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02')
    expect(daysBetween('2026-12-01', '2026-12-31')).toBe(30)
  })
})

describe('issuing', () => {
  it('has a pool of on-site perks to issue from', () => {
    expect(POOL.length).toBeGreaterThanOrEqual(6)
    // The pool is empty while the demo switch is off (the test default).
    expect(perkHotels()).toEqual([])
  })

  it('issues the plan’s quota, each from a different hotel, valid for one period', () => {
    for (const plan of Object.keys(VOUCHERS_PER_PERIOD) as PlanId[]) {
      const email = `${plan}@gmail.com`
      setSub(email, plan)
      const got = wallet.ensureBatch(email, 'Mina', sub(email), START, POOL)
      expect(got.length, plan).toBe(VOUCHERS_PER_PERIOD[plan])
      expect(new Set(got.map((v) => v.hotelSlug)).size, plan).toBe(got.length)
      for (const v of got) {
        expect(v.validFrom, plan).toBe(START)
        expect(v.validUntil, plan).toBe(addDays(START, PERIOD_DAYS - 1))
        expect(v.usedAt).toBeUndefined()
        expect(POOL.some((h) => h.slug === v.hotelSlug)).toBe(true)
      }
    }
  })

  it('is idempotent: reopening the page does not issue more', () => {
    setSub('a@gmail.com', 'voyager')
    wallet.ensureBatch('a@gmail.com', 'A', sub('a@gmail.com'), START, POOL)
    wallet.ensureBatch('a@gmail.com', 'A', sub('a@gmail.com'), addDays(START, 10), POOL)
    expect(wallet.list('a@gmail.com').length).toBe(VOUCHERS_PER_PERIOD.voyager)
  })

  it('starts a new batch each period, with different hotels, and the old one expires', () => {
    setSub('a@gmail.com', 'voyager')
    const first = wallet.ensureBatch('a@gmail.com', 'A', sub('a@gmail.com'), START, POOL)
    const nextDay = addDays(START, PERIOD_DAYS)
    const second = wallet.ensureBatch('a@gmail.com', 'A', sub('a@gmail.com'), nextDay, POOL)
    expect(second.length).toBe(VOUCHERS_PER_PERIOD.voyager)
    expect(second[0].periodStart).toBe(nextDay)
    expect(second.map((v) => v.hotelSlug).sort()).not.toEqual(first.map((v) => v.hotelSlug).sort())
    expect(statusOf(first[0], sub('a@gmail.com'), nextDay)).toBe('expired')
    expect(statusOf(first[0], sub('a@gmail.com'), addDays(START, PERIOD_DAYS - 1))).toBe('issued')
  })

  it('does not restart the periods when the member changes plan, and only tops up to the new quota', () => {
    setSub('a@gmail.com', 'getaway')
    wallet.ensureBatch('a@gmail.com', 'A', sub('a@gmail.com'), START, POOL)
    // Change plan later in the period: startedAt must survive the change.
    const later = addDays(START, 5)
    setSub('a@gmail.com', 'nomad', START) // what subscription.request does: keeps startedAt
    wallet.ensureBatch('a@gmail.com', 'A', sub('a@gmail.com'), later, POOL)
    const mine = wallet.list('a@gmail.com')
    expect(mine.length).toBe(VOUCHERS_PER_PERIOD.nomad) // 3 in total, not 1 + 3
    expect(new Set(mine.map((v) => v.periodStart)).size).toBe(1)
  })

  it('keeps the original start date when the real store changes plan', () => {
    window.localStorage.setItem('stayeasy-sub:a@gmail.com', JSON.stringify({ plan: 'getaway', period: 'monthly', requestedAt: '2026-01-01', startedAt: '2026-01-01' }))
    subscription.request('a@gmail.com', 'nomad', 'annual')
    expect(subscription.get('a@gmail.com')!.startedAt).toBe('2026-01-01')
  })

  it('issues nothing without a subscription or without a pool', () => {
    expect(wallet.ensureBatch('a@gmail.com', 'A', null, START, POOL)).toEqual([])
    setSub('a@gmail.com', 'nomad')
    expect(wallet.ensureBatch('a@gmail.com', 'A', sub('a@gmail.com'), START, [])).toEqual([])
    expect(wallet.list('a@gmail.com')).toEqual([])
  })

  it('gives different members different starting hotels', () => {
    const heads = new Set<string>()
    for (const e of ['a@x.com', 'b@x.com', 'c@x.com', 'd@x.com', 'e@x.com', 'f@x.com']) {
      setSub(e, 'getaway')
      heads.add(wallet.ensureBatch(e, 'x', sub(e), START, POOL)[0].hotelSlug)
    }
    expect(heads.size).toBeGreaterThan(1)
  })
})

describe('redeeming — the hotel PIN, once', () => {
  const issue = (plan: PlanId = 'getaway', email = 'a@gmail.com'): WalletVoucher => {
    setSub(email, plan)
    return wallet.ensureBatch(email, 'Mina', sub(email), START, POOL)[0]
  }
  /** A moment on a given day (UTC). */
  const at = (day: string, hour = 12, minute = 0) => new Date(`${day}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`)

  it('works once with the hotel PIN, then says the voucher is used', () => {
    const v = issue()
    const first = wallet.redeem(v.id, v.token, DEMO_PIN, at(START))
    expect(first.state).toBe('ok')
    expect(first.voucher?.usedAt).toBeTruthy()
    expect(statusOf(wallet.list('a@gmail.com')[0], sub('a@gmail.com'), START)).toBe('used')
    const usedAt = wallet.list('a@gmail.com')[0].usedAt
    expect(wallet.redeem(v.id, v.token, DEMO_PIN, at(START, 13)).state).toBe('used')
    expect(wallet.list('a@gmail.com')[0].usedAt).toBe(usedAt) // the first stamp stands
  })

  it('a wrong PIN is refused and counted, and the voucher stays usable', () => {
    const v = issue()
    const one = wallet.redeem(v.id, v.token, '0000', at(START))
    expect(one.state).toBe('wrong_pin')
    expect(one.triesLeft).toBe(MAX_PIN_TRIES - 1)
    expect(wallet.redeem(v.id, v.token, '', at(START)).triesLeft).toBe(MAX_PIN_TRIES - 2)
    expect(wallet.list('a@gmail.com')[0].usedAt).toBeUndefined()
    expect(wallet.redeem(v.id, v.token, DEMO_PIN, at(START)).state).toBe('ok')
    expect(wallet.list('a@gmail.com')[0].failures).toBe(0) // a success clears the count
  })

  it('locks after too many wrong PINs — even the right PIN is refused — and unlocks later', () => {
    const v = issue()
    for (let i = 0; i < MAX_PIN_TRIES - 1; i++) expect(wallet.redeem(v.id, v.token, '9999', at(START)).state).toBe('wrong_pin')
    expect(wallet.redeem(v.id, v.token, '9999', at(START)).state).toBe('locked')
    expect(wallet.redeem(v.id, v.token, DEMO_PIN, at(START, 12, 5)).state).toBe('locked')
    expect(wallet.list('a@gmail.com')[0].usedAt).toBeUndefined()
    expect(wallet.redeem(v.id, v.token, DEMO_PIN, at(START, 12, LOCK_MINUTES + 1)).state).toBe('ok')
  })

  it('takes the PIN however it is typed', () => {
    const v = issue()
    expect(wallet.redeem(v.id, v.token, ` ${DEMO_PIN.slice(0, 2)}-${DEMO_PIN.slice(2)} `, at(START)).state).toBe('ok')
  })

  it('needs the voucher’s own secret: another token or id redeems nothing', () => {
    const v = issue()
    expect(wallet.redeem(v.id, newToken(), DEMO_PIN, at(START)).state).toBe('not_found')
    expect(wallet.redeem('v_nope', v.token, DEMO_PIN, at(START)).state).toBe('not_found')
    expect(wallet.list('a@gmail.com')[0].usedAt).toBeUndefined()
  })

  it('rejects an expired voucher, but the last day still works', () => {
    const v = issue()
    expect(wallet.redeem(v.id, v.token, DEMO_PIN, at(addDays(v.validUntil, 1))).state).toBe('expired')
    expect(wallet.redeem(v.id, v.token, DEMO_PIN, at(v.validUntil, 23)).state).toBe('ok')
  })

  it('stops working when the subscription is cancelled; a used voucher stays used', () => {
    const v = issue('nomad')
    const other = wallet.list('a@gmail.com')[1]
    expect(wallet.redeem(v.id, v.token, DEMO_PIN, at(START)).state).toBe('ok')
    subscription.cancel('a@gmail.com')
    expect(wallet.redeem(other.id, other.token, DEMO_PIN, at(START)).state).toBe('void')
    expect(wallet.redeem(v.id, v.token, DEMO_PIN, at(START)).state).toBe('used')
  })

  it('opens a voucher only with its own secret', () => {
    const v = issue()
    expect(wallet.open(v.id, v.token)?.id).toBe(v.id)
    expect(wallet.open(v.id, newToken())).toBeNull()
    expect(wallet.open('v_nope', v.token)).toBeNull()
  })

  it('treats tampered storage as an empty wallet', () => {
    window.localStorage.setItem('stayeasy-wallet', '{not json')
    expect(wallet.all()).toEqual([])
    window.localStorage.setItem('stayeasy-wallet', JSON.stringify([{ nope: true }, 5]))
    expect(wallet.all()).toEqual([])
  })

  it('removes a member’s vouchers when the account is cleared, and no one else’s', () => {
    issue('getaway', 'a@gmail.com')
    issue('getaway', 'b@gmail.com')
    wallet.clear('a@gmail.com')
    expect(wallet.list('a@gmail.com')).toEqual([])
    expect(wallet.list('b@gmail.com').length).toBe(1)
  })
})
