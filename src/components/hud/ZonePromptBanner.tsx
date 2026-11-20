'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/data/projects'
import type { ZonePadTarget } from '@/types/world'

interface ZonePromptBannerProps {
  activePad: ZonePadTarget | null
  showIntroHint: boolean
  onActivatePad: (pad: ZonePadTarget) => void
  onDismissIntro: () => void
}

export function ZonePromptBanner({
  activePad,
  showIntroHint,
  onActivatePad,
  onDismissIntro,
}: ZonePromptBannerProps) {
  const resolvedLabel = activePad?.projectId
    ? projects.find((p) => p.id === activePad.projectId)?.shortTitle ?? activePad.label
    : activePad?.label

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-36 z-20 flex justify-center px-4 md:bottom-5">
      <AnimatePresence mode="wait">
        {activePad ? (
          <motion.button
            key={activePad.id}
            type="button"
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.18 }}
            onClick={() => onActivatePad(activePad)}
            className="pop-btn pointer-events-auto flex items-center gap-3 rounded-full bg-sunny-500 px-5 py-2.5 text-ink-900"
          >
            <div className="text-left">
              <div className="font-display text-sm font-bold leading-tight sm:text-base">
                {resolvedLabel}
              </div>
              <div className="text-[11px] font-bold text-ink-900/75">
                Press ENTER or tap to open
              </div>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink-900 bg-cobalt-600 text-cream-50">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </motion.button>
        ) : showIntroHint ? (
          <motion.div
            key="intro-hint"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-auto flex items-center gap-3 rounded-full border-2 border-ink-900 bg-cream-100 px-4 py-2 text-xs font-bold text-ink-900 shadow-pop sm:text-sm"
          >
            <span>
              Drive with <strong className="text-cobalt-600">WASD / Arrows</strong> or click any zone above!
            </span>
            <button
              type="button"
              onClick={onDismissIntro}
              className="rounded-full border border-ink-900 bg-sunny-500 px-2.5 py-0.5 text-[11px] font-extrabold"
            >
              Got it
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
