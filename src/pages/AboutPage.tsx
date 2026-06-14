import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'
import { useT } from '../i18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function AboutPage() {
  const t = useT()
  useDocumentMeta(t.about.metaTitle, t.about.metaDesc)
  return (
    <>
      <section className="bg-gradient-to-br from-ink-900 to-brand-800 py-14 text-white">
        <div className="container-page">
          <nav className="mb-3 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link> <span className="px-1">/</span> About
          </nav>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">{t.about.heroTitle}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            {t.about.heroSubtitle}
          </p>
        </div>
      </section>

      <section className="container-page mt-12">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5">
            <h2 className="text-2xl font-extrabold text-ink-900">{t.about.positionTitle}</h2>
            <p className="mt-3 text-sm text-ink-700/80">
              {t.about.positionText}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ink-700/90">
              {t.about.position.map((x) => (
                <li key={x} className="flex gap-2"><span className="text-brand-600">✓</span> {x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5">
            <h2 className="text-2xl font-extrabold text-ink-900">{t.about.moneyTitle}</h2>
            <p className="mt-3 text-sm text-ink-700/80">{t.about.moneyIntro}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-700/90">
              {t.about.money.map((x) => (
                <li key={x} className="flex gap-2"><span className="text-brand-600">•</span> {x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page my-16">
        <SectionHeading eyebrow={t.about.roadmapEyebrow} title={t.about.roadmapTitle} align="center" />
        <div className="rounded-3xl bg-ink-900 p-8 text-center text-white sm:p-12">
          <p className="mx-auto max-w-xl text-white/85">
            {t.about.roadmapText}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button to="/destinations/da-nang" variant="primary" size="lg">{t.about.roadmapBtn1}</Button>
            <Button to="/partners" variant="white" size="lg">{t.about.roadmapBtn2}</Button>
          </div>
        </div>
      </section>
    </>
  )
}
