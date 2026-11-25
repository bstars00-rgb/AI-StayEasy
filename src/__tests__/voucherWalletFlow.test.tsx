// @vitest-environment jsdom
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest'
import { cleanup, render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import { walletStrings } from '../lib/walletI18n'

const LANGS = ['en', 'ko', 'ja', 'vi', 'zh'] as const

/** Every string path in an object, so two languages can be compared key by key. */
function paths(o: unknown, prefix = ''): Record<string, string | null> {
  if (o === null || typeof o === 'string') return { [prefix]: o as string | null }
  return Object.entries(o as Record<string, unknown>).reduce((acc, [k, v]) => ({ ...acc, ...paths(v, prefix ? `${prefix}.${k}` : k) }), {} as Record<string, string | null>)
}
const holes = (s: string | null) => (s ?? '').match(/\{\w+\}/g)?.sort().join(',') ?? ''

describe('wallet copy, all five languages', () => {
  const base = paths(walletStrings.en)

  it('has the same keys and the same {placeholders} in every language', () => {
    for (const l of LANGS) {
      const p = paths(walletStrings[l])
      expect(Object.keys(p).sort(), l).toEqual(Object.keys(base).sort())
      for (const k of Object.keys(base)) {
        if (k === 'delivery.messenger') continue
        const empty = (l === 'en' || l === 'zh') && /^delivery\.(messengerLabel|bubble)/.test(k)
        if (!empty) expect((p[k] ?? '').length, `${l} ${k}`).toBeGreaterThan(0)
        if (!/^delivery\.bubble/.test(k)) expect(holes(p[k]), `${l} ${k}`).toBe(holes(base[k]))
      }
    }
  })

  it('has a messenger bubble exactly for the languages that have a messenger', () => {
    expect(walletStrings.ko.delivery.messenger).toMatch(/Kakao|카카오/)
    expect(walletStrings.ja.delivery.messenger).toMatch(/LINE/)
    expect(walletStrings.vi.delivery.messenger).toMatch(/Zalo/)
    expect(walletStrings.en.delivery.messenger).toBeNull()
    expect(walletStrings.zh.delivery.messenger).toBeNull()
    for (const l of ['ko', 'ja', 'vi'] as const) {
      const d = walletStrings[l].delivery
      expect(d.bubbleTitle && d.bubbleBody && d.bubbleCta && d.messengerLabel, l).toBeTruthy()
    }
  })
})

beforeAll(() => {
  window.localStorage.setItem('stayeasy-lang', 'en')
  if (!window.matchMedia) {
    window.matchMedia = (q: string) =>
      ({ matches: false, media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false }) as unknown as MediaQueryList
  }
  window.scrollTo = () => {}
  if (!('IntersectionObserver' in window)) {
    // @ts-expect-error minimal stub
    window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return [] } }
  }
})

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
  vi.resetModules()
})

beforeEach(() => {
  window.localStorage.clear()
  window.localStorage.setItem('stayeasy-lang', 'en')
})

async function open(path: string, env: { demo: boolean } = { demo: true }) {
  vi.stubEnv('VITE_DEMO_HOTELS', env.demo ? 'true' : '')
  vi.stubEnv('VITE_ENABLE_BM', 'true')
  vi.resetModules()
  const [{ default: App }, { I18nProvider }, { MemoryRouter }] = await Promise.all([import('../App'), import('../i18n'), import('react-router-dom')])
  render(
    <I18nProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </I18nProvider>,
  )
  await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
}

const TODAY = new Date().toISOString().slice(0, 10)

/** A signed-in member on a plan; their subscription starts today. */
function member(plan: 'getaway' | 'voyager' | 'nomad' = 'voyager') {
  window.localStorage.setItem('stayeasy-guest', JSON.stringify({ email: 'mina@gmail.com', name: 'Mina', joinedAt: TODAY }))
  window.localStorage.setItem('stayeasy-sub:mina@gmail.com', JSON.stringify({ plan, period: 'monthly', requestedAt: TODAY, startedAt: TODAY }))
}

