import { describe, it, expect } from 'vitest'
import { plansStrings, PLAN_IDS, PERIOD_IDS } from '../lib/plansI18n'
import type { Lang } from '../i18n'

const LANGS: Lang[] = ['en', 'ko', 'vi', 'zh', 'ja']

/** Every string in a plans table, flattened. */
function allStrings(v: unknown): string[] {
  if (typeof v === 'string') return [v]
  if (Array.isArray(v)) return v.flatMap(allStrings)
  if (v && typeof v === 'object') return Object.values(v).flatMap(allStrings)
  return []
}

describe('plans copy', () => {
  it('has the same shape in every language as English', () => {
    const en = plansStrings.en
    for (const l of LANGS) {
      const s = plansStrings[l]
      expect(s.explain.length, l).toBe(en.explain.length)
      expect(s.rows.length, l).toBe(en.rows.length)
      expect(s.faq.length, l).toBe(en.faq.length)
      for (const id of PLAN_IDS) {
        expect(s.plans[id].features.length, `${l}/${id} features`).toBe(en.plans[id].features.length)
      }
      for (const r of s.rows) expect(r.values.length, `${l} row ${r.label}`).toBe(PLAN_IDS.length)
      for (const str of allStrings(s)) expect(str.trim(), l).not.toBe('')
    }
  })

  it('covers every billing period, with a label and a hint, in every language', () => {
    for (const l of LANGS) {
      expect(Object.keys(plansStrings[l].periods).sort(), l).toEqual([...PERIOD_IDS].sort())
      for (const p of PERIOD_IDS) {
        expect(plansStrings[l].periods[p].label.trim(), `${l}/${p}`).toBeTruthy()
        expect(plansStrings[l].periods[p].hint.trim(), `${l}/${p}`).toBeTruthy()
      }
    }
  })

  it('keeps the plan names identical across languages (they are brand names)', () => {
    for (const l of LANGS) {
      expect(PLAN_IDS.map((id) => plansStrings[l].plans[id].name)).toEqual(['Getaway', 'Voyager', 'Nomad'])
    }
  })

  it('states no prices or currency amounts — they are set after the pilot', () => {
    const money = /[$₫₩¥€]\s*\d|\d[\d,.]*\s*(?:₫|원|円|元|đồng|\b(?:usd|vnd|krw|jpy|dollars?|won|yen|yuan)\b)/i
    for (const l of LANGS) for (const str of allStrings(plansStrings[l])) expect(str, `${l}: ${str}`).not.toMatch(money)
  })

  it('never promises lower hotel rates or any booking commission', () => {
    // The FAQ answers the rate/commission questions with a "no" — pin that wording's intent in English.
    const faq = plansStrings.en.faq.map((f) => f.a).join(' ')
    expect(faq).toMatch(/takes no money from bookings/i)
    expect(faq).toMatch(/don’t promise lower rates/i)
  })
})
