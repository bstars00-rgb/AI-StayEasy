import { useState } from 'react'
import { useLang } from '../i18n'
import type { BenefitValue } from '../data/benefitValue'
import { benefitValueStrings, withPct } from '../lib/benefitValueI18n'
import { CURRENCIES, DEFAULT_CURRENCY, formatMoney, parseAmount, savingsFor, type Currency } from '../lib/savings'

/**
 * The number behind a hotel's stated direct-booking discount, plus a calculator
 * that turns it into money using the rate the visitor reads off the official
 * site. Nothing here is a price StayEasy knows: the percentage comes from the
 * hotel's own offer line (shown beside it with its conditions) and the rate is
 * typed in by the visitor.
 */
export function BenefitSavings({ value, line }: { value: BenefitValue; line: string }) {
  const { lang } = useLang()
  const s = benefitValueStrings[lang]
  const [rate, setRate] = useState('')
  const [nights, setNights] = useState('1')
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY[lang])

  const saved = savingsFor(parseAmount(rate), Math.max(1, Math.floor(parseAmount(nights))), value.pct)
  const headline = withPct(value.upTo ? s.upTo : s.save, value.pct)

  return (
    <div className="mb-4 rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-100">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-brand-600 px-3 py-1 text-lg font-extrabold text-white">{headline}</span>
        <p className="min-w-0 flex-1 text-sm font-medium text-ink-800">{line}</p>
      </div>

      <div className="mt-4 border-t border-brand-100 pt-3">
        <p className="text-sm font-bold text-ink-900">{s.calcTitle}</p>
        <p className="text-xs text-ink-700/70">{s.calcIntro}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_6rem_6.5rem]">
          <label className="text-xs font-semibold text-ink-700">
            {s.rate}
            <input
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="0"
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>
          <label className="text-xs font-semibold text-ink-700">
            {s.nights}
            <input
              inputMode="numeric"
              value={nights}
              onChange={(e) => setNights(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>
          <label className="text-xs font-semibold text-ink-700">
            {s.currency}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-2 py-2 text-sm text-ink-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>

        {saved > 0 && (
          <p data-testid="savings-result" className="mt-3 text-sm text-ink-700">
            {value.upTo ? s.resultUpTo : s.result}{' '}
            <strong className="text-xl font-extrabold text-brand-700">{s.about} {formatMoney(saved, currency, lang)}</strong>{' '}
            <span className="text-xs text-ink-700/70">({withPct(s.basis, value.pct)})</span>
          </p>
        )}
        <p className="mt-2 text-xs text-ink-700/60">{s.note}</p>
      </div>
    </div>
  )
}
