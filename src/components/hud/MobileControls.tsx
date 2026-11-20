'use client'

import { useRef, useState, type MutableRefObject } from 'react'
import { Flame, Megaphone } from 'lucide-react'
import type { ControlInput } from '@/types/world'

interface MobileControlsProps {
  mobileInputRef: MutableRefObject<Partial<ControlInput>>
  onHorn: () => void
}

export function MobileControls({ mobileInputRef, onHorn }: MobileControlsProps) {
  const padRef = useRef<HTMLDivElement>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const activePointerRef = useRef<number | null>(null)

  const updateStick = (clientX: number, clientY: number) => {
    const pad = padRef.current
    if (!pad) return
    const rect = pad.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const maxR = rect.width * 0.38

    let dx = clientX - cx
    let dy = clientY - cy
    const dist = Math.hypot(dx, dy)
    if (dist > maxR) {
      dx = (dx / dist) * maxR
      dy = (dy / dist) * maxR
    }

    setKnob({ x: dx, y: dy })
    const normX = dx / maxR
    const normY = dy / maxR
    // Left is +steerAnalog, Right is -steerAnalog; Up (-Y) is +throttleAnalog
    mobileInputRef.current.steerAnalog = -normX
    mobileInputRef.current.throttleAnalog = -normY
  }

  const resetStick = () => {
    activePointerRef.current = null
    setKnob({ x: 0, y: 0 })
    mobileInputRef.current.steerAnalog = 0
    mobileInputRef.current.throttleAnalog = 0
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-20 flex items-end justify-between px-4 md:hidden">
      {/* Left Virtual Joystick */}
      <div
        ref={padRef}
        onPointerDown={(e) => {
          activePointerRef.current = e.pointerId
          ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
          updateStick(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => {
          if (activePointerRef.current !== e.pointerId) return
          updateStick(e.clientX, e.clientY)
        }}
        onPointerUp={resetStick}
        onPointerCancel={resetStick}
        aria-label="Drive joystick"
        className="touch-joystick-zone pointer-events-auto relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-ink-900 bg-cream-100/90 shadow-pop"
      >
        <div
          style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
          className="h-12 w-12 rounded-full border-2 border-ink-900 bg-cobalt-600 shadow-pop-sm"
        />
      </div>

      {/* Right Action Buttons: Boost, Hop, Horn */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        <button
          type="button"
          onPointerDown={() => {
            mobileInputRef.current.hop = true
          }}
          onPointerUp={() => {
            mobileInputRef.current.hop = false
          }}
          onPointerLeave={() => {
            mobileInputRef.current.hop = false
          }}
          className="touch-joystick-zone pop-btn flex h-12 w-12 items-center justify-center rounded-full bg-cream-100 font-display text-xs font-bold text-ink-900"
        >
          HOP
        </button>

        <button
          type="button"
          onClick={onHorn}
          aria-label="Honk Horn"
          className="touch-joystick-zone pop-btn flex h-12 w-12 items-center justify-center rounded-full bg-sunny-500 text-ink-900"
        >
          <Megaphone className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onPointerDown={() => {
            mobileInputRef.current.boost = true
            mobileInputRef.current.forward = true
          }}
          onPointerUp={() => {
            mobileInputRef.current.boost = false
            mobileInputRef.current.forward = false
          }}
          onPointerLeave={() => {
            mobileInputRef.current.boost = false
            mobileInputRef.current.forward = false
          }}
          aria-label="Turbo Boost"
          className="touch-joystick-zone pop-btn flex h-14 w-14 items-center justify-center rounded-full bg-coral-500 text-cream-50"
        >
          <Flame className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
