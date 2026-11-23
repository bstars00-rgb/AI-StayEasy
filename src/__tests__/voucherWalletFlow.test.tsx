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

const ledger = () => JSON.parse(window.localStorage.getItem('stayeasy-wallet') ?? '[]') as { id: string; token: string; hotelSlug: string; usedAt?: string }[]

/** Hotel staff screen: choose the hotel, type the code, press Check. */
async function checkAt(slug: string, token: string) {
  fireEvent.change(screen.getByLabelText(/your hotel/i), { target: { value: slug } })
  fireEvent.change(screen.getByLabelText(/voucher code/i), { target: { value: token.toLowerCase() } })
  fireEvent.click(screen.getByRole('button', { name: /^check$/i }))
}

describe('perk-voucher wallet, demo switch ON', () => {
  it('My page shows this period’s vouchers for the plan and a preview of the message', async () => {
    member('voyager')
    await open('/account')
    expect((await screen.findByText(/2 new voucher\(s\) just arrived/i)).textContent).toBeTruthy()
    expect(ledger().length).toBe(2)
    expect(screen.getAllByText('Ready to use').length).toBe(2)
    expect(screen.getAllByRole('link', { name: /open voucher/i }).length).toBe(2)

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

  it('the voucher page shows a QR and the code, and only opens with its own secret', async () => {
    member('getaway')
    await open('/account')
    await screen.findByText(/new voucher/i)
    const [v] = ledger()
    cleanup()

    await open(`/voucher/${v.id}?t=${v.token}`)
    expect((await screen.findAllByRole('img', { name: /^QR /i })).length).toBe(1)
    const code = `${v.token.slice(0, 4)}-${v.token.slice(4, 8)}-${v.token.slice(8, 12)}-${v.token.slice(12)}`
    expect(screen.getByText(code)).toBeTruthy()
    expect(screen.getByText('Mina')).toBeTruthy()
    cleanup()

    await open(`/voucher/${v.id}?t=WRONGWRONGWRONG0`)
    expect(await screen.findByRole('heading', { name: /voucher not found/i })).toBeTruthy()
    expect(screen.queryByText(code)).toBeNull()
    cleanup()

    await open(`/voucher/${v.id}`) // the id alone is not enough
    expect(await screen.findByRole('heading', { name: /voucher not found/i })).toBeTruthy()
  })

  it('hotel staff can give the perk once; the second check says it is used', async () => {
    member('getaway')
    await open('/account')
    await screen.findByText(/new voucher/i)
    const [v] = ledger()
    cleanup()

    await open(`/staff/redeem?c=${v.token}`)
    await screen.findByRole('heading', { name: /hotel staff check/i })
    expect((screen.getByLabelText(/voucher code/i) as HTMLInputElement).value).toBe(v.token) // QR pre-fills the code
    await checkAt(v.hotelSlug, v.token)
    expect(await screen.findByText('Valid voucher')).toBeTruthy()
    expect(ledger()[0].usedAt).toBeUndefined() // checking does not use it

    fireEvent.click(screen.getByRole('button', { name: /mark as given/i }))
    expect(await screen.findByText(/recorded as given/i)).toBeTruthy()
    expect(ledger()[0].usedAt).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /check another voucher/i }))
    await checkAt(v.hotelSlug, v.token)
    expect(await screen.findByText('Already used')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /mark as given/i })).toBeNull()
  })

  it('another hotel’s staff, and an unknown code, get nothing', async () => {
    member('getaway')
    await open('/account')
    await screen.findByText(/new voucher/i)
    const [v] = ledger()
    cleanup()

    await open('/staff/redeem')
    const select = (await screen.findByLabelText(/your hotel/i)) as HTMLSelectElement
    const other = Array.from(select.options).map((o) => o.value).find((s) => s !== v.hotelSlug)!
    await checkAt(other, v.token)
    expect(await screen.findByText('This voucher is for another hotel')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /mark as given/i })).toBeNull()
    expect(ledger()[0].usedAt).toBeUndefined()

    await checkAt(v.hotelSlug, 'ZZZZZZZZZZZZZZZZ')
    expect(await screen.findByText('Code not found')).toBeTruthy()
  })

  it('a used voucher shows as used on the member’s own voucher page', async () => {
    member('getaway')
    await open('/account')
    await screen.findByText(/new voucher/i)
    const [v] = ledger()
    cleanup()
    await open('/staff/redeem')
    await screen.findByLabelText(/your hotel/i)
    await checkAt(v.hotelSlug, v.token)
    fireEvent.click(await screen.findByRole('button', { name: /mark as given/i }))
    await screen.findByText(/recorded as given/i)
    cleanup()
    await open(`/voucher/${v.id}?t=${v.token}`)
    expect((await screen.findAllByText('Used')).length).toBeGreaterThan(0)
    expect(screen.queryByText(/show this screen to hotel staff/i)).toBeNull()
  })
})

describe('perk-voucher wallet, demo switch OFF (the public default)', () => {
  it('has no perk hotels: My page keeps the empty voucher card and the staff screen says so', async () => {
    member('nomad')
    await open('/account', { demo: false })
    await screen.findByRole('heading', { name: /subscription/i })
    expect(screen.queryByText(/perk vouchers this period/i)).toBeNull()
    expect(ledger()).toEqual([])
    cleanup()
    await open('/staff/redeem', { demo: false })
    expect(await screen.findByText(/no hotel has joined the voucher program yet/i)).toBeTruthy()
  })
})
