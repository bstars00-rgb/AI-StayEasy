import { PLAN_IDS, type PlanId } from './plansI18n'

/**
 * Which subscription plan the visitor registered interest in — PROTOTYPE.
 * Stored only in this browser (no account, no email, no payment); it exists so
 * the plans page can show a state and so the intent event can be measured.
 */
const KEY = 'stayeasy-plan-interest'

export const planInterest = {
  get(): PlanId | null {
    if (typeof localStorage === 'undefined') return null
    try {
      const v = localStorage.getItem(KEY)
      return PLAN_IDS.includes(v as PlanId) ? (v as PlanId) : null
    } catch {
      return null
    }
  },
  set(id: PlanId | null): void {
    if (typeof localStorage === 'undefined') return
    try {
      if (id) localStorage.setItem(KEY, id)
      else localStorage.removeItem(KEY)
    } catch {
      /* storage blocked — the page still works for this session */
    }
  },
}
