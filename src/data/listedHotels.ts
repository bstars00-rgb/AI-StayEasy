import type { Hotel } from '../types'
import { hotels } from './hotels'
import { DEMO_HOTELS } from './demoHotels'
import { DEMO_HOTELS_ENABLED } from '../lib/demo'

/**
 * Every hotel the site currently lists: the verified catalogue plus the
 * fictional demo chain while its switch is on (lib/demo.ts).
 *
 * Counts shown to visitors (a city's "N hotels", the Vietnam total, the admin
 * KPI) are derived from THIS list, so they always match the hotels a visitor can
 * actually open. The verified catalogue itself (`hotels`) stays real-only and
 * keeps feeding the editorial rankings and benchmarks.
 */
export const LISTED_HOTELS: Hotel[] = DEMO_HOTELS_ENABLED ? [...hotels, ...DEMO_HOTELS] : hotels
