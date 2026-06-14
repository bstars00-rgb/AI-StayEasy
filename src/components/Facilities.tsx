import { facilityIcon } from '../lib/facilities'

export function FacilityChips({ items, limit }: { items: string[]; limit?: number }) {
  const shown = limit ? items.slice(0, limit) : items
  const extra = limit ? items.length - shown.length : 0
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((f) => (
        <span key={f} className="pill bg-sand-100 text-ink-700">
          <span aria-hidden>{facilityIcon(f)}</span> {f}
        </span>
      ))}
      {extra > 0 && <span className="pill bg-sand-100 text-ink-700/70">+{extra} more</span>}
    </div>
  )
}

export function FacilityGrid({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((f) => (
        <div key={f} className="flex items-center gap-2.5 rounded-xl bg-sand-50 px-3 py-2.5 ring-1 ring-black/5">
          <span className="text-xl" aria-hidden>{facilityIcon(f)}</span>
          <span className="text-sm font-medium text-ink-800">{f}</span>
        </div>
      ))}
    </div>
  )
}

/** Pill list for "Best for" / travel-style tags. */
export function TagChips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className="pill bg-brand-50 text-brand-700">{t}</span>
      ))}
    </div>
  )
}
