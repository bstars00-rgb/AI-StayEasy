import { Link, useParams } from 'react-router-dom'
import { getGuide, guides } from '../data/guides'
import { HotelImage } from '../components/HotelImage'
import { AdSlot } from '../components/AdSlot'
import { JsonLd } from '../components/JsonLd'
import Button from '../components/Button'
import { useLang } from '../i18n'
import { guideStrings } from '../lib/guideI18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function GuideArticlePage() {
  const { slug } = useParams()
  const { lang } = useLang()
  const s = guideStrings[lang]
  const guide = slug ? getGuide(slug) : undefined

  useDocumentMeta(
    guide ? `${guide.title} — StayEasy` : 'Guide — StayEasy',
    guide ? guide.excerpt : 'StayEasy travel and booking guides.',
  )

  if (!guide) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold text-ink-900">{s.notFound}</h1>
        <p className="mt-2 text-ink-700/70">{s.notFoundText}</p>
        <Button to="/guides" className="mt-6">{s.allGuides}</Button>
      </div>
    )
  }

  const related = guides.filter((g) => g.category === guide.category && g.slug !== guide.slug).slice(0, 3)

  return (
    <article>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guide.title,
          description: guide.excerpt,
          image: guide.heroImage,
          datePublished: guide.updated,
          dateModified: guide.updated,
          author: { '@type': 'Organization', name: 'StayEasy' },
          publisher: { '@type': 'Organization', name: 'StayEasy' },
          ...(guide.faqs && guide.faqs.length
            ? {
                mainEntity: guide.faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              }
            : {}),
        }}
      />
      <section className="container-page pt-6">
        <nav className="mb-4 text-sm text-ink-700/60">
          <Link to="/" className="hover:text-brand-700">Home</Link> <span className="px-1">/</span>
          <Link to="/guides" className="hover:text-brand-700"> {s.nav}</Link> <span className="px-1">/</span>
          <span className="text-ink-800"> {s.category[guide.category]}</span>
        </nav>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{s.category[guide.category]} · {guide.readMins} {s.minRead} · {s.updated} {guide.updated}</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{guide.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-ink-700/85">{guide.excerpt}</p>
        {s.englishNote && <p className="mt-2 text-xs text-ink-600/60">🌐 {s.englishNote}</p>}
      </section>

      <section className="container-page mt-6">
        <HotelImage src={guide.heroImage} gradient={guide.heroColor} emoji={guide.emoji} className="h-64 w-full sm:h-80" label={guide.title} />
      </section>

      <section className="container-page mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="max-w-2xl">
          <p className="text-lg leading-relaxed text-ink-800">{guide.intro}</p>

          {guide.sections.map((s, i) => (
            <div key={s.heading}>
              <h2 className="mt-8 text-2xl font-extrabold text-ink-900">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-ink-800">{p}</p>
              ))}
              {s.bullets && (
                <ul className="mt-3 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-ink-800">
                      <span className="mt-1 text-brand-600">•</span> <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {/* Ad between content sections — clearly separated from editorial content. */}
              {i === 0 && <AdSlot slot="guide-inline-1" />}
            </div>
          ))}

          {guide.faqs && guide.faqs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-extrabold text-ink-900">{s.faqTitle}</h2>
              <div className="mt-4 space-y-3">
                {guide.faqs.map((f) => (
                  <div key={f.q} className="rounded-xl bg-sand-50 p-4 ring-1 ring-black/5">
                    <p className="font-bold text-ink-900">{f.q}</p>
                    <p className="mt-1 text-ink-700/85">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 rounded-2xl bg-brand-50 p-6 ring-1 ring-brand-100">
            <p className="font-bold text-ink-900">{s.readyTitle}</p>
            <p className="mt-1 text-sm text-ink-700/80">{s.readySubtitle}</p>
            <Button to="/destinations/da-nang" className="mt-4">{s.browseBtn} →</Button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <AdSlot slot="guide-sidebar" className="my-0" />
          {related.length > 0 && (
            <div className="mt-6 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
              <p className="text-sm font-bold text-ink-900">{s.related}</p>
              <ul className="mt-3 space-y-3">
                {related.map((g) => (
                  <li key={g.slug}>
                    <Link to={`/guides/${g.slug}`} className="block text-sm font-medium text-ink-800 hover:text-brand-700">
                      {g.emoji} {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link to="/guides" className="mt-4 block text-sm font-semibold text-brand-700 hover:underline">← {s.allGuides}</Link>
        </aside>
      </section>
    </article>
  )
}
