import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useLang } from '../i18n'
import { guestAuth, useGuest } from '../lib/guestAuth'
import { promptGoogle, googleEnabled } from '../lib/googleAuth'
import { memberStrings, fill } from '../lib/memberI18n'
import { plansStrings, PLAN_IDS, PERIOD_IDS, type PlanId, type PeriodId } from '../lib/plansI18n'
import { Logo } from '../components/Logo'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const inputCls = 'mt-1 w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3.1 0 5.9 1.2 8 3.1l5.7-5.7A20 20 0 1 0 24 44c11 0 20-8 20-20 0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C39.8 36 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  )
}

/** Only follow same-site paths after signing up (no open redirect through ?next=). */
export const safeNext = (v: string | null): string => (v && v.startsWith('/') && !v.startsWith('//') ? v : '/account')

/** The plan a visitor was in the middle of choosing, carried inside ?next=/plans?plan=..&period=.. */
export function pendingPlan(next: string): { plan: PlanId; period: PeriodId } | null {
  try {
    const q = new URL(next, 'http://x').searchParams
    const plan = q.get('plan') as PlanId
    const period = q.get('period') as PeriodId
    return PLAN_IDS.includes(plan) && PERIOD_IDS.includes(period) ? { plan, period } : null
  } catch {
    return null
  }
}

/**
 * Sign-up: Google or email, with a required consent to the terms and privacy
 * policy. Demo storage only (this browser) — the page says so. Reached from the
 * plans page before a subscription request, and from the sign-in page.
 */
export default function SignUpPage() {
  const { lang } = useLang()
  const m = memberStrings[lang].signup
  const ps = plansStrings[lang]
  useDocumentMeta(`${m.title} — StayEasy`, m.subtitle)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const pending = pendingPlan(next)
  const guest = useGuest()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [googleNote, setGoogleNote] = useState(false)

  // Signed up (or already signed in) → continue where the visitor was headed.
  useEffect(() => {
    if (guest) navigate(next, { replace: true })
  }, [guest, next, navigate])

  const needConsent = () => {
    if (agree) return false
    setError(m.errConsent)
    return true
  }

  const withGoogle = () => {
    if (needConsent()) return
    if (!googleEnabled) return setGoogleNote(true)
    promptGoogle((p) => guestAuth.signIn(p))
  }

  const withEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError(m.errEmail)
    if (needConsent()) return
    guestAuth.signIn({ email, name })
  }

  const consent = m.consent.split(/(\{terms\}|\{privacy\})/).map((part, i) =>
    part === '{terms}' ? (
      <Link key={i} to="/terms" target="_blank" className="font-semibold text-brand-700 underline">{m.terms}</Link>
    ) : part === '{privacy}' ? (
      <Link key={i} to="/privacy" target="_blank" className="font-semibold text-brand-700 underline">{m.privacy}</Link>
    ) : (
      <span key={i}>{part}</span>
    ),
  )

  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center"><Logo size={40} /></div>
        <div className="rounded-3xl bg-white p-7 shadow-card ring-1 ring-black/5">
          <h1 className="text-xl font-extrabold text-ink-900">{m.title}</h1>
          <p className="mt-0.5 text-sm text-ink-700/70">{m.subtitle}</p>

          {pending && (
            <p role="note" className="mt-4 rounded-xl bg-brand-50 px-3 py-2.5 text-sm font-medium text-brand-800 ring-1 ring-brand-100">
              {fill(m.fromPlan, { plan: ps.plans[pending.plan].name, period: ps.periods[pending.period].label })}
            </p>
          )}

          <button
            type="button"
            onClick={withGoogle}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-ink-800 hover:bg-sand-50"
          >
            <GoogleG /> {m.google}
          </button>
          {googleNote && <p className="mt-2 text-xs text-amber-700">{m.googleNotReady}</p>}

          <div className="my-4 flex items-center gap-3 text-xs text-ink-600/50">
            <span className="h-px flex-1 bg-black/10" /> {m.or} <span className="h-px flex-1 bg-black/10" />
          </div>

          <form onSubmit={withEmail} className="space-y-3" noValidate>
            <label className="block text-xs font-semibold text-ink-700">
              {m.nameLabel}
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={m.namePh} autoComplete="name" className={inputCls} />
            </label>
            <label className="block text-xs font-semibold text-ink-700">
              {m.emailLabel}
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder={m.emailPh}
                autoComplete="email"
                className={inputCls}
              />
            </label>
            <label className="flex items-start gap-2 text-xs text-ink-700">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => { setAgree(e.target.checked); setError('') }}
                className="mt-0.5 h-4 w-4 rounded border-black/20 accent-brand-600"
              />
              <span>{consent}</span>
            </label>
            {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
            <button type="submit" className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">{m.submit}</button>
          </form>

          <p className="mt-3 text-center text-xs text-ink-600/60">{m.stores}</p>
          <p className="mt-1 text-center text-xs text-ink-600/55">🧪 {m.demoNote}</p>
        </div>
        <p className="mt-4 text-center text-sm text-ink-700/80">
          {m.haveAccount}{' '}
          <Link to={`/signin?next=${encodeURIComponent(next)}`} className="font-semibold text-brand-700 hover:underline">{m.signInLink}</Link>
        </p>
      </div>
    </div>
  )
}
