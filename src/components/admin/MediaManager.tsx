import { useState } from 'react'
import { destinations } from '../../data/destinations'
import { siteImages, useSiteImages } from '../../lib/siteImages'

/**
 * Admin media manager — every editable image that appears on the public
 * homepage, grouped by where it shows up. Hotel photos are NOT here: those live
 * with the rest of a hotel's content in the hotel editor (partner listing).
 *
 * DEMO storage: a pasted URL or uploaded file (kept as a data URL) is saved in
 * localStorage in this browser only; a real build syncs to shared storage.
 */
function fileToDataUrl(file: File, cb: (dataUrl: string) => void) {
  const reader = new FileReader()
  reader.onload = () => cb(String(reader.result))
  reader.readAsDataURL(file)
}

function ImageSlot({ id, label, appearsIn }: { id: string; label: string; appearsIn: string }) {
  const src = useSiteImages()[id]
  const [url, setUrl] = useState(src && !src.startsWith('data:') ? src : '')
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand-100 ring-1 ring-black/5">
        {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-2xl text-ink-400">🖼️</div>}
        {src && (
          <button type="button" onClick={() => { siteImages.set(id, undefined); setUrl('') }} aria-label="Remove image" className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-xs text-white hover:bg-black/75">✕</button>
        )}
        <span className="absolute left-1.5 top-1.5 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white">{label}</span>
      </div>
      <p className="mt-1.5 text-[11px] text-ink-600/60"><i className="not-italic">📍</i> {appearsIn}</p>
      <div className="mt-1.5 flex gap-1.5">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && siteImages.set(id, url)}
          placeholder="https://…/photo.jpg"
          className="min-w-0 flex-1 rounded-lg border border-black/10 bg-sand-50 px-2.5 py-1.5 text-xs outline-none focus:border-brand-400"
        />
        <button type="button" onClick={() => siteImages.set(id, url)} className="shrink-0 rounded-lg bg-ink-900 px-2.5 text-xs font-semibold text-white hover:bg-ink-800">Set</button>
        <label className="shrink-0 cursor-pointer rounded-lg bg-sand-100 px-2.5 py-1.5 text-xs font-semibold text-ink-800 hover:bg-sand-200" title="Upload an image file">
          ⬆
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) fileToDataUrl(f, (d) => siteImages.set(id, d)); e.target.value = '' }} />
        </label>
      </div>
    </div>
  )
}

const HERO_SLOTS = [
  { id: 'hero-1', label: 'Hero · Beach', appearsIn: 'Homepage hero — top-left tile' },
  { id: 'hero-2', label: 'Hero · City', appearsIn: 'Homepage hero — top-right tile' },
  { id: 'hero-3', label: 'Hero · Hills', appearsIn: 'Homepage hero — bottom-left tile' },
  { id: 'hero-4', label: 'Hero · Family', appearsIn: 'Homepage hero — bottom-right tile' },
]

export function MediaManager() {
  const liveDestinations = destinations.filter((d) => d.available)

  return (
    <div className="space-y-5">
      <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
        🧪 Demo storage — images save in this browser only. A real build syncs them to shared object storage so every operator and visitor sees them. Hotel photos are managed in each hotel's listing, not here.
      </p>

      <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
        <h2 className="font-bold text-ink-900">Homepage hero</h2>
        <p className="mt-1 text-xs text-ink-600/70">The four tiles beside the headline at the top of the homepage. Empty slots show the decorative emoji tile.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HERO_SLOTS.map((s) => (
            <ImageSlot key={s.id} id={s.id} label={s.label} appearsIn={s.appearsIn} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
        <h2 className="font-bold text-ink-900">Featured destinations</h2>
        <p className="mt-1 text-xs text-ink-600/70">The city cards in the “Featured destinations” row on the homepage. Empty slots show the emoji tile.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {liveDestinations.map((d) => (
            <ImageSlot key={d.slug} id={`dest-${d.slug}`} label={d.city} appearsIn={`Homepage — Featured destinations · ${d.city}`} />
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-ink-600/55">Hotel cards, detail pages and galleries use each hotel’s own photos — set those in the hotel’s listing under Partners.</p>
    </div>
  )
}
