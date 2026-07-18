import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'
import { useT } from '../i18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function BookingGuidePage() {
  const t = useT()
  useDocumentMeta(t.guide.metaTitle, t.guide.metaDesc)

  const f = t.guide.factors
  const comparison: { factor: string; direct: string; ota: string }[] = [
    { factor: f.price, direct: f.priceDirect, ota: f.priceOta },
    { factor: f.cancel, direct: f.cancelDirect, ota: f.cancelOta },
    { factor: f.loyalty, direct: f.loyaltyDirect, ota: f.loyaltyOta },
    { factor: f.requests, direct: f.requestsDirect, ota: f.requestsOta },
    { factor: f.support, direct: f.supportDirect, ota: f.supportOta },
    { factor: f.payment, direct: f.paymentDirect, ota: f.paymentOta },
    { factor: f.upgrade, direct: f.upgradeDirect, ota: f.upgradeOta },
  ]

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-ink-900 py-14 text-white">
        <div className="container-page">
          <nav className="mb-3 text-sm text-white/60">
            <Link to="/" className="hover:text-white">{t.common.home}</Link> <span className="px-1">/</span> {t.nav.guide}
          </nav>
          <span className="pill bg-white/15 text-white ring-1 ring-white/25">{t.guide.heroBadge}</span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">{t.guide.heroTitle}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            {t.guide.heroSubtitle}
          </p>
        </div>
      </section>

      {/* 2. Comparison table */}
      <section className="container-page mt-12">
        <SectionHeading eyebrow={t.guide.cmpEyebrow} title={t.guide.cmpTitle} subtitle={t.guide.cmpSubtitle} />
        <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-sand-50">
                <th className="p-4 font-bold text-ink-900">{t.guide.colFactor}</th>
                <th className="p-4 font-bold text-brand-700">{t.guide.colDirect}</th>
                <th className="p-4 font-bold text-ink-700">{t.guide.colOta}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={row.factor} className={i % 2 ? 'bg-sand-50/40' : ''}>
                  <td className="p-4 font-semibold text-ink-900">{row.factor}</td>
                  <td className="p-4 text-ink-700/90">{row.direct}</td>
                  <td className="p-4 text-ink-700/80">{row.ota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-700/60">{t.guide.cmpNote}</p>
      </section>

      {/* 3. When direct booking is better */}
      <section className="container-page mt-16">
        <div className="rounded-3xl bg-brand-50 p-8 ring-1 ring-brand-100">
          <h2 className="text-2xl font-extrabold text-ink-900">{t.guide.whenDirectTitle}</h2>
          <ul className="mt-4 grid gap-2 text-sm text-ink-700/90 sm:grid-cols-2">
            {t.guide.whenDirect.map((x) => (
              <li key={x} className="flex items-start gap-2"><span className="mt-0.5 text-brand-600">✓</span> {x}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Direct booking checklist */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow={t.guide.checklistEyebrow} title={t.guide.checklistTitle} align="center" />
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
          <ul className="space-y-2.5">
            {t.guide.checklist.map((c) => (
              <li key={c} className="flex items-start gap-3 rounded-xl bg-sand-50 px-4 py-3 ring-1 ring-black/5">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 border-brand-300 text-xs text-brand-600">☑</span>
                <span className="text-sm text-ink-800">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="container-page my-16">
        <div className="rounded-3xl bg-ink-900 p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{t.guide.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">{t.guide.ctaText}</p>
          <div className="mt-6">
            <Button to="/destinations/da-nang" variant="primary" size="lg">{t.guide.ctaBtn}</Button>
          </div>
        </div>
      </section>
    </>
  )
}
