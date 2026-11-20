'use client'

import { Flame, Megaphone } from 'lucide-react'
import type { VehicleTelemetry } from '@/types/world'

interface SpeedometerProps {
  telemetry: VehicleTelemetry
  onHorn: () => void
}

export function Speedometer({ telemetry, onHorn }: SpeedometerProps) {
  const kmh = Math.round(Math.abs(telemetry.speed) * 4.2)
  const boostPct = Math.round(telemetry.boost * 100)

  return (
    <div className="pointer-events-auto fixed bottom-4 right-4 z-20 hidden flex-col gap-2 rounded-2xl border-2 border-ink-900 bg-cream-100 p-3 shadow-pop md:flex">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="font-display text-2xl font-bold leading-none text-cobalt-600">
            {kmh}
          </span>
          <span className="ml-1 text-[11px] font-extrabold uppercase text-ink-800/70">
            km/h
          </span>
        </div>

        <button
          type="button"
          onClick={onHorn}
          title="Honk Horn (H)"
          className="pop-btn flex items-center gap-1 rounded-full bg-sunny-500 px-2.5 py-1 text-xs font-extrabold text-ink-900"
        >
          <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Beep</span>
        </button>
      </div>

      {/* Turbo Boost Bar */}
      <div className="flex items-center gap-2">
        <Flame className="h-3.5 w-3.5 shrink-0 text-coral-500" aria-hidden="true" />
        <div className="h-2.5 w-32 overflow-hidden rounded-full border-2 border-ink-900 bg-cream-200">
          <div
            className="h-full bg-coral-500 transition-[width] duration-75"
            style={{ width: `${boostPct}%` }}
          />
        </div>
      </div>

      {/* Compact Keycaps Hint */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-ink-900/15 pt-2 text-[10px] font-bold text-ink-800">
        <kbd className="rounded border border-ink-900 bg-cream-50 px-1.5 py-0.5">WASD</kbd>
        <span>Drive</span>
        <kbd className="rounded border border-ink-900 bg-cream-50 px-1.5 py-0.5">SHIFT</kbd>
        <span>Boost</span>
        <kbd className="rounded border border-ink-900 bg-cream-50 px-1.5 py-0.5">SPACE</kbd>
        <span>Hop</span>
      </div>
    </div>
  )
}
