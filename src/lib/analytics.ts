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
