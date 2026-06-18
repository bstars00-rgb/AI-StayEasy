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
import { partnerAuth } from '../lib/partnerAuth'
import { hotelEdits } from '../lib/hotelEdits'
import { guestAuth } from '../lib/guestAuth'
import * as analytics from '../lib/analytics'
import SignInPage from '../pages/SignInPage'

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
    '/', '/search', '/wishlist', '/account', '/signin',
    '/destinations/vietnam', '/destinations/da-nang', '/destinations/hanoi',
    '/hotels/an-bang-beach-resort', '/guides/direct-booking',
    '/guides', '/guides/why-book-hotels-direct', '/guides/da-nang-travel-guide',
    '/privacy', '/terms', '/contact',
    '/partners', '/dashboard', '/admin', '/admin/register', '/partner/login', '/partner/reset', '/about', '/no-such-page',
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

describe('interaction: hotel partner self-service portal', () => {
  it('lets a signed-in hotel edit its listing, and the edit shows on the public page', async () => {
    hotelEdits.clear()
    partnerAuth.login({ slug: 'an-bang-beach-resort', propertyName: 'An Bang Beach Resort & Spa', email: 'gm@hotel.example' })

    wrap('/partner/edit')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })

    const posInput = await screen.findByDisplayValue(/biggest kids pool/i)
    fireEvent.change(posInput, { target: { value: 'A calm beachfront escape for couples.' } })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    // Persisted to the edits store…
    expect(hotelEdits.get('an-bang-beach-resort').positioningLine).toBe('A calm beachfront escape for couples.')

    // …and visible on the public hotel page.
    cleanup()
    wrap('/hotels/an-bang-beach-resort')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    expect(await screen.findByText('A calm beachfront escape for couples.')).toBeTruthy()

    hotelEdits.clear()
    partnerAuth.logout()
  })

  it('redirects to login when no partner session exists', async () => {
    partnerAuth.logout()
    wrap('/partner')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    expect(await screen.findByRole('button', { name: /create account/i })).toBeTruthy()
  })
})

describe('interaction: sign-in page issues a member voucher', () => {
  it('signs in with email and stores a member voucher', async () => {
    guestAuth.signOut()
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={['/signin']}>
          <SignInPage />
        </MemoryRouter>
      </I18nProvider>,
    )
    fireEvent.change(screen.getByPlaceholderText(/you@gmail.com/i), { target: { value: 'me@gmail.com' } })
    fireEvent.click(screen.getByRole('button', { name: /continue with email/i }))
    expect(guestAuth.get()?.email).toBe('me@gmail.com')
    expect(guestAuth.get()?.welcomeCode).toMatch(/^STAY-/)
    guestAuth.signOut()
  })
})

describe('interaction: member-gated hotel voucher', () => {
  it('hides the code until the guest signs in, then copies it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const hotel = getHotel('an-bang-beach-resort')!

    // Signed out → code is gated behind sign-in.
    guestAuth.signOut()
    const { rerender } = render(
      <I18nProvider>
        <MemoryRouter>
          <VoucherCard hotel={hotel} />
        </MemoryRouter>
      </I18nProvider>,
    )
    expect(screen.queryByRole('button', { name: /copy code/i })).toBeNull()
    // The unlock action is an in-place button (no navigation, no popup).
    expect(screen.getByRole('button', { name: /sign in to unlock/i })).toBeTruthy()

    // Member → code is revealed and copyable.
    guestAuth.signIn({ email: 'member@gmail.com' })
    rerender(
      <I18nProvider>
        <MemoryRouter>
          <VoucherCard hotel={hotel} />
        </MemoryRouter>
      </I18nProvider>,
    )
    fireEvent.click(await screen.findByRole('button', { name: /copy code/i }))
    expect(writeText).toHaveBeenCalledWith(hotel.voucher!.code)
    guestAuth.signOut()
  })

  it('unlocks in place when the lock is clicked — no navigation', async () => {
    const hotel = getHotel('an-bang-beach-resort')!
    guestAuth.signOut()
    render(
      <I18nProvider>
        <MemoryRouter>
          <VoucherCard hotel={hotel} />
        </MemoryRouter>
      </I18nProvider>,
    )
    // Click the in-place unlock — demo sign-in resolves without leaving the page.
    fireEvent.click(screen.getByRole('button', { name: /sign in to unlock/i }))
    // The code is revealed right here once the lock springs open.
    expect(await screen.findByRole('button', { name: /copy code/i })).toBeTruthy()
    expect(screen.getByText(hotel.voucher!.code)).toBeTruthy()
    guestAuth.signOut()
  })

  it('fires GA4 intent events on unlock and official-site click', async () => {
    const spy = vi.spyOn(analytics, 'trackEvent')
    const hotel = getHotel('an-bang-beach-resort')!
    guestAuth.signOut()
    render(
      <I18nProvider>
        <MemoryRouter>
          <VoucherCard hotel={hotel} />
        </MemoryRouter>
      </I18nProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: /sign in to unlock/i }))
    expect(spy).toHaveBeenCalledWith('voucher_unlock', expect.objectContaining({ hotel_slug: hotel.slug }))

    // Once unlocked, clicking through to the official site fires the money event.
    const link = await screen.findByRole('link', { name: /official website/i })
    fireEvent.click(link)
    expect(spy).toHaveBeenCalledWith('official_site_click', expect.objectContaining({ hotel_slug: hotel.slug }))
    spy.mockRestore()
    guestAuth.signOut()
  })

  it('shows a no-voucher notice for hotels without a voucher', () => {
    const hotel = getHotel('an-bang-beach-resort')!
    const noVoucher = { ...hotel, voucher: undefined }
    render(
      <I18nProvider>
        <MemoryRouter>
          <VoucherCard hotel={noVoucher} />
        </MemoryRouter>
      </I18nProvider>,
    )
    expect(screen.getByText(/no voucher from this hotel yet/i)).toBeTruthy()
  })

  it('shows on-site redemption instructions for onsite vouchers', () => {
    const hotel = getHotel('an-bang-beach-resort')!
    const onsite = { ...hotel, voucher: { ...hotel.voucher!, redeem: 'onsite' as const } }
    guestAuth.signIn({ email: 'member@gmail.com' })
    render(
      <I18nProvider>
        <MemoryRouter>
          <VoucherCard hotel={onsite} />
        </MemoryRouter>
      </I18nProvider>,
    )
    expect(screen.getByText(/show it at the front desk/i)).toBeTruthy()
    guestAuth.signOut()
  })

  it('names the exact code field when the hotel specifies one', () => {
    const hotel = getHotel('an-bang-beach-resort')!
    const named = { ...hotel, voucher: { ...hotel.voucher!, redeem: 'online' as const, fieldLabel: 'Gift code' } }
    guestAuth.signIn({ email: 'member@gmail.com' })
    render(
      <I18nProvider>
        <MemoryRouter>
          <VoucherCard hotel={named} />
        </MemoryRouter>
      </I18nProvider>,
    )
    expect(screen.getByText(/“Gift code” field/i)).toBeTruthy()
    guestAuth.signOut()
  })
})
