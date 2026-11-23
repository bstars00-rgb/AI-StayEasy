/**
 * The percentage a hotel itself states for its direct-booking offer, so the UI
 * can show a number instead of only a sentence.
 *
 * These are NOT estimates. Each entry points at the hotel's headline benefit
 * line (an index into `officialBenefits`, the same one HEADLINE_BENEFIT picks)
 * and repeats the percentage written in that line; a test fails if the line
 * does not contain it, if "up to" disagrees with the wording, or if a headline
 * line that states a percentage is missing from this table. The conditions
 * (code, minimum nights, advance booking, season) live in the line itself and
 * are always shown next to the number.
 *
 * Only a stated percentage qualifies. A free breakfast, a shuttle or a
 * best-price guarantee carries no number on the hotel's site, so none is
 * invented for it — those hotels keep their sentence and get no figure.
 */
export interface BenefitValue {
  /** Index into the hotel's `officialBenefits` (same index as HEADLINE_BENEFIT). */
  line: number
  /** Percentage off, exactly as the hotel states it. */
  pct: number
  /** True when the hotel says "up to N%" rather than a flat N%. */
  upTo?: boolean
}

export const BENEFIT_VALUE: Record<string, BenefitValue> = {
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

export const benefitValue = (slug: string): BenefitValue | undefined => BENEFIT_VALUE[slug]
