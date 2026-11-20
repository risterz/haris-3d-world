'use client'

import { Component, Suspense, useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { PROJECT_BILLBOARDS } from '@/data/worldLayout'
import { projects, type Project } from '@/data/projects'
import { createNameplateTexture, createSignboardTexture } from '@/lib/canvasTextures'

class ScreenErrorBoundary extends Component<
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

function TexturedScreen({ imageUrl }: { imageUrl: string }) {
  const texture = useTexture(imageUrl)
  texture.colorSpace = THREE.SRGBColorSpace
  return (
    <mesh position={[0, 3.6, 0.24]}>
      <planeGeometry args={[6.2, 3.5]} />
      <meshStandardMaterial map={texture} roughness={0.35} />
    </mesh>
  )
}

function ParkingPad({
  position,
  color,
  isActive,
  onClick,
}: {
  position: [number, number]
  color: string
  isActive: boolean
  onClick: () => void
}) {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    const pulse = isActive
      ? 1.04 + Math.sin(clock.elapsedTime * 6) * 0.06
      : 1 + Math.sin(clock.elapsedTime * 2.2) * 0.02
    ringRef.current.scale.set(pulse, pulse, 1)
  })

  return (
    <group
      position={[position[0], 0.04, position[1]]}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.55, 32]} />
        <meshStandardMaterial
          color={isActive ? '#F9DA19' : '#FFFBF2'}
          roughness={0.6}
          transparent
          opacity={isActive ? 0.92 : 0.72}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2.35, 2.85, 32]} />
        <meshBasicMaterial color={isActive ? '#EF4B34' : color} />
      </mesh>
    </group>
  )
}

function ProjectBillboardItem({
  project,
  position,
  rotationY,
  padPosition,
  accentColor,
  isActive,
  onSelectProject,
}: {
  project: Project
  position: [number, number, number]
  rotationY: number
  padPosition: [number, number]
  accentColor: string
  isActive: boolean
  onSelectProject: (project: Project) => void
}) {
  const headerTex = useMemo(
    () =>
      createSignboardTexture({
        eyebrow: project.category,
        title: project.shortTitle,
        subtitle: project.technologies.slice(0, 3).join(' · '),
        footer: 'CLICK OR PARK TO INSPECT →',
        accentColor,
      }),
    [project, accentColor],
  )

  const nameplateTex = useMemo(
    () => createNameplateTexture(project.shortTitle, project.category, accentColor),
    [project.shortTitle, project.category, accentColor],
  )

  const fallbackScreen = (
    <mesh position={[0, 3.6, 0.24]}>
      <planeGeometry args={[6.2, 3.5]} />
      <meshStandardMaterial map={headerTex} roughness={0.45} />
    </mesh>
  )

  return (
    <group>
      <group
        position={position}
        rotation={[0, rotationY, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelectProject(project)
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        {/* Twin wooden/ink support legs */}
        <mesh position={[-2.5, 1.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.22, 3.0, 10]} />
          <meshStandardMaterial color="#1A1E2E" roughness={0.7} />
        </mesh>
        <mesh position={[2.5, 1.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.22, 3.0, 10]} />
          <meshStandardMaterial color="#1A1E2E" roughness={0.7} />
        </mesh>

        {/* Retro OS billboard frame */}
        <mesh position={[0, 3.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.9, 4.75, 0.42]} />
          <meshStandardMaterial
            color={isActive ? '#F9DA19' : '#FFFBF2'}
            roughness={0.45}
          />
        </mesh>

        {/* Colored retro top titlebar strip */}
        <mesh position={[0, 5.88, 0.22]}>
          <boxGeometry args={[6.6, 0.56, 0.08]} />
          <meshStandardMaterial color={accentColor} roughness={0.4} />
        </mesh>

        {/* Dark outline trim behind billboard */}
        <mesh position={[0, 3.85, -0.05]}>
          <boxGeometry args={[7.15, 5.0, 0.34]} />
          <meshStandardMaterial color="#1A1E2E" roughness={0.75} />
        </mesh>

        {/* Real screenshot preview with resilient fallback */}
        <ScreenErrorBoundary fallback={fallbackScreen}>
          <Suspense fallback={fallbackScreen}>
            <TexturedScreen imageUrl={project.image} />
          </Suspense>
        </ScreenErrorBoundary>

        {/* Nameplate bar under screen */}
        <mesh position={[0, 1.56, 0.24]}>
          <planeGeometry args={[6.2, 1.02]} />
          <meshBasicMaterial map={nameplateTex} />
        </mesh>
      </group>

      {/* Interactive glowing parking pad in front */}
      <ParkingPad
        position={padPosition}
        color={accentColor}
        isActive={isActive}
        onClick={() => onSelectProject(project)}
      />
    </group>
  )
}

export function ProjectAlley({
  activePadId,
  onSelectProject,
}: {
  activePadId: string | null
  onSelectProject: (project: Project) => void
}) {
  const projectMap = useMemo(() => {
    const map = new Map<string, Project>()
    projects.forEach((p) => map.set(p.id, p))
    return map
  }, [])

  return (
    <group>
      {PROJECT_BILLBOARDS.map((bb) => {
        const project = projectMap.get(bb.projectId)
        if (!project) return null
        return (
          <ProjectBillboardItem
            key={bb.id}
            project={project}
            position={bb.position}
            rotationY={bb.rotationY}
            padPosition={bb.padPosition}
            accentColor={bb.accentColor}
            isActive={activePadId === bb.id}
            onSelectProject={onSelectProject}
          />
        )
      })}
    </group>
  )
}
