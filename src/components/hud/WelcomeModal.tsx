'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Car, GraduationCap, LayoutGrid, MapPin, Sparkles, X } from 'lucide-react'
import { personalInfo } from '@/data/personal'

interface WelcomeModalProps {
  open: boolean
  onStartDriving: () => void
  onOpenQuickView: () => void
}

export function WelcomeModal({
  open,
  onStartDriving,
  onOpenQuickView,
}: WelcomeModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault()
        onStartDriving()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onStartDriving])

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Warm translucent backdrop keeping the live 3D world visible behind */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onStartDriving}
            className="fixed inset-0 bg-ink-900/45 backdrop-blur-[2px]"
          />

          {/* Retro-Pop Playful Intro Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border-2 border-ink-900 bg-cream-100 shadow-pop-lg"
          >
            {/* Window Titlebar */}
            <div className="flex items-center justify-between border-b-2 border-ink-900 bg-cobalt-600 px-4 py-2.5 text-cream-50">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-ink-900 bg-coral-500" />
                <span className="h-3.5 w-3.5 rounded-full border-2 border-ink-900 bg-sunny-500" />
                <span className="h-3.5 w-3.5 rounded-full border-2 border-ink-900 bg-cream-100" />
                <span className="ml-2 font-display text-sm font-bold tracking-wide">
                  haris-world.exe — Welcome!
                </span>
              </div>

              <button
                type="button"
                onClick={onStartDriving}
                aria-label="Close welcome popup"
                className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-ink-900 bg-cream-100 text-ink-900 hover:bg-sunny-500"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 py-6 text-center sm:px-8 sm:py-7">
              {/* Playful status pill */}
              <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink-900 bg-sunny-500 px-3.5 py-1 text-xs font-extrabold text-ink-900 shadow-pop-sm">
                <Sparkles className="h-3.5 w-3.5 text-coral-600" aria-hidden="true" />
                <span>{personalInfo.availability.status}</span>
              </div>

              {/* Bold Chunky Cobalt Headline (inspired by reference) */}
              <h1
                id="welcome-modal-title"
                className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-cobalt-600 sm:text-5xl"
              >
                {personalInfo.name.split(' Bin ')[0]}
              </h1>
              <p className="mt-1 font-display text-lg font-bold text-ink-900 sm:text-xl">
                Full-Stack Developer &amp; Interactive 3D Builder.
              </p>

              {/* Short Bio */}
              <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed font-medium text-ink-800 sm:text-sm">
                Welcome to my drivable 3D playground! Hop into the toy truck to cruise
                through my live web projects, skills, and engineering journey — or jump
                straight into Quick View.
              </p>

              {/* Real Profile Badges */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-ink-900">
                <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink-900 bg-cream-50 px-3 py-1">
                  <GraduationCap className="h-3.5 w-3.5 text-cobalt-600" aria-hidden="true" />
                  <span>B.Sc (Hons.) Netcentric Computing · UiTM</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink-900 bg-cream-50 px-3 py-1">
                  <MapPin className="h-3.5 w-3.5 text-coral-500" aria-hidden="true" />
                  <span>{personalInfo.location}</span>
                </span>
              </div>

              {/* Compact Controls Strip */}
              <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border-2 border-ink-900 bg-cream-200/80 p-3 text-left sm:grid-cols-4">
                <div className="rounded-xl border border-ink-900/20 bg-cream-50 px-2.5 py-2 text-center">
                  <div className="font-display text-xs font-bold text-cobalt-600">
                    WASD / ↑↓←→
                  </div>
                  <div className="text-[11px] font-bold text-ink-800">Drive Truck</div>
                </div>
                <div className="rounded-xl border border-ink-900/20 bg-cream-50 px-2.5 py-2 text-center">
                  <div className="font-display text-xs font-bold text-coral-500">SHIFT</div>
                  <div className="text-[11px] font-bold text-ink-800">Turbo Boost</div>
                </div>
                <div className="rounded-xl border border-ink-900/20 bg-cream-50 px-2.5 py-2 text-center">
                  <div className="font-display text-xs font-bold text-cobalt-600">SPACE</div>
                  <div className="text-[11px] font-bold text-ink-800">Bunny Hop</div>
                </div>
                <div className="rounded-xl border border-ink-900/20 bg-cream-50 px-2.5 py-2 text-center">
                  <div className="font-display text-xs font-bold text-ink-900">H / ENTER</div>
                  <div className="text-[11px] font-bold text-ink-800">Horn &amp; Open</div>
                </div>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onStartDriving}
                  className="pop-btn inline-flex w-full items-center justify-center gap-2 rounded-full bg-sunny-500 px-7 py-3 font-display text-base font-bold text-ink-900 sm:w-auto sm:text-lg"
                >
                  <Car className="h-5 w-5" aria-hidden="true" />
                  <span>Start Driving!</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenQuickView}
                  className="pop-btn inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream-50 px-6 py-3 font-display text-sm font-bold text-cobalt-600 sm:w-auto sm:text-base"
                >
                  <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                  <span>Quick View Portfolio</span>
                </button>
              </div>
            </div>

            {/* Signature Coral & Cream Checkered Ribbon */}
            <div className="checker-ribbon h-4 w-full shrink-0 border-t-2 border-ink-900" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
