import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { TrustStrip } from '../components/TrustStrip'
import { DiscoveryBlock } from '../components/DiscoveryBlock'
import { SectionHeading } from '../components/SectionHeading'
import { HotelCard } from '../components/HotelCard'
import { HotelImage } from '../components/HotelImage'
import { hotels } from '../data/hotels'
import { destinations } from '../data/destinations'

export default function HomePage() {
  // 3 sample Da Nang hotels, leading with a sponsored one.
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
            <span className="pill bg-white/15 text-white ring-1 ring-white/25">🇻🇳 Vietnam hotels · Starting in Da Nang</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Book Vietnam hotels directly with confidence
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/90">
              StayEasy helps you choose the right hotel through clear content, official booking benefits, and
              practical travel guidance.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/destinations/da-nang" variant="white" size="lg">Explore Da Nang Hotels</Button>
              <Button to="/guides/direct-booking" variant="ghost" size="lg" className="!text-white hover:!bg-white/10">
                Why Book Direct?
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
              <span>✓ Not an OTA</span>
              <span>✓ No booking commission</span>
              <span>✓ Family · Couple · Business · Beach · Long stay</span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <HotelImage gradient="from-sky-400 to-brand-500" emoji="🏖️" className="h-44" label="Beach" />
              <HotelImage gradient="from-violet-400 to-indigo-500" emoji="🌉" className="mt-8 h-44" label="City" />
              <HotelImage gradient="from-emerald-500 to-teal-500" emoji="⛰️" className="h-44" label="Hills" />
              <HotelImage gradient="from-orange-400 to-rose-400" emoji="🏠" className="mt-8 h-44" label="Family" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search / discovery block */}
      <section className="container-page -mt-10 relative z-10">
        <DiscoveryBlock />
      </section>

      {/* Trust */}
      <section className="container-page mt-12">
        <TrustStrip />
      </section>

      {/* 3. Featured destinations */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow="Vietnam" title="Featured destinations" subtitle="Da Nang is live now. More coastal cities are onboarding official hotel partners." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d) => (
            <Link
              key={d.city}
              to={d.available ? '/destinations/da-nang' : '/destinations/vietnam'}
              className="group relative overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5"
            >
              <HotelImage gradient={d.heroColor} emoji={d.emoji} rounded="" className="h-40 w-full" label={d.city} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{d.city}</h3>
                  {!d.available && <span className="pill bg-white/20 text-white">Coming soon</span>}
                </div>
                <p className="text-xs text-white/85">{d.available ? `${d.hotelCount} hotels` : 'Onboarding partners'}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured hotels */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow="Da Nang" title="Featured hotels">
          <Link to="/destinations/da-nang" className="hidden text-sm font-semibold text-brand-700 hover:underline sm:block">
            See all Da Nang hotels →
          </Link>
        </SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-700/60">
          ★ Sponsored hotels pay for featured placement. We always label them. We never take a cut of your booking.
        </p>
      </section>

      {/* 5. Explanation — StayEasy is not an OTA */}
      <section className="container-page mt-16">
        <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5">
          <div className="grid lg:grid-cols-2">
            <div className="bg-gradient-to-br from-ink-900 to-brand-800 p-8 text-white sm:p-10">
              <span className="pill bg-white/15 text-white ring-1 ring-white/25">Our position</span>
              <h2 className="mt-4 text-3xl font-extrabold">StayEasy is not an OTA</h2>
              <p className="mt-3 text-white/85">
                We’re a hotel content and direct-booking guide. We help you understand hotels better — then you book
                straight with the hotel.
              </p>
              <div className="mt-6">
                <Button to="/guides/direct-booking" variant="white" size="md">Read the direct booking guide</Button>
              </div>
            </div>
            <div className="p-8 sm:p-10">
              <ul className="space-y-4">
                {[
                  { icon: '🚫', t: 'We do not process bookings', d: 'No reservations or payments happen on StayEasy.' },
                  { icon: '📚', t: 'We help travelers understand hotels better', d: 'Clear guides on rooms, location, breakfast, pools, and policies.' },
                  { icon: '🏨', t: 'Final booking is made directly with the hotel', d: 'You complete your booking on the hotel’s official website.' },
                  { icon: '🏷️', t: 'Hotels promote official benefits, commission-free', d: 'Hotels reach travelers without paying OTA booking commission.' },
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
              <h2 className="text-2xl font-extrabold sm:text-3xl">Own a hotel in Vietnam?</h2>
              <p className="mt-3 max-w-lg text-white/80">
                Promote your official booking benefits through trusted content and sponsored placements — and keep
                100% of your booking revenue.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button to="/partners" variant="primary" size="lg">Partner with StayEasy</Button>
              <Button to="/dashboard" variant="white" size="lg">See the hotel dashboard</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
