import { useEffect, useRef } from 'react'
import { BM_ENABLED } from '../lib/bm'

/**
 * Google AdSense display slot.
 *
 * Until a publisher ID is set (env `VITE_ADSENSE_CLIENT`, e.g. "ca-pub-XXXX"),
 * this renders nothing in production and a labeled placeholder in dev — so the
 * site stays clean and policy-safe before AdSense approval. After approval,
 * set the env var (and per-unit `slot` ids) and ads render automatically.
 *
 * Ads are kept visually distinct from StayEasy's own "Sponsored" content so the
 * two are never confused (an AdSense policy requirement).
 */
const CLIENT = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

let scriptLoaded = false
function ensureAdScript(client: string) {
  if (scriptLoaded || typeof document === 'undefined') return
  if (document.querySelector('script[data-adsbygoogle]')) {
    scriptLoaded = true
    return
  }
  const s = document.createElement('script')
  s.async = true
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
  s.crossOrigin = 'anonymous'
  s.setAttribute('data-adsbygoogle', '')
  document.head.appendChild(s)
  scriptLoaded = true
}

export function AdSlot({ slot, className = '' }: { slot?: string; className?: string }) {
  const ref = useRef<HTMLModElement>(null)

  useEffect(() => {
    if (!BM_ENABLED || !CLIENT) return
    ensureAdScript(CLIENT)
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      /* AdSense not ready yet — it retries on the next render */
    }
  }, [])

  if (!BM_ENABLED) return null

  if (!CLIENT) {
    if (import.meta.env.DEV) {
      return (
        <div
          className={`my-6 grid place-items-center rounded-xl border border-dashed border-black/15 bg-sand-50 py-8 text-xs text-ink-500/70 ${className}`}
          aria-hidden
        >
          Ad slot — set VITE_ADSENSE_CLIENT to enable
        </div>
      )
    }
    return null
  }

  return (
    <div className={`my-6 ${className}`}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-ink-500/50">Advertisement</p>
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
