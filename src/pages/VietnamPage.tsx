import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'
import { HotelImage } from '../components/HotelImage'
import { repo } from '../data/repo'
import { travelStyles } from '../data/travelStyles'
import { useT } from '../i18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function VietnamPage() {
  const t = useT()
  useDocumentMeta(t.vietnam.metaTitle, t.vietnam.metaDesc)
  const destinations = repo.listDestinations()
  const destText = t.destText as unknown as Record<string, { short: string; bestFor: string[]; recommended: string; highlights: string[] }>
  const cityNames = t.enums.city as Record<string, string>

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-gradient-to-br from-ink-900 to-brand-800 py-14 text-white">
        <div className="container-page">
          <nav className="mb-4 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link> <span className="px-1">/</span> Destinations / Vietnam
          </nav>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t.vietnam.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            {t.vietnam.heroSubtitle}
          </p>
        </div>
      </section>

      {/* 2. Destination cards */}
      <section className="container-page mt-12">
        <SectionHeading eyebrow={t.vietnam.destEyebrow} title={t.vietnam.destTitle} />
        <div className="grid gap-6 lg:grid-cols-2">
          {destinations.map((d) => {
            // Use translated destination text when present; fall back to the
            // destination's own (English) fields for newer "coming soon" cities.
            const dt = destText[d.slug]
            const short = dt?.short ?? d.shortDescription
            const best = dt?.bestFor ?? d.bestFor
            const rec = dt?.recommended ?? d.recommendedTraveler
            return (
            <div key={d.city} className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5">
              <div className="relative">
                <HotelImage gradient={d.heroColor} emoji={d.emoji} rounded="" className="h-44 w-full" label={cityNames[d.city] ?? d.city} />
                <div className="absolute right-4 top-4">
                  {d.available ? (
                    <span className="pill bg-brand-600 text-white">● {t.common.liveNow}</span>
                  ) : (
                    <span className="pill bg-white/90 text-ink-800">{t.common.comingSoon}</span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-2xl font-extrabold text-ink-900">{cityNames[d.city] ?? d.city}</h3>
                  {d.available && <span className="text-sm font-semibold text-brand-700">{d.hotelCount} {t.common.hotels}</span>}
                </div>
                <p className="mt-2 text-sm text-ink-700/80">{short}</p>

                <div className="mt-4 space-y-2 text-sm">
                  <p><span className="font-semibold text-ink-900">{t.vietnam.bestForLabel}</span> <span className="text-ink-700/80">{best.join(', ')}</span></p>
                  <p><span className="font-semibold text-ink-900">{t.vietnam.recommendedLabel}</span> <span className="text-ink-700/80">{rec}</span></p>
                </div>

                <div className="mt-5">
                  {d.available ? (
                    <Button to={`/destinations/${d.slug}`} size="md">{t.vietnam.exploreHotels} →</Button>
                  ) : (
                    <button disabled className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-sand-100 px-5 py-2.5 text-sm font-semibold text-ink-700/50">
                      {t.vietnam.exploreSoon}
                    </button>
                  )}
                </div>
              </div>
            </div>
            )
          })}
        </div>
      </section>

      {/* 3. Travel style guide */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow={t.vietnam.styleEyebrow} title={t.vietnam.styleTitle} subtitle={t.vietnam.styleSubtitle} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {travelStyles.map((ts, i) => (
            <div key={t.styleGuide[i].style} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
              <div className="text-2xl">{ts.emoji}</div>
              <h3 className="mt-2 font-bold text-ink-900">{t.styleGuide[i].style}</h3>
              <p className="mt-1.5 text-sm text-ink-700/80">{t.styleGuide[i].summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.styleGuide[i].lookFor.map((l) => (
                  <span key={l} className="pill bg-sand-100 text-ink-700">{l}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Direct booking explanation */}
      <section className="container-page mt-16">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl bg-brand-50 p-8 ring-1 ring-brand-100">
            <h2 className="text-2xl font-extrabold text-ink-900">{t.vietnam.whyTitle}</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-700/90">
              {[
                ['🏷️', t.vietnam.why1t, t.vietnam.why1d],
                ['💬', t.vietnam.why2t, t.vietnam.why2d],
                ['⬆️', t.vietnam.why3t, t.vietnam.why3d],
                ['📝', t.vietnam.why4t, t.vietnam.why4d],
              ].map(([icon, title, d]) => (
                <li key={title} className="flex gap-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="font-semibold text-ink-900">{title}</p>
                    <p className="text-ink-700/80">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5">
            <h2 className="text-2xl font-extrabold text-ink-900">{t.vietnam.compareTitle}</h2>
            <p className="mt-3 text-sm text-ink-700/80">
              {t.vietnam.compareIntro}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ink-700/90">
              {[t.vietnam.compare1, t.vietnam.compare2, t.vietnam.compare3, t.vietnam.compare4].map((c) => (
                <li key={c} className="flex items-start gap-2"><span className="mt-0.5 text-amber-500">•</span> {c}</li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-sand-50 px-4 py-3 text-xs text-ink-700/70 ring-1 ring-black/5">
              {t.vietnam.neutralNote}
            </p>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="container-page my-16">
        <div className="rounded-3xl bg-ink-900 p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{t.vietnam.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">{t.vietnam.ctaText}</p>
          <div className="mt-6">
            <Button to="/destinations/da-nang" variant="primary" size="lg">{t.vietnam.ctaBtn}</Button>
          </div>
        </div>
      </section>
    </>
  )
}
