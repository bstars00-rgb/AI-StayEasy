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
import { subscription } from '../lib/subscription'

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
    '/hotels/olalani-resort-condotel', '/guides/direct-booking',
    '/guides', '/guides/why-book-hotels-direct', '/guides/da-nang-travel-guide',
    '/privacy', '/terms', '/contact',
    '/partners', '/dashboard', '/plans', '/admin', '/admin/register', '/partner/login', '/partner/reset', '/about', '/no-such-page',
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
    const base = getHotel('olalani-resort-condotel')!
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
    const base = getHotel('olalani-resort-condotel')!
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
    partnerAuth.login({ slug: 'olalani-resort-condotel', propertyName: 'Olalani Resort & Condotel', email: 'gm@hotel.example' })

    wrap('/partner/edit')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })

    const posInput = await screen.findByDisplayValue(/beachfront resort-and-condotel/i)
    fireEvent.change(posInput, { target: { value: 'A calm beachfront escape for couples.' } })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    // Persisted to the edits store…
    expect(hotelEdits.get('olalani-resort-condotel').positioningLine).toBe('A calm beachfront escape for couples.')

    // …and visible on the public hotel page.
    cleanup()
    wrap('/hotels/olalani-resort-condotel')
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

  it('lets admin edit any hotel without a partner login (/admin/hotels/:slug/edit)', async () => {
    hotelEdits.clear()
    partnerAuth.logout() // no partner session — admin route still opens the editor
    wrap('/admin/hotels/dlg-hotel-danang/edit')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    const posInput = await screen.findByDisplayValue(/ocean-view rooms and two pools/i)
    fireEvent.change(posInput, { target: { value: 'Edited by admin.' } })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    expect(hotelEdits.get('dlg-hotel-danang').positioningLine).toBe('Edited by admin.')
    hotelEdits.clear()
  })
})

describe('interaction: sign-in page', () => {
  it('signs in with email and issues no made-up voucher', async () => {
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
    // A StayEasy-minted "10% off" code that no hotel honors would be a made-up benefit.
    expect(guestAuth.get()).not.toHaveProperty('welcomeCode')
    expect(guestAuth.get()).not.toHaveProperty('discountLabel')
    guestAuth.signOut()
  })
})

// Real catalogue hotels no longer carry fabricated voucher codes, so the voucher
// UI is exercised against a real hotel with a test voucher attached.
const TEST_VOUCHER = {
  code: 'STAY10',
  discountLabel: '10% off your direct booking',
  terms: 'Show this code when you book on the official website.',
  validUntil: '2026-12-31',
  redeem: 'online' as const,
  fieldLabel: 'Promo code',
}
const withVoucher = () => ({ ...getHotel('olalani-resort-condotel')!, voucher: TEST_VOUCHER })

