import type { Hotel } from '../types'

/**
 * Accommodation / property type — the "what kind of place is this" taxonomy
 * travelers filter by (distinct from `hotelType`, which is more about who it
 * suits). Derived deterministically from the hotel's name, type and conditions,
 * so no data or type migration is needed. Mirrors the picker labels the user
 * specified (resort, beach hotel, boutique, apartment hotel, B&B, hostel, …).
 */
export type PropertyType =
  | 'Resort'
  | 'Beach hotel'
  | 'Spa hotel'
  | 'Boutique hotel'
  | 'Apartment hotel'
  | 'Hostel'
  | 'B&B'
  | 'Motel'
  | 'Inn'
  | 'Hotel'
  | 'Other'

export const PROPERTY_TYPES: PropertyType[] = [
  'Resort', 'Beach hotel', 'Spa hotel', 'Boutique hotel', 'Apartment hotel',
  'Hostel', 'B&B', 'Motel', 'Inn', 'Hotel', 'Other',
]

export function propertyTypeOf(h: Hotel): PropertyType {
  const n = `${h.name} ${h.hotelType}`.toLowerCase()
  if (/resort/.test(n)) return 'Resort'
  if (/hostel|capsule|backpack|dorm/.test(n)) return 'Hostel'
  if (/condotel|apartment|serviced|residence|suites?/.test(n) || h.hotelType === 'Long stay serviced apartment') return 'Apartment hotel'
  if (/boutique/.test(n)) return 'Boutique hotel'
  if (/b&b|bed and breakfast|homestay|guesthouse|guest house/.test(n)) return 'B&B'
  if (/motel/.test(n)) return 'Motel'
  if (/\binn\b|lodge|villa|retreat|house|garden|homes?\b/.test(n)) return 'Inn'
  if (/spa/.test(n)) return 'Spa hotel'
  if (h.conditions.beachfront || /beach|ocean|bay|sea/.test(n) || h.hotelType === 'Beach resort') return 'Beach hotel'
  if (/hotel/.test(n)) return 'Hotel'
  return 'Other'
}
