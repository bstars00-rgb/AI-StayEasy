// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'

/**
 * The detail page's link to the subscription preview sits next to the member
 * voucher, a revenue surface. BM_ENABLED is read once when lib/bm.ts loads, so
 * each case sets the env and re-imports the app from a clean module registry.
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

async function openDetail(bm: boolean) {
  vi.stubEnv('VITE_ENABLE_BM', bm ? 'true' : '')
  vi.resetModules()
  const [{ default: App }, { I18nProvider }, { MemoryRouter }] = await Promise.all([
    import('../App'),
    import('../i18n'),
    import('react-router-dom'),
  ])
  render(
    <I18nProvider>
      <MemoryRouter initialEntries={['/hotels/amiana-resort-nha-trang']}>
        <App />
      </MemoryRouter>
    </I18nProvider>,
  )
  await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
  await screen.findByRole('heading', { name: /places worth visiting nearby/i }, { timeout: 5000 })
}

describe('hotel detail → subscription plans link', () => {
  it('is hidden while the business-model switch is off', async () => {
    await openDetail(false)
    expect(screen.queryByRole('link', { name: /see subscription plans/i })).toBeNull()
  })

  it('appears next to the member voucher when the switch is on, and goes to /plans', async () => {
    await openDetail(true)
    const link = await screen.findByRole('link', { name: /see subscription plans/i })
    expect(link.getAttribute('href')).toBe('/plans')
  })
})
