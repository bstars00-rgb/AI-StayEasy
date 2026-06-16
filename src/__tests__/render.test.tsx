// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import VietnamPage from '../pages/VietnamPage'
import { VoucherCard } from '../components/VoucherCard'
import { I18nProvider } from '../i18n'
import { getHotel } from '../data/hotels'
import { partnerDrafts } from '../lib/partnerDrafts'

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
    '/partners', '/dashboard', '/admin', '/admin/register', '/about', '/no-such-page',
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

describe('interaction: hotel registration page', () => {
  it('saves the full-schema registration into the drafts store on submit', async () => {
    partnerDrafts.clear()
    const { container } = wrap('/admin/register')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })

    const nameInput = await screen.findByPlaceholderText(/Riverside Pearl Hotel/i)
    fireEvent.change(nameInput, { target: { value: 'Test Onboard Hotel' } })
    fireEvent.submit(container.querySelector('form')!)

    expect(partnerDrafts.getAll()).toHaveLength(1)
    expect(partnerDrafts.getAll()[0].hotel.name).toBe('Test Onboard Hotel')
    expect(partnerDrafts.getAll()[0].hotel.slug).toBe('test-onboard-hotel')
    expect(partnerDrafts.getAll()[0].hotel.country).toBe('Vietnam') // country-first default
  })

  it('shows a registered draft in the unified Partners table', async () => {
    partnerDrafts.clear()
    const base = getHotel('an-bang-beach-resort')!
    partnerDrafts.add({
      hotel: { ...base, id: 'draft-x', slug: 'seeded-draft-hotel', name: 'Seeded Draft Hotel', isSponsored: false },
      plan: 'Growth',
      contactEmail: 'a@b.com',
      createdAt: '2026-06-16',
    })
    wrap('/admin?tab=partners')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    expect(await screen.findByText('Seeded Draft Hotel')).toBeTruthy()
    partnerDrafts.clear()
  })

  it('shows a registered hotel on its public detail page (loop closed)', async () => {
    partnerDrafts.clear()
    const base = getHotel('an-bang-beach-resort')!
    partnerDrafts.add({
      hotel: { ...base, id: 'draft-pub', slug: 'my-registered-hotel', name: 'My Registered Hotel' },
      plan: 'Growth',
      contactEmail: 'a@b.com',
      createdAt: '2026-06-16',
    })
    wrap('/hotels/my-registered-hotel')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    expect(await screen.findByRole('heading', { name: 'My Registered Hotel' }, { timeout: 5000 })).toBeTruthy()
    partnerDrafts.clear()
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
