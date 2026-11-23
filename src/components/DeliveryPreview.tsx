import { useLang } from '../i18n'
import { walletStrings, fillW } from '../lib/walletI18n'
import { perkOf } from '../lib/walletView'
import { voucherLink, type WalletVoucher } from '../lib/voucherWallet'

/**
 * What the member receives when a batch is issued: an email, and a messenger
 * message in the member's language (KakaoTalk for Korean, LINE for Japanese,
 * Zalo for Vietnamese; email only for English and Chinese). PREVIEW ONLY — nothing
 * is sent. Real sending needs a server, an email service and, for KakaoTalk,
 * a registered business channel with an approved template.
 */
export function DeliveryPreview({ vouchers, name, onClose }: { vouchers: WalletVoucher[]; name: string; onClose: () => void }) {
  const { lang } = useLang()
  const d = walletStrings[lang].delivery
  const n = vouchers.length
  const lines = vouchers.map((v) => {
    const p = perkOf(v, lang)
    return { v, text: p ? `${p.hotel.name} · ${p.label}` : v.hotelSlug }
  })

  return (
    <div role="dialog" aria-label={d.title} className="rounded-2xl bg-sand-100 p-4 ring-1 ring-black/10">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-ink-900">{d.title}</p>
        <button onClick={onClose} aria-label="Close" className="rounded-full px-2 text-lg leading-none text-ink-700/60 hover:text-ink-900">×</button>
      </div>
      <p className="text-xs text-ink-700/65">{d.note}</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {/* Email */}
        <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-700/50">{d.emailLabel}</p>
          <p className="mt-1 text-sm font-bold text-ink-900">{fillW(d.subject, { n })}</p>
          <p className="mt-2 text-sm text-ink-800">{fillW(d.greeting, { name })}</p>
          <p className="mt-1 text-sm text-ink-700/90">{d.body}</p>
          <ul className="mt-2 space-y-1 text-sm text-ink-800">
            {lines.map((l) => (
              <li key={l.v.id}>• {l.text} <span className="text-xs text-ink-700/60">({l.v.validUntil})</span></li>
            ))}
          </ul>
          <span className="mt-3 inline-block rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white">{d.cta}</span>
          <p className="mt-3 text-xs text-ink-700/60">{d.footer}</p>
        </div>

        {/* Messenger */}
        {d.messenger && (
          <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-700/50">{d.messengerLabel}</p>
            <div className="mt-2 rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-200">
              <p className="text-sm font-bold text-ink-900">[StayEasy] {d.bubbleTitle}</p>
              <p className="mt-1 text-sm text-ink-800">{fillW(d.bubbleBody, { name, n })}</p>
              <ul className="mt-2 space-y-1 text-sm text-ink-800">
                {lines.map((l) => (
                  <li key={l.v.id}>{l.text}</li>
                ))}
              </ul>
              <span className="mt-3 block rounded-lg bg-white px-3 py-2 text-center text-sm font-semibold text-ink-900 ring-1 ring-black/10">{d.bubbleCta}</span>
            </div>
          </div>
        )}
      </div>
      {vouchers[0] && <p className="mt-2 break-all text-[11px] text-ink-700/45">{voucherLink(vouchers[0])}</p>}
    </div>
  )
}
