// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import VietnamPage from '../pages/VietnamPage'
import AdminPage from '../pages/AdminPage'
import { VoucherCard } from '../components/VoucherCard'
import { I18nProvider } from '../i18n'
import { getHotel } from '../data/hotels'

// jsdom is missing a few browser APIs the app touches. Polyfill them so the
// real components render and interact exactly as in a browser.
beforeAll(() => {
  window.localStorage.setItem('stayeasy-lang', 'en') // deterministic locale
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

afterEach(cleanup)

const wrap = (path: string) =>
  render(
    <I18nProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </I18nProvider>,
  )

describe('route render (lazy chunks resolve, no throw)', () => {
  const routes = [
    '/', '/search', '/wishlist',
    '/destinations/vietnam', '/destinations/da-nang', '/destinations/hanoi',
    '/hotels/an-bang-beach-resort', '/guides/direct-booking',
    '/partners', '/dashboard', '/admin', '/about', '/no-such-page',
  ]
  for (const path of routes) {
    it(`renders ${path}`, async () => {
      const { container } = wrap(path)
      // Wait until the route's code-split chunk has loaded (fallback gone).
      await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
      expect(container.textContent?.length ?? 0).toBeGreaterThan(20)
    })
  }
})

describe('interaction: Vietnam "see recommended cities" toggle', () => {
  it('hides trending cities until the toggle is clicked', async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={['/destinations/vietnam']}>
          <VietnamPage />
        </MemoryRouter>
      </I18nProvider>,
    )
    // Featured cities render after the async destinations load.
    await screen.findByRole('heading', { name: 'Da Nang' }, { timeout: 5000 })
    // A trending-only city (coming soon) is hidden initially.
    expect(screen.queryByText('Sapa')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /see recommended cities/i }))

    // After expanding, the trending tile appears.
    expect(await screen.findByText('Sapa')).toBeTruthy()
  })
})

describe('interaction: register a hotel in the unified Partners registry', () => {
  it('adds a new partner row via the registration form', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    )
    // Go to the Partners section, then open the registration form.
    fireEvent.click(screen.getByRole('button', { name: /^partners$/i }))
    fireEvent.click(screen.getByRole('button', { name: /register hotel/i }))
    fireEvent.change(screen.getByLabelText(/hotel name/i), { target: { value: 'Test Onboard Hotel' } })
    fireEvent.click(screen.getByRole('button', { name: /register partner/i }))
    // The newly registered hotel appears in the table.
    expect(await screen.findByText('Test Onboard Hotel')).toBeTruthy()
  })
})

describe('interaction: voucher code copy', () => {
  it('copies the code and shows confirmation', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })

    const hotel = getHotel('an-bang-beach-resort')!
    render(
      <I18nProvider>
        <VoucherCard hotel={hotel} />
      </I18nProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /copy code/i }))

    expect(writeText).toHaveBeenCalledWith(hotel.voucher!.code)
    expect(await screen.findByText(/copied/i)).toBeTruthy()
  })
})
