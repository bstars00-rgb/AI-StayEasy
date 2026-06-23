import { useState } from 'react'
import { hotels } from '../../data/hotels'
import { findInCatalogue } from '../../data/mockRepo'
import { hotelEdits, useHotelEdits } from '../../lib/hotelEdits'
import { siteImages, useSiteImages } from '../../lib/siteImages'

/**
 * Admin media manager — operators set the home-hero photos and each hotel's
 * main photo + gallery (paste a URL or upload a file). DEMO storage: uploads
 * become data URLs in localStorage; a real build pushes these to object storage.
 */
function fileToDataUrl(file: File, cb: (dataUrl: string) => void) {
  const reader = new FileReader()
  reader.onload = () => cb(String(reader.result))
  reader.readAsDataURL(file)
}

function ImageSlot({ src, onSet, hint }: { src?: string; onSet: (src: string | undefined) => void; hint?: string }) {
  const [url, setUrl] = useState(src && !src.startsWith('data:') ? src : '')
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand-100 ring-1 ring-black/5">
        {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-2xl text-ink-400">🖼️</div>}
        {src && (
          <button type="button" onClick={() => { onSet(undefined); setUrl('') }} aria-label="Remove image" className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-xs text-white hover:bg-black/75">✕</button>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSet(url)}
          placeholder="https://…/photo.jpg"
          className="min-w-0 flex-1 rounded-lg border border-black/10 bg-sand-50 px-2.5 py-1.5 text-xs outline-none focus:border-brand-400"
        />
        <button type="button" onClick={() => onSet(url)} className="shrink-0 rounded-lg bg-ink-900 px-2.5 text-xs font-semibold text-white hover:bg-ink-800">Set</button>
        <label className="shrink-0 cursor-pointer rounded-lg bg-sand-100 px-2.5 py-1.5 text-xs font-semibold text-ink-800 hover:bg-sand-200">
          ⬆
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) fileToDataUrl(f, onSet); e.target.value = '' }} />
        </label>
      </div>
      {hint && <p className="mt-1 text-[11px] text-ink-600/55">{hint}</p>}
    </div>
  )
}

const HERO_LABELS = ['Tile 1 · Beach', 'Tile 2 · City', 'Tile 3 · Hills', 'Tile 4 · Family']

export function MediaManager() {
  const hero = useSiteImages().hero
  useHotelEdits() // re-render after a hotel image change
  const [slug, setSlug] = useState(hotels[0]?.slug ?? '')
  const hotel = findInCatalogue(slug)
  const gallery = hotel?.gallery ?? []

  const setGallery = (next: string[]) => hotelEdits.set(slug, { gallery: next.filter(Boolean) })

  return (
    <div className="space-y-5">
      <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
        🧪 Demo storage — images are saved in this browser only. A real build syncs them to shared object storage so every operator and visitor sees them.
      </p>

      {/* Home hero */}
      <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
        <h2 className="font-bold text-ink-900">Home hero photos</h2>
        <p className="mt-1 text-xs text-ink-600/70">Four tiles on the homepage. Empty slots fall back to the decorative emoji tile.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <p className="mb-1.5 text-xs font-semibold text-ink-700">{HERO_LABELS[i]}</p>
              <ImageSlot src={hero[i]} onSet={(src) => siteImages.setHero(i, src)} />
            </div>
          ))}
        </div>
      </section>

      {/* Hotel photos */}
      <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-ink-900">Hotel photos</h2>
            <p className="mt-1 text-xs text-ink-600/70">Set a hotel's main photo and gallery on its behalf.</p>
          </div>
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-lg border border-black/10 bg-sand-50 px-3 py-2 text-sm outline-none focus:border-brand-400">
            {hotels.map((h) => (
              <option key={h.slug} value={h.slug}>{h.name} · {h.city}</option>
            ))}
          </select>
        </div>

        {hotel && (
          <div className="mt-4 grid gap-5 lg:grid-cols-[16rem_1fr]">
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink-700">Main photo</p>
              <ImageSlot src={hotel.imageUrl} onSet={(src) => hotelEdits.set(slug, { imageUrl: src ?? '' })} hint="Shown on cards and the detail header." />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink-700">Gallery</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((url, i) => (
                  <ImageSlot key={`${slug}-${i}`} src={url} onSet={(src) => setGallery(src ? gallery.map((g, idx) => (idx === i ? src : g)) : gallery.filter((_, idx) => idx !== i))} />
                ))}
                <div className="self-start">
                  <p className="mb-1.5 text-xs font-semibold text-ink-700">Add</p>
                  <ImageSlot src={undefined} onSet={(src) => src && setGallery([...gallery, src])} />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
