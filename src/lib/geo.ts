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
  'Ba Dinh': [21.035, 105.814],
}

const FALLBACK: LatLng = [16.0544, 108.2022] // Da Nang / Vietnam-ish centre

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/**
 * Real per-hotel coordinates for the verified catalogue, placed from each
 * hotel's known street location (accurate to street/neighbourhood level; the
 * map still labels the pin "approximate — confirm on the official site"). Any
 * hotel not listed here falls back to its area centre + jitter.
 */
const COORDS: Record<string, LatLng> = {
  // Da Nang — Vo Nguyen Giap beach road (north→south), Han River city, southern resort strip
  'olalani-resort-condotel': [16.037, 108.25],
  'dlg-hotel-danang': [16.055, 108.247],
  'm-hotel-danang': [16.052, 108.248],
  'grand-tourane-danang': [16.056, 108.247],
  'haian-beach-hotel-spa': [16.053, 108.248],
  'le-sands-oceanfront-danang': [16.078, 108.245],
  'brilliant-hotel-danang': [16.069, 108.224],
  'sanouva-danang': [16.06, 108.216],
  'parosand-danang': [16.06, 108.246],
  'adamo-hotel-danang': [16.048, 108.248],
  'furama-resort-danang': [16.047, 108.249],
  'pullman-danang-beach-resort': [16.045, 108.249],
  'tia-wellness-resort': [16.041, 108.25],
  'naman-retreat': [16.005, 108.269],
  'fusion-resort-villas-danang': [15.995, 108.273],
  'a-la-carte-danang-beach': [16.061, 108.246],
  'muong-thanh-luxury-danang': [16.054, 108.248],
  'diamond-sea-hotel': [16.07, 108.245],
  'wink-hotel-danang-centre': [16.067, 108.221],
  'grandvrio-city-danang': [16.083, 108.222],
  // Ho Chi Minh City
  'hotel-nikko-saigon': [10.762, 106.683],
  'rex-hotel-saigon': [10.775, 106.703],
  'sq-saigon-thao-dien': [10.803, 106.734],
  'the-airport-hotel-saigon': [10.815, 106.66],
  // Nha Trang — Tran Phu beach road
  'intercontinental-nha-trang': [12.243, 109.196],
  'amiana-resort-nha-trang': [12.294, 109.213],
  'sunrise-nha-trang-beach-hotel-spa': [12.248, 109.195],
  'liberty-central-nha-trang': [12.238, 109.196],
  // Phu Quoc — Long Beach (Bai Truong)
  'salinda-resort-phu-quoc': [10.184, 103.965],
  'intercontinental-phu-quoc-long-beach-resort': [10.157, 103.972],
  'cassia-cottage-phu-quoc': [10.196, 103.962],
  'novotel-phu-quoc-resort': [10.176, 103.968],
  // Hoi An
  'allegro-hoi-an': [15.882, 108.328],
  'aira-boutique-hoi-an': [15.885, 108.325],
  'silk-sense-hoi-an-river-resort': [15.887, 108.349],
  'hoi-an-eco-lodge-spa': [15.876, 108.358],
  // Hanoi
  'sofitel-legend-metropole-hanoi': [21.025, 105.857],
  'intercontinental-hanoi-westlake': [21.064, 105.822],
  'la-siesta-premium-hang-be': [21.034, 105.853],
  'apricot-hotel-hanoi': [21.028, 105.851],
  'lotte-hotel-hanoi': [21.0319, 105.8123],
  'melia-hanoi': [21.0234, 105.8464],
  'pan-pacific-hanoi': [21.0498, 105.8399],
  'hotel-de-lopera-hanoi-mgallery': [21.0244, 105.8583],
  'solaria-hotel-hanoi': [21.0313, 105.8514],
  'peridot-grand-hotel-spa-hanoi': [21.033, 105.8465],
}

/** [lat, lng] for a hotel — real coordinates when known, else area centre + jitter. */
export function hotelLatLng(h: Hotel): LatLng {
  if (COORDS[h.slug]) return COORDS[h.slug]
  const base = AREA[h.area] ?? CITY[h.city] ?? FALLBACK
  const seed = hash(h.slug)
  // ±~0.0035° (~350 m) so co-located hotels separate on the map.
  const dLat = (((seed % 71) / 71) - 0.5) * 0.007
  const dLng = ((((seed >> 8) % 71) / 71) - 0.5) * 0.007
  return [base[0] + dLat, base[1] + dLng]
}
