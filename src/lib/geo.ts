import type { Hotel } from '../types'

/**
 * Approximate map coordinates. StayEasy doesn't hold verified GPS for every
 * hotel yet, so pins are placed at the hotel's area (falling back to city
 * centre) with a small deterministic offset so nearby hotels don't overlap.
 * The map UI labels this as an approximate location. Real coordinates can
 * replace this later without touching the map component.
 */
export type LatLng = [number, number]

const CITY: Record<string, LatLng> = {
  'Da Nang': [16.0544, 108.2022],
  'Ho Chi Minh City': [10.7769, 106.7009],
  'Nha Trang': [12.2388, 109.1967],
  'Phu Quoc': [10.227, 103.984],
  'Hoi An': [15.8801, 108.338],
  'Hanoi': [21.0278, 105.8342],
}

const AREA: Record<string, LatLng> = {
  // Da Nang
  'My Khe Beach': [16.06, 108.247],
  'Han River': [16.07, 108.224],
  'City Center': [16.0678, 108.2208],
  'Resort Area': [16.03, 108.25],
  // Ho Chi Minh City
  'District 1': [10.7756, 106.7019],
  'Thao Dien': [10.803, 106.734],
  'Airport Area': [10.818, 106.658],
  // Nha Trang
  'Nha Trang Beach': [12.2388, 109.196],
  'North Nha Trang': [12.265, 109.195],
  // Phu Quoc
  'Long Beach': [10.19, 103.96],
  'Sao Beach': [10.05, 104.03],
  // Hoi An
  'Ancient Town': [15.877, 108.327],
  'An Bang Beach': [15.908, 108.34],
  'Cam Thanh': [15.885, 108.36],
  // Hanoi
  'Old Quarter': [21.034, 105.85],
  'West Lake': [21.07, 105.82],
  'French Quarter': [21.023, 105.848],
}

const FALLBACK: LatLng = [16.0544, 108.2022] // Da Nang / Vietnam-ish centre

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/** Approximate [lat, lng] for a hotel — area centre + a small stable jitter. */
export function hotelLatLng(h: Hotel): LatLng {
  const base = AREA[h.area] ?? CITY[h.city] ?? FALLBACK
  const seed = hash(h.slug)
  // ±~0.0035° (~350 m) so co-located hotels separate on the map.
  const dLat = (((seed % 71) / 71) - 0.5) * 0.007
  const dLng = ((((seed >> 8) % 71) / 71) - 0.5) * 0.007
  return [base[0] + dLat, base[1] + dLng]
}