type Row = { id: string; token: string; hotelSlug: string; usedAt?: string; failures?: number }
const ledger = () => JSON.parse(window.localStorage.getItem('stayeasy-wallet') ?? '[]') as Row[]
const PIN = '1234' // the demo hotels' PIN (DEMO_PIN)

/** Visit My page once so this period's vouchers get issued, then hand back the first. */
async function issued(plan: 'getaway' | 'voyager' | 'nomad' = 'getaway'): Promise<Row> {
  member(plan)
  await open('/account')
  await screen.findByText(/new voucher/i)
  const v = ledger()[0]
  cleanup()
  return v
}
const voucherPath = (v: Row, token = v.token) => `/voucher/${v.id}?t=${token}`

describe('perk-voucher wallet, demo switch ON', () => {
  it('My page shows this period’s vouchers for the plan and a preview of the message', async () => {
    member('voyager')
    await open('/account')
    expect((await screen.findByText(/2 new voucher\(s\) just arrived/i)).textContent).toBeTruthy()
    expect(ledger().length).toBe(2)
    expect(screen.getAllByText('Ready to use').length).toBe(2)
    expect(screen.getAllByRole('link', { name: /open voucher/i }).length).toBe(2)
    expect(screen.queryByText(/staff check screen/i)).toBeNull() // no staff screen: the PIN is typed on the member's phone

    fireEvent.click(screen.getByRole('button', { name: /see the message we send/i }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(/nothing is actually sent/i)).toBeTruthy()
    expect(within(dialog).getByText(/Hi Mina/)).toBeTruthy()
    // English members get email only: no messenger card.
    expect(within(dialog).queryByText(/kakao|line|zalo/i)).toBeNull()
  })

  it('without a subscription it asks the member to subscribe and issues nothing', async () => {
    window.localStorage.setItem('stayeasy-guest', JSON.stringify({ email: 'mina@gmail.com', name: 'Mina', joinedAt: TODAY }))
    await open('/account')
    expect(await screen.findByText(/subscribe to receive perk vouchers/i)).toBeTruthy()
    expect(ledger()).toEqual([])
  })

  it('reopening My page does not issue more vouchers', async () => {
    member('voyager')
    await open('/account')
    await screen.findByText(/new voucher/i)
    cleanup()
    await open('/account')
    await screen.findAllByText('Ready to use')
    expect(ledger().length).toBe(2)
    expect(screen.queryByText(/new voucher\(s\) just arrived/i)).toBeNull()
  })

  it('the voucher opens for its subscriber: hotel, perk, a live clock, no QR to copy', async () => {
    const v = await issued()
    await open(voucherPath(v))
    expect(await screen.findByText('Ready to use')).toBeTruthy()
    expect(screen.getByText('Mina')).toBeTruthy()
    expect(screen.getByText(/at check-in, show this screen to the hotel staff/i)).toBeTruthy()
    expect(screen.getByLabelText('Now').textContent).toMatch(/^\d\d:\d\d:\d\d$/) // a screenshot shows a stale time
    expect(screen.queryByRole('img', { name: /qr/i })).toBeNull()
    expect(screen.getByRole('link', { name: /see the hotel/i }).getAttribute('href')).toBe(`/hotels/${v.hotelSlug}`)
  })

  it('does not open for anyone else: signed out → sign-in, wrong secret, another member, ended subscription', async () => {
    const v = await issued()

    window.localStorage.removeItem('stayeasy-guest') // signed out: the link alone is not enough
    await open(voucherPath(v))
    expect(await screen.findByRole('heading', { name: /sign in to stayeasy/i })).toBeTruthy()
    expect(screen.queryByText('Ready to use')).toBeNull()
    cleanup()

    member('getaway')
    await open(voucherPath(v, 'WRONGWRONGWRONG0'))
    expect(await screen.findByRole('heading', { name: /voucher not found/i })).toBeTruthy()
    cleanup()

    window.localStorage.setItem('stayeasy-guest', JSON.stringify({ email: 'sam@gmail.com', name: 'Sam', joinedAt: TODAY }))
    await open(voucherPath(v)) // someone else, with the right link
    expect(await screen.findByRole('heading', { name: /voucher not found/i })).toBeTruthy()
    expect(screen.queryByText('Ready to use')).toBeNull()
    cleanup()

    member('getaway')
    window.localStorage.removeItem('stayeasy-sub:mina@gmail.com') // the subscription ended
    await open(voucherPath(v))
    expect(await screen.findByText(/opens for active subscribers only/i)).toBeTruthy()
    expect(screen.queryByRole('button', { name: /confirm use/i })).toBeNull()
  })

  it('hotel staff type the PIN on the member’s phone: a wrong PIN is refused, the right one stamps it used, once', async () => {
    const v = await issued()
    await open(voucherPath(v))
    fireEvent.click(await screen.findByRole('button', { name: /hotel staff: confirm use/i }))

    const pin = screen.getByLabelText(/hotel pin/i)
    expect((screen.getByRole('button', { name: /^confirm$/i }) as HTMLButtonElement).disabled).toBe(true) // needs 4 digits
    fireEvent.change(pin, { target: { value: '0000' } })
    fireEvent.click(screen.getByRole('button', { name: /^confirm$/i }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/wrong pin\. 2 tries left/i)
    expect(ledger()[0].usedAt).toBeUndefined()

    fireEvent.change(screen.getByLabelText(/hotel pin/i), { target: { value: PIN } })
    fireEvent.click(screen.getByRole('button', { name: /^confirm$/i }))
    expect((await screen.findAllByText(/^✓ Used$/)).length).toBe(1)
    expect(ledger()[0].usedAt).toBeTruthy()
    expect(screen.getByText(/used on/i)).toBeTruthy()
    expect(screen.queryByRole('button', { name: /confirm use/i })).toBeNull() // nothing left to do
    expect(screen.queryByLabelText('Now')).toBeNull()
    cleanup()

    await open(voucherPath(v)) // opened again later: still used
    expect((await screen.findAllByText(/^✓ Used$/)).length).toBe(1)
    expect(screen.queryByRole('button', { name: /confirm use/i })).toBeNull()
  })

  it('too many wrong PINs lock the voucher — even the right PIN waits', async () => {
    const v = await issued()
    await open(voucherPath(v))
    fireEvent.click(await screen.findByRole('button', { name: /hotel staff: confirm use/i }))
    for (let i = 0; i < 3; i++) {
      fireEvent.change(screen.getByLabelText(/hotel pin/i), { target: { value: '9999' } })
      fireEvent.click(screen.getByRole('button', { name: /^confirm$/i }))
      await screen.findByRole('alert')
    }
    expect(screen.getByRole('alert').textContent).toMatch(/too many wrong tries/i)
    const input = screen.getByLabelText(/hotel pin/i) as HTMLInputElement
    expect(input.disabled).toBe(true)
    expect(ledger()[0].usedAt).toBeUndefined()
  })
})

describe('perk-voucher wallet, demo switch OFF (the public default)', () => {
  it('has no perk hotels: My page keeps the empty voucher card, and no voucher exists to open', async () => {
    member('nomad')
    await open('/account', { demo: false })
    await screen.findByRole('heading', { name: /subscription/i })
    expect(screen.queryByText(/perk vouchers this period/i)).toBeNull()
    expect(ledger()).toEqual([])
    cleanup()
    await open('/voucher/v_none?t=ABCD', { demo: false })
    expect(await screen.findByRole('heading', { name: /voucher not found/i })).toBeTruthy()
  })
})
