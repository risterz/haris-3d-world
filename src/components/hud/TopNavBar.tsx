'use client'

import { HelpCircle, LayoutGrid, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { ZONE_TELEPORTS } from '@/data/worldLayout'
import type { WorldZoneId } from '@/types/world'

interface TopNavBarProps {
  activeZone: WorldZoneId
  muted: boolean
  onTeleport: (zoneId: WorldZoneId) => void
  onOpenQuickView: () => void
  onOpenWelcome: () => void
  onResetWorld: () => void
  onToggleMute: () => void
}

const ZONE_ORDER: WorldZoneId[] = ['start', 'projects', 'skills', 'journey', 'contact']

export function TopNavBar({
  activeZone,
  muted,
  onTeleport,
  onOpenQuickView,
  onOpenWelcome,
  onResetWorld,
  onToggleMute,
}: TopNavBarProps) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 p-3 sm:p-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
        {/* Brand Badge */}
        <button
          type="button"
          onClick={() => onTeleport('start')}
          className="pop-btn pointer-events-auto flex items-center gap-2.5 rounded-full bg-cream-100 px-3.5 py-2 text-left"
          aria-label="Back to Start Plaza"
        >
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink-900 bg-coral-500 font-display text-xs font-bold text-cream-50"
          >
            H
          </span>
          <span className="font-display text-base font-bold tracking-tight text-cobalt-600 sm:text-lg">
            Haris World
          </span>
        </button>

        {/* Zone Fast-Travel Pills */}
        <nav
          aria-label="World Zones"
          className="pointer-events-auto order-3 flex w-full items-center gap-1.5 overflow-x-auto pb-1 sm:order-2 sm:w-auto sm:pb-0"
        >
          {ZONE_ORDER.map((zoneId) => {
            const zone = ZONE_TELEPORTS[zoneId]
            const isCurrent = activeZone === zoneId
            return (
              <button
                key={zoneId}
                type="button"
                onClick={() => onTeleport(zoneId)}
                className={`pop-btn shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold sm:text-sm ${
                  isCurrent
                    ? 'bg-cobalt-600 text-cream-50'
                    : 'bg-cream-100 text-ink-900 hover:bg-sunny-400'
                }`}
              >
                {zone.label}
              </button>
            )
          })}
        </nav>

        {/* Right Actions: Quick View + Reset + Sound */}
        <div className="pointer-events-auto order-2 flex items-center gap-2 sm:order-3">
          <button
            type="button"
            onClick={onOpenQuickView}
            className="pop-btn flex items-center gap-1.5 rounded-full bg-sunny-500 px-3.5 py-2 text-xs font-extrabold text-ink-900 sm:text-sm"
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            <span>Quick View</span>
          </button>

          <button
            type="button"
            onClick={onOpenWelcome}
            title="Portfolio Intro & Controls"
            aria-label="Open Portfolio Intro"
            className="pop-btn flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-cobalt-600 hover:bg-cream-200"
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onResetWorld}
            title="Reset Car & Props (R)"
            aria-label="Reset Car and Props"
            className="pop-btn flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-ink-900 hover:bg-cream-200"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            title={muted ? 'Enable Sound' : 'Mute Sound'}
            aria-label={muted ? 'Enable Sound' : 'Mute Sound'}
            className={`pop-btn flex h-9 w-9 items-center justify-center rounded-full ${
              muted ? 'bg-cream-100 text-ink-800' : 'bg-coral-500 text-cream-50'
            }`}
          >
            {muted ? (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
