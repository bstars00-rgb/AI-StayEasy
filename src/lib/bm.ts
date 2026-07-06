/**
 * Business-model master switch.
 *
 * StayEasy is launching as a pure audience/content site first — the goal is to
 * grow a trusted travel-guide audience before turning on any monetization. So
 * every revenue surface is gated behind this one flag:
 *   - discount vouchers (consumer)
 *   - display ads (AdSense)
 *   - "Sponsored" / paid-placement badges
 *   - the consumer member sign-in (its only purpose was unlocking vouchers)
 *
 * All of that code is kept intact — just hidden. When the business model is
 * ready, set `VITE_ENABLE_BM=true` and every gated surface returns as-is.
 * Off by default.
 */
export const BM_ENABLED = import.meta.env.VITE_ENABLE_BM === 'true'
