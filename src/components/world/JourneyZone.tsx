'use client'

import { useMemo } from 'react'
import { JOURNEY_PAD, JOURNEY_SIGNS } from '@/data/worldLayout'
import { createSignboardTexture } from '@/lib/canvasTextures'

function JourneyBoard({
  title,
  organization,
  period,
  position,
  rotationY,
  color,
  onOpenJourney,
}: {
  title: string
  organization: string
  period: string
  position: [number, number, number]
  rotationY: number
  color: string
  onOpenJourney: () => void
}) {
  const boardTex = useMemo(
    () =>
      createSignboardTexture({
        eyebrow: period,
        title,
        subtitle: organization,
        footer: 'READ FULL TIMELINE →',
        accentColor: color,
      }),
    [title, organization, period, color],
  )

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onOpenJourney()
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Twin posts */}
      <mesh position={[-1.9, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 2.6, 8]} />
        <meshStandardMaterial color="#8E5838" roughness={0.85} />
      </mesh>
      <mesh position={[1.9, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 2.6, 8]} />
        <meshStandardMaterial color="#8E5838" roughness={0.85} />
      </mesh>

      {/* Sign frame */}
      <mesh position={[0, 3.05, 0]} castShadow>
        <boxGeometry args={[5.4, 3.25, 0.3]} />
        <meshStandardMaterial color="#1A1E2E" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.05, 0.17]}>
        <planeGeometry args={[5.15, 3.02]} />
        <meshStandardMaterial map={boardTex} roughness={0.42} />
      </mesh>
    </group>
  )
}

export function JourneyZone({
  activePadId,
  onOpenJourney,
}: {
  activePadId: string | null
  onOpenJourney: () => void
}) {
  const isActive = activePadId === 'pad-journey'

  return (
    <group>
      {JOURNEY_SIGNS.map((sign) => (
        <JourneyBoard
          key={sign.id}
          title={sign.title}
          organization={sign.organization}
          period={sign.period}
          position={sign.position}
          rotationY={sign.rotationY}
          color={sign.color}
          onOpenJourney={onOpenJourney}
        />
      ))}

      {/* Central Journey Road parking pad */}
      <group
        position={[JOURNEY_PAD.position[0], 0.04, JOURNEY_PAD.position[1]]}
        onClick={(e) => {
          e.stopPropagation()
          onOpenJourney()
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.0, 32]} />
          <meshStandardMaterial
            color={isActive ? '#F9DA19' : '#FFFBF2'}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[2.8, 3.35, 32]} />
          <meshBasicMaterial color={isActive ? '#EF4B34' : '#39A96B'} />
        </mesh>
      </group>
    </group>
  )
}
