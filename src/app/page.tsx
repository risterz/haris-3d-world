'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { CAR_SPAWN, ZONE_TELEPORTS } from '@/data/worldLayout'
import { projects, type Project } from '@/data/projects'
import { soundEngine } from '@/lib/soundEngine'
import type {
  ControlInput,
  TeleportCommand,
  VehicleTelemetry,
  WorldZoneId,
  ZonePadTarget,
} from '@/types/world'
import { TopNavBar } from '@/components/hud/TopNavBar'
import { Minimap } from '@/components/hud/Minimap'
import { Speedometer } from '@/components/hud/Speedometer'
import { ZonePromptBanner } from '@/components/hud/ZonePromptBanner'
import { MobileControls } from '@/components/hud/MobileControls'
import { ProjectWindowModal } from '@/components/hud/ProjectWindowModal'
import { ContactModal } from '@/components/hud/ContactModal'
import { QuickViewDrawer, type QuickViewTab } from '@/components/hud/QuickViewDrawer'
import { WelcomeModal } from '@/components/hud/WelcomeModal'

const WorldCanvas = dynamic(
  () => import('@/components/world/WorldCanvas').then((m) => m.WorldCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center bg-sand-300 p-6 text-center">
        <div className="rounded-3xl border-2 border-ink-900 bg-cream-100 px-8 py-6 shadow-pop-lg">
          <div className="font-display text-3xl font-bold text-cobalt-600">
            Starting Haris&apos;s 3D World...
          </div>
          <p className="mt-2 text-sm font-semibold text-ink-800">
            Warming up the toy truck &amp; painting the roads
          </p>
        </div>
      </div>
    ),
  },
)

function inferZoneFromPosition(x: number, z: number): WorldZoneId {
  if (z < -12) return 'projects'
  if (z > 15) return 'contact'
  if (x > 16) return 'skills'
  if (x < -16) return 'journey'
  return 'start'
}

export default function Home() {
  const [telemetry, setTelemetry] = useState<VehicleTelemetry>({
    x: CAR_SPAWN.x,
    y: 0,
    z: CAR_SPAWN.z,
    heading: CAR_SPAWN.heading,
    speed: 0,
    boost: 1,
    grounded: true,
    drifting: false,
  })
  const [activePad, setActivePad] = useState<ZonePadTarget | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [welcomeOpen, setWelcomeOpen] = useState(true)
  const [contactOpen, setContactOpen] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [quickViewTab, setQuickViewTab] = useState<QuickViewTab>('projects')
  const [showIntroHint, setShowIntroHint] = useState(true)
  const [muted, setMuted] = useState(true)
  const [teleportCommand, setTeleportCommand] = useState<TeleportCommand | null>(null)
  const [resetSignal, setResetSignal] = useState(0)

  const mobileInputRef = useRef<Partial<ControlInput>>({})
  const teleportIdRef = useRef(0)

  const anyModalOpen = Boolean(welcomeOpen || selectedProject || contactOpen || quickViewOpen)
  const activeZone = inferZoneFromPosition(telemetry.x, telemetry.z)

  const handleTeleport = useCallback((zoneId: WorldZoneId) => {
    const dest = ZONE_TELEPORTS[zoneId]
    teleportIdRef.current += 1
    setTeleportCommand({
      id: teleportIdRef.current,
      x: dest.x,
      z: dest.z,
      heading: dest.heading,
      zoneId,
    })
    setShowIntroHint(false)
  }, [])

  const handleResetWorld = useCallback(() => {
    setResetSignal((c) => c + 1)
    soundEngine.playPadChime()
  }, [])

  const handleToggleMute = useCallback(() => {
    const nextMuted = soundEngine.toggleMute()
    setMuted(nextMuted)
  }, [])

  const handleHorn = useCallback(() => {
    soundEngine.playHorn()
    setMuted(soundEngine.isMuted())
  }, [])

  const openQuickViewOnTab = useCallback((tab: QuickViewTab) => {
    setWelcomeOpen(false)
    setSelectedProject(null)
    setContactOpen(false)
    setQuickViewTab(tab)
    setQuickViewOpen(true)
  }, [])

  const handleActivatePad = useCallback(
    (pad: ZonePadTarget) => {
      if (pad.kind === 'project' && pad.projectId) {
        const proj = projects.find((p) => p.id === pad.projectId)
        if (proj) setSelectedProject(proj)
      } else if (pad.kind === 'skills') {
        openQuickViewOnTab('skills')
      } else if (pad.kind === 'journey') {
        openQuickViewOnTab('journey')
      } else if (pad.kind === 'contact') {
        setContactOpen(true)
      }
    },
    [openQuickViewOnTab],
  )

  // Global shortcuts: Enter opens active pad, R resets world
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (anyModalOpen) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return

      if (e.key === 'Enter' && activePad) {
        e.preventDefault()
        handleActivatePad(activePad)
      } else if (e.code === 'KeyR') {
        handleResetWorld()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activePad, anyModalOpen, handleActivatePad, handleResetWorld])

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-sand-300">
      {/* Full-Viewport Interactive 3D Playground */}
      <WorldCanvas
        activePad={activePad}
        mobileInputRef={mobileInputRef}
        teleportCommand={teleportCommand}
        resetSignal={resetSignal}
        inputDisabled={anyModalOpen}
        onTelemetry={setTelemetry}
        onActivePadChange={setActivePad}
        onSelectProject={(proj) => setSelectedProject(proj)}
        onOpenSkills={() => openQuickViewOnTab('skills')}
        onOpenJourney={() => openQuickViewOnTab('journey')}
        onOpenContact={() => setContactOpen(true)}
        onOpenQuickView={() => openQuickViewOnTab('projects')}
        onFirstMove={() => setShowIntroHint(false)}
      />

      {/* Playful Retro-Pop HUD */}
      <TopNavBar
        activeZone={activeZone}
        muted={muted}
        onTeleport={handleTeleport}
        onOpenQuickView={() => openQuickViewOnTab('projects')}
        onOpenWelcome={() => setWelcomeOpen(true)}
        onResetWorld={handleResetWorld}
        onToggleMute={handleToggleMute}
      />

      <Minimap telemetry={telemetry} onTeleport={handleTeleport} />

      <Speedometer telemetry={telemetry} onHorn={handleHorn} />

      <ZonePromptBanner
        activePad={anyModalOpen ? null : activePad}
        showIntroHint={!anyModalOpen && showIntroHint}
        onActivatePad={handleActivatePad}
        onDismissIntro={() => setShowIntroHint(false)}
      />

      {!anyModalOpen && (
        <MobileControls mobileInputRef={mobileInputRef} onHorn={handleHorn} />
      )}

      {/* Interactive Modals & Quick View Drawer */}
      <WelcomeModal
        open={welcomeOpen}
        onStartDriving={() => setWelcomeOpen(false)}
        onOpenQuickView={() => openQuickViewOnTab('projects')}
      />

      <ProjectWindowModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      <QuickViewDrawer
        open={quickViewOpen}
        initialTab={quickViewTab}
        onClose={() => setQuickViewOpen(false)}
        onInspectProject={(proj) => {
          setQuickViewOpen(false)
          setSelectedProject(proj)
        }}
      />
    </main>
  )
}
