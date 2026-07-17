import type { Area, City, Hotel } from '../types'

/**
 * Approximate map coordinates. StayEasy doesn't hold verified GPS for every
 * hotel yet, so pins are placed at the hotel's area (falling back to city
 * centre) with a small deterministic offset so nearby hotels don't overlap.
 * The map UI labels this as an approximate location. Real coordinates can
 * replace this later without touching the map component.
 */
export type LatLng = [number, number]

const CITY: Partial<Record<City, LatLng>> = {
  'Da Nang': [16.0544, 108.2022],
  'Ho Chi Minh City': [10.7769, 106.7009],
  'Nha Trang': [12.2388, 109.1967],
  'Phu Quoc': [10.227, 103.984],
  'Hoi An': [15.8801, 108.338],
  'Hanoi': [21.0278, 105.8342],
  'Hue': [16.4637, 107.5909],
  'Da Lat': [11.9404, 108.4583],
  'Sapa': [22.3364, 103.8438],
  'Ha Long Bay': [20.9101, 107.1839],
}

/**
 * Area centres, keyed `"<City>|<Area>"`.
 *
 * The key MUST include the city: several area names are reused across cities
 * ('City Center' exists in Da Nang, Hue and Da Lat), so a city-blind lookup
 * silently pinned Hue/Da Lat hotels in Da Nang.
 *
 * The template-literal key type is load-bearing, not decoration. When this was
 * `Record<string, LatLng>`, the table was re-keyed to include the city but the
 * reader below kept doing `AREA[h.area]` — every entry became unreachable and
 * all 10 fallback hotels silently dropped to their city centre (Paradise Suites
 * landed 21km from Tuan Chau) while tsc stayed clean. With this type a bare
 * `AREA[h.area]` is a compile error, because Area isn't a `${City}|${Area}`.
 */
