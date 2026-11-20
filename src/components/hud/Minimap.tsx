'use client'

import { WORLD_BOUNDS, ZONE_TELEPORTS } from '@/data/worldLayout'
import type { VehicleTelemetry, WorldZoneId } from '@/types/world'

interface MinimapProps {
  telemetry: VehicleTelemetry
  onTeleport: (zoneId: WorldZoneId) => void
}

const ZONES: WorldZoneId[] = ['projects', 'skills', 'journey', 'contact', 'start']

export function Minimap({ telemetry, onTeleport }: MinimapProps) {
  const spanX = WORLD_BOUNDS.maxX - WORLD_BOUNDS.minX
  const spanZ = WORLD_BOUNDS.maxZ - WORLD_BOUNDS.minZ

  const toPctX = (x: number) =>
    Math.max(6, Math.min(94, ((x - WORLD_BOUNDS.minX) / spanX) * 100))
  const toPctY = (z: number) =>
    Math.max(6, Math.min(94, ((z - WORLD_BOUNDS.minZ) / spanZ) * 100))

  const carX = toPctX(telemetry.x)
  const carY = toPctY(telemetry.z)
  const deg = (-telemetry.heading * 180) / Math.PI

  return (
    <div className="pointer-events-auto fixed bottom-4 left-4 z-20 hidden w-40 rounded-2xl border-2 border-ink-900 bg-cream-100 p-2.5 shadow-pop md:block">
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-cobalt-600">
        <span>World Map</span>
        <span className="text-ink-800/70">Click Zone</span>
      </div>

      <div className="relative h-32 w-full overflow-hidden rounded-xl border-2 border-ink-900 bg-sand-300">
        {/* Schematic Roads */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[15%] h-[68%] w-2 -translate-x-1/2 bg-ink-800/55"
        />
        <div
          aria-hidden="true"
          className="absolute left-[14%] top-[28%] h-2 w-[72%] bg-ink-800/55"
        />
        <div
          aria-hidden="true"
          className="absolute left-[12%] top-[59%] h-2 w-[76%] bg-ink-800/55"
        />

        {/* Clickable Zone Dots */}
        {ZONES.map((zoneId) => {
          const z = ZONE_TELEPORTS[zoneId]
          return (
            <button
              key={zoneId}
              type="button"
              onClick={() => onTeleport(zoneId)}
              title={`Warp to ${z.label}`}
              style={{
                left: `${toPctX(z.x)}%`,
                top: `${toPctY(z.z)}%`,
                backgroundColor: z.color,
              }}
              className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-900 transition-transform hover:scale-125"
              aria-label={`Warp to ${z.label}`}
            />
          )
        })}

        {/* Live Car Directional Arrow */}
        <div
          style={{
            left: `${carX}%`,
            top: `${carY}%`,
            transform: `translate(-50%, -50%) rotate(${deg}deg)`,
          }}
          className="pointer-events-none absolute h-4 w-4"
        >
          <svg viewBox="0 0 16 16" className="h-full w-full drop-shadow">
            <polygon
              points="8,1 14,14 8,11 2,14"
              fill="#EF4B34"
              stroke="#1A1E2E"
              strokeWidth="1.6"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
