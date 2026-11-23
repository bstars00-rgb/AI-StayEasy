import { PLAN_IDS, PERIOD_IDS, type PlanId, type PeriodId } from './plansI18n'

/**
 * Which subscription plan (and billing period) the visitor registered interest
 * in — PROTOTYPE. Stored only in this browser (no account, no email, no
 * payment); it exists so the plans page can show a state and so the intent
 * event can be measured.
 */
export interface PlanChoice {
  plan: PlanId
  period: PeriodId
}

const KEY = 'stayeasy-plan-interest'

export const planInterest = {
  get(): PlanChoice | null {
    if (typeof localStorage === 'undefined') return null
    try {
      const v = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<PlanChoice> | null
      return v && PLAN_IDS.includes(v.plan as PlanId) && PERIOD_IDS.includes(v.period as PeriodId) ? (v as PlanChoice) : null
    } catch {
      return null
    }
  },
  set(choice: PlanChoice | null): void {
    if (typeof localStorage === 'undefined') return
    try {
      if (choice) localStorage.setItem(KEY, JSON.stringify(choice))
      else localStorage.removeItem(KEY)
    } catch {
      /* storage blocked — the page still works for this session */
    }
  },
}
