// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'

/**
 * A count shown on a card ("Da Nang · 21 hotels") must equal the hotels a visitor
 * can actually open for that city, whatever is listed — including the fictional
 * demo chain while its switch is on. The switch is read once at module load, so
 * each case sets the env and re-imports from a clean module registry.
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

async function load(demo: boolean) {
  vi.stubEnv('VITE_DEMO_HOTELS', demo ? 'true' : '')
  vi.resetModules()
  const [dest, countries, admin, repoMod, hot] = await Promise.all([
    import('../data/destinations'),
    import('../data/countries'),
    import('../data/adminData'),
    import('../data/repo'),
    import('../data/hotels'),
  ])
  return { destinations: dest.destinations, countries: countries.countries, kpis: admin.overviewKpis, repo: repoMod.repo, real: hot.hotels }
}

describe.each([
  { demo: false, extra: 0 },
  { demo: true, extra: 10 },
])('hotel counts, demo switch $demo', ({ demo, extra }) => {
  it('each city’s count equals the hotels listed for that city', async () => {
    const { destinations, repo, real } = await load(demo)
    for (const d of destinations.filter((x) => x.available)) {
      const listed = await repo.listHotelsByCity(d.city)
      expect(d.hotelCount, d.city).toBe(listed.length)
      expect(d.hotelCount, d.city).toBe(real.filter((h) => h.city === d.city).length + (demo ? 1 : 0))
    }
  })

  it('the Vietnam total and the admin KPI equal the hotels listed overall', async () => {
    const { countries, kpis, repo, real } = await load(demo)
    const all = await repo.allHotels()
    expect(all.length).toBe(real.length + extra)
    expect(countries.find((c) => c.name === 'Vietnam')!.hotelCount).toBe(all.length)
    expect(kpis.find((k) => k.label === 'Hotels listed')!.value).toBe(String(all.length))
  })

  it('the Vietnam page shows those counts on its city cards', async () => {
    vi.stubEnv('VITE_DEMO_HOTELS', demo ? 'true' : '')
    vi.resetModules()
    const [{ default: App }, { I18nProvider }, { MemoryRouter }, { destinations }] = await Promise.all([
      import('../App'),
      import('../i18n'),
      import('react-router-dom'),
      import('../data/destinations'),
    ])
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={['/destinations/vietnam']}>
          <App />
        </MemoryRouter>
      </I18nProvider>,
    )
    await waitFor(() => expect(screen.queryByTestId('route-loading')).toBeNull(), { timeout: 5000 })
    const daNang = destinations.find((d) => d.city === 'Da Nang')!
    expect((await screen.findAllByText(`${daNang.hotelCount} hotels`)).length).toBeGreaterThan(0)
  })
})
