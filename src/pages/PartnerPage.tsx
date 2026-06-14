import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'
import { useT } from '../i18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function PartnerPage() {
  const t = useT()
  useDocumentMeta(t.partner.metaTitle, t.partner.metaDesc)
  const [submitted, setSubmitted] = useState(false)

  const products = [
    { icon: '🆓', name: t.partner.products.p1n, desc: t.partner.products.p1d, tag: t.partner.products.p1t },
    { icon: '📄', name: t.partner.products.p2n, desc: t.partner.products.p2d, tag: t.partner.products.p2t },
    { icon: '✨', name: t.partner.products.p3n, desc: t.partner.products.p3d, tag: t.partner.products.p3t },
    { icon: '⭐', name: t.partner.products.p4n, desc: t.partner.products.p4d, tag: t.partner.products.p4t },
    { icon: '📰', name: t.partner.products.p5n, desc: t.partner.products.p5d, tag: t.partner.products.p5t },
    { icon: '🖱️', name: t.partner.products.p6n, desc: t.partner.products.p6d, tag: t.partner.products.p6t },
  ]

  const reportMetrics = [
    { label: t.partner.report.views, value: '18,420' },
    { label: t.partner.report.clicks, value: '3,160' },
    { label: t.partner.report.ctr, value: '17.2%' },
    { label: t.partner.report.market, value: '🇰🇷 Korea' },
    { label: t.partner.report.traveler, value: 'Family' },
  ]

  const plans = [
    { name: t.partner.plans.starter, sub: t.partner.plans.starterSub, features: t.partner.plans.starterF },
    { name: t.partner.plans.growth, sub: t.partner.plans.growthSub, features: t.partner.plans.growthF, highlight: true },
    { name: t.partner.plans.campaign, sub: t.partner.plans.campaignSub, features: t.partner.plans.campaignF },
  ]

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-brand-800 py-16 text-white">
        <div className="container-page">
          <nav className="mb-3 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link> <span className="px-1">/</span> Partners
          </nav>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="pill bg-brand-500/25 text-brand-100 ring-1 ring-brand-400/30">{t.partner.heroBadge}</span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">{t.partner.heroTitle}</h1>
              <p className="mt-4 max-w-xl text-lg text-white/85">
                {t.partner.heroSubtitle}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="#contact" variant="primary" size="lg">{t.partner.heroCta1}</Button>
                <Button to="/dashboard" variant="white" size="lg">{t.partner.heroCta2}</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: '0%', v: t.partner.stat1 },
                { k: '100%', v: t.partner.stat2 },
                { k: t.partner.stat3v, v: t.partner.stat3 },
                { k: t.partner.stat4v, v: t.partner.stat4 },
              ].map((s) => (
                <div key={s.v} className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                  <div className="text-3xl font-extrabold text-brand-100">{s.k}</div>
                  <div className="mt-1 text-sm text-white/75">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why hotels need StayEasy */}
      <section className="container-page mt-14">
        <SectionHeading eyebrow={t.partner.whyEyebrow} title={t.partner.whyTitle} align="center" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '💸', t: t.partner.why1t, d: t.partner.why1d },
            { icon: '📚', t: t.partner.why2t, d: t.partner.why2d },
            { icon: '🌐', t: t.partner.why3t, d: t.partner.why3d },
            { icon: '🏷️', t: t.partner.why4t, d: t.partner.why4d },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
              <div className="text-2xl">{c.icon}</div>
              <h3 className="mt-2 font-bold text-ink-900">{c.t}</h3>
              <p className="mt-1.5 text-sm text-ink-700/80">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Products */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow={t.partner.productsEyebrow} title={t.partner.productsTitle} subtitle={t.partner.productsSubtitle} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.name} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{p.icon}</span>
                <span className="pill bg-brand-50 text-brand-700">{p.tag}</span>
              </div>
              <h3 className="mt-3 font-bold text-ink-900">{p.name}</h3>
              <p className="mt-1.5 text-sm text-ink-700/80">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. What hotels get */}
      <section className="container-page mt-16">
        <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5 sm:p-10">
          <SectionHeading eyebrow={t.partner.getEyebrow} title={t.partner.getTitle} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {t.partner.get.map((x) => (
              <div key={x} className="flex items-center gap-2.5 rounded-xl bg-sand-50 px-4 py-3 ring-1 ring-black/5">
                <span className="text-brand-600">✓</span> <span className="text-sm font-medium text-ink-800">{x}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Example report preview */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow={t.partner.reportEyebrow} title={t.partner.reportTitle} subtitle={t.partner.reportSubtitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {reportMetrics.map((m) => (
            <div key={m.label} className="rounded-2xl bg-white p-5 text-center shadow-card ring-1 ring-black/5">
              <div className="text-2xl font-extrabold text-ink-900">{m.value}</div>
              <div className="mt-1 text-xs text-ink-700/70">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link to="/dashboard" className="text-sm font-semibold text-brand-700 hover:underline">{t.partner.reportLink} →</Link>
        </div>
      </section>

      {/* 6. Pricing placeholder */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow={t.partner.plansEyebrow} title={t.partner.plansTitle} align="center" />
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-3xl p-6 ring-1 ${p.highlight ? 'bg-ink-900 text-white ring-ink-900 shadow-card-hover' : 'bg-white text-ink-900 ring-black/5 shadow-card'}`}>
              {p.highlight && <span className="absolute -top-3 left-6 pill bg-brand-500 text-white">★ {t.partner.plans.popular}</span>}
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className={`mt-1 text-sm ${p.highlight ? 'text-white/70' : 'text-ink-700/70'}`}>{p.sub}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-brand-500">✓</span>
                    <span className={p.highlight ? 'text-white/85' : 'text-ink-700/85'}>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className={`mt-6 block rounded-full px-5 py-2.5 text-center text-sm font-semibold ${p.highlight ? 'bg-brand-500 text-white hover:bg-brand-400' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
                {t.partner.plans.contact}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-ink-700/60">{t.partner.plansNote}</p>
      </section>

      {/* 7. Contact form */}
      <section id="contact" className="container-page my-16">
        <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5">
          <div className="grid lg:grid-cols-2">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white sm:p-10">
              <h2 className="text-2xl font-extrabold">{t.partner.formTitle}</h2>
              <p className="mt-3 text-white/85">{t.partner.formText}</p>
              <ul className="mt-6 space-y-3 text-sm text-white/85">
                <li className="flex gap-2">✓ {t.partner.formP1}</li>
                <li className="flex gap-2">✓ {t.partner.formP2}</li>
                <li className="flex gap-2">✓ {t.partner.formP3}</li>
              </ul>
            </div>
            <form
              className="p-8 sm:p-10"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
            >
              {submitted ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <div className="text-4xl">🎉</div>
                    <h3 className="mt-2 text-xl font-bold text-ink-900">{t.partner.successTitle}</h3>
                    <p className="mt-1 text-sm text-ink-700/70">{t.partner.successText}</p>
                    <button onClick={() => setSubmitted(false)} className="mt-4 text-sm font-semibold text-brand-700 hover:underline">{t.partner.submitAnother}</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { id: 'hotel', label: t.partner.fHotel, type: 'text', ph: 'e.g. An Bang Beach Resort' },
                    { id: 'city', label: t.partner.fCity, type: 'text', ph: 'Da Nang' },
                    { id: 'person', label: t.partner.fPerson, type: 'text', ph: 'Your name' },
                    { id: 'email', label: t.partner.fEmail, type: 'email', ph: 'you@hotel.com' },
                    { id: 'website', label: t.partner.fWebsite, type: 'url', ph: 'https://your-hotel.com' },
                  ].map((f) => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="text-sm font-medium text-ink-800">{f.label}</label>
                      <input id={f.id} type={f.type} required placeholder={f.ph} className="mt-1 w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="message" className="text-sm font-medium text-ink-800">{t.partner.fMessage}</label>
                    <textarea id="message" rows={3} placeholder={t.partner.fMessagePh} className="mt-1 w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
                  </div>
                  <button type="submit" className="w-full rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700">{t.partner.submit}</button>
                  <p className="text-center text-xs text-ink-700/50">{t.partner.formNote}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
