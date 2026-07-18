import { Link } from 'react-router-dom'
import { guides } from '../data/guides'
import type { GuideCategory } from '../data/guides'
import { HotelImage } from '../components/HotelImage'
import { useLang, useT } from '../i18n'
import { guideStrings } from '../lib/guideI18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const CATEGORIES: GuideCategory[] = ['Direct booking', 'City guide', 'Planning']

export default function GuidesIndexPage() {
  const { lang } = useLang()
  const t = useT()
  const s = guideStrings[lang]
  useDocumentMeta(
    'Travel & booking guides — StayEasy',
    'Practical, original guides to booking hotels directly and traveling Vietnam — how to book direct, what to check before you pay, and city-by-city advice.',
  )

  return (
    <>
      <section className="bg-gradient-to-br from-ink-900 to-brand-800 py-14 text-white">
        <div className="container-page">
          <nav className="mb-4 text-sm text-white/60">
            <Link to="/" className="hover:text-white">{t.common.home}</Link> <span className="px-1">/</span> {s.nav}
          </nav>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">{s.indexTitle}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{s.indexSubtitle}</p>
        </div>
      </section>

      {CATEGORIES.map((category) => {
        const items = guides.filter((g) => g.category === category)
        if (!items.length) return null
        return (
          <section key={category} className="container-page mt-12">
            <h2 className="text-2xl font-extrabold text-ink-900">{s.category[category]}</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((g) => (
                <Link
                  key={g.slug}
                  to={`/guides/${g.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <HotelImage src={g.heroImage} gradient={g.heroColor} emoji={g.emoji} rounded="" className="h-40 w-full" label={g.title} />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{s.category[g.category]} · {g.readMins} {s.minRead}</p>
                    <h3 className="mt-1 font-bold leading-snug text-ink-900 group-hover:text-brand-700">{g.title}</h3>
                    <p className="mt-2 text-sm text-ink-700/80">{g.excerpt}</p>
                    <span className="mt-auto pt-3 text-sm font-semibold text-brand-700">{s.readGuide} →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}

      <section className="container-page my-16">
        <div className="rounded-3xl bg-brand-50 p-8 text-center ring-1 ring-brand-100 sm:p-12">
          <h2 className="text-2xl font-extrabold text-ink-900">{s.readyTitle}</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-700/80">{s.readySubtitle}</p>
          <Link to="/destinations/da-nang" className="mt-6 inline-flex rounded-full bg-brand-600 px-7 py-3.5 text-base font-bold text-white hover:bg-brand-700">
            {s.browseBtn} →
          </Link>
        </div>
      </section>
    </>
  )
}