export const AREA: Partial<Record<`${City}|${Area}`, LatLng>> = {
  // Da Nang
  'Da Nang|My Khe Beach': [16.06, 108.247],
  'Da Nang|Han River': [16.07, 108.224],
  'Da Nang|City Center': [16.0678, 108.2208],
  'Da Nang|Resort Area': [16.03, 108.25],
  // Ho Chi Minh City
  'Ho Chi Minh City|District 1': [10.7756, 106.7019],
  'Ho Chi Minh City|Thao Dien': [10.803, 106.734],
  'Ho Chi Minh City|Airport Area': [10.818, 106.658],
  // Nha Trang
  'Nha Trang|Nha Trang Beach': [12.2388, 109.196],
  'Nha Trang|North Nha Trang': [12.265, 109.195],
  'Nha Trang|Bai Dong': [12.134, 109.212],
  'Nha Trang|Ninh Van Bay': [12.359, 109.277],
  // Phu Quoc
  'Phu Quoc|Long Beach': [10.19, 103.96],
  'Phu Quoc|Sao Beach': [10.05, 104.03],
  'Phu Quoc|Kem Beach': [10.032, 104.028],
  'Phu Quoc|Ong Lang': [10.259, 103.936],
  'Phu Quoc|Ong Doi Cape': [10.005, 104.052],
  // Hoi An
  'Hoi An|Ancient Town': [15.877, 108.327],
  'Hoi An|An Bang Beach': [15.908, 108.34],
  'Hoi An|Cam Thanh': [15.885, 108.36],
  'Hoi An|Cua Dai Beach': [15.898, 108.365],
  'Hoi An|Ha My Beach': [15.929, 108.318],
  // Hanoi
  'Hanoi|Old Quarter': [21.034, 105.85],
  'Hanoi|West Lake': [21.07, 105.82],
  'Hanoi|French Quarter': [21.023, 105.848],
  'Hanoi|Ba Dinh': [21.035, 105.814],
  // Hue
  'Hue|Perfume River': [16.463, 107.585],
  'Hue|Thuy Xuan': [16.425, 107.579],
  'Hue|Lang Co': [16.27, 108.077],
  'Hue|Phong Dien': [16.578, 107.437],
  'Hue|City Center': [16.4637, 107.5909],
  // Da Lat
  'Da Lat|City Center': [11.9425, 108.4372],
  'Da Lat|Xuan Huong Lake': [11.9416, 108.4433],
  'Da Lat|Tuyen Lam Lake': [11.8969, 108.4194],
  'Da Lat|Valley of Love': [11.9776, 108.451],
  'Da Lat|Cam Ly': [11.9442, 108.4236],
  // Sapa
  'Sapa|Sapa Town': [22.3357, 103.8419],
  'Sapa|Muong Hoa Valley': [22.331, 103.846],
  'Sapa|Ham Rong': [22.3236, 103.8521],
  'Sapa|Ban Ho': [22.2762, 103.967],
  // Ha Long Bay
  'Ha Long Bay|Bai Chay': [20.9505, 107.0554],
  'Ha Long Bay|Halong Marina': [20.9539, 107.0131],
  'Ha Long Bay|Reu Island': [20.9475, 107.0247],
  'Ha Long Bay|Tuan Chau': [20.9203, 106.9906],
  'Ha Long Bay|Hon Gai': [20.9515, 107.0845],
  'Ha Long Bay|Quang Hanh': [20.983, 107.2082],
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
export const COORDS: Record<string, LatLng> = {
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
  // Ho Chi Minh City (expansion)
  'park-hyatt-saigon': [10.7769, 106.704],
  'the-reverie-saigon': [10.7738, 106.7046],
  'hotel-majestic-saigon': [10.7731, 106.7061],
  'caravelle-saigon': [10.7761, 106.7034],
  'lotte-hotel-saigon': [10.7789, 106.7066],
  'new-world-saigon-hotel': [10.7708, 106.6945],
  // Nha Trang / Phu Quoc / Hoi An (expansion)
  'mia-resort-nha-trang': [12.1344, 109.2122],
  'sheraton-nha-trang': [12.2463, 109.196],
  'six-senses-ninh-van-bay': [12.3587, 109.2775],
  'novotel-nha-trang': [12.2378, 109.1965],
  'havana-nha-trang': [12.2435, 109.1958],
  'vinpearl-beachfront-nha-trang': [12.2334, 109.1972],
  'jw-marriott-phu-quoc-emerald-bay': [10.032, 104.0283],
  'la-veranda-resort-phu-quoc': [10.1931, 103.965],
  'regent-phu-quoc': [10.1107, 103.9857],
  'premier-village-phu-quoc': [10.0053, 104.0519],
  'mango-bay-resort-phu-quoc': [10.2591, 103.9362],
  'sol-by-melia-phu-quoc': [10.1463, 103.9773],
  'four-seasons-the-nam-hai-hoi-an': [15.9292, 108.3177],
  'anantara-hoi-an-resort': [15.8801, 108.338],
  'hotel-royal-hoi-an': [15.8767, 108.3198],
  'victoria-hoi-an-beach-resort': [15.8954, 108.37],
  'la-siesta-hoi-an-resort': [15.88, 108.3163],
  'palm-garden-beach-resort-hoi-an': [15.9008, 108.3592],
  // Hue
  'azerai-la-residence-hue': [16.4591, 107.5802],
  'pilgrimage-village-hue': [16.4251, 107.5795],
  'indochine-palace-hue': [16.4614, 107.5979],
  'silk-path-grand-hue': [16.4577, 107.5799],
  'melia-vinpearl-hue': [16.4634, 107.5942],
  'eldora-hotel-hue': [16.4647, 107.5945],
  'alba-wellness-valley-hue': [16.4906, 107.3824],
  'senna-hue-hotel': [16.4637, 107.5909],
  'banyan-tree-lang-co': [16.2892, 108.0247],
  'angsana-lang-co': [16.2953, 108.0195],
  // Da Lat — most pins come from a Google Maps link the hotel publishes on its
  // own site; the rest are OSM POI matches. Terracotta and Dalat Wonder publish
  // neither (Wonder's address is ambiguous between two "Hoa Hong" streets), so
  // they intentionally fall back to the Tuyen Lam Lake area centre.
  'ana-mandara-villas-dalat': [11.9442, 108.4236],
  'dalat-palace-heritage-hotel': [11.9376, 108.4405],
  'dalat-edensee-lake-resort': [11.8868, 108.4209],
  'swiss-belresort-tuyen-lam': [11.8824, 108.4493],
  'ladalat-hotel': [11.9776, 108.451],
  'colline-hotel-dalat': [11.9439, 108.4381],
  'merperle-dalat-hotel': [11.941, 108.4583],
  'ttc-hotel-da-lat-ngoc-lan': [11.9407, 108.4364],
  // Sapa — these five publish their own map pin (Accor GPS, a Maps link, or an
  // initMap marker). The other five publish none at all, so they intentionally
  // fall back to their area centre rather than a geocoder's guess.
  'hotel-de-la-coupole-sapa': [22.3347, 103.8404],
  'topas-ecolodge-sapa': [22.2762, 103.967],
  'sapa-jade-hill-resort': [22.3236, 103.8521],
  'paos-sapa-leisure-hotel': [22.3311, 103.8432],
  'eden-boutique-hotel-sapa': [22.3359, 103.8391],
  // Ha Long Bay — seven publish their own pin (a Maps link, a printed lat/lng, or
  // an operator data attribute). Both Muong Thanhs and Paradise publish none —
  // Muong Thanh's own embed is a NAME-query geocode, which with three confusable
  // same-chain neighbours could resolve to the wrong building, so they fall back.
  'vinpearl-resort-spa-ha-long': [20.9475, 107.0247],
  'wyndham-legend-halong': [20.9587, 107.0597],
  'novotel-ha-long-bay': [20.952, 107.0422],
  'a-la-carte-ha-long-bay': [20.9532, 106.9999],
  'citadines-marina-halong': [20.9539, 107.0131],
  'tru-by-hilton-ha-long-hon-gai': [20.9515, 107.0845],
  'hilton-quang-hanh-onsen-resort': [20.983, 107.2082],
}

/** [lat, lng] for a hotel — real coordinates when known, else area centre + jitter. */
export function hotelLatLng(h: Hotel): LatLng {
  if (COORDS[h.slug]) return COORDS[h.slug]
  const base = AREA[`${h.city}|${h.area}`] ?? CITY[h.city] ?? FALLBACK
  const seed = hash(h.slug)
  // ±~0.0035° (~350 m) so co-located hotels separate on the map.
  // `>>>`, not `>>`: hash() returns a uint32, and a signed shift reinterprets
  // any seed past 2^31 as negative — which made `% 71` negative and dragged 45
  // of 110 hotels up to 1.15km WEST, never east, under a comment promising
  // ±350m. The tests below pin the real spread.
  const dLat = (((seed % 71) / 71) - 0.5) * 0.007
  const dLng = ((((seed >>> 8) % 71) / 71) - 0.5) * 0.007
  return [base[0] + dLat, base[1] + dLng]
}
