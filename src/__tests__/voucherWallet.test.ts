// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { DEMO_HOTELS } from '../data/demoHotels'
import { subscription } from '../lib/subscription'
import {
  wallet, allowanceOf, newToken, formatToken, normalizeToken, addDays, daysBetween, statusOf, perkHotels,
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

describe('picking a hotel', () => {
  const claim = (email: string, slug: string, day = START, name = 'Mina') => wallet.claim(email, name, sub(email), slug, day, POOL)

  it('has a pool of on-site perks to pick from', () => {
    expect(POOL.length).toBeGreaterThanOrEqual(6)
    // The pool is empty while the demo switch is off (the test default).
    expect(perkHotels()).toEqual([])
  })

  it('gives each plan its allowance, one voucher per picked hotel, valid from the pick day', () => {
    for (const plan of Object.keys(VOUCHERS_PER_PERIOD) as PlanId[]) {
      const email = `${plan}@gmail.com`
      setSub(email, plan)
      const quota = VOUCHERS_PER_PERIOD[plan]
      for (let i = 0; i < quota; i++) {
        const r = claim(email, POOL[i].slug)
        expect(r.state, `${plan} #${i}`).toBe('ok')
        expect(r.voucher!.hotelSlug).toBe(POOL[i].slug)
        expect(r.voucher!.validFrom).toBe(START)
        expect(r.voucher!.validUntil).toBe(addDays(START, PERIOD_DAYS - 1))
        expect(r.voucher!.usedAt).toBeUndefined()
      }
      expect(claim(email, POOL[quota].slug).state, plan).toBe('none_left')
      expect(wallet.list(email).length).toBe(quota)
    }
  })

  it('counts the allowance: total, picked, left — and the refresh date', () => {
    setSub('a@gmail.com', 'voyager')
    expect(allowanceOf(wallet.list('a@gmail.com'), sub('a@gmail.com'), START)).toMatchObject({ total: 2, picked: 0, left: 2 })
    claim('a@gmail.com', POOL[0].slug)
    const al = allowanceOf(wallet.list('a@gmail.com'), sub('a@gmail.com'), addDays(START, 3))
    expect(al).toMatchObject({ total: 2, picked: 1, left: 1 })
    expect(al.period).toEqual({ index: 0, start: START, end: addDays(START, PERIOD_DAYS - 1) })
  })

  it('gives a hotel to a member only once a period', () => {
    setSub('a@gmail.com', 'nomad')
    const first = claim('a@gmail.com', POOL[0].slug)
    const again = claim('a@gmail.com', POOL[0].slug, addDays(START, 5))
    expect(again.state).toBe('already')
    expect(again.voucher?.id).toBe(first.voucher!.id) // hands back the one they hold
    expect(wallet.list('a@gmail.com').length).toBe(1)
  })

  it('lets the member pick the same hotel again next period — a new voucher for the next visit', () => {
    setSub('a@gmail.com', 'getaway')
    const first = claim('a@gmail.com', POOL[0].slug)
    expect(claim('a@gmail.com', POOL[1].slug, addDays(START, 10)).state).toBe('none_left') // allowance used up
    const nextPeriod = addDays(START, PERIOD_DAYS)
    const second = claim('a@gmail.com', POOL[0].slug, nextPeriod)
    expect(second.state).toBe('ok')
    expect(second.voucher!.id).not.toBe(first.voucher!.id)
    expect(second.voucher!.token).not.toBe(first.voucher!.token)
    expect(second.voucher!.periodStart).toBe(nextPeriod)
    expect(statusOf(first.voucher!, sub('a@gmail.com'), nextPeriod)).toBe('expired') // the old one ran out
    expect(statusOf(second.voucher!, sub('a@gmail.com'), nextPeriod)).toBe('issued')
  })

  it('does not carry unpicked allowance into the next period', () => {
    setSub('a@gmail.com', 'nomad')
    claim('a@gmail.com', POOL[0].slug) // picked 1 of 3
    const next = addDays(START, PERIOD_DAYS)
    expect(allowanceOf(wallet.list('a@gmail.com'), sub('a@gmail.com'), next)).toMatchObject({ total: 3, picked: 0, left: 3 })
  })

  it('does not restart the periods when the member changes plan; only the total changes', () => {
    setSub('a@gmail.com', 'getaway')
    claim('a@gmail.com', POOL[0].slug)
    setSub('a@gmail.com', 'nomad', START) // what subscription.request does: keeps startedAt
    const al = allowanceOf(wallet.list('a@gmail.com'), sub('a@gmail.com'), addDays(START, 5))
    expect(al).toMatchObject({ total: 3, picked: 1, left: 2 })
    expect(al.period.start).toBe(START)
    expect(claim('a@gmail.com', POOL[1].slug, addDays(START, 5)).state).toBe('ok')
  })

  it('keeps the original start date when the real store changes plan', () => {
    window.localStorage.setItem('stayeasy-sub:a@gmail.com', JSON.stringify({ plan: 'getaway', period: 'monthly', requestedAt: '2026-01-01', startedAt: '2026-01-01' }))
    subscription.request('a@gmail.com', 'nomad', 'annual')
    expect(subscription.get('a@gmail.com')!.startedAt).toBe('2026-01-01')
  })

  it('refuses without a subscription, for a hotel outside the program, and never over the allowance', () => {
    expect(wallet.claim('a@gmail.com', 'A', null, POOL[0].slug, START, POOL).state).toBe('no_sub')
    setSub('a@gmail.com', 'nomad')
    expect(claim('a@gmail.com', 'not-a-hotel').state).toBe('unknown_hotel')
    expect(wallet.claim('a@gmail.com', 'A', sub('a@gmail.com'), POOL[0].slug, START, []).state).toBe('unknown_hotel')
    expect(wallet.list('a@gmail.com')).toEqual([])
  })

  it('keeps members apart: one member’s picks never use another’s allowance', () => {
    setSub('a@gmail.com', 'getaway')
    setSub('b@gmail.com', 'getaway')
    expect(claim('a@gmail.com', POOL[0].slug).state).toBe('ok')
    expect(claim('b@gmail.com', POOL[0].slug).state).toBe('ok')
    expect(wallet.list('a@gmail.com').length).toBe(1)
    expect(wallet.list('b@gmail.com').length).toBe(1)
  })
})

describe('redeeming — the hotel PIN, once', () => {
  const issue = (plan: PlanId = 'getaway', email = 'a@gmail.com'): WalletVoucher => {
    setSub(email, plan)
    return wallet.claim(email, 'Mina', sub(email), POOL[0].slug, START, POOL).voucher!
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
    const other = wallet.claim('a@gmail.com', 'Mina', sub('a@gmail.com'), POOL[1].slug, START, POOL).voucher!
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
