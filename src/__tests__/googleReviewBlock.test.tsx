// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { I18nProvider } from '../i18n'
import { GoogleReviewSummary } from '../components/GoogleReviewSummary'

beforeAll(() => window.localStorage.setItem('stayeasy-lang', 'en'))
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

const mount = (apiBase?: string) =>
  render(
    <I18nProvider>
      <GoogleReviewSummary slug="olalani-resort-condotel" apiBase={apiBase} />
    </I18nProvider>,
  )

const stubFetch = (res: { ok: boolean; json?: unknown }) => {
  const f = vi.fn(async (..._args: unknown[]) => ({ ok: res.ok, status: res.ok ? 200 : 404, json: async () => res.json }))
  vi.stubGlobal('fetch', f)
  return f
}

describe('<GoogleReviewSummary>', () => {
  it('shows the summary with Google’s disclosure, both links, and an opinion label', async () => {
    const f = stubFetch({
      ok: true,
      json: {
        text: 'Guests like the beachfront setting.',
        textLang: 'en',
        disclosure: 'Summarized with Gemini',
        reviewsUri: 'https://www.google.com/maps/place/?q=place_id:abc',
        flagUri: 'https://www.google.com/local/review/rap/report?id=1',
      },
    })
    mount('http://api.test')
    expect(await screen.findByText('Guests like the beachfront setting.')).toBeTruthy()
    expect(screen.getByText('Summarized with Gemini')).toBeTruthy()
    expect(screen.getByRole('link', { name: /see reviews on google maps/i }).getAttribute('href')).toContain('google.com/maps')
    expect(screen.getByRole('link', { name: /report a problem/i })).toBeTruthy()
    expect(screen.getByText(/not facts StayEasy has verified/i)).toBeTruthy()
    expect(String(f.mock.calls[0][0])).toBe('http://api.test/api/v1/hotels/olalani-resort-condotel/review-summary?lang=en')
  })

  it('renders nothing when the backend has no summary (404)', async () => {
    const f = stubFetch({ ok: false })
    const { container } = mount('http://api.test')
    await waitFor(() => expect(f).toHaveBeenCalled())
    await new Promise((r) => setTimeout(r, 20))
    expect(container.innerHTML).toBe('')
  })

  it('renders nothing and never calls out when no backend is configured', async () => {
    const f = stubFetch({ ok: true, json: { text: 'x' } })
    const { container } = mount(undefined)
    await new Promise((r) => setTimeout(r, 20))
    expect(f).not.toHaveBeenCalled()
    expect(container.innerHTML).toBe('')
  })

  it('renders nothing when the network call throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline') }))
    const { container } = mount('http://api.test')
    await new Promise((r) => setTimeout(r, 20))
    expect(container.innerHTML).toBe('')
  })
})
