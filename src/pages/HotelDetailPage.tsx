import { Link, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import Button from '../components/Button'
import { HotelImage } from '../components/HotelImage'
import { SponsoredBadge } from '../components/SponsoredBadge'
import { FacilityGrid, TagChips } from '../components/Facilities'
import { WishlistButton } from '../components/WishlistButton'
import { VoucherCard } from '../components/VoucherCard'
import { JsonLd } from '../components/JsonLd'
import { HotelCard } from '../components/HotelCard'
import { repo } from '../data/repo'
import { useAsync } from '../lib/useAsync'
import { Spinner } from '../components/Loading'
import { useT, useLang, localizeHotel } from '../i18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { officialLink } from '../lib/officialLink'
import { scoreStrings } from '../lib/scoreI18n'

function Card({ title, icon, children, className = '' }: { title: string; icon: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 ${className}`}>
      <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
        <span aria-hidden>{icon}</span> {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  )
}

/** The single, prominent direct-booking action. Always links to the official website. */
function BookOfficialButton({ href, hotelName, label, className = '' }: { href: string; hotelName: string; label: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-base font-bold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${className}`}
      aria-label={`Book ${hotelName} on its official website (opens in a new tab)`}
    >
      {label} ↗
    </a>
  )
}

export default function HotelDetailPage() {
  const { slug } = useParams()
  const t = useT()
  const { lang } = useLang()
  const { data: rawHotel, loading } = useAsync(
    () => (slug ? repo.getHotel(slug) : Promise.resolve(undefined)),
    [slug],
  )
  const { data: similar = [] } = useAsync(
    () => (rawHotel ? repo.getSimilarHotels(rawHotel) : Promise.resolve([])),
    [rawHotel?.id],
  )

  // Document meta: built from the (localized) hotel when present, else a
  // generic fallback. useDocumentMeta is called unconditionally before any
  // early return to keep hook order stable.
  const metaHotel = rawHotel ? localizeHotel(rawHotel, lang) : undefined
  useDocumentMeta(
    metaHotel ? `${metaHotel.name} — StayEasy` : 'StayEasy Vietnam',
    metaHotel ? metaHotel.positioningLine : t.detail.notFoundText,
  )

  if (loading) {
    return (
      <div className="container-page">
        <Spinner />
      </div>
    )
  }

  if (!rawHotel) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold text-ink-900">{t.detail.notFound}</h1>
        <p className="mt-2 text-ink-700/70">{t.detail.notFoundText}</p>
        <Button to="/destinations/da-nang" className="mt-6">{t.detail.backToList}</Button>
      </div>
    )
  }

  const hotel = localizeHotel(rawHotel, lang)
  const area = (t.enums.area as Record<string, string>)[hotel.area] ?? hotel.area
  const city = (t.enums.city as Record<string, string>)[hotel.city] ?? hotel.city
  const hotelType = (t.enums.hotelType as Record<string, string>)[hotel.hotelType] ?? hotel.hotelType

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Hotel',
          name: hotel.name,
          description: hotel.positioningLine,
          image: hotel.imageUrl,
          address: { '@type': 'PostalAddress', addressLocality: city, addressCountry: hotel.country },
          amenityFeature: hotel.facilities.slice(0, 8).map((f) => ({ '@type': 'LocationFeatureSpecification', name: f })),
        }}
      />
      {/* Gallery */}
      <section className="container-page pt-6">
        <nav className="mb-4 text-sm text-ink-700/60">
          <Link to="/" className="hover:text-brand-700">Home</Link> <span className="px-1">/</span>
          <Link to={`/destinations/${hotel.city.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-brand-700"> {city}</Link> <span className="px-1">/</span>
          <span className="text-ink-800"> {hotel.name}</span>
        </nav>
        <div className="grid gap-3 sm:grid-cols-3 sm:grid-rows-2">
          <HotelImage src={hotel.imageUrl} gradient={hotel.heroColor} emoji={hotel.emoji} className="h-64 sm:col-span-2 sm:row-span-2 sm:h-full" label={hotel.name} />
          {hotel.gallery && hotel.gallery.length >= 2 ? (
            <>
              <HotelImage src={hotel.gallery[0]} gradient={hotel.heroColor} emoji={hotel.emoji} className="hidden h-full sm:flex" label={`${hotel.name} — photo 2`} />
              <HotelImage src={hotel.gallery[1]} gradient={hotel.heroColor} emoji={hotel.emoji} className="hidden h-full sm:flex" label={`${hotel.name} — photo 3`} />
            </>
          ) : (
            <>
              <HotelImage gradient="from-sand-200 to-sand-300" emoji="🛏️" className="hidden h-full sm:flex" label="Rooms" />
              <HotelImage gradient="from-brand-200 to-brand-400" emoji="🏊" className="hidden h-full sm:flex" label="Pool" />
            </>
          )}
        </div>
      </section>

      {/* 1. Hotel header */}
      <section className="container-page mt-6">
        <div className="flex flex-wrap items-center gap-2">
          {hotel.isSponsored && <SponsoredBadge />}
          <span className="pill bg-sand-100 text-ink-700">{hotelType}</span>
          {hotel.koreanFriendly && <span className="pill bg-rose-50 text-rose-600">🇰🇷 {t.badges.koreanFriendly}</span>}
        </div>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{hotel.name}</h1>
            <p className="mt-1 text-ink-700/80">📍 {area}, {city}</p>
            <p className="mt-2 max-w-2xl text-lg font-medium text-ink-800">{hotel.positioningLine}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-sm font-extrabold text-white">
                <span aria-hidden>✦</span> {hotel.conditions.stayEasyScore.toFixed(1)} · {scoreStrings[lang].label}
              </span>
              <span className="text-xs text-ink-700/60">{scoreStrings[lang].localFocus}</span>
            </div>
            <div className="mt-3"><TagChips items={hotel.tags} /></div>
          </div>
          <div className="shrink-0">
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-end">
              <BookOfficialButton href={officialLink(hotel)} hotelName={hotel.name} label={t.common.bookOfficial} className="w-full lg:w-auto" />
              <WishlistButton hotelId={hotel.slug} variant="pill" className="w-full justify-center sm:w-auto lg:w-auto" />
            </div>
            <p className="mt-2 text-center text-xs text-ink-700/60 lg:text-right">{t.detail.noCommission}</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container-page mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          {/* 2. StayEasy Summary */}
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-sand-50 p-5 ring-1 ring-brand-100">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">🤖 {t.detail.summaryTitle}</h2>
            <p className="mt-1 text-xs text-ink-700/60">{t.detail.summarySub}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/80 p-4 ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-700">✓ {t.detail.bestFor}</p>
                <ul className="mt-1.5 space-y-1 text-sm text-ink-800">
                  {hotel.bestFor.map((b) => <li key={b}>• {b}</li>)}
                </ul>
              </div>
              <div className="rounded-xl bg-white/80 p-4 ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase tracking-wide text-rose-500">✕ {t.detail.notIdealFor}</p>
                <ul className="mt-1.5 space-y-1 text-sm text-ink-800">
                  {hotel.notIdealFor.map((b) => <li key={b}>• {b}</li>)}
                </ul>
              </div>
              <div className="rounded-xl bg-white/80 p-4 ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-700/50">★ {t.detail.mainReason}</p>
                <p className="mt-1.5 text-sm text-ink-800">{hotel.mainReason}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-4 ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-700/50">🔎 {t.detail.thingsToCheck}</p>
                <ul className="mt-1.5 space-y-1 text-sm text-ink-800">
                  {hotel.thingsToCheck.map((b) => <li key={b}>• {b}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Official booking benefits */}
          <Card title={t.detail.benefitsTitle} icon="🏷️">
            <p className="text-sm text-ink-700/80">{t.detail.benefitsSub}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {hotel.officialBenefits.map((b) => (
                <div key={b} className="flex items-start gap-2 rounded-xl bg-sand-50 p-3 ring-1 ring-black/5">
                  <span className="text-brand-600">✓</span>
                  <span className="text-sm font-medium text-ink-800">{b}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 4. Room choice guide */}
          <Card title={t.detail.roomTitle} icon="🛏️">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                [t.detail.roomCouples, hotel.roomGuide.couples, '💑'],
                [t.detail.roomFamilies, hotel.roomGuide.families, '👨‍👩‍👧'],
                [t.detail.roomLongStay, hotel.roomGuide.longStay, '🧳'],
                [t.detail.roomCheck, hotel.roomGuide.checkBeforeBooking, '🔎'],
              ].map(([label, d, icon]) => (
                <div key={label} className="rounded-xl bg-sand-50 p-4 ring-1 ring-black/5">
                  <p className="text-sm font-bold text-ink-900">{icon} {label}</p>
                  <p className="mt-1 text-sm text-ink-700/80">{d}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 5. Location guide */}
          <Card title={t.detail.locationTitle} icon="📍">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                [t.detail.locNearby, hotel.locationGuide.nearby, '🏝️'],
                [t.detail.locAirport, hotel.locationGuide.airportDistance, '✈️'],
                [t.detail.locAround, hotel.locationGuide.gettingAround, '🚶'],
                [t.detail.locFood, hotel.locationGuide.nearbyFood, '🍜'],
              ].map(([label, d, icon]) => (
                <div key={label} className="rounded-xl bg-sand-50 p-4 ring-1 ring-black/5">
                  <p className="text-sm font-bold text-ink-900">{icon} {label}</p>
                  <p className="mt-1 text-sm text-ink-700/80">{d}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 6. Facilities guide */}
          <Card title={t.detail.facilitiesTitle} icon="✨">
            <FacilityGrid items={hotel.facilities} />
          </Card>

          {/* 7. Cancellation & payment checklist */}
          <Card title={t.detail.cancelTitle} icon="🛡️">
            <ul className="space-y-2">
              {hotel.cancellationChecklist.map((c) => (
                <li key={c} className="flex items-start gap-2.5 rounded-xl bg-sand-50 px-3 py-2.5 ring-1 ring-black/5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 border-brand-300 text-xs text-brand-600">☑</span>
                  <span className="text-sm text-ink-800">{c}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-ink-700/60">{t.detail.cancelNote}</p>
          </Card>
        </div>

        {/* Sticky rail */}
        <aside className="lg:sticky lg:top-20 lg:h-fit space-y-3">
          {hotel.voucher && <VoucherCard hotel={hotel} />}
          <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
            <p className="text-sm font-bold text-ink-900">{t.detail.railTitle}</p>
            <p className="mt-1 text-sm text-ink-700/70">{t.detail.railText}</p>
            <BookOfficialButton href={officialLink(hotel)} hotelName={hotel.name} label={t.common.bookOfficial} className="mt-4 w-full" />
            <div className="mt-4 space-y-2 border-t border-black/5 pt-4 text-sm text-ink-700/80">
              <p className="flex items-center gap-2">🔒 {t.detail.rail1}</p>
              <p className="flex items-center gap-2">🏷️ {t.detail.rail2}</p>
              <p className="flex items-center gap-2">📞 {t.detail.rail3}</p>
            </div>
          </div>
          <Link to="/guides/direct-booking" className="mt-3 block rounded-2xl bg-ink-900 p-4 text-sm text-white transition-colors hover:bg-ink-800">
            <p className="font-semibold">{t.detail.railGuideTitle}</p>
            <p className="mt-0.5 text-white/75">{t.detail.railGuideText} →</p>
          </Link>
        </aside>
      </section>

      {/* 8. Official booking CTA block */}
      <section className="container-page mt-12">
        <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-brand-600 p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{t.detail.ctaTitle}</h2>
          <p className="mx-auto mt-2 max-w-lg text-white/85">{t.detail.ctaText}</p>
          <a
            href={officialLink(hotel)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-brand-700 shadow-sm transition-transform hover:scale-[1.02]"
          >
            {t.detail.ctaBtn} ↗
          </a>
        </div>
      </section>

      {/* 9. Similar hotels */}
      <section className="container-page mt-16">
        <h2 className="mb-5 text-2xl font-extrabold text-ink-900">{t.detail.similarTitle}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      </section>

      {/* 10. Disclaimer */}
      <section className="container-page my-12">
        <p className="rounded-2xl bg-sand-100 px-5 py-4 text-center text-sm text-ink-700/80 ring-1 ring-black/5">
          ⚠️ {t.detail.disclaimer}
        </p>
      </section>

      {/* Mobile sticky CTA */}
      <div className="sticky bottom-0 z-30 border-t border-black/10 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="container-page">
          <BookOfficialButton href={officialLink(hotel)} hotelName={hotel.name} label={t.common.bookOfficial} className="w-full" />
        </div>
      </div>
    </>
  )
}
