/**
 * Privacy-light Google Analytics 4 loader.
 *
 * No-op until `VITE_GA_ID` (e.g. "G-XXXXXXX") is set, so the site ships clean
 * before analytics is configured. SSR-safe. SPA page views are sent on route
 * changes via trackPageview().
 */
const GA_ID = import.meta.env.VITE_GA_ID as string | undefined

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let loaded = false

export const analyticsEnabled = !!GA_ID

export function initAnalytics(): void {
  if (!GA_ID || typeof document === 'undefined' || loaded) return
  loaded = true
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)
  window.dataLayer = window.dataLayer || []
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
}

export function trackPageview(path: string): void {
  if (!GA_ID || typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'page_view', { page_path: path })
}

/**
 * Semantic intent events — the signals hotels actually care about: which
 * properties travelers view, who unlocks a voucher, who clicks through to the
 * official site (booking intent), who reaches out, and what people search for.
 * Each event carries a hotel/city/type dimension so GA4 can answer "what are
 * travelers looking for?" and "what converts?" per hotel. No-op until GA_ID is
 * set, so instrumentation is always safe to leave in.
 */
export type StayEvent =
  | 'hotel_view'
  | 'voucher_unlock'
  | 'voucher_download'
  | 'official_site_click'
  | 'contact_click'
  | 'search'
  | 'wishlist_add'

export function trackEvent(name: StayEvent, params: Record<string, string | number | undefined> = {}): void {
  if (!GA_ID || typeof window === 'undefined' || !window.gtag) return
  // Drop undefined params so GA4 reports stay clean.
  const clean: Record<string, string | number> = {}
  for (const [k, v] of Object.entries(params)) if (v !== undefined) clean[k] = v
  window.gtag('event', name, clean)
}
