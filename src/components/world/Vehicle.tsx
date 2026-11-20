'use client'

import { useEffect, useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ALL_PARKING_PADS, CAR_SPAWN } from '@/data/worldLayout'
import {
  createInitialVehicleState,
  stepProps,
  stepVehicle,
  type PropBodyState,
  type VehiclePhysicsState,
} from '@/lib/vehiclePhysics'
import { soundEngine } from '@/lib/soundEngine'
import type {
  ControlInput,
  TeleportCommand,
  VehicleTelemetry,
  ZonePadTarget,
} from '@/types/world'

interface VehicleProps {
  mobileInputRef: MutableRefObject<Partial<ControlInput>>
  propsStateRef: MutableRefObject<PropBodyState[]>
  teleportCommand: TeleportCommand | null
  resetSignal: number
  inputDisabled: boolean
  onTelemetry: (telemetry: VehicleTelemetry) => void
  onActivePadChange: (pad: ZonePadTarget | null) => void
  onFirstMove: () => void
}

const PUFF_COUNT = 14

export function Vehicle({
  mobileInputRef,
  propsStateRef,
  teleportCommand,
  resetSignal,
  inputDisabled,
  onTelemetry,
  onActivePadChange,
  onFirstMove,
}: VehicleProps) {
  const { camera } = useThree()
  const carStateRef = useRef<VehiclePhysicsState>(
    createInitialVehicleState(CAR_SPAWN.x, CAR_SPAWN.z, CAR_SPAWN.heading),
  )
  const keysRef = useRef<ControlInput>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false,
    brake: false,
    hop: false,
  })
  const movedOnceRef = useRef(false)
  const lastTelemetryEmitRef = useRef(0)
  const activePadIdRef = useRef<string | null>(null)
  const lastTeleportIdRef = useRef<number>(0)

  const rootRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const wheelFLRef = useRef<THREE.Group>(null)
  const wheelFRRef = useRef<THREE.Group>(null)
  const wheelRLRef = useRef<THREE.Mesh>(null)
  const wheelRRRef = useRef<THREE.Mesh>(null)
  const wheelFLSpinRef = useRef<THREE.Mesh>(null)
  const wheelFRSpinRef = useRef<THREE.Mesh>(null)
  const flameLeftRef = useRef<THREE.Mesh>(null)
  const flameRightRef = useRef<THREE.Mesh>(null)
  const antennaRef = useRef<THREE.Group>(null)

  // Exhaust puff ring buffer
  const puffsRef = useRef<Array<THREE.Mesh | null>>([])
  const puffStateRef = useRef(
    Array.from({ length: PUFF_COUNT }, () => ({
      x: 0,
      y: -10,
      z: 0,
      age: 1,
      scale: 0.01,
    })),
  )
  const puffSpawnTimerRef = useRef(0)
  const puffCursorRef = useRef(0)

  const camTargetRef = useRef(new THREE.Vector3(CAR_SPAWN.x, 1, CAR_SPAWN.z))
  const camPosRef = useRef(new THREE.Vector3(CAR_SPAWN.x, 14.5, CAR_SPAWN.z + 15.5))

  // Handle explicit teleport commands from HUD/minimap
  useEffect(() => {
    if (!teleportCommand || teleportCommand.id === lastTeleportIdRef.current) return
    lastTeleportIdRef.current = teleportCommand.id
    carStateRef.current = createInitialVehicleState(
      teleportCommand.x,
      teleportCommand.z,
      teleportCommand.heading,
    )
    soundEngine.playPadChime()
  }, [teleportCommand])

  // Handle world reset signal
  useEffect(() => {
    if (resetSignal === 0) return
    carStateRef.current = createInitialVehicleState(
      CAR_SPAWN.x,
      CAR_SPAWN.z,
      CAR_SPAWN.heading,
    )
  }, [resetSignal])

  // Keyboard bindings (disabled cleanly when modal/drawer is open)
  useEffect(() => {
    const clearKeys = () => {
      keysRef.current = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        boost: false,
        brake: false,
        hop: false,
      }
    }

    if (inputDisabled) {
      clearKeys()
      return
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          e.preventDefault()
          keysRef.current.forward = true
          break
        case 'KeyS':
        case 'ArrowDown':
          e.preventDefault()
          keysRef.current.backward = true
          break
        case 'KeyA':
        case 'ArrowLeft':
          e.preventDefault()
          keysRef.current.left = true
          break
        case 'KeyD':
        case 'ArrowRight':
          e.preventDefault()
          keysRef.current.right = true
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          keysRef.current.boost = true
          break
        case 'Space':
          e.preventDefault()
          keysRef.current.hop = true
          break
        case 'KeyB':
          keysRef.current.brake = true
          break
        case 'KeyH':
          soundEngine.playHorn()
          break
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.forward = false
          break
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.backward = false
          break
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = false
          break
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = false
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          keysRef.current.boost = false
          break
        case 'Space':
          keysRef.current.hop = false
          break
        case 'KeyB':
          keysRef.current.brake = false
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', clearKeys)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', clearKeys)
    }
  }, [inputDisabled])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const mob = mobileInputRef.current

    const mergedInput: ControlInput = inputDisabled
      ? {
          forward: false,
          backward: false,
          left: false,
          right: false,
          boost: false,
          brake: true,
          hop: false,
        }
      : {
          forward: keysRef.current.forward || Boolean(mob.forward),
          backward: keysRef.current.backward || Boolean(mob.backward),
          left: keysRef.current.left || Boolean(mob.left),
          right: keysRef.current.right || Boolean(mob.right),
          boost: keysRef.current.boost || Boolean(mob.boost),
          brake: keysRef.current.brake || Boolean(mob.brake),
          hop: keysRef.current.hop || Boolean(mob.hop),
          steerAnalog: mob.steerAnalog,
          throttleAnalog: mob.throttleAnalog,
        }

    const prevGrounded = carStateRef.current.grounded
    const nextCar = stepVehicle(carStateRef.current, mergedInput, dt)
    carStateRef.current = nextCar

    // Trigger hop SFX when leaving ground via hop
    if (prevGrounded && !nextCar.grounded && mergedInput.hop) {
      soundEngine.playHop()
    }

    if (!movedOnceRef.current && Math.abs(nextCar.speed) > 1.2) {
      movedOnceRef.current = true
      onFirstMove()
    }

    // Step smashable prop collisions
    const { hitCount, maxImpact } = stepProps(propsStateRef.current, nextCar, dt)
    if (hitCount > 0) {
      soundEngine.playBonk(maxImpact)
    }

    // Update procedural engine hum
    const boostingNow = mergedInput.boost && nextCar.boost > 0.05 && nextCar.speed > 4
    soundEngine.updateEngine(Math.abs(nextCar.speed) / 18.5, boostingNow)

    // Sync 3D vehicle transforms
    if (rootRef.current) {
      rootRef.current.position.set(nextCar.x, nextCar.y, nextCar.z)
      rootRef.current.rotation.y = nextCar.heading
    }
    if (bodyRef.current) {
      const idleBounce = Math.sin(state.clock.elapsedTime * 8) * 0.022
      bodyRef.current.position.y = 0.65 + idleBounce
      bodyRef.current.rotation.x = nextCar.pitch
      bodyRef.current.rotation.z = nextCar.roll
    }
    if (wheelFLRef.current) wheelFLRef.current.rotation.y = nextCar.steerAngle
    if (wheelFRRef.current) wheelFRRef.current.rotation.y = nextCar.steerAngle
    if (wheelFLSpinRef.current) wheelFLSpinRef.current.rotation.x = -nextCar.wheelSpin
    if (wheelFRSpinRef.current) wheelFRSpinRef.current.rotation.x = -nextCar.wheelSpin
    if (wheelRLRef.current) wheelRLRef.current.rotation.x = -nextCar.wheelSpin
    if (wheelRRRef.current) wheelRRRef.current.rotation.x = -nextCar.wheelSpin

    if (antennaRef.current) {
      antennaRef.current.rotation.x = Math.min(0.45, Math.abs(nextCar.speed) * 0.018)
      antennaRef.current.rotation.z = -nextCar.roll * 2.5
    }

    // Boost flame cones
    const flameScale = boostingNow ? 0.85 + Math.sin(state.clock.elapsedTime * 48) * 0.25 : 0.001
    if (flameLeftRef.current) flameLeftRef.current.scale.set(flameScale, flameScale * 1.4, flameScale)
    if (flameRightRef.current) flameRightRef.current.scale.set(flameScale, flameScale * 1.4, flameScale)

    // Exhaust puffs
    puffSpawnTimerRef.current += dt
    const spawnInterval = boostingNow ? 0.045 : Math.abs(nextCar.speed) > 2 ? 0.11 : 0.35
    if (puffSpawnTimerRef.current >= spawnInterval) {
      puffSpawnTimerRef.current = 0
      const idx = puffCursorRef.current % PUFF_COUNT
      puffCursorRef.current += 1
      const backX = Math.sin(nextCar.heading) * 1.7
      const backZ = Math.cos(nextCar.heading) * 1.7
      puffStateRef.current[idx] = {
        x: nextCar.x + backX + (Math.random() - 0.5) * 0.35,
        y: nextCar.y + 0.45,
        z: nextCar.z + backZ + (Math.random() - 0.5) * 0.35,
        age: 0,
        scale: boostingNow ? 0.42 : 0.26,
      }
    }

    for (let i = 0; i < PUFF_COUNT; i++) {
      const p = puffStateRef.current[i]
      const mesh = puffsRef.current[i]
      if (!mesh) continue
      if (p.age < 1) {
        p.age += dt * 1.9
        p.y += dt * 1.15
        const s = Math.max(0.001, p.scale * (1 + p.age * 1.4) * (1 - p.age))
        mesh.position.set(p.x, p.y, p.z)
        mesh.scale.setScalar(s)
        mesh.visible = true
      } else {
        mesh.visible = false
      }
    }

    // Smooth isometric-angled follow camera (Bruno Simon style!)
    const lookAhead = Math.min(3.5, Math.abs(nextCar.speed) * 0.14)
    const desiredTargetX = nextCar.x - Math.sin(nextCar.heading) * lookAhead
    const desiredTargetZ = nextCar.z - Math.cos(nextCar.heading) * lookAhead
    camTargetRef.current.lerp(
      new THREE.Vector3(desiredTargetX, nextCar.y * 0.4 + 0.8, desiredTargetZ),
      Math.min(1, dt * 6.5),
    )

    const zoomKick = boostingNow ? 1.8 : 0
    const desiredCamPos = new THREE.Vector3(
      nextCar.x + 11.5 + zoomKick * 0.4,
      14.5 + nextCar.y * 0.35 + zoomKick * 0.5,
      nextCar.z + 15.5 + zoomKick * 0.6,
    )
    camPosRef.current.lerp(desiredCamPos, Math.min(1, dt * 5.2))
    camera.position.copy(camPosRef.current)
    camera.lookAt(camTargetRef.current)

    // Parking pad proximity check
    let matchedPad: ZonePadTarget | null = null
    for (let i = 0; i < ALL_PARKING_PADS.length; i++) {
      const pad = ALL_PARKING_PADS[i]
      const dx = nextCar.x - pad.position[0]
      const dz = nextCar.z - pad.position[1]
      if (dx * dx + dz * dz <= pad.radius * pad.radius) {
        matchedPad = pad
        break
      }
    }
    const nextPadId = matchedPad ? matchedPad.id : null
    if (nextPadId !== activePadIdRef.current) {
      activePadIdRef.current = nextPadId
      if (matchedPad) soundEngine.playPadChime()
      onActivePadChange(matchedPad)
    }

    // Throttled telemetry to HUD (~18 Hz)
    const now = state.clock.elapsedTime
    if (now - lastTelemetryEmitRef.current > 0.055) {
      lastTelemetryEmitRef.current = now
      onTelemetry({
        x: nextCar.x,
        y: nextCar.y,
        z: nextCar.z,
        heading: nextCar.heading,
        speed: nextCar.speed,
        boost: nextCar.boost,
        grounded: nextCar.grounded,
        drifting: nextCar.drifting,
      })
    }
  })

  return (
    <>
      <group ref={rootRef} position={[CAR_SPAWN.x, 0, CAR_SPAWN.z]}>
        {/* Bouncy toy truck body */}
        <group ref={bodyRef} position={[0, 0.65, 0]}>
          {/* Main coral chassis */}
          <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.65, 0.62, 3.15]} />
            <meshStandardMaterial color="#EF4B34" roughness={0.38} metalness={0.08} />
          </mesh>

          {/* Cobalt side bumpers & trim */}
          <mesh position={[0, -0.14, 0]} castShadow>
            <boxGeometry args={[1.76, 0.22, 3.25]} />
            <meshStandardMaterial color="#2355F5" roughness={0.45} />
          </mesh>

          {/* Cabin top */}
          <mesh position={[0, 0.66, -0.15]} castShadow receiveShadow>
            <boxGeometry args={[1.38, 0.58, 1.48]} />
            <meshStandardMaterial color="#FFFBF2" roughness={0.32} />
          </mesh>

          {/* Windshield & side windows */}
          <mesh position={[0, 0.66, -0.91]}>
            <planeGeometry args={[1.18, 0.42]} />
            <meshStandardMaterial color="#252A34" roughness={0.18} metalness={0.3} />
          </mesh>
          <mesh position={[0.7, 0.66, -0.15]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.18, 0.38]} />
            <meshStandardMaterial color="#252A34" roughness={0.18} metalness={0.3} />
          </mesh>
          <mesh position={[-0.7, 0.66, -0.15]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[1.18, 0.38]} />
            <meshStandardMaterial color="#252A34" roughness={0.18} metalness={0.3} />
          </mesh>

          {/* Sunny yellow roof rack */}
          <mesh position={[0, 1.0, -0.15]} castShadow>
            <boxGeometry args={[1.16, 0.1, 1.1]} />
            <meshStandardMaterial color="#F9DA19" roughness={0.4} />
          </mesh>

          {/* Little bouncy radio antenna with yellow ball */}
          <group ref={antennaRef} position={[-0.55, 0.95, 0.4]}>
            <mesh position={[0, 0.42, 0]}>
              <cylinderGeometry args={[0.025, 0.03, 0.84, 6]} />
              <meshStandardMaterial color="#1A1E2E" />
            </mesh>
            <mesh position={[0, 0.88, 0]}>
              <sphereGeometry args={[0.11, 10, 10]} />
              <meshStandardMaterial color="#F9DA19" emissive="#F9DA19" emissiveIntensity={0.25} />
            </mesh>
          </group>

          {/* Pickup cargo bed with tiny luggage block */}
          <mesh position={[0, 0.48, 0.95]} castShadow>
            <boxGeometry args={[1.25, 0.25, 0.85]} />
            <meshStandardMaterial color="#F9DA19" roughness={0.5} />
          </mesh>

          {/* Front sunny headlights */}
          <mesh position={[-0.52, 0.16, -1.6]}>
            <boxGeometry args={[0.34, 0.2, 0.1]} />
            <meshStandardMaterial color="#FFF7B2" emissive="#F9DA19" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.52, 0.16, -1.6]}>
            <boxGeometry args={[0.34, 0.2, 0.1]} />
            <meshStandardMaterial color="#FFF7B2" emissive="#F9DA19" emissiveIntensity={0.8} />
          </mesh>

          {/* Rear brake lights */}
          <mesh position={[-0.54, 0.18, 1.6]}>
            <boxGeometry args={[0.32, 0.16, 0.08]} />
            <meshStandardMaterial color="#FF3B30" emissive="#FF3B30" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0.54, 0.18, 1.6]}>
            <boxGeometry args={[0.32, 0.16, 0.08]} />
            <meshStandardMaterial color="#FF3B30" emissive="#FF3B30" emissiveIntensity={0.6} />
          </mesh>

          {/* Twin turbo boost flames */}
          <mesh
            ref={flameLeftRef}
            position={[-0.36, -0.05, 1.95]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.001}
          >
            <coneGeometry args={[0.18, 0.95, 8]} />
            <meshBasicMaterial color="#F9DA19" />
          </mesh>
          <mesh
            ref={flameRightRef}
            position={[0.36, -0.05, 1.95]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.001}
          >
            <coneGeometry args={[0.18, 0.95, 8]} />
            <meshBasicMaterial color="#FF7A2F" />
          </mesh>
        </group>

        {/* Front Left Steering Wheel */}
        <group ref={wheelFLRef} position={[-0.95, 0.42, -1.02]}>
          <mesh ref={wheelFLSpinRef} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.34, 16]} />
            <meshStandardMaterial color="#252A34" roughness={0.82} />
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.04, 12]} />
              <meshStandardMaterial color="#FFFBF2" roughness={0.4} />
            </mesh>
          </mesh>
        </group>

        {/* Front Right Steering Wheel */}
        <group ref={wheelFRRef} position={[0.95, 0.42, -1.02]}>
          <mesh ref={wheelFRSpinRef} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.34, 16]} />
            <meshStandardMaterial color="#252A34" roughness={0.82} />
            <mesh position={[0, -0.18, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.04, 12]} />
              <meshStandardMaterial color="#FFFBF2" roughness={0.4} />
            </mesh>
          </mesh>
        </group>

        {/* Rear Left Wheel */}
        <mesh
          ref={wheelRLRef}
          position={[-0.95, 0.44, 1.02]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.44, 0.44, 0.38, 16]} />
          <meshStandardMaterial color="#252A34" roughness={0.82} />
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.04, 12]} />
            <meshStandardMaterial color="#FFFBF2" roughness={0.4} />
          </mesh>
        </mesh>

        {/* Rear Right Wheel */}
        <mesh
          ref={wheelRRRef}
          position={[0.95, 0.44, 1.02]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.44, 0.44, 0.38, 16]} />
          <meshStandardMaterial color="#252A34" roughness={0.82} />
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.04, 12]} />
            <meshStandardMaterial color="#FFFBF2" roughness={0.4} />
          </mesh>
        </mesh>
      </group>

      {/* Pooled exhaust smoke puffs in world space */}
      {Array.from({ length: PUFF_COUNT }).map((_, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            puffsRef.current[idx] = el
          }}
          visible={false}
        >
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#FFFBF2" transparent opacity={0.68} roughness={1} />
        </mesh>
      ))}
    </>
  )
}
