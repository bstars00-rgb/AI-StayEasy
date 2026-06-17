import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { hotels, deriveConditions } from '../data/hotels'
import { countries, getCountry } from '../data/countries'
import type { Hotel, Country, City, Area, HotelType, PriceTier, TravelStyle } from '../types'
import { feeByPlan, PLANS } from '../data/adminData'
import type { Plan } from '../data/adminData'
import { partnerDrafts } from '../lib/partnerDrafts'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const TRAVEL_STYLES: TravelStyle[] = ['Family', 'Couple', 'Business', 'Beach', 'Long Stay', 'Korean-friendly']
const HERO_COLORS = [
  'from-brand-500 to-accent-500',
  'from-sky-500 to-brand-500',
  'from-amber-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-teal-500 to-emerald-500',
  'from-rose-500 to-red-600',
]

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const lines = (s: string): string[] => s.split('\n').map((l) => l.trim()).filter(Boolean)

/** Initial empty form — strings for every field; arrays are entered one-per-line. */
const initialForm = {
  // basics
  name: '',
  country: 'Vietnam' as Country,
  city: 'Da Nang',
  area: '',
  hotelType: 'City hotel',
  priceTier: 'mid' as PriceTier,
  emoji: '🏨',
  heroColor: HERO_COLORS[0],
  imageUrl: '',
  officialWebsiteUrl: '',
  koreanFriendly: false,
  isSponsored: false,
  // positioning
  shortDescription: '',
  positioningLine: '',
  mainReason: '',
  // suitability
  bestFor: '',
  notIdealFor: '',
  thingsToCheck: '',
  tags: [] as TravelStyle[],
  // facilities & benefits
  facilities: '',
  officialBenefits: '',
  // room guide
  roomCouples: '',
  roomFamilies: '',
  roomLongStay: '',
  roomCheck: '',
  // location guide
  locNearby: '',
  locAirport: '',
  locAround: '',
  locFood: '',
  // checklist + gallery
  cancellationChecklist: '',
  gallery: '',
  // voucher (optional)
  voucherCode: '',
  voucherLabel: '',
  voucherTerms: '',
  voucherValidUntil: '',
  // partner contract
  plan: 'Growth' as Plan,
  contactEmail: '',
}
type Form = typeof initialForm

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">{label}</span>
      {hint && <span className="ml-2 text-xs text-ink-500/60">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  )
}

function Section({ step, title, desc, children }: { step: number; title: string; desc: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{step}</span>
        <div>
          <h2 className="font-bold text-ink-900">{title}</h2>
          <p className="text-xs text-ink-600/70">{desc}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  )
}

const inputCls = 'w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

