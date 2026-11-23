import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/SectionHeading'
import { useLang, useT } from '../i18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { trackEvent } from '../lib/analytics'
import { planInterest } from '../lib/planInterest'
import { PLAN_IDS, plansStrings, type PlanId } from '../lib/plansI18n'

/**
 * Traveler subscription plans — PROTOTYPE. Explains the model and lets a visitor
 * register interest; there is no billing, no price and no account behind it.
 * The route exists but is not linked from the nav unless VITE_ENABLE_BM is on,
 * and it is left out of the sitemap, like every other revenue surface.
 */
export default function PlansPage() {
  const { lang } = useLang()
  const t = useT()
  const s = plansStrings[lang]
  useDocumentMeta(s.metaTitle, s.metaDesc)
  const [chosen, setChosen] = useState<PlanId | null>(() => planInterest.get())

  const toggle = (id: PlanId) => {
    const next = chosen === id ? null : id
    planInterest.set(next)
    setChosen(next)
    if (next) trackEvent('plan_interest', { plan: next, lang })
  }

  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 to-ink-900 py-14 text-white">
        <div className="container-page">
          <nav className="mb-3 text-sm text-white/60">
            <Link to="/" className="hover:text-white">{t.common.home}</Link> <span className="px-1">/</span> {s.nav}
          </nav>
          <span className="pill bg-white/15 text-white ring-1 ring-white/25">{s.eyebrow}</span>
          <h1 className="mt-4 max-w-3xl whitespace-pre-line text-4xl font-extrabold tracking-tight sm:text-5xl">{s.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{s.subtitle}</p>
        </div>
      </section>

      {/* Prototype notice — no billing exists yet. */}
      <section className="container-page mt-8">
        <div role="note" className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
          <p className="text-sm font-bold text-amber-900">{s.previewTitle}</p>
          <p className="mt-0.5 text-sm text-amber-900/80">{s.previewText}</p>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page mt-12">
        <SectionHeading title={s.explainTitle} />
        <div className="grid gap-4 md:grid-cols-3">
          {s.explain.map((e, i) => (
            <div key={e.t} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{i + 1}</span>
              <h3 className="mt-3 text-lg font-extrabold text-ink-900">{e.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700/90">{e.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The three plans */}
      <section className="container-page mt-16">
        <SectionHeading title={s.plansTitle} />
        <div className="grid gap-5 lg:grid-cols-3">
          {PLAN_IDS.map((id) => {
            const p = s.plans[id]
            const on = chosen === id
            return (
              <div key={id} className={`flex flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ${on ? 'ring-2 ring-brand-500' : 'ring-black/5'}`}>
                <p className="text-sm font-semibold text-brand-700">{p.kicker}</p>
                <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">{p.name}</h3>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-ink-700/50">{s.forWho}</p>
                <p className="mt-0.5 text-sm text-ink-700/90">{p.forWho}</p>
                <p className="mt-4 rounded-lg bg-sand-100 px-3 py-2 text-xs font-semibold text-ink-700/80">{s.priceTbd}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-800">
                      <span aria-hidden className="mt-0.5 text-brand-600">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  aria-pressed={on}
                  className={`mt-6 rounded-full px-5 py-3 text-sm font-bold transition-colors ${on ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200' : 'bg-ink-900 text-white hover:bg-ink-800'}`}
                >
                  {on ? `✓ ${s.interestDone}` : s.interest}
                </button>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-ink-700/60">{s.interestNote}</p>
      </section>

      {/* Comparison */}
      <section className="container-page mt-16">
        <SectionHeading title={s.compareTitle} />
        <div className="overflow-x-auto rounded-2xl bg-white shadow-card ring-1 ring-black/5">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-sand-50">
                <th className="p-4 font-bold text-ink-900">{s.colFeature}</th>
                {PLAN_IDS.map((id) => (
                  <th key={id} className="p-4 font-bold text-brand-700">{s.plans[id].name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows.map((r, i) => (
                <tr key={r.label} className={i % 2 ? 'bg-sand-50/40' : ''}>
                  <td className="p-4 font-semibold text-ink-900">{r.label}</td>
                  {r.values.map((v, j) => (
                    <td key={j} className="p-4 text-ink-700/90">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page mt-16">
        <SectionHeading title={s.faqTitle} />
        <div className="mx-auto max-w-3xl divide-y divide-black/5 rounded-2xl bg-white shadow-card ring-1 ring-black/5">
          {s.faq.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink-900">
                {f.q}
                <span aria-hidden className="text-ink-700/50 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-ink-700/90">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Free start */}
      <section className="container-page my-16">
        <div className="rounded-3xl bg-ink-900 p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{s.endTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">{s.endText}</p>
          <Link to="/signin?next=/plans" className="mt-6 inline-block rounded-full bg-brand-600 px-6 py-3 text-base font-bold text-white hover:bg-brand-700">
            {s.endBtn}
          </Link>
        </div>
      </section>
    </>
  )
}
