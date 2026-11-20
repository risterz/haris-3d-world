'use client'

import {
  Component,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import { Canvas } from '@react-three/fiber'
import { INITIAL_PROPS } from '@/data/worldLayout'
import { createPropStates, type PropBodyState } from '@/lib/vehiclePhysics'
import type { Project } from '@/data/projects'
import type {
  ControlInput,
  TeleportCommand,
  VehicleTelemetry,
  ZonePadTarget,
} from '@/types/world'
import { TerrainAndRoads } from './TerrainAndRoads'
import { Vehicle } from './Vehicle'
import { InteractiveProps } from './InteractiveProps'
import { ProjectAlley } from './ProjectAlley'
import { SkillsZone } from './SkillsZone'
import { JourneyZone } from './JourneyZone'
import { ContactZone } from './ContactZone'

class WebGLErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

interface WorldCanvasProps {
  activePad: ZonePadTarget | null
  mobileInputRef: MutableRefObject<Partial<ControlInput>>
  teleportCommand: TeleportCommand | null
  resetSignal: number
  inputDisabled: boolean
  onTelemetry: (telemetry: VehicleTelemetry) => void
  onActivePadChange: (pad: ZonePadTarget | null) => void
  onSelectProject: (project: Project) => void
  onOpenSkills: () => void
  onOpenJourney: () => void
  onOpenContact: () => void
  onOpenQuickView: () => void
  onFirstMove: () => void
}

function WebGLFallbackView({ onOpenQuickView }: { onOpenQuickView: () => void }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-cream-100 p-6 text-center">
      <div className="max-w-md rounded-3xl border-2 border-ink-900 bg-cream-50 p-8 shadow-pop-lg">
        <div className="checker-ribbon mb-5 h-4 w-full rounded-full border-2 border-ink-900" />
        <h1 className="font-display text-4xl font-bold text-cobalt-600">
          Haris Al-Harraz
        </h1>
        <p className="mt-2 font-medium text-ink-800">
          Your device does not currently have WebGL enabled for the 3D driving world.
          Explore every project, skill, and milestone in Quick View instead!
        </p>
        <button
          type="button"
          onClick={onOpenQuickView}
          className="pop-btn mt-6 rounded-full bg-sunny-500 px-6 py-3 font-display text-lg font-bold text-ink-900"
        >
          Open Portfolio Quick View
        </button>
      </div>
    </div>
  )
}

export function WorldCanvas({
  activePad,
  mobileInputRef,
  teleportCommand,
  resetSignal,
  inputDisabled,
  onTelemetry,
  onActivePadChange,
  onSelectProject,
  onOpenSkills,
  onOpenJourney,
  onOpenContact,
  onOpenQuickView,
  onFirstMove,
}: WorldCanvasProps) {
  const [webglReady, setWebglReady] = useState<boolean>(true)
  const propsStateRef = useRef<PropBodyState[]>(createPropStates(INITIAL_PROPS))

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      if (!gl) setWebglReady(false)
    } catch {
      setWebglReady(false)
    }
  }, [])

  const fallback = <WebGLFallbackView onOpenQuickView={onOpenQuickView} />

  if (!webglReady) {
    return fallback
  }

  return (
    <WebGLErrorBoundary fallback={fallback}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 36, near: 0.5, far: 240, position: [11.5, 14.5, 22.5] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        className="h-full w-full"
      >
        {/* Warm sunlit sky & horizon fog */}
        <color attach="background" args={['#F6D4AE']} />
        <fog attach="fog" args={['#F6D4AE', 52, 138]} />

        {/* Miniature-world warm lighting rig */}
        <hemisphereLight args={['#FFFBF2', '#D98D57', 0.92]} />
        <ambientLight intensity={0.28} color="#FFF6E8" />
        <directionalLight
          position={[28, 44, 24]}
          intensity={1.55}
          color="#FFF7E6"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-65}
          shadow-camera-right={65}
          shadow-camera-top={65}
          shadow-camera-bottom={-65}
          shadow-camera-near={5}
          shadow-camera-far={140}
          shadow-bias={-0.0005}
        />

        <TerrainAndRoads />

        <InteractiveProps propsStateRef={propsStateRef} resetSignal={resetSignal} />

        <ProjectAlley
          activePadId={activePad?.id ?? null}
          onSelectProject={onSelectProject}
        />

        <SkillsZone activePadId={activePad?.id ?? null} onOpenSkills={onOpenSkills} />

        <JourneyZone
          activePadId={activePad?.id ?? null}
          onOpenJourney={onOpenJourney}
        />

        <ContactZone
          activePadId={activePad?.id ?? null}
          onOpenContact={onOpenContact}
        />

        <Vehicle
          mobileInputRef={mobileInputRef}
          propsStateRef={propsStateRef}
          teleportCommand={teleportCommand}
          resetSignal={resetSignal}
          inputDisabled={inputDisabled}
          onTelemetry={onTelemetry}
          onActivePadChange={onActivePadChange}
          onFirstMove={onFirstMove}
        />
      </Canvas>
    </WebGLErrorBoundary>
  )
}
