import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'
import { HotelImage } from '../components/HotelImage'
import { destinations } from '../data/destinations'
import { travelStyles } from '../data/travelStyles'

export default function VietnamPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="bg-gradient-to-br from-ink-900 to-brand-800 py-14 text-white">
        <div className="container-page">
          <nav className="mb-4 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link> <span className="px-1">/</span> Destinations / Vietnam
          </nav>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Find the right hotel for your Vietnam trip
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            From beach resorts in Da Nang to city hotels in Ho Chi Minh City, StayEasy helps you choose hotels based
            on real travel needs.
          </p>
        </div>
      </section>

      {/* 2. Destination cards */}
      <section className="container-page mt-12">
        <SectionHeading eyebrow="Destinations" title="Choose your Vietnam city" />
        <div className="grid gap-6 lg:grid-cols-2">
          {destinations.map((d) => (
            <div key={d.city} className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5">
              <div className="relative">
                <HotelImage gradient={d.heroColor} emoji={d.emoji} rounded="" className="h-44 w-full" label={d.city} />
                <div className="absolute right-4 top-4">
                  {d.available ? (
                    <span className="pill bg-brand-600 text-white">● Live now</span>
                  ) : (
                    <span className="pill bg-white/90 text-ink-800">Coming soon</span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-2xl font-extrabold text-ink-900">{d.city}</h3>
                  {d.available && <span className="text-sm font-semibold text-brand-700">{d.hotelCount} hotels</span>}
                </div>
                <p className="mt-2 text-sm text-ink-700/80">{d.shortDescription}</p>

                <div className="mt-4 space-y-2 text-sm">
                  <p><span className="font-semibold text-ink-900">Best for:</span> <span className="text-ink-700/80">{d.bestFor.join(', ')}</span></p>
                  <p><span className="font-semibold text-ink-900">Recommended traveler:</span> <span className="text-ink-700/80">{d.recommendedTraveler}</span></p>
                </div>

                <div className="mt-5">
                  {d.available ? (
                    <Button to="/destinations/da-nang" size="md">Explore hotels →</Button>
                  ) : (
                    <button disabled className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-sand-100 px-5 py-2.5 text-sm font-semibold text-ink-700/50">
                      Explore hotels (coming soon)
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Travel style guide */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow="By travel style" title="Vietnam hotels by purpose" subtitle="Start from how you travel, and we’ll point you to what matters in a hotel." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {travelStyles.map((t) => (
            <div key={t.style} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
              <div className="text-2xl">{t.emoji}</div>
              <h3 className="mt-2 font-bold text-ink-900">{t.style}</h3>
              <p className="mt-1.5 text-sm text-ink-700/80">{t.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.lookFor.map((l) => (
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
            <h2 className="text-2xl font-extrabold text-ink-900">Why direct booking can be useful</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-700/90">
              {[
                ['🏷️', 'Hotel official benefits', 'Free breakfast, upgrades, and best-rate guarantees are often direct-only.'],
                ['💬', 'Better communication with the hotel', 'You deal with the hotel directly for requests and changes.'],
                ['⬆️', 'Potential room upgrades or perks', 'Direct guests are easier for hotels to recognize and reward.'],
                ['📝', 'Clearer special requests', 'Connecting rooms, early check-in, or dietary needs handled first-hand.'],
              ].map(([icon, t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="font-semibold text-ink-900">{t}</p>
                    <p className="text-ink-700/80">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5">
            <h2 className="text-2xl font-extrabold text-ink-900">But always compare carefully</h2>
            <p className="mt-3 text-sm text-ink-700/80">
              Direct booking is not automatically cheaper or better. Before you book, check:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ink-700/90">
              {['The total price including taxes and fees', 'The cancellation policy and deadline', 'Whether breakfast is included', 'The deposit and refund terms'].map((c) => (
                <li key={c} className="flex items-start gap-2"><span className="mt-0.5 text-amber-500">•</span> {c}</li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-sand-50 px-4 py-3 text-xs text-ink-700/70 ring-1 ring-black/5">
              StayEasy stays neutral: we explain the trade-offs so you can decide. OTAs are convenient too — the
              right choice depends on your trip.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="container-page my-16">
        <div className="rounded-3xl bg-ink-900 p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Ready to start planning?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">Da Nang is live with 12 sample hotels chosen by travel style and official booking benefits.</p>
          <div className="mt-6">
            <Button to="/destinations/da-nang" variant="primary" size="lg">Start with Da Nang hotels</Button>
          </div>
        </div>
      </section>
    </>
  )
}
