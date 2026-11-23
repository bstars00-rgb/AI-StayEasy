import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SectionHeading } from '../components/SectionHeading'
import { useLang, useT } from '../i18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { trackEvent } from '../lib/analytics'
import { useGuest } from '../lib/guestAuth'
import { subscription, useSubscription } from '../lib/subscription'
import { memberStrings } from '../lib/memberI18n'
import { PLAN_IDS, PERIOD_IDS, plansStrings, type PlanId, type PeriodId } from '../lib/plansI18n'

/**
 * Traveler subscription plans — PROTOTYPE. Explains the model and takes a
 * subscription REQUEST; there is no billing and no price behind it. Requesting
 * needs an account: signed-out visitors are sent to sign-up first and come back
 * here, where the request they were making is recorded and they land on My page.
 * The route is not linked from the nav unless VITE_ENABLE_BM is on, and it is
 * left out of the sitemap, like every other revenue surface.
 */
export default function PlansPage() {
  const { lang } = useLang()
  const t = useT()
  const s = plansStrings[lang]
  useDocumentMeta(s.metaTitle, s.metaDesc)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const guest = useGuest()
  const sub = useSubscription(guest?.email)
  const [period, setPeriod] = useState<PeriodId>(() => {
    const q = params.get('period') as PeriodId
    return PERIOD_IDS.includes(q) ? q : sub?.period ?? 'monthly'
  })

  const record = (email: string, plan: PlanId, per: PeriodId) => {
    subscription.request(email, plan, per)
    trackEvent('plan_interest', { plan, period: per, lang })
    navigate('/account?subscribed=1#subscription', { replace: true })
  }

  // Back from sign-up with a plan in the URL → record the request and go to My page.
  useEffect(() => {
    const plan = params.get('plan') as PlanId
    const per = params.get('period') as PeriodId
    if (guest && PLAN_IDS.includes(plan) && PERIOD_IDS.includes(per)) record(guest.email, plan, per)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guest?.email])

  const choose = (id: PlanId) => {
    if (guest) return record(guest.email, id, period)
    // Sign up first, then return here to finish the request.
    navigate(`/signup?next=${encodeURIComponent(`/plans?plan=${id}&period=${period}`)}`)
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

        {/* Billing period — same features in each; only the monthly cost order differs. */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-700/50">{s.periodTitle}</p>
          <div role="radiogroup" aria-label={s.periodTitle} className="mt-2 inline-flex rounded-full bg-white p-1 shadow-card ring-1 ring-black/5">
            {PERIOD_IDS.map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={period === p}
                onClick={() => setPeriod(p)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${period === p ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-sand-100'}`}
              >
                {s.periods[p].label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-700/60">{s.periodNote}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {PLAN_IDS.map((id) => {
            const p = s.plans[id]
            const current = sub?.plan === id && sub.period === period
            const samePlan = sub?.plan === id
            return (
              <div key={id} className={`flex flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ${samePlan ? 'ring-2 ring-brand-500' : 'ring-black/5'}`}>
                <p className="text-sm font-semibold text-brand-700">{p.kicker}</p>
                <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">{p.name}</h3>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-ink-700/50">{s.forWho}</p>
                <p className="mt-0.5 text-sm text-ink-700/90">{p.forWho}</p>
                <div className="mt-4 rounded-lg bg-sand-100 px-3 py-2 text-xs text-ink-700/80">
                  <p className="font-semibold">{s.periods[period].label} · {s.priceTbd}</p>
                  <p className="mt-0.5 text-ink-700/70">{s.periods[period].hint}</p>
                </div>
                <ul className="mt-4 flex-1 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-800">
                      <span aria-hidden className="mt-0.5 text-brand-600">✓</span> {f}
                    </li>
                  ))}
                </ul>
                {current ? (
                  <Link
                    to="/account#subscription"
                    className="mt-6 rounded-full bg-brand-50 px-5 py-3 text-center text-sm font-bold text-brand-700 ring-1 ring-brand-200"
                  >
                    ✓ {s.interestDone} · {memberStrings[lang].mypage.title}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => choose(id)}
                    className="mt-6 rounded-full bg-ink-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-ink-800"
                  >
                    {sub ? s.change : s.interest}
                  </button>
                )}
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

      {/* Free start — only for visitors without an account. */}
      {!guest && (
        <section className="container-page my-16">
          <div className="rounded-3xl bg-ink-900 p-8 text-center text-white sm:p-12">
            <h2 className="text-2xl font-extrabold sm:text-3xl">{s.endTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">{s.endText}</p>
            <Link to="/signup?next=/plans" className="mt-6 inline-block rounded-full bg-brand-600 px-6 py-3 text-base font-bold text-white hover:bg-brand-700">
              {s.endBtn}
            </Link>
          </div>
        </section>
      )}
      {guest && <div className="my-16" />}
    </>
  )
}
