'use client'

import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { INITIAL_PROPS } from '@/data/worldLayout'
import { createPropStates, type PropBodyState } from '@/lib/vehiclePhysics'
import { createBlockLetterTexture, createCheckerTexture } from '@/lib/canvasTextures'

interface InteractivePropsProps {
  propsStateRef: MutableRefObject<PropBodyState[]>
  resetSignal: number
}

export function InteractiveProps({ propsStateRef, resetSignal }: InteractivePropsProps) {
  const meshRefs = useRef<Array<THREE.Group | null>>([])

  const ballTexture = useMemo(() => createCheckerTexture('#2355F5', '#FFFBF2', 6), [])

  const letterTextures = useMemo(() => {
    const map: Record<string, THREE.CanvasTexture> = {}
    INITIAL_PROPS.forEach((p) => {
      if ((p.kind === 'letter' || p.kind === 'skillCube') && p.label) {
        const textColor = p.color === '#F9DA19' ? '#1A1E2E' : '#FFFBF2'
        map[p.id] = createBlockLetterTexture(p.label, p.color, textColor)
      }
    })
    return map
  }, [])

  // Reset prop physics cleanly whenever resetSignal increments
  useEffect(() => {
    if (resetSignal === 0) return
    propsStateRef.current = createPropStates(INITIAL_PROPS)
  }, [resetSignal, propsStateRef])

  useFrame(() => {
    const states = propsStateRef.current
    for (let i = 0; i < states.length; i++) {
      const grp = meshRefs.current[i]
      const s = states[i]
      if (!grp || !s) continue
      grp.position.set(s.x, s.y, s.z)
      grp.rotation.set(s.rx, s.ry, s.rz)
    }
  })

  return (
    <group>
      {INITIAL_PROPS.map((prop, idx) => (
        <group
          key={prop.id}
          ref={(el) => {
            meshRefs.current[idx] = el
          }}
          position={prop.position}
        >
          {prop.kind === 'letter' && (
            <mesh castShadow receiveShadow>
              <boxGeometry args={prop.size} />
              <meshStandardMaterial
                map={letterTextures[prop.id]}
                roughness={0.42}
                metalness={0.04}
              />
            </mesh>
          )}

          {prop.kind === 'skillCube' && (
            <mesh castShadow receiveShadow>
              <boxGeometry args={prop.size} />
              <meshStandardMaterial map={letterTextures[prop.id]} roughness={0.45} />
            </mesh>
          )}

          {prop.kind === 'cone' && (
            <group>
              <mesh position={[0, -0.46, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.82, 0.14, 0.82]} />
                <meshStandardMaterial color="#1A1E2E" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.05, 0]} castShadow>
                <coneGeometry args={[0.35, 1.0, 12]} />
                <meshStandardMaterial color="#FF6B2B" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.2, 0.27, 0.22, 12]} />
                <meshStandardMaterial color="#FFFBF2" roughness={0.45} />
              </mesh>
            </group>
          )}

          {prop.kind === 'pin' && (
            <group>
              <mesh position={[0, -0.25, 0]} castShadow>
                <cylinderGeometry args={[0.22, 0.28, 1.0, 12]} />
                <meshStandardMaterial color="#FFFBF2" roughness={0.35} />
              </mesh>
              <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.14, 0.19, 0.24, 12]} />
                <meshStandardMaterial color="#EF4B34" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.58, 0]} castShadow>
                <sphereGeometry args={[0.2, 12, 12]} />
                <meshStandardMaterial color="#FFFBF2" roughness={0.35} />
              </mesh>
            </group>
          )}

          {prop.kind === 'crate' && (
            <group>
              <mesh castShadow receiveShadow>
                <boxGeometry args={prop.size} />
                <meshStandardMaterial color={prop.color} roughness={0.75} />
              </mesh>
              <mesh>
                <boxGeometry
                  args={[prop.size[0] + 0.06, prop.size[1] * 0.16, prop.size[2] + 0.06]}
                />
                <meshStandardMaterial color="#8E5838" roughness={0.85} />
              </mesh>
            </group>
          )}

          {prop.kind === 'ball' && (
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[prop.radius, 20, 16]} />
              <meshStandardMaterial map={ballTexture} roughness={0.35} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}
