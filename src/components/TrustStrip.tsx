const points = [
  { icon: '🤝', title: 'Book directly with the hotel', text: 'We don’t process bookings. You reserve on the hotel’s official website — no middleman markup.' },
  { icon: '🏷️', title: 'Official booking benefits', text: 'Free breakfast, upgrades, late checkout, and best-rate guarantees you only get booking direct.' },
  { icon: '🔍', title: 'Honest, labeled content', text: 'Sponsored placements are always marked. We help you understand hotels, not chase the lowest price.' },
  { icon: '👨‍👩‍👧‍👦', title: 'Chosen for real trips', text: 'Family, couple, business, beach, or long stay — matched to how you actually travel.' },
]

export function TrustStrip() {
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
