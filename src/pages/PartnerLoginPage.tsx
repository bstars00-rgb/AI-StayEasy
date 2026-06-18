import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { partnerAuth } from '../lib/partnerAuth'
import { partnerAccounts } from '../lib/partnerAccounts'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const inputCls = 'w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100'
const labelCls = 'text-xs font-semibold uppercase tracking-wide text-ink-600/70'

export default function PartnerLoginPage() {
  useDocumentMeta('Hotel login — StayEasy partners', 'Sign in or create a partner account to manage your StayEasy listing.')
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hotelName, setHotelName] = useState('')
  const [city, setCity] = useState('')
  const [msg, setMsg] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null)

  const signIn = (e: React.FormEvent) => {
    e.preventDefault()
    const res = partnerAccounts.authenticate(email.trim(), password)
    if (!res.ok) {
      const text =
        res.reason === 'pending'
          ? 'Your account is awaiting admin approval.'
          : res.reason === 'rejected'
            ? 'This account was not approved. Please contact us.'
            : 'Invalid email or password.'
      setMsg({ kind: 'error', text })
      return
    }
    partnerAuth.login({ slug: res.account.hotelSlug ?? '', propertyName: res.account.hotelName, email: res.account.email })
    navigate('/partner')
  }

  const signUp = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setMsg({ kind: 'error', text: 'Password must be at least 6 characters.' })
      return
    }
    const account = partnerAccounts.register({
      email: email.trim(),
      password,
      hotelName: hotelName.trim(),
      city: city.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    })
    if (!account) {
      setMsg({ kind: 'error', text: 'An account with this email already exists.' })
      return
    }
    setMode('signin')
    setPassword('')
    setMsg({ kind: 'ok', text: 'Account created — it’s pending admin approval. We’ll email you once it’s approved.' })
  }

  const tab = (m: 'signin' | 'signup', label: string) => (
    <button
      type="button"
      onClick={() => { setMode(m); setMsg(null) }}
      className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        mode === m ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-700/70 hover:text-ink-900'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="grid min-h-screen place-items-center bg-sand-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo size={40} /></div>

        <div className="rounded-3xl bg-white p-7 shadow-card ring-1 ring-black/5">
          <div className="mb-5 flex gap-1 rounded-xl bg-sand-100 p-1">
            {tab('signin', 'Sign in')}
            {tab('signup', 'Create account')}
          </div>

          {msg && (
            <p className={`mb-4 rounded-xl px-4 py-3 text-sm ring-1 ${msg.kind === 'error' ? 'bg-rose-50 text-rose-700 ring-rose-200' : 'bg-brand-50 text-brand-700 ring-brand-200'}`}>
              {msg.text}
            </p>
          )}

          {mode === 'signin' ? (
            <form onSubmit={signIn} className="space-y-4">
              <label className="block">
                <span className={labelCls}>Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="manager@hotel.example" className={`mt-1 ${inputCls}`} />
              </label>
              <label className="block">
                <span className={labelCls}>Password</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={`mt-1 ${inputCls}`} />
              </label>
              <div className="text-right">
                <Link to="/partner/reset" className="text-xs font-semibold text-brand-700 hover:underline">Forgot password?</Link>
              </div>
              <button type="submit" className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">Sign in</button>
            </form>
          ) : (
            <form onSubmit={signUp} className="space-y-4">
              <label className="block">
                <span className={labelCls}>Hotel name</span>
                <input value={hotelName} onChange={(e) => setHotelName(e.target.value)} required placeholder="Riverside Pearl Hotel" className={`mt-1 ${inputCls}`} />
              </label>
              <label className="block">
                <span className={labelCls}>City</span>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Da Nang" className={`mt-1 ${inputCls}`} />
              </label>
              <label className="block">
                <span className={labelCls}>Email (your login ID)</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="manager@hotel.example" className={`mt-1 ${inputCls}`} />
              </label>
              <label className="block">
                <span className={labelCls}>Password</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="At least 6 characters" className={`mt-1 ${inputCls}`} />
              </label>
              <button type="submit" className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">Create account</button>
              <p className="text-center text-xs text-ink-600/60">New accounts are reviewed and approved by our team before sign-in.</p>
            </form>
          )}
        </div>

        <div className="mt-4 flex justify-between text-sm">
          <Link to="/" className="text-ink-700/70 hover:text-ink-900">← Back to site</Link>
          <Link to="/partners" className="text-brand-700 hover:underline">Why partner with us?</Link>
        </div>
        <p className="mt-3 text-center text-xs text-ink-600/55">🧪 Demo — accounts and approval are stored in your browser.</p>
      </div>
    </div>
  )
}
