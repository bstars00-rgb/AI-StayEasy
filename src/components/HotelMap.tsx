import { useEffect, useRef } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import type maplibregl from 'maplibre-gl'
import type { Hotel } from '../types'
import { hotelLatLng } from '../lib/geo'
import { mapStrings } from '../lib/mapI18n'
import type { Lang } from '../i18n'

/** BASE_URL always ends in "/" (Vite), so this yields a correct absolute path. */
const hotelHref = (slug: string) => `${import.meta.env.BASE_URL}hotels/${slug}`

/** Escape text interpolated into popup HTML (names can carry user input via
 *  partner-registered drafts — never trust them as markup). */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** MapTiler key (client-side, publishable). When set, the base map uses vector
 *  tiles whose labels follow the app language. Without it — or if the MapTiler
 *  style fails to load — we fall back to free OpenStreetMap raster tiles. */
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

type ML = typeof import('maplibre-gl')

/**
 * MapLibre GL map of hotels + optional attractions. The map instance is created
 * ONCE per mount; when props change only the markers are replaced (no tile
 * re-download, pan/zoom preserved). MapLibre is dynamically imported so it never
 * runs during prerender/SSR or tests, and every call is guarded. With a MapTiler
 * key the base-map labels follow `lang`; on style failure it falls back to OSM.
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
  const mapRef = useRef<maplibregl.Map | null>(null)
  const glRef = useRef<ML | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const fittedRef = useRef<string>('')
  const fellBackRef = useRef(false)
  // maplibre's 'load' fires exactly once, and map.loaded() goes false again
  // whenever tiles are streaming — so effects must key off our own flag, never
  // `map.loaded() ? apply : once('load', …)` (that silently drops updates that
  // arrive while the user pans). The 'load' handler renders from propsRef, so
  // anything that changed before load is picked up then; after load, effects
  // apply immediately.
  const readyRef = useRef(false)

  // Latest props for the async create step.
  const propsRef = useRef({ hotels, attractions, zoom, lang })
  propsRef.current = { hotels, attractions, zoom, lang }

  /** Localize base-map labels (vector styles only). */
  const applyLanguage = (map: maplibregl.Map, language: string) => {
    if (!MAPTILER_KEY || fellBackRef.current) return
    const suffix = NAME_SUFFIX[language] ?? 'en'
    const expr = ['coalesce', ['get', `name:${suffix}`], ['get', 'name:latin'], ['get', 'name']]
    for (const layer of map.getStyle().layers ?? []) {
      if (layer.type === 'symbol' && (layer.layout as Record<string, unknown> | undefined)?.['text-field']) {
        try {
          map.setLayoutProperty(layer.id, 'text-field', expr as unknown as string)
        } catch {
          /* non-settable text-field — skip */
        }
      }
    }
  }

  /** Replace all markers with the current hotel/attraction sets. */
  const renderMarkers = (map: maplibregl.Map, gl: ML) => {
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []
    const { hotels: hs, attractions: ats } = propsRef.current

    for (const a of ats) {
      const m = new gl.Marker({ element: markerEl(SPOT_HTML), anchor: 'center' })
        .setLngLat([a.lng, a.lat])
        .setPopup(new gl.Popup({ offset: 14 }).setHTML(`<span style="font-weight:600;color:#b45309">★ ${esc(a.name)}</span>`))
        .addTo(map)
      markersRef.current.push(m)
    }
    for (const h of hs) {
      const ll = hotelLatLng(h)
      const m = new gl.Marker({ element: markerEl(HOTEL_HTML), anchor: 'bottom' })
        .setLngLat([ll[1], ll[0]])
        .setPopup(new gl.Popup({ offset: 24 }).setHTML(`<a href="${hotelHref(h.slug)}" style="font-weight:700;color:#0f766e">${esc(h.name)}</a>`))
        .addTo(map)
      markersRef.current.push(m)
    }

    // Refit only when the hotel SET actually changes (filters), never on a
    // simple re-render — preserves the traveler's pan/zoom.
    const signature = hs.map((h) => h.slug).sort().join(',')
    if (signature !== fittedRef.current && hs.length > 0) {
      fittedRef.current = signature
      try {
        if (hs.length === 1) {
          const ll = hotelLatLng(hs[0])
          map.setCenter([ll[1], ll[0]])
        } else {
          const b = new gl.LngLatBounds()
          hs.forEach((h) => {
            const ll = hotelLatLng(h)
            b.extend([ll[1], ll[0]])
          })
          map.fitBounds(b, { padding: 40, maxZoom: 14, animate: false })
        }
      } catch {
        /* keep current view */
      }
    }
  }

  // Create the map once per mount.
  useEffect(() => {
    let cancelled = false
    const el = elRef.current
    if (!el || typeof window === 'undefined') return

    import('maplibre-gl')
      .then((mod) => {
        const gl = ((mod as { default?: ML }).default ?? (mod as unknown as ML)) as ML
        if (cancelled || !el || mapRef.current) return
        glRef.current = gl

        // Create the map even if hotels haven't loaded yet (the markers effect
        // fills them in later) — a Vietnam-centre default avoids a permanently
        // blank map when mounted with an empty list.
        const p = propsRef.current
        const first = p.hotels.length ? hotelLatLng(p.hotels[0]) : ([16.05, 108.2] as [number, number])
        const style = MAPTILER_KEY ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}` : (OSM_STYLE as unknown as string)
        const map = new gl.Map({
          container: el,
          style,
          center: [first[1], first[0]],
          zoom: p.zoom ?? (p.hotels.length > 1 ? 11 : 14),
        })
        mapRef.current = map
        map.addControl(new gl.NavigationControl({ showCompass: false }), 'top-left')

        // Fall back to OSM raster ONLY when the style itself fails (bad key,
        // blocked network before first load) — a transient single-tile 5xx
        // after load must NOT demote the whole map.
        map.on('error', (e) => {
          const msg = String((e as { error?: { message?: string } }).error?.message ?? '')
          const styleFailed = /style\.json/i.test(msg) || (!readyRef.current && /failed to fetch|networkerror/i.test(msg))
          if (MAPTILER_KEY && !fellBackRef.current && styleFailed) {
            fellBackRef.current = true
            try {
              map.setStyle(OSM_STYLE as unknown as string)
            } catch {
              /* give up quietly */
            }
          }
        })

        map.on('load', () => {
          readyRef.current = true
          applyLanguage(map, propsRef.current.lang)
          renderMarkers(map, gl)
        })
      })
      .catch(() => {
        /* maplibre unavailable (e.g. jsdom/WebGL-less test env) — empty container */
      })

    return () => {
      cancelled = true
      markersRef.current = []
      // Reset ready/gl too, so a StrictMode remount can't fire the marker/lang
      // effects against a not-yet-loaded new map instance.
      readyRef.current = false
      glRef.current = null
      fittedRef.current = ''
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Prop changes update markers in place — the map itself is never recreated.
  // Pre-load changes are picked up by the 'load' handler via propsRef.
  useEffect(() => {
    const map = mapRef.current
    const gl = glRef.current
    if (map && gl && readyRef.current) renderMarkers(map, gl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotels, attractions])

  // Language changes relabel the base map without a rebuild.
  useEffect(() => {
    const map = mapRef.current
    if (map && readyRef.current) applyLanguage(map, lang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  const aria = mapStrings[(lang as Lang) in mapStrings ? (lang as Lang) : 'en'].title
  return <div ref={elRef} style={{ height }} className="relative z-0 w-full overflow-hidden rounded-2xl ring-1 ring-black/10" role="img" aria-label={aria} />
}
