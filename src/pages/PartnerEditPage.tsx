import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { findInCatalogue } from '../data/mockRepo'
import { Logo } from '../components/Logo'
import { usePartnerSession } from '../lib/partnerAuth'
import { hotelEdits } from '../lib/hotelEdits'
import type { HotelPatch } from '../lib/hotelEdits'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const inputCls = 'w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100'
const lines = (s: string): string[] => s.split('\n').map((l) => l.trim()).filter(Boolean)

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">{label}</span>
      {hint && <span className="ml-2 text-xs text-ink-500/60">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  )
}

export default function PartnerEditPage() {
  useDocumentMeta('Edit listing — StayEasy partners', 'Update your StayEasy listing content.')
  const navigate = useNavigate()
  const session = usePartnerSession()
  const hotel = session ? findInCatalogue(session.slug) : undefined

  const [f, setF] = useState(() => ({
    shortDescription: hotel?.shortDescription ?? '',
    positioningLine: hotel?.positioningLine ?? '',
    mainReason: hotel?.mainReason ?? '',
    facilities: (hotel?.facilities ?? []).join('\n'),
    officialBenefits: (hotel?.officialBenefits ?? []).join('\n'),
    officialWebsiteUrl: hotel?.officialWebsiteUrl ?? '',
    imageUrl: hotel?.imageUrl ?? '',
    koreanFriendly: hotel?.koreanFriendly ?? false,
    voucherCode: hotel?.voucher?.code ?? '',
    voucherLabel: hotel?.voucher?.discountLabel ?? '',
    voucherTerms: hotel?.voucher?.terms ?? '',
    voucherValidUntil: hotel?.voucher?.validUntil ?? '',
  }))

  if (!session) return <Navigate to="/partner/login" replace />
  if (!hotel) return <Navigate to="/partner" replace />

  const set =
    <K extends keyof typeof f>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const t = e.target
      const v = t instanceof HTMLInputElement && t.type === 'checkbox' ? t.checked : t.value
      setF((prev) => ({ ...prev, [k]: v }))
    }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const patch: HotelPatch = {
      shortDescription: f.shortDescription.trim(),
      positioningLine: f.positioningLine.trim(),
      mainReason: f.mainReason.trim(),
      facilities: lines(f.facilities),
      officialBenefits: lines(f.officialBenefits),
      officialWebsiteUrl: f.officialWebsiteUrl.trim(),
      imageUrl: f.imageUrl.trim(),
      koreanFriendly: f.koreanFriendly,
      voucher: f.voucherCode.trim()
        ? {
            code: f.voucherCode.trim().toUpperCase(),
            discountLabel: f.voucherLabel.trim(),
            terms: f.voucherTerms.trim(),
            validUntil: f.voucherValidUntil.trim() || '2026-12-31',
          }
        : undefined,
    }
    hotelEdits.set(session.slug, patch)
    navigate('/partner')
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-black/5 bg-white/90 px-4 backdrop-blur sm:px-6">
        <Link to="/partner" className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900">← Back to portal</Link>
        <Logo size={30} textClass="text-base" />
      </header>

      <form onSubmit={save} className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">Edit your listing</h1>
          <p className="mt-1 text-sm text-ink-700/70">{session.propertyName} — changes appear on your public page immediately. List items go one per line.</p>
        </div>

        <section className="space-y-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
          <Field label="Positioning line" hint="one-line pitch"><input value={f.positioningLine} onChange={set('positioningLine')} className={inputCls} /></Field>
          <Field label="Short description"><textarea value={f.shortDescription} onChange={set('shortDescription')} rows={3} className={inputCls} /></Field>
          <Field label="Main reason to choose"><textarea value={f.mainReason} onChange={set('mainReason')} rows={2} className={inputCls} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Facilities"><textarea value={f.facilities} onChange={set('facilities')} rows={5} className={inputCls} /></Field>
            <Field label="Official booking benefits"><textarea value={f.officialBenefits} onChange={set('officialBenefits')} rows={5} className={inputCls} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Official website URL"><input value={f.officialWebsiteUrl} onChange={set('officialWebsiteUrl')} placeholder="https://hotel.example/booking" className={inputCls} /></Field>
            <Field label="Main photo URL"><input value={f.imageUrl} onChange={set('imageUrl')} className={inputCls} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.koreanFriendly} onChange={set('koreanFriendly')} /> 🇰🇷 Korean-friendly</label>
        </section>

        <section className="space-y-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
          <div>
            <h2 className="font-bold text-ink-900">Direct-booking voucher</h2>
            <p className="text-xs text-ink-600/70">Optional — leave the code blank to remove it.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Voucher code"><input value={f.voucherCode} onChange={set('voucherCode')} placeholder="STAY10" className={inputCls} /></Field>
            <Field label="Valid until"><input value={f.voucherValidUntil} onChange={set('voucherValidUntil')} placeholder="2026-12-31" className={inputCls} /></Field>
            <Field label="Discount label"><input value={f.voucherLabel} onChange={set('voucherLabel')} placeholder="10% off your direct booking" className={inputCls} /></Field>
            <Field label="Terms"><input value={f.voucherTerms} onChange={set('voucherTerms')} className={inputCls} /></Field>
          </div>
        </section>

        <div className="sticky bottom-0 flex gap-2 border-t border-black/5 bg-sand-50/95 py-3 backdrop-blur">
          <Link to="/partner" className="flex-1 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-ink-800 ring-1 ring-black/10 hover:bg-sand-100">Cancel</Link>
          <button type="submit" className="flex-1 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">Save changes</button>
        </div>
      </form>
    </div>
  )
}
