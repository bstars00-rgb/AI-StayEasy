import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Destination } from '../types'
import Button from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'
import { HotelImage } from '../components/HotelImage'
import { cityPhoto } from '../lib/cityPhotos'
import { repo } from '../data/repo'
import { useAsync } from '../lib/useAsync'
import { travelStyles } from '../data/travelStyles'
import { AsiaMap } from '../components/AsiaMap'
import { asiaStrings } from '../lib/asiaI18n'
import { useT, useLang } from '../i18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function VietnamPage() {
  const t = useT()
  const { lang } = useLang()
  const asia = asiaStrings[lang]
  useDocumentMeta(t.vietnam.metaTitle, t.vietnam.metaDesc)
  const { data: destinations = [], loading: destLoading } = useAsync(() => repo.listDestinations(), [])
  const destText = t.destText as unknown as Record<string, { short: string; bestFor: string[]; recommended: string; highlights: string[] }>
  const cityNames = t.enums.city as Record<string, string>
  const [showMore, setShowMore] = useState(false)

  // Keep the page short: feature the 4 flagship cities, then reveal the rest on
  // demand — split into "available now" and "trending / coming soon".
  const featured = destinations.slice(0, 4)
  const rest = destinations.slice(4)
  const moreAvailable = rest.filter((d) => d.available)
  const trending = rest.filter((d) => !d.available)

  // Full destination card (used for featured + the "available now" group).
  const DestCard = (d: Destination) => {
    const dt = destText[d.slug]
    const short = dt?.short ?? d.shortDescription
    const best = dt?.bestFor ?? d.bestFor
    const rec = dt?.recommended ?? d.recommendedTraveler
    return (
      <div key={d.city} className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5">
        <div className="relative">
          <HotelImage gradient={d.heroColor} emoji={d.emoji} src={cityPhoto(d.slug)} rounded="" className="h-44 w-full" label={cityNames[d.city] ?? d.city} />
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
  }

  // Compact tile for trending / coming-soon cities.
  const TrendingCard = (d: Destination) => {
    const dt = destText[d.slug]
    const short = dt?.short ?? d.shortDescription
    return (
      <div key={d.city} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${d.heroColor} text-2xl`} aria-hidden>
          {d.emoji}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-ink-900">{cityNames[d.city] ?? d.city}</h4>
            <span className="pill bg-sand-100 text-[11px] text-ink-700/70">{t.common.comingSoon}</span>
          </div>
          <p className="mt-0.5 text-sm text-ink-700/70">{short}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-gradient-to-br from-ink-900 to-brand-800 py-14 text-white">
        <div className="container-page">
          <nav className="mb-4 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link> <span className="px-1">/</span> Destinations / Vietnam
          </nav>
          <h1 className="max-w-2xl whitespace-pre-line text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t.vietnam.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            {t.vietnam.heroSubtitle}
          </p>
        </div>
      </section>

      {/* 2. Destination cards — featured 4, rest on demand */}
      <section className="container-page mt-12">
        <SectionHeading eyebrow={t.vietnam.destEyebrow} title={t.vietnam.destTitle} />
        {destLoading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-3xl bg-sand-100" />)}
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              {featured.map((d) => DestCard(d))}
            </div>

            {!showMore && rest.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setShowMore(true)}
                  aria-expanded={false}
                  className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
                >
                  {t.vietnam.moreToggleOpen} <span className="text-white/70">({rest.length})</span> ↓
                </button>
              </div>
            )}

            {showMore && (
              <>
                {moreAvailable.length > 0 && (
                  <div className="mt-12">
                    <SectionHeading eyebrow={t.vietnam.moreAvailEyebrow} title={t.vietnam.moreAvailTitle} />
                    <div className="grid gap-6 lg:grid-cols-2">
                      {moreAvailable.map((d) => DestCard(d))}
                    </div>
                  </div>
                )}

                {trending.length > 0 && (
                  <div className="mt-12">
                    <SectionHeading eyebrow={t.vietnam.trendingEyebrow} title={t.vietnam.trendingTitle} />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {trending.map((d) => TrendingCard(d))}
                    </div>
                  </div>
                )}

                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setShowMore(false)}
                    aria-expanded
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-800 ring-1 ring-black/10 transition-colors hover:bg-sand-50"
                  >
                    {t.vietnam.moreToggleClose} ↑
                  </button>
                </div>
              </>
            )}
          </>
        )}
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

      {/* 4.5 Asia expansion roadmap */}
      <section className="container-page mt-16">
        <div className="rounded-3xl bg-gradient-to-br from-ink-900 to-brand-800 p-8 text-white sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-300">{asia.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">{asia.title}</h2>
          <p className="mt-2 max-w-2xl text-white/80">{asia.subtitle}</p>
          <div className="mt-6">
            <AsiaMap live={asia.live} coming={asia.coming} />
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
