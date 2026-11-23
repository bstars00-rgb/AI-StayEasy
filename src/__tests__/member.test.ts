// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { memberStrings, fill } from '../lib/memberI18n'
import { accountStrings } from '../lib/accountI18n'
import { subscription } from '../lib/subscription'
import { safeNext, pendingPlan } from '../pages/SignUpPage'
import type { Lang } from '../i18n'

const LANGS: Lang[] = ['en', 'ko', 'vi', 'zh', 'ja']

function allStrings(v: unknown): string[] {
  if (typeof v === 'string') return [v]
  if (v && typeof v === 'object') return Object.values(v).flatMap(allStrings)
  return []
}

describe('member copy', () => {
  it('has every sign-up and My page string in every language, with the same keys as English', () => {
    for (const l of LANGS) {
      expect(Object.keys(memberStrings[l].signup).sort(), l).toEqual(Object.keys(memberStrings.en.signup).sort())
      expect(Object.keys(memberStrings[l].mypage).sort(), l).toEqual(Object.keys(memberStrings.en.mypage).sort())
      for (const str of allStrings(memberStrings[l])) expect(str.trim(), l).not.toBe('')
      for (const str of allStrings(accountStrings[l])) expect(str.trim(), l).not.toBe('')
    }
  })

  it('keeps the placeholders the pages fill in', () => {
    for (const l of LANGS) {
      const { signup, mypage } = memberStrings[l]
      expect(signup.consent, l).toContain('{terms}')
      expect(signup.consent, l).toContain('{privacy}')
      expect(signup.fromPlan, l).toContain('{plan}')
      expect(signup.fromPlan, l).toContain('{period}')
      expect(mypage.subDone, l).toContain('{plan}')
      expect(mypage.subDone, l).toContain('{period}')
    }
    expect(fill('{plan} · {period}', { plan: 'Voyager', period: '1 year' })).toBe('Voyager · 1 year')
  })

  it('promises no discount or price anywhere in the account copy', () => {
    const money = /[$₫₩¥€]\s*\d|\d[\d,.]*\s*(?:₫|원|円|元|đồng|%|\b(?:usd|vnd|krw|jpy)\b)/i
    for (const l of LANGS) {
      for (const str of [...allStrings(memberStrings[l]), ...allStrings(accountStrings[l])]) expect(str, `${l}: ${str}`).not.toMatch(money)
    }
  })
})

describe('sign-up redirect safety', () => {
  it('only follows same-site paths after signing up', () => {
    expect(safeNext('/plans?plan=nomad&period=annual')).toBe('/plans?plan=nomad&period=annual')
    expect(safeNext('/account')).toBe('/account')
    expect(safeNext(null)).toBe('/account')
    expect(safeNext('//evil.example/phish')).toBe('/account')
    expect(safeNext('https://evil.example')).toBe('/account')
    expect(safeNext('javascript:alert(1)')).toBe('/account')
  })

  it('reads the pending plan out of the return path, and rejects anything else', () => {
    expect(pendingPlan('/plans?plan=voyager&period=semiannual')).toEqual({ plan: 'voyager', period: 'semiannual' })
    expect(pendingPlan('/plans?plan=gold&period=annual')).toBeNull()
    expect(pendingPlan('/plans?plan=nomad')).toBeNull()
    expect(pendingPlan('/account')).toBeNull()
  })
})

describe('subscription store', () => {
  beforeEach(() => window.localStorage.clear())

  it('keeps each member’s request separate and case-insensitive on the email', () => {
    subscription.request('Ann@Gmail.com', 'getaway', 'monthly')
    subscription.request('bob@gmail.com', 'nomad', 'annual')
    expect(subscription.get('ann@gmail.com')).toMatchObject({ plan: 'getaway', period: 'monthly' })
    expect(subscription.get('bob@gmail.com')).toMatchObject({ plan: 'nomad', period: 'annual' })
    expect(subscription.get('carol@gmail.com')).toBeNull()
  })

  it('replaces a request when the member changes plan or period, and cancels cleanly', () => {
    subscription.request('ann@gmail.com', 'getaway', 'monthly')
    subscription.request('ann@gmail.com', 'voyager', 'semiannual')
    expect(subscription.get('ann@gmail.com')).toMatchObject({ plan: 'voyager', period: 'semiannual' })
    subscription.cancel('ann@gmail.com')
    expect(subscription.get('ann@gmail.com')).toBeNull()
  })

  it('treats corrupted or tampered storage as "no subscription"', () => {
    window.localStorage.setItem('stayeasy-sub:ann@gmail.com', '{not json')
    expect(subscription.get('ann@gmail.com')).toBeNull()
    window.localStorage.setItem('stayeasy-sub:ann@gmail.com', JSON.stringify({ plan: 'platinum', period: 'monthly' }))
    expect(subscription.get('ann@gmail.com')).toBeNull()
  })

  it('notifies listeners so the page updates when the request changes', () => {
    let calls = 0
    const off = subscription.subscribe(() => calls++)
    subscription.request('ann@gmail.com', 'nomad', 'monthly')
    subscription.cancel('ann@gmail.com')
    off()
    subscription.request('ann@gmail.com', 'nomad', 'monthly')
    expect(calls).toBe(2)
  })
})
