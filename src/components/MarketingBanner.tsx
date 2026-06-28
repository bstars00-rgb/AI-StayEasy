import { Link } from 'react-router-dom'
import { useMarketingBanner } from '../lib/marketingBanner'

/**
 * Admin-controlled homepage marketing banner. Renders nothing unless enabled
 * and given a title, so the team can switch promos on/off from the admin.
 */
export function MarketingBanner() {
  const b = useMarketingBanner()
  if (!b.enabled || !b.title.trim()) return null

  const isInternal = b.ctaHref.startsWith('/')
  const cta = b.ctaLabel.trim() && b.ctaHref.trim() && (
    isInternal ? (
      <Link to={b.ctaHref} className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-white/90">
        {b.ctaLabel} →
      </Link>
    ) : (
      <a href={b.ctaHref} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-white/90">
        {b.ctaLabel} ↗
      </a>
    )
  )

  return (
    <section className="container-page my-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 p-8 text-white sm:p-12">
        <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_15%_20%,white_0,transparent_35%),radial-gradient(circle_at_85%_75%,white_0,transparent_30%)]" />
        <div className="relative">
          {b.eyebrow.trim() && <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">{b.eyebrow}</p>}
          <h2 className="mt-2 max-w-2xl whitespace-pre-line text-2xl font-extrabold sm:text-3xl">{b.title}</h2>
          {b.body.trim() && <p className="mt-3 max-w-2xl text-white/90">{b.body}</p>}
          {cta && <div className="mt-6">{cta}</div>}
        </div>
      </div>
    </section>
  )
}
