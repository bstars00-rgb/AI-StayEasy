import { marketingBanner, useMarketingBanner } from '../../lib/marketingBanner'
import { MarketingBanner } from '../MarketingBanner'

/**
 * Admin editor for the homepage marketing banner. Edits persist immediately
 * (DEMO localStorage) and the preview below reflects exactly what visitors see.
 */
const inputCls = 'w-full rounded-lg border border-black/10 bg-sand-50 px-3 py-2 text-sm outline-none focus:border-brand-400'

export function MarketingEditor() {
  const b = useMarketingBanner()
  const set = (k: 'eyebrow' | 'title' | 'body' | 'ctaLabel' | 'ctaHref') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => marketingBanner.set({ [k]: e.target.value })

  return (
    <div className="space-y-5">
      <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
        🧪 Demo storage — saved in this browser. A real build serves the banner from the CMS so every visitor sees it. Text is single-language (not auto-translated).
      </p>

      <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-ink-900">Homepage marketing banner</h2>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-800">
            <input type="checkbox" checked={b.enabled} onChange={(e) => marketingBanner.set({ enabled: e.target.checked })} />
            {b.enabled ? 'Shown' : 'Hidden'}
          </label>
        </div>
        <p className="mt-1 text-xs text-ink-600/70">Appears on the homepage between Featured hotels and the “not a booking site” section.</p>

        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">Eyebrow</span>
            <input value={b.eyebrow} onChange={set('eyebrow')} placeholder="StayEasy" className={`mt-1 ${inputCls}`} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">Title</span>
            <textarea value={b.title} onChange={set('title')} rows={2} placeholder="Book direct. Stay easy." className={`mt-1 ${inputCls}`} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">Body</span>
            <textarea value={b.body} onChange={set('body')} rows={2} className={`mt-1 ${inputCls}`} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">Button label</span>
              <input value={b.ctaLabel} onChange={set('ctaLabel')} placeholder="Explore Da Nang hotels" className={`mt-1 ${inputCls}`} />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">Button link</span>
              <input value={b.ctaHref} onChange={set('ctaHref')} placeholder="/destinations/da-nang" className={`mt-1 ${inputCls}`} />
            </label>
          </div>
        </div>
      </section>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-600/60">Live preview</p>
        {b.enabled ? (
          <div className="-mx-4 sm:mx-0">
            <MarketingBanner />
          </div>
        ) : (
          <p className="rounded-xl bg-sand-50 px-3 py-4 text-center text-sm text-ink-600/60 ring-1 ring-black/5">Banner is hidden — toggle “Shown” to display it on the homepage.</p>
        )}
      </div>
    </div>
  )
}
