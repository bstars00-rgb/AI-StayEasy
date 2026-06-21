import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { findInCatalogue } from '../data/mockRepo'
import { Logo } from '../components/Logo'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { useLang } from '../i18n'
import { partnerStrings } from '../lib/partnerI18n'
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
  const { lang } = useLang()
  const t = partnerStrings[lang]
  const te = t.edit
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
    voucherRedeem: (hotel?.voucher?.redeem ?? 'online') as 'online' | 'onsite',
    voucherFieldLabel: hotel?.voucher?.fieldLabel ?? '',
    contactLang: hotel?.contact?.lang ?? 'vi',
    cEmail: hotel?.contact?.email ?? '',
    cPhone: hotel?.contact?.phone ?? '',
    cWhatsapp: hotel?.contact?.whatsapp ?? '',
    cZalo: hotel?.contact?.zalo ?? '',
    cKakao: hotel?.contact?.kakao ?? '',
    cLine: hotel?.contact?.line ?? '',
    cMessenger: hotel?.contact?.messenger ?? '',
  }))
  const [gallery, setGallery] = useState<string[]>(() => hotel?.gallery ?? [])

  const setPhoto = (i: number, v: string) => setGallery((g) => g.map((x, idx) => (idx === i ? v : x)))
  const addPhoto = () => setGallery((g) => [...g, ''])
  const removePhoto = (i: number) => setGallery((g) => g.filter((_, idx) => idx !== i))
  const uploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => setGallery((g) => [...g, String(reader.result)])
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  if (!session) return <Navigate to="/partner/login" replace />
  if (!hotel) return <Navigate to="/partner" replace />

  const set =
    <K extends keyof typeof f>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      gallery: gallery.map((g) => g.trim()).filter(Boolean),
      voucher: f.voucherCode.trim()
        ? {
            code: f.voucherCode.trim().toUpperCase(),
            discountLabel: f.voucherLabel.trim(),
            terms: f.voucherTerms.trim(),
            validUntil: f.voucherValidUntil.trim() || '2026-12-31',
            redeem: f.voucherRedeem,
            fieldLabel: f.voucherRedeem === 'online' && f.voucherFieldLabel.trim() ? f.voucherFieldLabel.trim() : undefined,
          }
        : undefined,
      contact: {
        lang: f.contactLang as 'en' | 'ko' | 'vi' | 'zh' | 'ja',
        email: f.cEmail.trim() || undefined,
        phone: f.cPhone.trim() || undefined,
        whatsapp: f.cWhatsapp.trim() || undefined,
        zalo: f.cZalo.trim() || undefined,
        kakao: f.cKakao.trim() || undefined,
        line: f.cLine.trim() || undefined,
        messenger: f.cMessenger.trim() || undefined,
      },
    }
    hotelEdits.set(session.slug, patch)
    navigate('/partner')
  }

  // Live-preview derivations + a simple completeness score for the sidebar.
  const facLines = lines(f.facilities)
  const benLines = lines(f.officialBenefits)
  const previewImg = f.imageUrl.trim() || gallery.find((g) => g.trim()) || ''
  const checkFields = [
    f.positioningLine, f.shortDescription, f.mainReason, f.facilities, f.officialBenefits,
    f.officialWebsiteUrl, f.imageUrl, f.voucherCode,
    [f.cEmail, f.cPhone, f.cWhatsapp, f.cZalo, f.cKakao, f.cLine, f.cMessenger].find((x) => x.trim()) ?? '',
  ]
  const completeness = Math.round((checkFields.filter((x) => x.trim()).length / checkFields.length) * 100)

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-black/5 bg-white/90 px-4 backdrop-blur sm:px-6">
        <Link to="/partner" className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900">{t.backToPortal}</Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Logo size={30} textClass="text-base" />
        </div>
      </header>

      <form onSubmit={save} className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold text-ink-900">{te.title}</h1>
          <p className="mt-1 text-sm text-ink-700/70">{te.subtitle.replace('{name}', session.propertyName)}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div className="min-w-0 space-y-5">

        <section className="space-y-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
          <Field label={te.positioning} hint={te.positioningHint}><input value={f.positioningLine} onChange={set('positioningLine')} className={inputCls} /></Field>
          <Field label={te.shortDesc}><textarea value={f.shortDescription} onChange={set('shortDescription')} rows={3} className={inputCls} /></Field>
          <Field label={te.mainReason}><textarea value={f.mainReason} onChange={set('mainReason')} rows={2} className={inputCls} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={te.facilities}><textarea value={f.facilities} onChange={set('facilities')} rows={5} className={inputCls} /></Field>
            <Field label={te.officialBenefits}><textarea value={f.officialBenefits} onChange={set('officialBenefits')} rows={5} className={inputCls} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={te.officialUrl}><input value={f.officialWebsiteUrl} onChange={set('officialWebsiteUrl')} placeholder="https://hotel.example/booking" className={inputCls} /></Field>
            <Field label={te.mainPhoto}><input value={f.imageUrl} onChange={set('imageUrl')} className={inputCls} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.koreanFriendly} onChange={set('koreanFriendly')} /> {te.koreanFriendly}</label>
        </section>

        <section className="space-y-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
          <div>
            <h2 className="font-bold text-ink-900">{te.photosTitle}</h2>
            <p className="text-xs text-ink-600/70">{te.photosSub}</p>
          </div>

          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {gallery.map((url, i) => (
                <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-sand-100 ring-1 ring-black/5">
                  {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-xl text-ink-400">🏨</div>}
                  <button type="button" onClick={() => removePhoto(i)} aria-label={t.remove} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">✕</button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {gallery.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input value={url} onChange={(e) => setPhoto(i, e.target.value)} placeholder="https://…/room.jpg" className={inputCls} />
                <button type="button" onClick={() => removePhoto(i)} className="shrink-0 rounded-xl bg-white px-3 text-sm font-semibold text-ink-700 ring-1 ring-black/10 hover:bg-sand-50">{t.remove}</button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={addPhoto} className="rounded-xl bg-sand-100 px-4 py-2 text-sm font-semibold text-ink-800 hover:bg-sand-200">{te.addPhotoUrl}</button>
            <label className="cursor-pointer rounded-xl bg-sand-100 px-4 py-2 text-sm font-semibold text-ink-800 hover:bg-sand-200">
              {te.uploadPhotos}
              <input type="file" accept="image/*" multiple onChange={uploadPhotos} className="hidden" />
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
          <div>
            <h2 className="font-bold text-ink-900">{te.voucherTitle}</h2>
            <p className="text-xs text-ink-600/70">{te.voucherSub}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={te.voucherCode}><input value={f.voucherCode} onChange={set('voucherCode')} placeholder="STAY10" className={inputCls} /></Field>
            <Field label={te.validUntil}><input value={f.voucherValidUntil} onChange={set('voucherValidUntil')} placeholder="2026-12-31" className={inputCls} /></Field>
            <Field label={te.discountLabel}><input value={f.voucherLabel} onChange={set('voucherLabel')} placeholder="10% off your direct booking" className={inputCls} /></Field>
            <Field label={te.terms}><input value={f.voucherTerms} onChange={set('voucherTerms')} className={inputCls} /></Field>
            <Field label={te.howRedeem}>
              <select value={f.voucherRedeem} onChange={set('voucherRedeem')} className={inputCls}>
                <option value="online">{te.redeemOnline}</option>
                <option value="onsite">{te.redeemOnsite}</option>
              </select>
            </Field>
            {f.voucherRedeem === 'online' && (
              <Field label={te.fieldName}>
                <input value={f.voucherFieldLabel} onChange={set('voucherFieldLabel')} placeholder="Promo code / Voucher / Gift code" className={inputCls} />
              </Field>
            )}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
          <div>
            <h2 className="font-bold text-ink-900">{te.contactTitle}</h2>
            <p className="text-xs text-ink-600/70">{te.contactSub}</p>
          </div>
          <Field label={te.yourLang} hint={te.yourLangHint}>
            <select value={f.contactLang} onChange={set('contactLang')} className={inputCls}>
              {(['vi', 'en', 'ko', 'zh', 'ja'] as const).map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.email}><input value={f.cEmail} onChange={set('cEmail')} placeholder="frontdesk@hotel.example" className={inputCls} /></Field>
            <Field label={te.phone} hint={te.phoneHint}><input value={f.cPhone} onChange={set('cPhone')} placeholder="+84905123456" className={inputCls} /></Field>
            <Field label={te.whatsapp} hint={te.numberHint}><input value={f.cWhatsapp} onChange={set('cWhatsapp')} placeholder="+84905123456" className={inputCls} /></Field>
            <Field label={te.zalo} hint={te.numberHint}><input value={f.cZalo} onChange={set('cZalo')} placeholder="+84905123456" className={inputCls} /></Field>
            <Field label={te.kakao} hint={te.kakaoHint}><input value={f.cKakao} onChange={set('cKakao')} placeholder="https://open.kakao.com/o/…" className={inputCls} /></Field>
            <Field label={te.line} hint={te.lineHint}><input value={f.cLine} onChange={set('cLine')} placeholder="@hotelid" className={inputCls} /></Field>
            <Field label={te.messenger} hint={te.messengerHint}><input value={f.cMessenger} onChange={set('cMessenger')} placeholder="hotelpage" className={inputCls} /></Field>
          </div>
        </section>

          </div>{/* /left column */}

          <aside className="space-y-4 lg:sticky lg:top-20">
            <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5">
              <div className="flex items-baseline justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-600/60">{te.completeness}</p>
                <p className="text-sm font-extrabold text-ink-900">{completeness}%</p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/5">
                <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${completeness}%` }} />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5">
              <div className="aspect-[16/10] bg-sand-100">
                {previewImg ? (
                  <img src={previewImg} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-3xl text-ink-400">🏨</div>
                )}
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-600/55">{te.previewTitle}</p>
                  <h3 className="mt-0.5 font-extrabold text-ink-900">{session.propertyName}</h3>
                  {f.positioningLine && <p className="text-sm text-brand-700">{f.positioningLine}</p>}
                </div>
                {f.shortDescription && <p className="text-xs text-ink-700/80">{f.shortDescription}</p>}
                {f.koreanFriendly && <span className="inline-block rounded-full bg-sand-50 px-2 py-0.5 text-[11px] font-medium text-ink-700 ring-1 ring-black/5">{te.koreanFriendly}</span>}
                {facLines.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {facLines.slice(0, 6).map((x) => (
                      <span key={x} className="rounded-full bg-sand-50 px-2 py-0.5 text-[11px] text-ink-700 ring-1 ring-black/5">{x}</span>
                    ))}
                  </div>
                )}
                {benLines.length > 0 && (
                  <ul className="space-y-1">
                    {benLines.slice(0, 4).map((b) => (
                      <li key={b} className="flex items-start gap-1.5 text-[11px] text-ink-800"><span className="text-brand-600">✓</span> {b}</li>
                    ))}
                  </ul>
                )}
                {f.voucherCode && (
                  <p className="rounded-lg bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-700 ring-1 ring-brand-100">🎟️ {f.voucherLabel || f.voucherCode}</p>
                )}
                <p className="text-[11px] text-ink-600/55">{te.previewSub}</p>
              </div>
            </div>
          </aside>
        </div>{/* /grid */}

        <div className="sticky bottom-0 mt-5 flex gap-2 border-t border-black/5 bg-sand-50/95 py-3 backdrop-blur">
          <Link to="/partner" className="flex-1 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-ink-800 ring-1 ring-black/10 hover:bg-sand-100">{t.cancel}</Link>
          <button type="submit" className="flex-1 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">{te.saveChanges}</button>
        </div>
      </form>
    </div>
  )
}
