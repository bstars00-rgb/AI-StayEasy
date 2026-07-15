import { useEffect, useRef } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Hotel } from '../types'
import { hotelLatLng } from '../lib/geo'

/** BASE_URL always ends in "/" (Vite), so this yields a correct absolute path. */
const hotelHref = (slug: string) => `${import.meta.env.BASE_URL}hotels/${slug}`

/** MapTiler key (client-side, publishable). When set, the base map uses vector
 *  tiles whose labels follow the app language. Without it, we fall back to free
 *  OpenStreetMap raster tiles (local/Vietnamese labels). */
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string | undefined

/** App language → OSM/MapTiler `name:<lang>` field suffix. */
const NAME_SUFFIX: Record<string, string> = { en: 'en', ko: 'ko', vi: 'vi', zh: 'zh', ja: 'ja' }

/** A recommended attraction to plot alongside the hotels. */
export interface MapAttraction {
  name: string
  lat: number
  lng: number
}

const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap',
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
}

function markerEl(html: string): HTMLDivElement {
  const d = document.createElement('div')
  d.innerHTML = html
  return d
}
const HOTEL_HTML = '<span style="display:grid;place-items:center;width:26px;height:26px;border-radius:50% 50% 50% 0;background:#0d9488;transform:rotate(-45deg);box-shadow:0 1px 4px rgba(0,0,0,.4)"><span style="width:8px;height:8px;border-radius:50%;background:#fff;transform:rotate(45deg)"></span></span>'
const SPOT_HTML = '<span style="display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#f59e0b;box-shadow:0 1px 4px rgba(0,0,0,.35);color:#fff;font-size:12px;line-height:1">★</span>'

/**
 * MapLibre GL map of hotels + optional attractions. MapLibre is dynamically
 * imported inside the effect so it never runs during prerender/SSR or tests,
 * and every call is guarded — a map failure degrades to an empty container.
 * With a MapTiler key the base-map labels follow `lang`; otherwise OSM raster.
 * Zoom (wheel / double-click / pinch / buttons) and drag are all enabled.
 */
export function HotelMap({
  hotels,
  attractions = [],
  height = 300,
  zoom,
  lang = 'en',
}: {
  hotels: Hotel[]
  attractions?: MapAttraction[]
  height?: number
  zoom?: number
  lang?: string
}) {
  const elRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<{ remove: () => void } | null>(null)

  useEffect(() => {
    let cancelled = false
    const el = elRef.current
    if (!el || typeof window === 'undefined') return

    import('maplibre-gl')
      .then((mod) => {
        const maplibregl = (mod as { default?: typeof import('maplibre-gl') }).default ?? (mod as unknown as typeof import('maplibre-gl'))
        if (cancelled || !el || mapRef.current) return

        const points = hotels.map((h) => ({ h, ll: hotelLatLng(h) })) // ll = [lat, lng]
        if (!points.length) return

        const style = MAPTILER_KEY ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}` : (OSM_STYLE as unknown as string)
        const map = new maplibregl.Map({
          container: el,
          style,
          center: [points[0].ll[1], points[0].ll[0]],
          zoom: zoom ?? (points.length > 1 ? 11 : 14),
        })
        mapRef.current = map
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')

        map.on('load', () => {
          // Localize base-map labels to the app language (vector/MapTiler only).
          if (MAPTILER_KEY) {
            const suffix = NAME_SUFFIX[lang] ?? 'en'
            const expr = ['coalesce', ['get', `name:${suffix}`], ['get', 'name:latin'], ['get', 'name']]
            for (const layer of map.getStyle().layers ?? []) {
              if (layer.type === 'symbol' && (layer.layout as Record<string, unknown> | undefined)?.['text-field']) {
                try {
                  map.setLayoutProperty(layer.id, 'text-field', expr as unknown as string)
                } catch {
                  /* layer without a settable text-field — skip */
                }
              }
            }
          }

          for (const a of attractions) {
            new maplibregl.Marker({ element: markerEl(SPOT_HTML), anchor: 'center' })
              .setLngLat([a.lng, a.lat])
              .setPopup(new maplibregl.Popup({ offset: 14, closeButton: true }).setHTML(`<span style="font-weight:600;color:#b45309">★ ${a.name}</span>`))
              .addTo(map)
          }
          for (const { h, ll } of points) {
            new maplibregl.Marker({ element: markerEl(HOTEL_HTML), anchor: 'bottom' })
              .setLngLat([ll[1], ll[0]])
              .setPopup(new maplibregl.Popup({ offset: 24, closeButton: true }).setHTML(`<a href="${hotelHref(h.slug)}" style="font-weight:700;color:#0f766e">${h.name}</a>`))
              .addTo(map)
          }

          // Fit to the hotels only (attractions can be far) so listings stay focus.
          if (points.length > 1) {
            try {
              const b = new maplibregl.LngLatBounds()
              points.forEach((p) => b.extend([p.ll[1], p.ll[0]]))
              map.fitBounds(b, { padding: 40, maxZoom: 14, animate: false })
            } catch {
              /* keep the initial center/zoom */
            }
          }
        })
      })
      .catch(() => {
        /* maplibre unavailable (e.g. jsdom/WebGL-less test env) — empty container */
      })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [hotels, attractions, zoom, lang])

  return <div ref={elRef} style={{ height }} className="relative z-0 w-full overflow-hidden rounded-2xl ring-1 ring-black/10" role="img" aria-label="Map" />
}
