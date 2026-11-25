// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
import { cleanup, render, screen, waitFor, fireEvent } from '@testing-library/react'

/**
 * The demo chain only exists while VITE_DEMO_HOTELS is on, and its voucher card
 * only while VITE_ENABLE_BM is on. Both are read once at module load, so each case
 * sets the env and re-imports the app from a clean module registry.
 */
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

async function open(path: string, env: { demo: boolean; bm: boolean }) {
  vi.stubEnv('VITE_DEMO_HOTELS', env.demo ? 'true' : '')
  vi.stubEnv('VITE_ENABLE_BM', env.bm ? 'true' : '')
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

describe('demo hotels, switch ON', () => {
  it('labels the hotel as fictional and shows its perk as a stated value, not a price cut', async () => {
    await open('/hotels/lunas-park-hotel-nhatrang', { demo: true, bm: true })
    expect((await screen.findByRole('alert')).textContent).toMatch(/this hotel is fictional/i)
    expect(screen.getAllByText(/Beach cabana & drinks for two, worth USD 40/).length).toBeGreaterThan(0)
    expect(screen.queryByText(/% off|free night|discount/i)).toBeNull()
    expect((await screen.findByTestId('savings-result')).textContent).toContain('$40')
    expect(screen.queryByLabelText(/nights/i)).toBeNull() // a per-stay perk doesn't scale with nights
  })

  it('shows a fixed-value perk as its stated value, scaled by nights when it is per night', async () => {
    await open('/hotels/lunas-park-hotel-saigon', { demo: true, bm: true })
    const result = await screen.findByTestId('savings-result')
    expect(result.textContent).toContain('Value of this benefit')
    expect(result.textContent).toContain('$20') // 1 night by default
    fireEvent.change(screen.getByLabelText(/nights/i), { target: { value: '4' } })
    await waitFor(() => expect(screen.getByTestId('savings-result').textContent).toContain('$80'))
  })

  it('scales a per-night perk by the number of nights', async () => {
    await open('/hotels/lunas-park-hotel-danang', { demo: true, bm: true })
    expect((await screen.findByTestId('savings-result')).textContent).toContain('$30') // 1 night by default
    fireEvent.change(screen.getByLabelText(/nights/i), { target: { value: '3' } })
    await waitFor(() => expect(screen.getByTestId('savings-result').textContent).toContain('$90'))
  })

  it('gives a member the perk through the wallet: no shared code on the card, and a way to their vouchers', async () => {
    const today = new Date().toISOString().slice(0, 10)
    window.localStorage.setItem('stayeasy-guest', JSON.stringify({ email: 'mina@gmail.com', name: 'Mina', joinedAt: today }))
    await open('/hotels/lunas-park-hotel-danang', { demo: true, bm: true })
    await screen.findByRole('alert')
    expect((await screen.findAllByText(/Member perk/)).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/show your member voucher at check-in/i).length).toBeGreaterThan(0)
    expect(document.body.textContent).not.toContain('LUNAS-') // nothing to copy and share
    expect(screen.queryByRole('button', { name: /copy code|download voucher/i })).toBeNull()
    // Without a subscription the way forward is the plans page; with one, the member's vouchers.
    expect(screen.getByRole('link', { name: /see plans to get vouchers/i }).getAttribute('href')).toBe('/plans')
    cleanup()
    window.localStorage.setItem('stayeasy-sub:mina@gmail.com', JSON.stringify({ plan: 'getaway', period: 'monthly', requestedAt: today, startedAt: today }))
    await open('/hotels/lunas-park-hotel-danang', { demo: true, bm: true })
    expect((await screen.findByRole('link', { name: /see my vouchers/i })).getAttribute('href')).toBe('/account#vouchers')
  })

  it('still computes a hotel-stated percentage for a real hotel', async () => {
    await open('/hotels/brilliant-hotel-danang', { demo: false, bm: true })
    fireEvent.change(await screen.findByLabelText(/nightly rate/i), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/nights/i), { target: { value: '2' } })
    expect((await screen.findByTestId('savings-result')).textContent).toContain('$30')
  })

  it('lists the demo hotel on its city page with the fictional chip and its figure', async () => {
    await open('/destinations/hue', { demo: true, bm: true })
    expect((await screen.findAllByText('Fictional demo hotel')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Worth $80').length).toBeGreaterThan(0)
  })

  it('sends its "official website" buttons to the explanation page, not a booking site', async () => {
    await open('/hotels/lunas-park-hotel-hue', { demo: true, bm: true })
    await screen.findByRole('alert')
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href') ?? '').filter((h) => /demo-hotel/.test(h))
    expect(hrefs.length).toBeGreaterThan(0)
    expect(screen.queryAllByRole('link').some((a) => /google\.com\/search/.test(a.getAttribute('href') ?? '') && /Lunas/i.test(a.getAttribute('href') ?? ''))).toBe(false)
  })
})

describe('demo hotels, switch OFF (the public default)', () => {
  it('does not exist: the detail page is "not found" and the city list has no Lunas hotel', async () => {
    await open('/hotels/lunas-park-hotel-hue', { demo: false, bm: true })
    expect(await screen.findByRole('heading', { name: /not found|couldn.t find/i })).toBeTruthy()
    cleanup()
    await open('/destinations/hue', { demo: false, bm: true })
    expect(screen.queryByText(/Lunas Park/)).toBeNull()
    expect(screen.queryByText('Fictional demo hotel')).toBeNull()
  })
})
