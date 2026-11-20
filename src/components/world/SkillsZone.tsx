'use client'

import { useMemo } from 'react'
import { SKILL_ISLANDS } from '@/data/worldLayout'
import { createSignboardTexture } from '@/lib/canvasTextures'

function SkillIslandCard({
  title,
  subtitle,
  position,
  padPosition,
  color,
  isActive,
  onOpenSkills,
}: {
  title: string
  subtitle: string
  position: [number, number, number]
  padPosition: [number, number]
  color: string
  isActive: boolean
  onOpenSkills: () => void
}) {
  const boardTex = useMemo(
    () =>
      createSignboardTexture({
        eyebrow: 'SKILLS ISLAND',
        title,
        subtitle,
        footer: 'OPEN FULL SKILLS SHEET →',
        accentColor: color,
      }),
    [title, subtitle, color],
  )

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        onOpenSkills()
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Colored platform base */}
      <group position={position}>
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[4.2, 4.6, 0.4, 24]} />
          <meshStandardMaterial color={color} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.42, 0]} receiveShadow>
          <cylinderGeometry args={[3.65, 3.8, 0.08, 24]} />
          <meshStandardMaterial color="#FFFBF2" roughness={0.75} />
        </mesh>

        {/* Signboard */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.2, 2.2, 10]} />
          <meshStandardMaterial color="#1A1E2E" />
        </mesh>
        <mesh position={[0, 3.3, 0]} castShadow>
          <boxGeometry args={[5.4, 3.25, 0.3]} />
          <meshStandardMaterial color="#1A1E2E" roughness={0.7} />
        </mesh>
        <mesh position={[0, 3.3, 0.17]}>
          <planeGeometry args={[5.15, 3.05]} />
          <meshStandardMaterial map={boardTex} roughness={0.4} />
        </mesh>
      </group>

      {/* Parking pad */}
      <group position={[padPosition[0], 0.04, padPosition[1]]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.3, 28]} />
          <meshStandardMaterial
            color={isActive ? '#F9DA19' : '#FFFBF2'}
            transparent
            opacity={0.82}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[2.1, 2.55, 28]} />
          <meshBasicMaterial color={isActive ? '#EF4B34' : color} />
        </mesh>
      </group>
    </group>
  )
}

export function SkillsZone({
  activePadId,
  onOpenSkills,
}: {
  activePadId: string | null
  onOpenSkills: () => void
}) {
  return (
    <group>
      {SKILL_ISLANDS.map((island) => (
        <SkillIslandCard
          key={island.id}
          title={island.title}
          subtitle={island.subtitle}
          position={island.position}
          padPosition={island.padPosition}
          color={island.color}
          isActive={activePadId === island.id}
          onOpenSkills={onOpenSkills}
        />
      ))}
    </group>
  )
}
