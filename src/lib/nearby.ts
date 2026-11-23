import type { Hotel } from '../types'
import type { Lang } from '../i18n'
import { ATTRACTIONS, type AttractionCategory } from '../data/attractions'
import { COORDS, hotelLatLng, type LatLng } from './geo'

const EARTH_RADIUS_KM = 6371.0088

/** Great-circle (straight-line) distance between two [lat, lng] points, in km. */
export function haversineKm([lat1, lng1]: LatLng, [lat2, lng2]: LatLng): number {
  const rad = (d: number) => (d * Math.PI) / 180
  const dLat = rad(lat2 - lat1)
  const dLng = rad(lng2 - lng1)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

export interface NearbyAttraction {
  id: string
  name: string
  category: AttractionCategory
  lat: number
  lng: number
  /** Straight-line distance from the hotel's map pin. */
  km: number
}

export interface NearbyResult {
  items: NearbyAttraction[]
  /**
   * True when the hotel has its own street-level pin (COORDS). False means the
   * pin is the area centre plus jitter, so distances are only indicative and
   * the UI says so — we never present a derived number as firmer than its input.
   */
  pinConfirmed: boolean
}

/** The hotel city's attractions, nearest first, names in the active language. */
export function nearbyAttractions(hotel: Hotel, lang: Lang): NearbyResult {
  const from = hotelLatLng(hotel)
  const items = ATTRACTIONS.filter((a) => a.city === hotel.city)
    .map((a) => ({
      id: a.id,
      name: a.name[lang] ?? a.name.en,
      category: a.category,
      lat: a.lat,
      lng: a.lng,
      km: haversineKm(from, [a.lat, a.lng]),
    }))
    .sort((a, b) => a.km - b.km)
  return { items, pinConfirmed: hotel.slug in COORDS }
}

/** "400 m" under 1 km, "2.3 km" up to 10 km, whole km beyond. */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(1, Math.round(km * 10)) * 100} m`
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

/** Google Maps pin for a coordinate (opens the user's maps app on mobile). */
export const mapsLink = (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
