import { useState } from 'react'
import { useLang } from '../i18n'
import { isPercent, type BenefitValue } from '../data/benefitValue'
import { benefitValueStrings, withVars } from '../lib/benefitValueI18n'
import { CURRENCIES, DEFAULT_CURRENCY, formatMoney, freeNightsSaving, parseAmount, savingsFor, type Currency } from '../lib/savings'
import type { Lang } from '../i18n'

/** The short figure shown on a hotel card and at the top of the benefit panel. */
export function benefitHeadline(v: BenefitValue, lang: Lang): string {
  const s = benefitValueStrings[lang]
  if (isPercent(v)) return withVars(v.upTo ? s.upTo : s.save, { pct: v.pct })
  if (v.kind === 'nights') return withVars(s.freeNights, { min: v.minNights, free: v.freeNights })
  return withVars(v.perNight ? s.amountChipNight : s.amountChip, { amount: formatMoney(v.amount, v.currency, lang) })
}

/**
 * The number behind a hotel's stated direct-booking benefit, plus — where it
 * depends on the guest's own rate — a calculator that turns it into money. The
 * percentage, free nights or fixed value come from the hotel's own offer line
 * (shown beside the figure with its conditions); the rate is typed in by the
 * visitor. A fixed-value perk needs no input, so it shows the hotel's stated value.
 */
export function BenefitSavings({ value, line }: { value: BenefitValue; line: string }) {
  const { lang } = useLang()
  const s = benefitValueStrings[lang]
  const [rate, setRate] = useState('')
  const [nights, setNights] = useState('1')
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY[lang])

  const rateNum = parseAmount(rate)
  const nightsNum = Math.max(1, Math.floor(parseAmount(nights)))

  // What the visitor could get, in the currency they typed (percent / free nights),
  // or the hotel's own stated value in its own currency (fixed-value perk).
  let result = 0
  let resultCurrency: Currency = currency
  let resultLabel = s.result
  let basis = ''
  let needMore = false
  if (isPercent(value)) {
    result = savingsFor(rateNum, nightsNum, value.pct)
    resultLabel = value.upTo ? s.resultUpTo : s.result
    basis = withVars(s.basis, { pct: value.pct })
  } else if (value.kind === 'nights') {
    result = freeNightsSaving(rateNum, nightsNum, value.minNights, value.freeNights)
    basis = withVars(s.nightsBasis, { free: value.freeNights })
    needMore = rateNum > 0 && nightsNum < value.minNights
  } else {
    result = value.amount * (value.perNight ? nightsNum : 1)
    resultCurrency = value.currency
    resultLabel = s.amountResult
    basis = s.amountBasis
  }
  const needsInput = isPercent(value) || value.kind === 'nights'
  const fixedAmount = !needsInput

  return (
    <div className="mb-4 rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-100">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-brand-600 px-3 py-1 text-lg font-extrabold text-white">{benefitHeadline(value, lang)}</span>
        <p className="min-w-0 flex-1 text-sm font-medium text-ink-800">{line}</p>
      </div>

      <div className="mt-4 border-t border-brand-100 pt-3">
        <p className="text-sm font-bold text-ink-900">{s.calcTitle}</p>
        {needsInput && <p className="text-xs text-ink-700/70">{s.calcIntro}</p>}

        {needsInput ? (
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
        ) : value.kind === 'amount' && value.perNight ? (
          <label className="mt-2 block w-28 text-xs font-semibold text-ink-700">
            {s.nights}
            <input
              inputMode="numeric"
              value={nights}
              onChange={(e) => setNights(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>
        ) : null}

        {needMore && value.kind === 'nights' && (
          <p role="note" className="mt-3 text-xs font-semibold text-amber-800">{withVars(s.nightsNeed, { min: value.minNights })}</p>
        )}
        {(result > 0 || fixedAmount) && result > 0 && (
          <p data-testid="savings-result" className="mt-3 text-sm text-ink-700">
            {resultLabel}{' '}
            <strong className="text-xl font-extrabold text-brand-700">{needsInput ? `${s.about} ` : ''}{formatMoney(result, resultCurrency, lang)}</strong>{' '}
            <span className="text-xs text-ink-700/70">({basis})</span>
          </p>
        )}
        <p className="mt-2 text-xs text-ink-700/60">{s.note}</p>
      </div>
    </div>
  )
}
