import type { Lang } from '../i18n'
import { endpoints, type ReviewSummaryDto } from '../api/contract'

/** App language → Places API `languageCode`. */
export const PLACES_LANG: Record<Lang, string> = { en: 'en', ko: 'ko', vi: 'vi', zh: 'zh-CN', ja: 'ja' }

/** Used only if Google omits the disclosure — the summary must never show without it. */
export const DEFAULT_DISCLOSURE = 'Summarized with Gemini'

/**
 * Google-owned HTTPS links only: google.com and its subdomains, plus goo.gl short
 * links. Country domains (google.<cc>) are deliberately NOT accepted: many ccTLDs
 * can be registered by anyone, so a host check on them proves nothing.
 */
export function safeGoogleUrl(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined
  try {
    const u = new URL(v)
    if (u.protocol !== 'https:') return undefined
    return /(^|\.)google\.com$/i.test(u.hostname) || /(^|\.)goo\.gl$/i.test(u.hostname) ? u.toString() : undefined
  } catch {
    return undefined
  }
}

/** Places returns LocalizedText ({text, languageCode}); tolerate a bare string too. */
function localized(v: unknown): { text: string; lang?: string } | undefined {
  if (typeof v === 'string') return v.trim() ? { text: v } : undefined
  if (v && typeof v === 'object') {
    const o = v as { text?: unknown; languageCode?: unknown }
    if (typeof o.text === 'string' && o.text.trim()) {
      return { text: o.text, lang: typeof o.languageCode === 'string' ? o.languageCode : undefined }
    }
  }
  return undefined
}

/**
 * Turn Google's `reviewSummary` object into our DTO. Returns null when there is
 * nothing displayable (field absent, no text) — "no summary" is a normal answer,
 * not an error. The text is passed through untouched.
 */
export function parseReviewSummary(raw: unknown): ReviewSummaryDto | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const text = localized(r.text)
  if (!text) return null
  return {
    text: text.text,
    textLang: text.lang,
    disclosure: localized(r.disclosureText)?.text ?? DEFAULT_DISCLOSURE,
    reviewsUri: safeGoogleUrl(r.reviewsUri),
    flagUri: safeGoogleUrl(r.flagContentUri),
  }
}

/** Validate what OUR backend returned (never trust the wire, even our own). */
function fromBackend(v: unknown): ReviewSummaryDto | null {
  if (!v || typeof v !== 'object') return null
  const o = v as Record<string, unknown>
  if (typeof o.text !== 'string' || !o.text.trim()) return null
  return {
    text: o.text,
    textLang: typeof o.textLang === 'string' ? o.textLang : undefined,
    disclosure: typeof o.disclosure === 'string' && o.disclosure.trim() ? o.disclosure : DEFAULT_DISCLOSURE,
    reviewsUri: safeGoogleUrl(o.reviewsUri),
    flagUri: safeGoogleUrl(o.flagUri),
  }
}

/** Live fetch through the backend; any failure or 404 means "show nothing". */
export async function fetchReviewSummary(base: string, slug: string, lang: Lang, signal?: AbortSignal): Promise<ReviewSummaryDto | null> {
  try {
    const res = await fetch(`${base}${endpoints.hotelReviewSummary(slug)}?lang=${PLACES_LANG[lang]}`, { signal })
    if (!res.ok) return null
    return fromBackend(await res.json())
  } catch {
    return null
  }
}
