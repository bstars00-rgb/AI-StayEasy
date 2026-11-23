import type { Currency } from '../lib/savings'
import { DEMO_BENEFIT_VALUE } from './demoHotels'
import { DEMO_HOTELS_ENABLED } from '../lib/demo'

/**
 * The number a hotel itself attaches to its direct-booking offer, so the UI can
 * show "how much could you get" instead of only a sentence.
 *
 * These are NOT estimates. Each entry points at the hotel's headline benefit
 * line (an index into `officialBenefits`, the same one HEADLINE_BENEFIT picks)
 * and repeats the figure written in that line. For the real catalogue a test
 * fails if the line does not contain it, if "up to" disagrees with the wording,
 * or if a headline line that states a percentage is missing from the table.
 * The conditions (code, minimum nights, season) live in the line itself and are
 * always shown next to the number.
 *
 * Three shapes exist:
 *   percent - "N% off" (the real catalogue only has these);
 *   nights  - "stay M nights, get F free";
 *   amount  - a fixed value the hotel states for a perk (breakfast, transfer, spa).
 * A perk with no figure on the hotel's own site (a shuttle, a best-price
 * guarantee) gets no entry — no number is invented for it.
 */
export interface PercentBenefit {
  kind?: 'percent'
  /** Index into the hotel's `officialBenefits` (same index as HEADLINE_BENEFIT). */
  line: number
  /** Percentage off, exactly as the hotel states it. */
  pct: number
  /** True when the hotel says "up to N%" rather than a flat N%. */
  upTo?: boolean
}
export interface NightsBenefit {
  kind: 'nights'
  line: number
  /** Nights the guest must book for the free night(s) to apply. */
  minNights: number
  freeNights: number
}
export interface AmountBenefit {
  kind: 'amount'
  line: number
  /** The value the hotel states, in the currency it states it in (no conversion). */
  amount: number
  currency: Currency
  /** True when the stated value is per night rather than per stay. */
  perNight?: boolean
}
export type BenefitValue = PercentBenefit | NightsBenefit | AmountBenefit

export const isPercent = (b: BenefitValue): b is PercentBenefit => !b.kind || b.kind === 'percent'

/** Real catalogue: percentages the hotels state on their own sites. */
export const BENEFIT_VALUE: Record<string, PercentBenefit> = {
  'brilliant-hotel-danang': { line: 0, pct: 15 },
  'sanouva-danang': { line: 0, pct: 10 },
  'pullman-danang-beach-resort': { line: 0, pct: 20, upTo: true },
  'naman-retreat': { line: 0, pct: 12 },
  'fusion-resort-villas-danang': { line: 0, pct: 10 },
  'amiana-resort-nha-trang': { line: 0, pct: 10 },
  'liberty-central-nha-trang': { line: 0, pct: 25 },
  'cassia-cottage-phu-quoc': { line: 0, pct: 12, upTo: true },
  'hoi-an-eco-lodge-spa': { line: 0, pct: 15 },
}

/** The figure for a hotel, or undefined when it states none. Demo hotels only count while the demo flag is on. */
export const benefitValue = (slug: string): BenefitValue | undefined =>
  BENEFIT_VALUE[slug] ?? (DEMO_HOTELS_ENABLED ? DEMO_BENEFIT_VALUE[slug] : undefined)
