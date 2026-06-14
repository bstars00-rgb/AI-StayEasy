import { Link, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import Button from '../components/Button'
import { HotelImage } from '../components/HotelImage'
import { SponsoredBadge } from '../components/SponsoredBadge'
import { FacilityGrid, TagChips } from '../components/Facilities'
import { HotelCard } from '../components/HotelCard'
import { getHotel, getSimilarHotels } from '../data/hotels'

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
function BookOfficialButton({ href, hotelName, className = '' }: { href: string; hotelName: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-base font-bold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${className}`}
      aria-label={`Book ${hotelName} on its official website (opens in a new tab)`}
    >
      Book on Official Website ↗
    </a>
  )
}

export default function HotelDetailPage() {
  const { slug } = useParams()
  const hotel = slug ? getHotel(slug) : undefined

  if (!hotel) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Hotel not found</h1>
        <p className="mt-2 text-ink-700/70">We couldn’t find that hotel.</p>
        <Button to="/destinations/da-nang" className="mt-6">Back to Da Nang hotels</Button>
      </div>
    )
  }

  const similar = getSimilarHotels(hotel)

  return (
    <>
      {/* Gallery */}
      <section className="container-page pt-6">
        <nav className="mb-4 text-sm text-ink-700/60">
          <Link to="/" className="hover:text-brand-700">Home</Link> <span className="px-1">/</span>
          <Link to="/destinations/da-nang" className="hover:text-brand-700"> Da Nang</Link> <span className="px-1">/</span>
          <span className="text-ink-800"> {hotel.name}</span>
        </nav>
        <div className="grid gap-3 sm:grid-cols-3 sm:grid-rows-2">
          <HotelImage src={hotel.imageUrl} gradient={hotel.heroColor} emoji={hotel.emoji} className="h-64 sm:col-span-2 sm:row-span-2 sm:h-full" label={hotel.name} />
          <HotelImage gradient="from-sand-200 to-sand-300" emoji="🛏️" className="hidden h-full sm:flex" label="Rooms" />
          <HotelImage gradient="from-brand-200 to-brand-400" emoji="🏊" className="hidden h-full sm:flex" label="Pool" />
        </div>
      </section>

      {/* 1. Hotel header */}
      <section className="container-page mt-6">
        <div className="flex flex-wrap items-center gap-2">
          {hotel.isSponsored && <SponsoredBadge />}
          <span className="pill bg-sand-100 text-ink-700">{hotel.hotelType}</span>
          {hotel.koreanFriendly && <span className="pill bg-rose-50 text-rose-600">🇰🇷 Korean-friendly</span>}
        </div>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{hotel.name}</h1>
            <p className="mt-1 text-ink-700/80">📍 {hotel.area}, {hotel.city}</p>
            <p className="mt-2 max-w-2xl text-lg font-medium text-ink-800">{hotel.positioningLine}</p>
            <div className="mt-3"><TagChips items={hotel.tags} /></div>
          </div>
          <div className="shrink-0">
            <BookOfficialButton href={hotel.officialWebsiteUrl} hotelName={hotel.name} className="w-full lg:w-auto" />
            <p className="mt-2 text-center text-xs text-ink-700/60 lg:text-right">No commission · booked directly with the hotel</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container-page mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          {/* 2. StayEasy Summary */}
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-sand-50 p-5 ring-1 ring-brand-100">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">🤖 StayEasy summary</h2>
            <p className="mt-1 text-xs text-ink-700/60">A quick, honest read to help you decide.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/80 p-4 ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-700">✓ Best for</p>
                <ul className="mt-1.5 space-y-1 text-sm text-ink-800">
                  {hotel.bestFor.map((b) => <li key={b}>• {b}</li>)}
                </ul>
              </div>
              <div className="rounded-xl bg-white/80 p-4 ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase tracking-wide text-rose-500">✕ Not ideal for</p>
                <ul className="mt-1.5 space-y-1 text-sm text-ink-800">
                  {hotel.notIdealFor.map((b) => <li key={b}>• {b}</li>)}
                </ul>
              </div>
              <div className="rounded-xl bg-white/80 p-4 ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-700/50">★ Main reason to choose</p>
                <p className="mt-1.5 text-sm text-ink-800">{hotel.mainReason}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-4 ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-700/50">🔎 Things to check first</p>
                <ul className="mt-1.5 space-y-1 text-sm text-ink-800">
                  {hotel.thingsToCheck.map((b) => <li key={b}>• {b}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Official booking benefits */}
          <Card title="Official booking benefits" icon="🏷️">
            <p className="text-sm text-ink-700/80">Perks you get by booking on {hotel.name}’s official website — not through an OTA.</p>
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
          <Card title="Room choice guide" icon="🛏️">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Best for couples', hotel.roomGuide.couples, '💑'],
                ['Best for families', hotel.roomGuide.families, '👨‍👩‍👧'],
                ['Best for long stay', hotel.roomGuide.longStay, '🧳'],
                ['Check before booking', hotel.roomGuide.checkBeforeBooking, '🔎'],
              ].map(([t, d, icon]) => (
                <div key={t} className="rounded-xl bg-sand-50 p-4 ring-1 ring-black/5">
                  <p className="text-sm font-bold text-ink-900">{icon} {t}</p>
                  <p className="mt-1 text-sm text-ink-700/80">{d}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 5. Location guide */}
          <Card title="Location guide" icon="📍">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Nearby beach / landmarks', hotel.locationGuide.nearby, '🏝️'],
                ['Airport distance', hotel.locationGuide.airportDistance, '✈️'],
                ['Getting around', hotel.locationGuide.gettingAround, '🚶'],
                ['Nearby food & attractions', hotel.locationGuide.nearbyFood, '🍜'],
              ].map(([t, d, icon]) => (
                <div key={t} className="rounded-xl bg-sand-50 p-4 ring-1 ring-black/5">
                  <p className="text-sm font-bold text-ink-900">{icon} {t}</p>
                  <p className="mt-1 text-sm text-ink-700/80">{d}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 6. Facilities guide */}
          <Card title="Facilities" icon="✨">
            <FacilityGrid items={hotel.facilities} />
          </Card>

          {/* 7. Cancellation & payment checklist */}
          <Card title="Cancellation & payment checklist" icon="🛡️">
            <ul className="space-y-2">
              {hotel.cancellationChecklist.map((c) => (
                <li key={c} className="flex items-start gap-2.5 rounded-xl bg-sand-50 px-3 py-2.5 ring-1 ring-black/5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 border-brand-300 text-xs text-brand-600">☑</span>
                  <span className="text-sm text-ink-800">{c}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-ink-700/60">Confirm every item on the hotel’s official website before you pay.</p>
          </Card>
        </div>

        {/* Sticky rail */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
            <p className="text-sm font-bold text-ink-900">Ready to book directly?</p>
            <p className="mt-1 text-sm text-ink-700/70">You’ll complete your booking on {hotel.name}’s own website.</p>
            <BookOfficialButton href={hotel.officialWebsiteUrl} hotelName={hotel.name} className="mt-4 w-full" />
            <div className="mt-4 space-y-2 border-t border-black/5 pt-4 text-sm text-ink-700/80">
              <p className="flex items-center gap-2">🔒 No booking fee or markup</p>
              <p className="flex items-center gap-2">🏷️ Direct-only perks included</p>
              <p className="flex items-center gap-2">📞 The hotel handles your booking & support</p>
            </div>
          </div>
          <Link to="/guides/direct-booking" className="mt-3 block rounded-2xl bg-ink-900 p-4 text-sm text-white transition-colors hover:bg-ink-800">
            <p className="font-semibold">New to booking direct? 🤔</p>
            <p className="mt-0.5 text-white/75">Read the direct booking guide →</p>
          </Link>
        </aside>
      </section>

      {/* 8. Official booking CTA block */}
      <section className="container-page mt-12">
        <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-brand-600 p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Ready to book directly?</h2>
          <p className="mx-auto mt-2 max-w-lg text-white/85">Get {hotel.name}’s official benefits by booking on their own website.</p>
          <a
            href={hotel.officialWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-brand-700 shadow-sm transition-transform hover:scale-[1.02]"
          >
            Go to Hotel Official Website ↗
          </a>
        </div>
      </section>

      {/* 9. Similar hotels */}
      <section className="container-page mt-16">
        <h2 className="mb-5 text-2xl font-extrabold text-ink-900">Similar hotels</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      </section>

      {/* 10. Disclaimer */}
      <section className="container-page my-12">
        <p className="rounded-2xl bg-sand-100 px-5 py-4 text-center text-sm text-ink-700/80 ring-1 ring-black/5">
          ⚠️ StayEasy does not process reservations or payments. Final booking terms are provided by the hotel.
        </p>
      </section>

      {/* Mobile sticky CTA */}
      <div className="sticky bottom-0 z-30 border-t border-black/10 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="container-page">
          <BookOfficialButton href={hotel.officialWebsiteUrl} hotelName={hotel.name} className="w-full" />
        </div>
      </div>
    </>
  )
}
