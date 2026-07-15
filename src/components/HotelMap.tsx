import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import type { Hotel } from '../types'
import { hotelLatLng, type LatLng } from '../lib/geo'

/** BASE_URL always ends in "/" (Vite), so this yields a correct absolute path. */
const hotelHref = (slug: string) => `${import.meta.env.BASE_URL}hotels/${slug}`

/** A recommended attraction to plot alongside the hotels. */
export interface MapAttraction {
  name: string
  lat: number
  lng: number
}

/**
 * OpenStreetMap (Leaflet) map of hotels + optional recommended attractions.
 * Leaflet is dynamically imported inside the effect so it never runs during
 * prerender/SSR or tests, and every call is guarded — a map failure degrades to
 * an empty container, it never throws. Markers use styled divIcons (teal
 * teardrop = hotel, amber star = attraction) so there are no image assets to
 * misresolve. Zoom (wheel / double-click / pinch) and drag are enabled.
 */
export function HotelMap({
  hotels,
  attractions = [],
  height = 300,
  zoom,
}: {
  hotels: Hotel[]
  attractions?: MapAttraction[]
  height?: number
  zoom?: number
}) {
  const elRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<{ remove: () => void } | null>(null)

  useEffect(() => {
    let cancelled = false
    const el = elRef.current
    if (!el || typeof window === 'undefined') return

    import('leaflet')
      .then((mod) => {
        const L = (mod as { default?: typeof import('leaflet') }).default ?? (mod as unknown as typeof import('leaflet'))
        if (cancelled || !el || mapRef.current) return

        const points: { h: Hotel; ll: LatLng }[] = hotels.map((h) => ({ h, ll: hotelLatLng(h) }))
        if (!points.length) return

        const map = L.map(el, { scrollWheelZoom: true, attributionControl: true })
        mapRef.current = map
        map.setView(points[0].ll, zoom ?? (points.length > 1 ? 12 : 15))
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
          maxZoom: 19,
        }).addTo(map)

        const hotelPin = L.divIcon({
          className: '',
          html: '<span style="display:grid;place-items:center;width:26px;height:26px;border-radius:50% 50% 50% 0;background:#0d9488;transform:rotate(-45deg);box-shadow:0 1px 4px rgba(0,0,0,.4)"><span style="width:8px;height:8px;border-radius:50%;background:#fff;transform:rotate(45deg)"></span></span>',
          iconSize: [26, 26],
          iconAnchor: [13, 24],
          popupAnchor: [0, -22],
        })
        const spotPin = L.divIcon({
          className: '',
          html: '<span style="display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#f59e0b;box-shadow:0 1px 4px rgba(0,0,0,.35);color:#fff;font-size:12px;line-height:1">★</span>',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
          popupAnchor: [0, -12],
        })

        // Attractions first, so hotel pins render on top.
        for (const a of attractions) {
          L.marker([a.lat, a.lng], { icon: spotPin, zIndexOffset: -100 })
            .addTo(map)
            .bindPopup(`<span style="font-weight:600;color:#b45309">★ ${a.name}</span>`)
        }
        for (const { h, ll } of points) {
          L.marker(ll, { icon: hotelPin })
            .addTo(map)
            .bindPopup(`<a href="${hotelHref(h.slug)}" style="font-weight:700;color:#0f766e">${h.name}</a>`)
        }

        // Fit to the hotels only (attractions can be far, e.g. Ba Na Hills) so
        // the listings stay the focus; travelers can zoom/pan out to the spots.
        if (points.length > 1) {
          try {
            map.fitBounds(points.map((p) => p.ll), { padding: [30, 30] })
          } catch {
            /* single cluster — keep the setView above */
          }
        }
      })
      .catch(() => {
        /* leaflet unavailable (e.g. test env) — leave an empty map container */
      })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [hotels, attractions, zoom])

  return <div ref={elRef} style={{ height }} className="relative z-0 w-full overflow-hidden rounded-2xl ring-1 ring-black/10" role="img" aria-label="Map" />
}
