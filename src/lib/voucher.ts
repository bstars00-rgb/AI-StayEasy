import type { Hotel } from '../types'

/** Escapes text for safe inclusion in SVG/XML markup. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Wraps a string into up to `maxLines` lines of at most `width` chars (word-aware). */
function wrap(text: string, width: number, maxLines: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (next.length > width && line) {
      lines.push(line)
      line = w
      if (lines.length === maxLines - 1) break
    } else {
      line = next
    }
  }
  if (line && lines.length < maxLines) lines.push(line)
  const used = lines.join(' ').split(/\s+/).length
  if (used < words.length && lines.length) lines[lines.length - 1] += '…'
  return lines
}

export interface CouponText {
  /** "Direct-booking voucher" etc. */
  heading: string
  validUntilLabel: string
  footer: string
}

/**
 * Renders a self-contained branded coupon as an SVG string. Pure (no DOM), so
 * it is SSR-safe and unit-testable. The hotel must carry a `voucher`.
 */
export function buildVoucherSvg(hotel: Hotel, text: CouponText): string {
  const v = hotel.voucher
  if (!v) return ''
  const termsLines = wrap(v.terms, 64, 3)
  const termsTspans = termsLines
    .map((l, i) => `<tspan x="48" dy="${i === 0 ? 0 : 18}">${esc(l)}</tspan>`)
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="360" viewBox="0 0 720 360" role="img" aria-label="${esc(hotel.name)} voucher ${esc(v.code)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0d9488"/>
      <stop offset="1" stop-color="#0f766e"/>
    </linearGradient>
  </defs>
  <rect width="720" height="360" rx="24" fill="url(#bg)"/>
  <rect x="16" y="16" width="688" height="328" rx="16" fill="#ffffff"/>
  <circle cx="16" cy="180" r="20" fill="url(#bg)"/>
  <circle cx="704" cy="180" r="20" fill="url(#bg)"/>
  <text x="48" y="64" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="2" fill="#0d9488">STAYEASY VIETNAM</text>
  <text x="48" y="98" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#475569">${esc(text.heading)}</text>
  <text x="48" y="142" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="800" fill="#0f172a">${esc(hotel.name)}</text>
  <text x="48" y="178" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#0f766e">${esc(v.discountLabel)}</text>
  <rect x="48" y="200" width="320" height="56" rx="10" fill="#f0fdfa" stroke="#99f6e4" stroke-width="2"/>
  <text x="208" y="236" text-anchor="middle" font-family="'Courier New', monospace" font-size="28" font-weight="800" letter-spacing="3" fill="#0f766e">${esc(v.code)}</text>
  <text x="48" y="296" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#64748b">${termsTspans}</text>
  <text x="672" y="296" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#0f172a">${esc(text.validUntilLabel)}: ${esc(v.validUntil)}</text>
  <text x="48" y="326" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94a3b8">${esc(text.footer)}</text>
</svg>`
}

/**
 * Builds the coupon SVG and triggers a client-side download. Browser-only —
 * guarded so it is a no-op during SSR.
 */
export function downloadVoucher(hotel: Hotel, text: CouponText): void {
  if (typeof document === 'undefined' || !hotel.voucher) return
  const svg = buildVoucherSvg(hotel, text)
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `stayeasy-voucher-${hotel.slug}-${hotel.voucher.code}.svg`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
