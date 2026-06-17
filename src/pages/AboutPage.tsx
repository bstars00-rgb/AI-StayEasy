import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'
import { useT, useLang } from '../i18n'
import { scoreStrings } from '../lib/scoreI18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function AboutPage() {
  const t = useT()
  const { lang } = useLang()
  const sc = scoreStrings[lang]
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

      {/* The StayEasy Score — our guide-style rating */}
      <section className="container-page mt-12">
        <div className="rounded-3xl bg-gradient-to-br from-brand-50 to-sand-50 p-8 ring-1 ring-brand-100 sm:p-10">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-600 text-2xl text-white">✦</span>
            <h2 className="text-2xl font-extrabold text-ink-900">{sc.explainerTitle}</h2>
          </div>
          <p className="mt-4 max-w-3xl text-ink-700/85">{sc.explainerText}</p>
          <p className="mt-3 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-brand-200">
            🏨 {sc.localFocus}
          </p>
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
