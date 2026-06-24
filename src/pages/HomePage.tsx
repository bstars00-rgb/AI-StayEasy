import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { TrustStrip } from '../components/TrustStrip'
import { AISearch } from '../components/AISearch'
import { SectionHeading } from '../components/SectionHeading'
import { HotelCard } from '../components/HotelCard'
import { HotelImage } from '../components/HotelImage'
import { repo } from '../data/repo'
import { useAsync } from '../lib/useAsync'
import { CardGridSkeleton } from '../components/Loading'
import { useT } from '../i18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { useSiteImages } from '../lib/siteImages'

/** The four hero tiles — decorative emoji by default; an operator can swap in
 *  real photos from the admin Images tab (siteImages.hero[i]). */
const HERO_TILES = [
  { gradient: 'from-sky-400 to-brand-500', emoji: '🏖️', label: 'Beach', mt: false },
  { gradient: 'from-violet-400 to-indigo-500', emoji: '🌉', label: 'City', mt: true },
  { gradient: 'from-emerald-500 to-teal-500', emoji: '⛰️', label: 'Hills', mt: false },
  { gradient: 'from-orange-400 to-rose-400', emoji: '🏠', label: 'Family', mt: true },
]

export default function HomePage() {
  const t = useT()
  useDocumentMeta(t.home.metaTitle, t.home.metaDesc)
  const siteImgs = useSiteImages()
  const hot = useAsync(() => repo.allHotels(), [])
  const dest = useAsync(() => repo.listDestinations(), [])
  const hotels = hot.data ?? []
  const destinations = (dest.data ?? []).filter((d) => d.available)
  // 3 sample hotels, leading with a sponsored one.
  const featured = [
    ...hotels.filter((h) => h.isSponsored),
    ...hotels.filter((h) => !h.isSponsored),
  ].slice(0, 3)

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-sky-500">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_35%),radial-gradient(circle_at_85%_60%,white_0,transparent_30%)]" />
        <div className="container-page relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="text-white">
            <span className="pill bg-white/15 text-white ring-1 ring-white/25">{t.home.heroBadge}</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/90">
              {t.home.heroSubtitle}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/destinations/da-nang" variant="white" size="lg">{t.home.ctaExplore}</Button>
              <Button to="/guides/direct-booking" variant="ghost" size="lg" className="!text-white hover:!bg-white/10">
                {t.home.ctaWhy}
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
              <span>✓ {t.home.heroPoint1}</span>
              <span>✓ {t.home.heroPoint2}</span>
              <span>✓ {t.home.heroPoint3}</span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {HERO_TILES.map((tile, i) => (
                <HotelImage
                  key={tile.label}
                  gradient={tile.gradient}
                  emoji={tile.emoji}
                  src={siteImgs[`hero-${i + 1}`]}
                  className={`h-44 ${tile.mt ? 'mt-8' : ''}`}
                  label={tile.label}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI search / discovery block */}
      <section className="container-page -mt-10 relative z-10">
        <AISearch />
      </section>

      {/* Trust */}
      <section className="container-page mt-12">
        <TrustStrip />
      </section>

      {/* 3. Featured destinations */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow={t.home.featuredDestEyebrow} title={t.home.featuredDestTitle} subtitle={t.home.featuredDestSubtitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dest.loading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-sand-100" />)
            : destinations.map((d) => (
            <Link
              key={d.city}
              to={`/destinations/${d.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5"
            >
              <HotelImage gradient={d.heroColor} emoji={d.emoji} src={siteImgs[`dest-${d.slug}`]} rounded="" className="h-40 w-full" label={d.city} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{d.city}</h3>
                  {!d.available && <span className="pill bg-white/20 text-white">{t.common.comingSoon}</span>}
                </div>
                <p className="text-xs text-white/85">{d.available ? `${d.hotelCount} ${t.common.hotels}` : t.home.onboarding}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured hotels */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow={t.home.featuredHotelsEyebrow} title={t.home.featuredHotelsTitle}>
          <Link to="/destinations/da-nang" className="hidden text-sm font-semibold text-brand-700 hover:underline sm:block">
            {t.home.seeAll} →
          </Link>
        </SectionHeading>
        {hot.loading ? (
          <CardGridSkeleton count={3} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-ink-700/60">
          {t.home.sponsoredNote}
        </p>
      </section>

      {/* 5. Explanation — StayEasy is not an OTA */}
      <section className="container-page mt-16">
        <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5">
          <div className="grid lg:grid-cols-2">
            <div className="bg-gradient-to-br from-ink-900 to-brand-800 p-8 text-white sm:p-10">
              <span className="pill bg-white/15 text-white ring-1 ring-white/25">{t.home.notOtaPosition}</span>
              <h2 className="mt-4 text-3xl font-extrabold">{t.home.notOtaTitle}</h2>
              <p className="mt-3 text-white/85">
                {t.home.notOtaText}
              </p>
              <div className="mt-6">
                <Button to="/guides/direct-booking" variant="white" size="md">{t.home.notOtaCta}</Button>
              </div>
            </div>
            <div className="p-8 sm:p-10">
              <ul className="space-y-4">
                {[
                  { icon: '🚫', t: t.home.notOta1t, d: t.home.notOta1d },
                  { icon: '📚', t: t.home.notOta2t, d: t.home.notOta2d },
                  { icon: '🏨', t: t.home.notOta3t, d: t.home.notOta3d },
                  { icon: '🏷️', t: t.home.notOta4t, d: t.home.notOta4d },
                ].map((r) => (
                  <li key={r.t} className="flex gap-3">
                    <span className="text-2xl">{r.icon}</span>
                    <div>
                      <p className="font-bold text-ink-900">{r.t}</p>
                      <p className="text-sm text-ink-700/80">{r.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="container-page mt-16">
        <div className="overflow-hidden rounded-3xl bg-ink-900 p-8 text-white sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">{t.home.partnerCtaTitle}</h2>
              <p className="mt-3 max-w-lg text-white/80">
                {t.home.partnerCtaText}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button to="/partners" variant="primary" size="lg">{t.home.partnerCtaBtn}</Button>
              <Button to="/dashboard" variant="white" size="lg">{t.home.partnerCtaBtn2}</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