describe('interaction: member-gated hotel voucher', () => {
  it('hides the code until the guest signs in, then copies it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const hotel = withVoucher()

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
    const hotel = withVoucher()
    guestAuth.signOut()
    render(
      <I18nProvider>
        <MemoryRouter>
          <VoucherCard hotel={hotel} />
        </MemoryRouter>
      </I18nProvider>,
    )
    // Enter an email and submit — sign-in resolves in place, no navigation.
    fireEvent.change(screen.getByPlaceholderText(/you@gmail.com/i), { target: { value: 'me@gmail.com' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in to unlock/i }))
    // The code is revealed right here once the lock springs open.
    expect(await screen.findByRole('button', { name: /copy code/i })).toBeTruthy()
    expect(screen.getByText(hotel.voucher!.code)).toBeTruthy()
    guestAuth.signOut()
  })

  it('fires GA4 intent events on unlock and official-site click', async () => {
    const spy = vi.spyOn(analytics, 'trackEvent')
    const hotel = withVoucher()
    guestAuth.signOut()
    render(
      <I18nProvider>
        <MemoryRouter>
          <VoucherCard hotel={hotel} />
        </MemoryRouter>
      </I18nProvider>,
    )
    fireEvent.change(screen.getByPlaceholderText(/you@gmail.com/i), { target: { value: 'me@gmail.com' } })
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
    const hotel = withVoucher()
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
    const hotel = withVoucher()
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
    const hotel = withVoucher()
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

describe('hotel detail: nearby places', () => {
  it('lists the city’s recommended places nearest-first with distances', async () => {
    wrap('/hotels/olalani-resort-condotel')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    expect(await screen.findByRole('heading', { name: /places worth visiting nearby/i })).toBeTruthy()
    const items = screen.getAllByRole('listitem').filter((li) => /about [\d.]+ (m|km)/.test(li.textContent ?? ''))
    expect(items.length).toBe(5)
    // Olalani sits on the southern beach strip: My Khe is nearest, Ba Na Hills (inland) farthest.
    expect(items[0].textContent).toContain('My Khe Beach')
    expect(items[items.length - 1].textContent).toContain('Ba Na Hills')
  })
})

describe('subscription plans preview (/plans)', () => {
  it('shows the three plans and a prototype notice, and no nav link while BM is off', async () => {
    wrap('/plans')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    for (const name of ['Getaway', 'Voyager', 'Nomad']) {
      expect(screen.getAllByRole('heading', { name }).length).toBeGreaterThan(0)
    }
    expect(screen.getByRole('note').textContent).toMatch(/preview before launch/i)
    expect(screen.queryByRole('link', { name: 'Plans' })).toBeNull()
  })

  it('offers 1 month, 6 months and 1 year', async () => {
    wrap('/plans')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    const radios = screen.getAllByRole('radio')
    expect(radios.map((r) => r.textContent)).toEqual(['1 month', '6 months', '1 year'])
    expect(radios[0].getAttribute('aria-checked')).toBe('true')
    expect(screen.getAllByText(/Highest monthly cost/).length).toBe(3)
    fireEvent.click(radios[2])
    expect(screen.getAllByText(/Lowest monthly cost/).length).toBe(3)
  })
})

describe('subscribing: sign up first, then My page', () => {
  const reset = () => {
    guestAuth.signOut()
    window.localStorage.clear()
    window.localStorage.setItem('stayeasy-lang', 'en')
  }
  afterEach(reset)

  it('sends a signed-out visitor to sign-up, carrying the plan and period', async () => {
    reset()
    wrap('/plans')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    fireEvent.click(screen.getAllByRole('radio')[1]) // 6 months
    fireEvent.click(screen.getAllByRole('button', { name: /^subscribe$/i })[1]) // Voyager
    expect(await screen.findByRole('heading', { name: /create your account/i })).toBeTruthy()
    expect(screen.getByRole('note').textContent).toContain('Voyager · 6 months')
    expect(subscription.get('anyone@gmail.com')).toBeNull() // nothing is recorded before an account exists
  })

  it('requires consent to the terms and privacy policy before creating the account', async () => {
    reset()
    wrap('/signup')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'me@gmail.com' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up and continue/i }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/agree to the terms of use and privacy policy/i)
    expect(guestAuth.get()).toBeNull()
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'not-an-email' } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: /sign up and continue/i }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/valid email/i)
    expect(guestAuth.get()).toBeNull()
  })

  it('signs up with email, finishes the pending request, and lands on My page', async () => {
    reset()
    wrap('/signup?next=' + encodeURIComponent('/plans?plan=voyager&period=annual'))
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Mina' } })
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'Mina@Gmail.com' } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: /sign up and continue/i }))

    expect(await screen.findByRole('heading', { name: 'My page' }, { timeout: 5000 })).toBeTruthy()
    expect(guestAuth.get()?.email).toBe('mina@gmail.com')
    expect(subscription.get('mina@gmail.com')).toMatchObject({ plan: 'voyager', period: 'annual' })
    expect(screen.getByRole('status').textContent).toMatch(/Voyager · 1 year request was received/)
    expect(screen.getByText('Request received')).toBeTruthy()
  })

  it('lets a signed-in member subscribe straight from the plans page', async () => {
    reset()
    guestAuth.signIn({ email: 'jun@gmail.com', name: 'Jun' })
    wrap('/plans')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    fireEvent.click(screen.getAllByRole('button', { name: /^subscribe$/i })[2]) // Nomad, 1 month
    expect(await screen.findByRole('heading', { name: 'My page' }, { timeout: 5000 })).toBeTruthy()
    expect(subscription.get('jun@gmail.com')).toMatchObject({ plan: 'nomad', period: 'monthly' })
  })

  it('My page: shows no made-up voucher, cancels the request, and deletes the account', async () => {
    reset()
    guestAuth.signIn({ email: 'sol@gmail.com', name: 'Sol' })
    subscription.request('sol@gmail.com', 'getaway', 'semiannual')
    wrap('/account')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    expect(await screen.findByRole('heading', { name: 'My page' })).toBeTruthy()
    expect(screen.getByText('Getaway')).toBeTruthy()
    expect(screen.getByText('6 months')).toBeTruthy()
    expect(document.body.textContent).not.toMatch(/10% off your direct booking|STAY-[A-Z0-9]{6}/)
    expect(screen.getByText(/none available right now/i)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel request' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Cancel request' })[0])
    expect(await screen.findByText(/subscription request was cancelled/i)).toBeTruthy()
    expect(subscription.get('sol@gmail.com')).toBeNull()

    subscription.request('sol@gmail.com', 'nomad', 'annual')
    fireEvent.click(screen.getByRole('button', { name: 'Delete account' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await waitFor(() => expect(guestAuth.get()).toBeNull())
    expect(subscription.get('sol@gmail.com')).toBeNull()
  })

  it('sends a signed-out visitor from My page to sign-in', async () => {
    reset()
    wrap('/account')
    expect(await screen.findByRole('heading', { name: /sign in to stayeasy/i }, { timeout: 5000 })).toBeTruthy()
  })
})

describe('official-benefit numbers', () => {
  it('shows the stated percentage and turns the visitor’s own rate into money', async () => {
    wrap('/hotels/amiana-resort-nha-trang')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    expect((await screen.findAllByText('10% off')).length).toBeGreaterThan(0)

    fireEvent.change(screen.getByLabelText(/nightly rate/i), { target: { value: '1,000' } })
    fireEvent.change(screen.getByLabelText(/nights/i), { target: { value: '2' } })
    const result = await screen.findByTestId('savings-result')
    expect(result.textContent).toContain('$200')
    expect(result.textContent).toContain('at 10% off')
  })

  it('shows no figure and no calculator for a hotel that states no percentage', async () => {
    wrap('/hotels/olalani-resort-condotel')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    await screen.findByRole('heading', { name: /places worth visiting nearby/i })
    expect(screen.queryByLabelText(/nightly rate/i)).toBeNull()
    expect(screen.queryByText(/% off/)).toBeNull()
  })

  it('puts the number on the hotel card too', async () => {
    wrap('/destinations/nha-trang')
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    expect((await screen.findAllByText('10% off')).length).toBeGreaterThan(0)
  })
})
