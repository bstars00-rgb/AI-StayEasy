import { countries } from '../data/countries'

/**
 * Asia expansion map — instead of listing every country, plot them geographically
 * with Vietnam as the live hub and faint spokes radiating to the roadmap markets.
 * Approximate lat/lng per market (good enough for a marketing visual) projected
 * with a simple equirectangular transform.
 */
const COORD: Record<string, [number, number]> = {
  VN: [14.5, 108], TH: [14, 101], JP: [37, 138.5], KR: [37, 128], ID: [-3, 118],
  SG: [1.3, 104], MY: [3.5, 102], PH: [13, 122.5], KH: [12.5, 105], LA: [19.5, 103],
  TW: [23.7, 121], HK: [22.3, 114.2], CN: [34, 106], IN: [22, 79], LK: [8, 81], MV: [4, 73],
}

// Projection bounds onto a wide, short viewBox so it fits in one screen.
const W = 760
const H = 360
const x = (lng: number) => ((lng - 68) / (150 - 68)) * W
const y = (lat: number) => ((46 - lat) / (46 + 10)) * H

export function AsiaMap({ live, coming }: { live: string; coming: string }) {
  const pts = countries
    .map((c) => ({ c, xy: COORD[c.code] }))
    .filter((p) => p.xy)
    .map((p) => ({ ...p, px: x(p.xy![1]), py: y(p.xy![0]) }))
  const vn = pts.find((p) => p.c.code === 'VN')

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-3xl" role="img" aria-label="StayEasy expansion across Asia">
        {/* faint lat/long grid for a map feel */}
        <g stroke="white" strokeOpacity="0.06" strokeWidth="1">
          {[0, 1, 2, 3, 4, 5].map((i) => <line key={`h${i}`} x1="0" x2={W} y1={(H / 5) * i} y2={(H / 5) * i} />)}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={`v${i}`} y1="0" y2={H} x1={(W / 6) * i} x2={(W / 6) * i} />)}
        </g>

        {/* spokes from Vietnam to each roadmap market */}
        {vn && (
          <g stroke="#2dd4bf" strokeOpacity="0.28" strokeWidth="1.2">
            {pts.filter((p) => p.c.code !== 'VN').map((p) => (
              <line key={`l${p.c.code}`} x1={vn.px} y1={vn.py} x2={p.px} y2={p.py} />
            ))}
          </g>
        )}

        {/* markers */}
        {pts.map((p) => {
          const isLive = p.c.available
          const flip = p.px > W * 0.62 // right-side markers: label to the left so it doesn't clip
          const dx = (isLive ? 9 : 6) * (flip ? -1 : 1)
          return (
            <g key={p.c.code}>
              {isLive && <circle cx={p.px} cy={p.py} r="14" fill="#2dd4bf" opacity="0.25" className="animate-ping" style={{ transformOrigin: `${p.px}px ${p.py}px` }} />}
              <circle cx={p.px} cy={p.py} r={isLive ? 6 : 3.5} fill={isLive ? '#34d399' : '#ffffff'} fillOpacity={isLive ? 1 : 0.45} />
              <text
                x={p.px + dx}
                y={p.py + 4}
                textAnchor={flip ? 'end' : 'start'}
                fontSize={isLive ? 13 : 10.5}
                fontWeight={isLive ? 700 : 500}
                fill="#ffffff"
                fillOpacity={isLive ? 1 : 0.7}
              >
                {p.c.flag} {p.c.name}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/70">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> {live}</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-white/45" /> {coming}</span>
      </div>
    </div>
  )
}
