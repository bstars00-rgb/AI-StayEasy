import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { partnerAccounts } from '../lib/partnerAccounts'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const inputCls = 'w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100'
const labelCls = 'text-xs font-semibold uppercase tracking-wide text-ink-600/70'

export default function PartnerResetPage() {
  useDocumentMeta('Reset password — StayEasy partners', 'Reset your StayEasy partner account password.')
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [msg, setMsg] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw.length < 6) return setMsg({ kind: 'error', text: 'Password must be at least 6 characters.' })
    if (pw !== pw2) return setMsg({ kind: 'error', text: 'Passwords don’t match.' })
    const ok = partnerAccounts.resetPassword(email.trim(), pw)
    if (!ok) return setMsg({ kind: 'error', text: 'No account found for that email.' })
    setMsg({ kind: 'ok', text: 'Password updated — redirecting to sign in…' })
    setTimeout(() => navigate('/partner/login'), 1200)
  }

  return (
    <div className="grid min-h-screen place-items-center bg-sand-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo size={40} /></div>
        <form onSubmit={submit} className="rounded-3xl bg-white p-7 shadow-card ring-1 ring-black/5">
          <h1 className="text-xl font-extrabold text-ink-900">Reset password</h1>
          <p className="mt-1 text-sm text-ink-700/70">Enter your account email and choose a new password.</p>

          {msg && (
            <p className={`mt-4 rounded-xl px-4 py-3 text-sm ring-1 ${msg.kind === 'error' ? 'bg-rose-50 text-rose-700 ring-rose-200' : 'bg-brand-50 text-brand-700 ring-brand-200'}`}>{msg.text}</p>
          )}

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className={labelCls}>Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="manager@hotel.example" className={`mt-1 ${inputCls}`} />
            </label>
            <label className="block">
              <span className={labelCls}>New password</span>
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required placeholder="At least 6 characters" className={`mt-1 ${inputCls}`} />
            </label>
            <label className="block">
              <span className={labelCls}>Confirm new password</span>
              <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} required className={`mt-1 ${inputCls}`} />
            </label>
          </div>

          <button type="submit" className="mt-6 w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">Update password</button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link to="/partner/login" className="text-brand-700 hover:underline">← Back to sign in</Link>
        </div>
        <p className="mt-3 text-center text-xs text-ink-600/55">🧪 Demo — a real build emails a secure reset link instead.</p>
      </div>
    </div>
  )
}
