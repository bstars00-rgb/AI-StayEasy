import { useT } from '../i18n'
import { IconCheck, IconTag, IconShield, IconUsers } from './icons'

export function TrustStrip() {
  const t = useT()
  const points = [
    { Icon: IconCheck, title: t.home.trust.t1, text: t.home.trust.d1 },
    { Icon: IconTag, title: t.home.trust.t2, text: t.home.trust.d2 },
    { Icon: IconShield, title: t.home.trust.t3, text: t.home.trust.d3 },
    { Icon: IconUsers, title: t.home.trust.t4, text: t.home.trust.d4 },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {points.map(({ Icon, title, text }) => (
        <div key={title} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="mt-3 font-bold text-ink-900">{title}</h3>
          <p className="mt-1 text-sm text-ink-700/80">{text}</p>
        </div>
      ))}
    </div>
  )
}
