import { useT } from '../i18n'

export function TrustStrip() {
  const t = useT()
  const points = [
    { icon: '🤝', title: t.home.trust.t1, text: t.home.trust.d1 },
    { icon: '🏷️', title: t.home.trust.t2, text: t.home.trust.d2 },
    { icon: '🔍', title: t.home.trust.t3, text: t.home.trust.d3 },
    { icon: '👨‍👩‍👧‍👦', title: t.home.trust.t4, text: t.home.trust.d4 },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {points.map((p) => (
        <div key={p.title} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <div className="text-2xl">{p.icon}</div>
          <h3 className="mt-2 font-bold text-ink-900">{p.title}</h3>
          <p className="mt-1 text-sm text-ink-700/80">{p.text}</p>
        </div>
      ))}
    </div>
  )
}