export default function RegisterHotelPage() {
  useDocumentMeta('Register a hotel — StayEasy Admin', 'Onboard a hotel partner (demo).')
  const navigate = useNavigate()
  const [f, setF] = useState<Form>(initialForm)
  const [error, setError] = useState('')

  const typeOptions = [...new Set(hotels.map((h) => h.hotelType))]
  const cityOptions = getCountry(f.country)?.cities ?? []

  // Country → City cascade: switching country resets the city to that market's first.
  const onCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value as Country
    setF((prev) => ({ ...prev, country, city: getCountry(country)?.cities[0] ?? '' }))
  }

  const set =
    <K extends keyof Form>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const target = e.target
      const value =
        target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value
      setF((prev) => ({ ...prev, [k]: value }))
    }

  const toggleTag = (tag: TravelStyle) =>
    setF((prev) => ({ ...prev, tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag] }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.name.trim()) {
      setError('Hotel name is required.')
      return
    }
    const slug = slugify(f.name)
    const base: Omit<Hotel, 'conditions'> = {
      id: `draft-${slug}`,
      slug,
      name: f.name.trim(),
      country: f.country,
      city: f.city as City,
      area: (f.area.trim() || 'City Center') as Area,
      hotelType: f.hotelType as HotelType,
      priceTier: f.priceTier,
      shortDescription: f.shortDescription.trim(),
      positioningLine: f.positioningLine.trim(),
      bestFor: lines(f.bestFor),
      notIdealFor: lines(f.notIdealFor),
      mainReason: f.mainReason.trim(),
      thingsToCheck: lines(f.thingsToCheck),
      tags: f.tags,
      facilities: lines(f.facilities),
      officialBenefits: lines(f.officialBenefits),
      roomGuide: {
        couples: f.roomCouples.trim(),
        families: f.roomFamilies.trim(),
        longStay: f.roomLongStay.trim(),
        checkBeforeBooking: f.roomCheck.trim(),
      },
      locationGuide: {
        nearby: f.locNearby.trim(),
        airportDistance: f.locAirport.trim(),
        gettingAround: f.locAround.trim(),
        nearbyFood: f.locFood.trim(),
      },
      cancellationChecklist: lines(f.cancellationChecklist),
      imageUrl: f.imageUrl.trim() || `https://picsum.photos/seed/stayeasy-${slug}/800/600`,
      gallery: lines(f.gallery).length ? lines(f.gallery) : undefined,
      officialWebsiteUrl: f.officialWebsiteUrl.trim(),
      isSponsored: f.isSponsored,
      voucher: f.voucherCode.trim()
        ? {
            code: f.voucherCode.trim().toUpperCase(),
            discountLabel: f.voucherLabel.trim(),
            terms: f.voucherTerms.trim(),
            validUntil: f.voucherValidUntil.trim() || '2026-12-31',
          }
        : undefined,
      similarHotelSlugs: [],
      heroColor: f.heroColor,
      emoji: f.emoji.trim() || '🏨',
      koreanFriendly: f.koreanFriendly,
    }
    const hotel: Hotel = { ...base, conditions: deriveConditions(base) }
    partnerDrafts.add({
      hotel,
      plan: f.plan,
      contactEmail: f.contactEmail.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    })
    navigate('/admin?tab=partners')
  }

  return (
    <div className="min-h-screen bg-sand-50 font-sans text-ink-800">
      {/* Topbar */}
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-black/5 bg-white/85 px-4 backdrop-blur sm:px-6">
        <Link to="/admin?tab=partners" className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900">← Back to Partners</Link>
        <h1 className="ml-2 text-lg font-extrabold text-ink-900">Register a hotel</h1>
        <span className="ml-auto hidden rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 sm:inline">🧪 Demo · saved locally</span>
      </header>

      <form onSubmit={submit} className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
        <p className="text-sm text-ink-600/80">
          This captures everything that appears on the public hotel listing. Only the hotel name is required — fill in
          what you have; list items go one per line.
        </p>

        <Section step={1} title="Basics" desc="Identity, location, and the official booking link.">
          <Field label="Hotel name *">
            <input value={f.name} onChange={set('name')} required placeholder="Riverside Pearl Hotel" className={inputCls} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Country" hint="market">
              <select value={f.country} onChange={onCountry} className={inputCls}>
                {countries.map((c) => (
                  <option key={c.slug} value={c.name}>{c.flag} {c.name}{c.available ? '' : ' — coming soon'}</option>
                ))}
              </select>
            </Field>
            <Field label="City">
              <select value={f.city} onChange={set('city')} className={inputCls}>
                {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Area / neighbourhood" hint="free text">
              <input value={f.area} onChange={set('area')} placeholder="Han River" className={inputCls} />
            </Field>
            <Field label="Hotel type">
              <select value={f.hotelType} onChange={set('hotelType')} className={inputCls}>
                {typeOptions.map((tp) => <option key={tp} value={tp}>{tp}</option>)}
              </select>
            </Field>
            <Field label="Price tier">
              <select value={f.priceTier} onChange={set('priceTier')} className={`${inputCls} capitalize`}>
                {(['budget', 'mid', 'premium'] as PriceTier[]).map((tr) => <option key={tr} value={tr}>{tr}</option>)}
              </select>
            </Field>
            <Field label="Emoji" hint="card icon">
              <input value={f.emoji} onChange={set('emoji')} className={inputCls} />
            </Field>
            <Field label="Hero gradient">
              <select value={f.heroColor} onChange={set('heroColor')} className={inputCls}>
                {HERO_COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Official website URL">
              <input value={f.officialWebsiteUrl} onChange={set('officialWebsiteUrl')} placeholder="https://hotel.example/booking" className={inputCls} />
            </Field>
            <Field label="Main image URL" hint="optional">
              <input value={f.imageUrl} onChange={set('imageUrl')} placeholder="https://…/photo.jpg" className={inputCls} />
            </Field>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.koreanFriendly} onChange={set('koreanFriendly')} /> 🇰🇷 Korean-friendly</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.isSponsored} onChange={set('isSponsored')} /> ★ Sponsored</label>
          </div>
        </Section>

        <Section step={2} title="Positioning" desc="The one-line pitch and StayEasy summary.">
          <Field label="Short description"><textarea value={f.shortDescription} onChange={set('shortDescription')} rows={2} className={inputCls} /></Field>
          <Field label="Positioning line" hint="shown in the detail header"><input value={f.positioningLine} onChange={set('positioningLine')} className={inputCls} /></Field>
          <Field label="Main reason to choose"><textarea value={f.mainReason} onChange={set('mainReason')} rows={2} className={inputCls} /></Field>
        </Section>

        <Section step={3} title="Who it's for" desc="Suitability-first content. One item per line.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Best for"><textarea value={f.bestFor} onChange={set('bestFor')} rows={3} placeholder={'Families\nBeach holidays'} className={inputCls} /></Field>
            <Field label="Not ideal for"><textarea value={f.notIdealFor} onChange={set('notIdealFor')} rows={3} className={inputCls} /></Field>
          </div>
          <Field label="Things to check before booking"><textarea value={f.thingsToCheck} onChange={set('thingsToCheck')} rows={3} className={inputCls} /></Field>
          <Field label="Travel-style tags">
            <div className="flex flex-wrap gap-2">
              {TRAVEL_STYLES.map((tag) => (
                <button type="button" key={tag} onClick={() => toggleTag(tag)} className={`pill border ${f.tags.includes(tag) ? 'border-brand-600 bg-brand-600 text-white' : 'border-black/10 bg-white text-ink-700 hover:bg-sand-50'}`}>{tag}</button>
              ))}
            </div>
          </Field>
        </Section>

        <Section step={4} title="Facilities & official benefits" desc="One item per line.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Facilities"><textarea value={f.facilities} onChange={set('facilities')} rows={4} placeholder={'Pool\nFree Wi-Fi\nBreakfast'} className={inputCls} /></Field>
            <Field label="Official booking benefits"><textarea value={f.officialBenefits} onChange={set('officialBenefits')} rows={4} placeholder={'Free breakfast\nBest-rate guarantee'} className={inputCls} /></Field>
          </div>
        </Section>

        <Section step={5} title="Room choice guide" desc="Guidance per traveller type.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="For couples"><input value={f.roomCouples} onChange={set('roomCouples')} className={inputCls} /></Field>
            <Field label="For families"><input value={f.roomFamilies} onChange={set('roomFamilies')} className={inputCls} /></Field>
            <Field label="For long stays"><input value={f.roomLongStay} onChange={set('roomLongStay')} className={inputCls} /></Field>
            <Field label="Check before booking"><input value={f.roomCheck} onChange={set('roomCheck')} className={inputCls} /></Field>
          </div>
        </Section>

        <Section step={6} title="Location guide" desc="Getting around and what's nearby.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nearby / setting"><input value={f.locNearby} onChange={set('locNearby')} className={inputCls} /></Field>
            <Field label="Airport distance"><input value={f.locAirport} onChange={set('locAirport')} className={inputCls} /></Field>
            <Field label="Getting around"><input value={f.locAround} onChange={set('locAround')} className={inputCls} /></Field>
            <Field label="Nearby food"><input value={f.locFood} onChange={set('locFood')} className={inputCls} /></Field>
          </div>
        </Section>

        <Section step={7} title="Cancellation & gallery" desc="Checklist items and extra photo URLs — one per line.">
          <Field label="Cancellation & payment checklist"><textarea value={f.cancellationChecklist} onChange={set('cancellationChecklist')} rows={3} className={inputCls} /></Field>
          <Field label="Gallery photo URLs" hint="optional"><textarea value={f.gallery} onChange={set('gallery')} rows={3} placeholder={'https://…/1.jpg\nhttps://…/2.jpg'} className={inputCls} /></Field>
        </Section>

        <Section step={8} title="Direct-booking voucher" desc="Optional — leave the code blank to skip.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Voucher code"><input value={f.voucherCode} onChange={set('voucherCode')} placeholder="STAY10" className={inputCls} /></Field>
            <Field label="Valid until"><input value={f.voucherValidUntil} onChange={set('voucherValidUntil')} placeholder="2026-12-31" className={inputCls} /></Field>
            <Field label="Discount label"><input value={f.voucherLabel} onChange={set('voucherLabel')} placeholder="10% off your direct booking" className={inputCls} /></Field>
            <Field label="Terms"><input value={f.voucherTerms} onChange={set('voucherTerms')} className={inputCls} /></Field>
          </div>
        </Section>

        <Section step={9} title="Partner contract" desc="Plan and the hotel's contact.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Plan">
              <select value={f.plan} onChange={set('plan')} className={inputCls}>
                {PLANS.map((pl) => <option key={pl} value={pl}>{pl} {feeByPlan[pl] ? `($${feeByPlan[pl]}/mo)` : '(Free)'}</option>)}
              </select>
            </Field>
            <Field label="Contact email"><input type="email" value={f.contactEmail} onChange={set('contactEmail')} placeholder="owner@hotel.example" className={inputCls} /></Field>
          </div>
        </Section>

        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">{error}</p>}

        <div className="sticky bottom-0 flex gap-2 border-t border-black/5 bg-sand-50/95 py-3 backdrop-blur">
          <Link to="/admin?tab=partners" className="flex-1 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-ink-800 ring-1 ring-black/10 hover:bg-sand-100">Cancel</Link>
          <button type="submit" className="flex-1 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">Register partner →</button>
        </div>
        <p className="pb-4 text-center text-xs text-ink-600/60">🧪 Demo — saved in your browser (localStorage). A real build would POST this to the partner API.</p>
      </form>
    </div>
  )
}
