import { Link } from 'react-router-dom'
import { guides } from '../data/guides'
import type { GuideCategory } from '../data/guides'
import { HotelImage } from '../components/HotelImage'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const CATEGORIES: GuideCategory[] = ['Direct booking', 'City guide', 'Planning']

export default function GuidesIndexPage() {
  useDocumentMeta(
    'Travel & booking guides — StayEasy',
    'Practical, original guides to booking hotels directly and traveling Vietnam — how to book direct, what to check before you pay, and city-by-city advice.',
  )

  return (
    <>
      <section className="bg-gradient-to-br from-ink-900 to-brand-800 py-14 text-white">
        <div className="container-page">
          <nav className="mb-4 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link> <span className="px-1">/</span> Guides
          </nav>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">Travel &amp; booking guides</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            Original, practical advice for booking hotels directly and planning a trip to Vietnam — written for travelers,
            not search engines.
          </p>
        </div>
      </section>

      {CATEGORIES.map((category) => {
        const items = guides.filter((g) => g.category === category)
        if (!items.length) return null
        return (
          <section key={category} className="container-page mt-12">
            <h2 className="text-2xl font-extrabold text-ink-900">{category}</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((g) => (
                <Link
                  key={g.slug}
                  to={`/guides/${g.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <HotelImage src={g.heroImage} gradient={g.heroColor} emoji={g.emoji} rounded="" className="h-40 w-full" label={g.title} />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{g.category} · {g.readMins} min read</p>
                    <h3 className="mt-1 font-bold leading-snug text-ink-900 group-hover:text-brand-700">{g.title}</h3>
                    <p className="mt-2 text-sm text-ink-700/80">{g.excerpt}</p>
                    <span className="mt-auto pt-3 text-sm font-semibold text-brand-700">Read guide →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}

      <section className="container-page my-16">
        <div className="rounded-3xl bg-brand-50 p-8 text-center ring-1 ring-brand-100 sm:p-12">
          <h2 className="text-2xl font-extrabold text-ink-900">Ready to choose a hotel?</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-700/80">Browse Da Nang hotels curated by travel style — then book direct on the hotel’s official website.</p>
          <Link to="/destinations/da-nang" className="mt-6 inline-flex rounded-full bg-brand-600 px-7 py-3.5 text-base font-bold text-white hover:bg-brand-700">
            Browse Da Nang hotels →
          </Link>
        </div>
      </section>
    </>
  )
}
