export function Spinner({ label }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 py-16 text-ink-600/70">
      <span aria-hidden className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  )
}

/** Placeholder cards while a grid of data loads. */
export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5">
          <div className="h-44 w-full animate-pulse bg-sand-100" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-sand-100" />
            <div className="h-3 w-full animate-pulse rounded bg-sand-100" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-sand-100" />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="h-9 animate-pulse rounded-full bg-sand-100" />
              <div className="h-9 animate-pulse rounded-full bg-sand-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
