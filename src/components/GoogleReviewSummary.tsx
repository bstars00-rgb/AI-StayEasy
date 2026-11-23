import { useEffect, useState } from 'react'
import { useLang } from '../i18n'
import type { ReviewSummaryDto } from '../api/contract'
import { fetchReviewSummary } from '../lib/googleReviews'
import { googleReviewStrings } from '../lib/googleReviewI18n'

const API_URL = import.meta.env.VITE_API_URL as string | undefined

/**
 * Google's AI summary of a hotel's Google Maps reviews — an ADDITIONAL block
 * under the verified StayEasy summary, never a replacement for it.
 *
 * Fetched live through our backend (Google forbids storing Places content), so
 * it only exists when VITE_API_URL points at a backend and a verified place ID
 * is on file. On any miss — no backend, no place ID, no summary, an error — it
 * renders nothing. The text is shown as-is, always with Google's AI disclosure
 * and its links, and labeled as guest opinion rather than a verified fact.
 */
export function GoogleReviewSummary({ slug, apiBase = API_URL }: { slug: string; apiBase?: string }) {
  const { lang } = useLang()
  const s = googleReviewStrings[lang]
  const [data, setData] = useState<ReviewSummaryDto | null>(null)

  useEffect(() => {
    setData(null)
    if (!apiBase) return
    const ctl = new AbortController()
    fetchReviewSummary(apiBase, slug, lang, ctl.signal).then((d) => {
      if (!ctl.signal.aborted) setData(d)
    })
    return () => ctl.abort()
  }, [apiBase, slug, lang])

  if (!data) return null

  return (
    <section aria-label={s.title} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
      <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
        <span aria-hidden>🗣️</span> {s.title}
      </h2>
      <p className="mt-1 text-xs text-ink-700/60">{s.sub}</p>
      <p lang={data.textLang} className="mt-3 text-sm leading-relaxed text-ink-800">{data.text}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="text-ink-700/70">{data.disclosure}</span>
        {data.reviewsUri && (
          <a href={data.reviewsUri} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 hover:underline">
            {s.openReviews} ↗
          </a>
        )}
        {data.flagUri && (
          <a href={data.flagUri} target="_blank" rel="noopener noreferrer" className="text-ink-700/60 hover:underline">
            {s.report}
          </a>
        )}
      </div>
    </section>
  )
}
