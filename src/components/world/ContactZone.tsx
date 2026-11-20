'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CONTACT_PAD } from '@/data/worldLayout'
import { createSignboardTexture } from '@/lib/canvasTextures'

export function ContactZone({
  activePadId,
  onOpenContact,
}: {
  activePadId: string | null
  onOpenContact: () => void
}) {
  const isActive = activePadId === 'pad-contact'
  const flagRef = useRef<THREE.Group>(null)

  const contactTex = useMemo(
    () =>
      createSignboardTexture({
        eyebrow: 'CONTACT PIT-STOP',
        title: 'Say Hello to Haris!',
        subtitle: 'harisharraz02@gmail.com · GitHub · LinkedIn',
        footer: 'PARK OR CLICK TO CONNECT →',
        accentColor: '#EF4B34',
      }),
    [],
  )

  useFrame(({ clock }) => {
    if (!flagRef.current) return
    flagRef.current.rotation.z = isActive
      ? -0.25 + Math.sin(clock.elapsedTime * 8) * 0.25
      : -0.15
  })

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        onOpenContact()
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Contact billboard on left roadside facing East-Southeast across the road & toward camera */}
      <group position={CONTACT_PAD.mailboxPosition} rotation={[0, Math.PI / 2 - 0.18, 0]}>
        {/* Signboard posts */}
        <mesh position={[-2.4, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.2, 3.0, 10]} />
          <meshStandardMaterial color="#1A1E2E" />
        </mesh>
        <mesh position={[2.4, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.2, 3.0, 10]} />
          <meshStandardMaterial color="#1A1E2E" />
        </mesh>

        <mesh position={[0, 3.55, 0]} castShadow>
          <boxGeometry args={[6.4, 3.8, 0.36]} />
          <meshStandardMaterial color="#1A1E2E" roughness={0.7} />
        </mesh>
        <mesh position={[0, 3.55, 0.2]}>
          <planeGeometry args={[6.1, 3.55]} />
          <meshStandardMaterial map={contactTex} roughness={0.4} />
        </mesh>

        {/* Stylized playful toy mailbox beside signboard along the roadside */}
        <group position={[4.5, 0, 0.15]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.2, 2.0, 10]} />
            <meshStandardMaterial color="#8E5838" />
          </mesh>
          <mesh position={[0, 2.25, 0]} castShadow>
            <boxGeometry args={[1.2, 0.9, 1.8]} />
            <meshStandardMaterial color="#2355F5" roughness={0.42} />
          </mesh>
          <mesh position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 1.8, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#2355F5" roughness={0.42} />
          </mesh>
          {/* Red mailbox flag */}
          <group ref={flagRef} position={[0.66, 2.35, 0.2]}>
            <mesh position={[0, 0.38, 0]}>
              <boxGeometry args={[0.08, 0.76, 0.12]} />
              <meshStandardMaterial color="#EF4B34" />
            </mesh>
            <mesh position={[0, 0.72, -0.18]}>
              <boxGeometry args={[0.08, 0.26, 0.38]} />
              <meshStandardMaterial color="#F9DA19" />
            </mesh>
          </group>
        </group>
      </group>

      {/* Contact Pit-Stop parking pad */}
      <group position={[CONTACT_PAD.position[0], 0.04, CONTACT_PAD.position[1]]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.1, 32]} />
          <meshStandardMaterial
            color={isActive ? '#F9DA19' : '#FFFBF2'}
            transparent
            opacity={0.88}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[2.9, 3.45, 32]} />
          <meshBasicMaterial color={isActive ? '#EF4B34' : '#2355F5'} />
        </mesh>
      </group>
    </group>
  )
}
