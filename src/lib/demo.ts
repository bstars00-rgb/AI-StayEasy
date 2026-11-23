/**
 * Demo-hotel switch.
 *
 * The 110-hotel catalogue is real and verified; nothing fictional belongs in it.
 * The "Lunas Park Hotel" chain (src/data/demoHotels.ts) is fictional and exists
 * only to show how member vouchers and benefit figures look. It is kept out of
 * the catalogue unless this switch is on, labeled as fictional everywhere it
 * appears, has no booking link, and is never in the sitemap. Off by default.
 */
export const DEMO_HOTELS_ENABLED = import.meta.env.VITE_DEMO_HOTELS === 'true'
