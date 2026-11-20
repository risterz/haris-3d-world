'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  ROAD_SEGMENTS,
  STUNT_RAMP,
  TREE_POSITIONS,
  WORLD_BOUNDS,
} from '@/data/worldLayout'
import {
  createCheckerTexture,
  createGroundTextTexture,
  createRampStripeTexture,
  createRoadCategoryBannerTexture,
} from '@/lib/canvasTextures'

function StylizedTree({
  position,
  scale,
  tint,
}: {
  position: [number, number, number]
  scale: number
  tint: string
}) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.36, 2.0, 8]} />
        <meshStandardMaterial color="#8E5838" roughness={0.85} />
      </mesh>
      {/* Tiered playful low-poly foliage */}
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.65, 2.3, 8]} />
        <meshStandardMaterial color={tint} roughness={0.72} flatShading />
      </mesh>
      <mesh position={[0, 3.65, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.15, 1.85, 8]} />
        <meshStandardMaterial color={tint} roughness={0.68} flatShading />
      </mesh>
    </group>
  )
}

function DriftingClouds() {
  const groupRef = useRef<THREE.Group>(null)
  const clouds = useMemo(
    () => [
      { pos: [-28, 16, -24] as [number, number, number], scale: 1.5 },
      { pos: [26, 18, -32] as [number, number, number], scale: 1.8 },
      { pos: [-18, 15, 18] as [number, number, number], scale: 1.3 },
      { pos: [34, 17, 14] as [number, number, number], scale: 1.4 },
      { pos: [0, 19, -46] as [number, number, number], scale: 1.6 },
    ],
    [],
  )

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.children.forEach((child, i) => {
      child.position.x = clouds[i].pos[0] + Math.sin(t * 0.12 + i * 1.4) * 3.5
      child.position.y = clouds[i].pos[1] + Math.sin(t * 0.45 + i) * 0.35
    })
  })

  return (
    <group ref={groupRef}>
      {clouds.map((c, idx) => (
        <group key={idx} position={c.pos} scale={c.scale}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.4, 12, 10]} />
            <meshStandardMaterial color="#FFFBF2" roughness={0.95} />
          </mesh>
          <mesh position={[-1.2, -0.25, 0.2]}>
            <sphereGeometry args={[1.0, 12, 10]} />
            <meshStandardMaterial color="#FFFBF2" roughness={0.95} />
          </mesh>
          <mesh position={[1.25, -0.2, -0.15]}>
            <sphereGeometry args={[1.05, 12, 10]} />
            <meshStandardMaterial color="#FFFBF2" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function StuntRampMesh() {
  const rampTex = useMemo(() => createRampStripeTexture(), [])
  const rampGeo = useMemo(() => {
    // Wedge geometry rising from +Z (height 0) to -Z (height maxHeight)
    const shape = new THREE.Shape()
    const halfL = STUNT_RAMP.length / 2
    shape.moveTo(-halfL, 0)
    shape.lineTo(halfL, 0)
    shape.lineTo(halfL, STUNT_RAMP.maxHeight)
    shape.closePath()

    const extrude = new THREE.ExtrudeGeometry(shape, {
      depth: STUNT_RAMP.width,
      bevelEnabled: false,
    })
    extrude.center()
    // Rotate so width is along X and slope rises toward -Z
    extrude.rotateY(Math.PI / 2)
    return extrude
  }, [])

  const slopeLength = Math.hypot(STUNT_RAMP.length, STUNT_RAMP.maxHeight)
  const slopeAngle = Math.atan2(STUNT_RAMP.maxHeight, STUNT_RAMP.length)

  return (
    <group position={[STUNT_RAMP.x, 0, STUNT_RAMP.z]}>
      <mesh
        geometry={rampGeo}
        position={[0, STUNT_RAMP.maxHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#2355F5" roughness={0.55} />
      </mesh>
      {/* Striped chevron deck surface */}
      <mesh
        position={[0, STUNT_RAMP.maxHeight / 2 + 0.03, 0]}
        rotation={[-Math.PI / 2 + slopeAngle, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[STUNT_RAMP.width - 0.12, slopeLength]} />
        <meshStandardMaterial map={rampTex} roughness={0.5} />
      </mesh>
    </group>
  )
}

export function TerrainAndRoads() {
  const textures = useMemo(() => {
    const checker = createCheckerTexture('#EF4B34', '#FFFBF2', 12)
    checker.repeat.set(6, 1)

    return {
      checker,
      controlsDecal: createGroundTextTexture(
        ['WASD / ARROWS TO DRIVE', 'SHIFT BOOST · SPACE HOP · H HORN'],
        {
          color: '#F9DA19',
          accentColor: '#FFFBF2',
          strokeColor: '#1A1E2E',
          fontSize: 78,
          subFontSize: 48,
        },
      ),
      projectsDir: createRoadCategoryBannerTexture('▲ PROJECTS ALLEY ▲', {
        bgColor: '#2355F5',
        textColor: '#FFFBF2',
      }),
      skillsDir: createRoadCategoryBannerTexture('SKILLS & RAMP ▶', {
        bgColor: '#F9DA19',
        textColor: '#1A1E2E',
      }),
      journeyDir: createRoadCategoryBannerTexture('◀ JOURNEY ROAD', {
        bgColor: '#39A96B',
        textColor: '#FFFBF2',
      }),
      contactDir: createRoadCategoryBannerTexture('▼ CONTACT PIT-STOP ▼', {
        bgColor: '#EF4B34',
        textColor: '#FFFBF2',
      }),
      bowlingLabel: createRoadCategoryBannerTexture('STUNT RAMP & BOWLING!', {
        bgColor: '#F9DA19',
        textColor: '#1A1E2E',
      }),
    }
  }, [])

  const fencePosts = useMemo(() => {
    const posts: Array<[number, number, number]> = []
    for (let x = WORLD_BOUNDS.minX; x <= WORLD_BOUNDS.maxX; x += 6.5) {
      posts.push([x, 0.55, WORLD_BOUNDS.minZ])
      posts.push([x, 0.55, WORLD_BOUNDS.maxZ])
    }
    for (let z = WORLD_BOUNDS.minZ + 6.5; z <= WORLD_BOUNDS.maxZ - 6.5; z += 6.5) {
      posts.push([WORLD_BOUNDS.minX, 0.55, z])
      posts.push([WORLD_BOUNDS.maxX, 0.55, z])
    }
    return posts
  }, [])

  return (
    <group>
      {/* Sunlit apricot-sand ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -6]} receiveShadow>
        <planeGeometry args={[280, 280]} />
        <meshStandardMaterial color="#F4C89A" roughness={0.92} metalness={0.02} />
      </mesh>

      {/* Start Plaza warm cream circle + checkered border strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 2]} receiveShadow>
        <circleGeometry args={[12.5, 48]} />
        <meshStandardMaterial color="#FFF4DF" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 12.2]} receiveShadow>
        <planeGeometry args={[18, 1.3]} />
        <meshStandardMaterial map={textures.checker} roughness={0.7} />
      </mesh>

      {/* Paved roads */}
      {ROAD_SEGMENTS.map((road) => (
        <group key={road.id} position={road.position}>
          {/* Subtle sandy curb edge */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.004, 0]} receiveShadow>
            <planeGeometry args={[road.width + 0.9, road.length + 0.9]} />
            <meshStandardMaterial color="#FFFBF2" roughness={0.85} />
          </mesh>
          {/* Slate asphalt surface */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[road.width, road.length]} />
            <meshStandardMaterial color="#495264" roughness={0.88} />
          </mesh>
          {/* Dashed center markings */}
          {road.dashedAxis === 'z' &&
            Array.from({ length: Math.floor(road.length / 4.5) }).map((_, i) => (
              <mesh
                key={i}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.01, -road.length / 2 + 2.5 + i * 4.5]}
              >
                <planeGeometry args={[0.26, 2.0]} />
                <meshBasicMaterial color="#DCE1EB" />
              </mesh>
            ))}
          {road.dashedAxis === 'x' &&
            Array.from({ length: Math.floor(road.width / 4.5) }).map((_, i) => (
              <mesh
                key={i}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[-road.width / 2 + 2.5 + i * 4.5, 0.01, 0]}
              >
                <planeGeometry args={[2.0, 0.26]} />
                <meshBasicMaterial color="#DCE1EB" />
              </mesh>
            ))}
        </group>
      ))}

      {/* Painted floor typography decals */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 10.1]} renderOrder={10}>
        <planeGeometry args={[13.6, 4.1]} />
        <meshBasicMaterial map={textures.controlsDecal} transparent depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, -10.5]} renderOrder={10}>
        <planeGeometry args={[12.4, 3.3]} />
        <meshBasicMaterial map={textures.projectsDir} transparent depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[14.5, 0.07, 0]} renderOrder={10}>
        <planeGeometry args={[12.4, 3.3]} />
        <meshBasicMaterial map={textures.skillsDir} transparent depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-14.5, 0.07, 0]} renderOrder={10}>
        <planeGeometry args={[12.4, 3.3]} />
        <meshBasicMaterial map={textures.journeyDir} transparent depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 15.2]} renderOrder={10}>
        <planeGeometry args={[12.8, 3.4]} />
        <meshBasicMaterial map={textures.contactDir} transparent depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[36, 0.07, 21.2]} renderOrder={10}>
        <planeGeometry args={[13.2, 3.5]} />
        <meshBasicMaterial map={textures.bowlingLabel} transparent depthWrite={false} />
      </mesh>

      {/* Stunt Ramp */}
      <StuntRampMesh />

      {/* Low-poly trees */}
      {TREE_POSITIONS.map((tree, idx) => (
        <StylizedTree
          key={idx}
          position={tree.position}
          scale={tree.scale}
          tint={tree.tint}
        />
      ))}

      {/* Playful perimeter curb rails & posts */}
      {fencePosts.map((pos, idx) => (
        <mesh key={idx} position={pos} castShadow receiveShadow>
          <boxGeometry args={[0.55, 1.1, 0.55]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#EF4B34' : '#FFFBF2'}
            roughness={0.65}
          />
        </mesh>
      ))}

      {/* Drifting toy clouds */}
      <DriftingClouds />
    </group>
  )
}
