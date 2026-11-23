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
  it('labels the hotel as fictional and shows a free-night figure that turns the visitor’s rate into money', async () => {
    await open('/hotels/lunas-park-hotel-nhatrang', { demo: true, bm: true })
    expect((await screen.findByRole('alert')).textContent).toMatch(/this hotel is fictional/i)
    expect(screen.getAllByText('3 free night when you stay'.replace('3', '1') + ' 3+').length).toBeGreaterThan(0)

    fireEvent.change(screen.getByLabelText(/nightly rate/i), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/nights/i), { target: { value: '2' } })
    expect(await screen.findByText(/applies from 3 nights/i)).toBeTruthy() // too short: says why, no number
    expect(screen.queryByTestId('savings-result')).toBeNull()

    fireEvent.change(screen.getByLabelText(/nights/i), { target: { value: '3' } })
    expect((await screen.findByTestId('savings-result')).textContent).toContain('$100')
  })

  it('shows a fixed-value perk as its stated value, scaled by nights when it is per night', async () => {
    await open('/hotels/lunas-park-hotel-saigon', { demo: true, bm: true })
    const result = await screen.findByTestId('savings-result')
    expect(result.textContent).toContain('Value of this benefit')
    expect(result.textContent).toContain('$20') // 1 night by default
    fireEvent.change(screen.getByLabelText(/nights/i), { target: { value: '4' } })
    await waitFor(() => expect(screen.getByTestId('savings-result').textContent).toContain('$80'))
  })

  it('shows a percentage as "up to" and computes it from the rate', async () => {
    await open('/hotels/lunas-park-hotel-hanoi', { demo: true, bm: true })
    expect((await screen.findAllByText('Up to 20% off')).length).toBeGreaterThan(0)
    fireEvent.change(screen.getByLabelText(/nightly rate/i), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/nights/i), { target: { value: '2' } })
    expect((await screen.findByTestId('savings-result')).textContent).toContain('$40')
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
