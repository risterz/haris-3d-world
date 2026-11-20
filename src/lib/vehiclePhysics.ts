import type { ControlInput, SmashPropDef, VehicleTelemetry } from '../types/world'

export interface VehiclePhysicsState extends VehicleTelemetry {
  vy: number
  steerAngle: number
  wheelSpin: number
  pitch: number
  roll: number
  hopCooldown: number
}

export interface PropBodyState {
  id: string
  kind: SmashPropDef['kind']
  x: number
  y: number
  z: number
  baseY: number
  vx: number
  vy: number
  vz: number
  rx: number
  ry: number
  rz: number
  vrx: number
  vry: number
  vrz: number
  radius: number
  mass: number
  restitution: number
  active: boolean
}

const BOUNDS = {
  minX: -51.0,
  maxX: 51.0,
  minZ: -53.0,
  maxZ: 37.0,
}

const RAMP = {
  x: 36,
  z: 14,
  halfW: 3.2,
  halfL: 4.25,
  maxHeight: 2.4,
}

const GRAVITY = 28
const CAR_RADIUS = 1.45

export function createInitialVehicleState(
  x = 0,
  z = 7,
  heading = 0,
): VehiclePhysicsState {
  return {
    x,
    y: 0,
    z,
    vy: 0,
    heading,
    speed: 0,
    boost: 1,
    grounded: true,
    drifting: false,
    steerAngle: 0,
    wheelSpin: 0,
    pitch: 0,
    roll: 0,
    hopCooldown: 0,
  }
}

export function getRampHeight(
  x: number,
  z: number,
): { onRamp: boolean; height: number; slopePitch: number } {
  const dx = Math.abs(x - RAMP.x)
  const dz = z - RAMP.z
  if (dx <= RAMP.halfW && dz >= -RAMP.halfL && dz <= RAMP.halfL) {
    // Rises smoothly from south edge (+halfL -> 0) to north crest (-halfL -> maxHeight)
    const t = Math.max(0, Math.min(1, (RAMP.halfL - dz) / (RAMP.halfL * 2)))
    const height = t * RAMP.maxHeight
    const slopePitch = Math.atan2(RAMP.maxHeight, RAMP.halfL * 2)
    return { onRamp: true, height, slopePitch }
  }
  return { onRamp: false, height: 0, slopePitch: 0 }
}

export function stepVehicle(
  prev: VehiclePhysicsState,
  input: ControlInput,
  rawDt: number,
): VehiclePhysicsState {
  const dt = Math.min(Math.max(rawDt, 0.001), 0.05)

  let {
    x,
    y,
    z,
    vy,
    heading,
    speed,
    boost,
    grounded,
    drifting,
    steerAngle,
    wheelSpin,
    pitch,
    roll,
    hopCooldown,
  } = prev

  hopCooldown = Math.max(0, hopCooldown - dt)

  // Resolve throttle [-1, 1] and steer [-1, 1]
  let throttle = 0
  if (typeof input.throttleAnalog === 'number' && Math.abs(input.throttleAnalog) > 0.05) {
    throttle = Math.max(-1, Math.min(1, input.throttleAnalog))
  } else {
    if (input.forward) throttle += 1
    if (input.backward) throttle -= 1
  }

  let steerInput = 0
  if (typeof input.steerAnalog === 'number' && Math.abs(input.steerAnalog) > 0.05) {
    steerInput = Math.max(-1, Math.min(1, input.steerAnalog))
  } else {
    if (input.left) steerInput += 1
    if (input.right) steerInput -= 1
  }

  const canBoost = input.boost && boost > 0.05 && throttle > 0.1
  const maxForwardSpeed = canBoost ? 28.5 : 18.5
  const maxReverseSpeed = 9.5
  const accelRate = canBoost ? 34 : 21

  if (canBoost) {
    boost = Math.max(0, boost - dt * 0.45)
  } else {
    boost = Math.min(1, boost + dt * 0.28)
  }

  if (input.brake) {
    speed *= Math.max(0, 1 - dt * 7.5)
  } else if (throttle > 0) {
    speed = Math.min(maxForwardSpeed, speed + throttle * accelRate * dt)
  } else if (throttle < 0) {
    speed = Math.max(-maxReverseSpeed, speed + throttle * 18 * dt)
  } else {
    // Natural rolling friction
    const drag = grounded ? 3.2 : 0.65
    speed *= Math.max(0, 1 - dt * drag)
    if (Math.abs(speed) < 0.08) speed = 0
  }

  // Smooth steering wheel animation
  const targetSteer = steerInput * 0.55
  steerAngle += (targetSteer - steerAngle) * Math.min(1, dt * 12)

  // Turn rate scales with speed and reverses cleanly while backing up
  const speedRatio = Math.min(1, Math.abs(speed) / 7)
  const turnSign = speed >= -0.05 ? 1 : -1
  const turnRate = 2.45 * speedRatio * turnSign
  if (Math.abs(speed) > 0.15) {
    heading += steerInput * turnRate * dt
  }

  drifting = grounded && Math.abs(steerInput) > 0.5 && Math.abs(speed) > 10.5

  // Forward direction: heading = 0 faces -Z, turning left (+heading) faces -X
  const forwardX = -Math.sin(heading)
  const forwardZ = -Math.cos(heading)

  const prevRamp = getRampHeight(x, z)
  x += forwardX * speed * dt
  z += forwardZ * speed * dt

  // Soft bouncy perimeter curb clamp
  let hitWall = false
  if (x < BOUNDS.minX) {
    x = BOUNDS.minX
    hitWall = true
  } else if (x > BOUNDS.maxX) {
    x = BOUNDS.maxX
    hitWall = true
  }
  if (z < BOUNDS.minZ) {
    z = BOUNDS.minZ
    hitWall = true
  } else if (z > BOUNDS.maxZ) {
    z = BOUNDS.maxZ
    hitWall = true
  }
  if (hitWall) {
    speed *= -0.35
  }

  // Ramp & playful hop vertical motion
  const nextRamp = getRampHeight(x, z)
  const groundY = nextRamp.height

  // Detect launching off the north crest of the ramp
  if (prevRamp.onRamp && !nextRamp.onRamp && prevRamp.height > 1.4 && speed > 7 && grounded) {
    vy = Math.min(12.5, 4.8 + speed * 0.34)
    grounded = false
  }

  // Playful bunny hop on Space
  if (input.hop && grounded && hopCooldown <= 0) {
    vy = 7.4
    grounded = false
    hopCooldown = 0.55
  }

  if (!grounded || y > groundY + 0.02) {
    vy -= GRAVITY * dt
    y += vy * dt
    if (y <= groundY) {
      y = groundY
      vy = 0
      grounded = true
    }
  } else {
    y = groundY
    vy = 0
    grounded = true
  }

  // Wheel rotation & bouncy chassis pitch/roll
  wheelSpin += speed * dt * 1.45
  const rampSlopePitch = nextRamp.onRamp && grounded ? nextRamp.slopePitch * Math.cos(heading) : 0
  const targetPitch =
    rampSlopePitch +
    (grounded ? -throttle * (canBoost ? 0.095 : 0.055) : Math.max(-0.28, Math.min(0.28, vy * 0.028)))
  const targetRoll = steerInput * Math.min(1, Math.abs(speed) / 16) * 0.11

  pitch += (targetPitch - pitch) * Math.min(1, dt * 10)
  roll += (targetRoll - roll) * Math.min(1, dt * 10)

  return {
    x: Number.isFinite(x) ? x : 0,
    y: Number.isFinite(y) ? y : 0,
    z: Number.isFinite(z) ? z : 7,
    vy: Number.isFinite(vy) ? vy : 0,
    heading: Number.isFinite(heading) ? heading : 0,
    speed: Number.isFinite(speed) ? speed : 0,
    boost,
    grounded,
    drifting,
    steerAngle,
    wheelSpin,
    pitch,
    roll,
    hopCooldown,
  }
}

export function createPropStates(defs: SmashPropDef[]): PropBodyState[] {
  return defs.map((d) => ({
    id: d.id,
    kind: d.kind,
    x: d.position[0],
    y: d.position[1],
    z: d.position[2],
    baseY: d.position[1],
    vx: 0,
    vy: 0,
    vz: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    vrx: 0,
    vry: 0,
    vrz: 0,
    radius: d.radius,
    mass: d.kind === 'ball' ? 0.65 : d.kind === 'letter' ? 1.5 : d.kind === 'crate' ? 1.2 : 0.75,
    restitution: d.kind === 'ball' ? 0.72 : 0.42,
    active: false,
  }))
}

export function stepProps(
  props: PropBodyState[],
  car: VehiclePhysicsState,
  rawDt: number,
): { hitCount: number; maxImpact: number } {
  const dt = Math.min(Math.max(rawDt, 0.001), 0.05)
  const carVx = -Math.sin(car.heading) * car.speed
  const carVz = -Math.cos(car.heading) * car.speed

  let hitCount = 0
  let maxImpact = 0

  for (let i = 0; i < props.length; i++) {
    const p = props[i]

    // Check collision against car when car is near prop elevation
    if (Math.abs(car.y - (p.y - p.baseY)) < 2.2) {
      const dx = p.x - car.x
      const dz = p.z - car.z
      const minDist = CAR_RADIUS + p.radius
      const distSq = dx * dx + dz * dz

      if (distSq < minDist * minDist && distSq > 0.0001) {
        const dist = Math.sqrt(distSq)
        const nx = dx / dist
        const nz = dz / dist
        const overlap = minDist - dist

        // Push prop out cleanly
        p.x += nx * (overlap + 0.08)
        p.z += nz * (overlap + 0.08)

        const impactSpeed = Math.max(4.5, Math.abs(car.speed) * 1.15)
        const impulse = impactSpeed / p.mass

        p.vx = carVx * 0.65 + nx * impulse * 0.75
        p.vz = carVz * 0.65 + nz * impulse * 0.75
        p.vy = Math.min(11, 2.6 + impulse * 0.24)
        p.vrx = (nz * impulse) * 0.65
        p.vry = (nx - nz) * impulse * 0.4
        p.vrz = (-nx * impulse) * 0.65
        p.active = true

        hitCount += 1
        if (impactSpeed > maxImpact) maxImpact = impactSpeed
      }
    }

    if (!p.active) continue

    // Integrate prop velocity & gravity
    p.x += p.vx * dt
    p.z += p.vz * dt
    p.vy -= GRAVITY * dt
    p.y += p.vy * dt

    p.rx += p.vrx * dt
    p.ry += p.vry * dt
    p.rz += p.vrz * dt

    // Floor bounce
    if (p.y <= p.baseY) {
      p.y = p.baseY
      if (Math.abs(p.vy) > 1.6) {
        p.vy = -p.vy * p.restitution
      } else {
        p.vy = 0
      }
      const friction = p.kind === 'ball' ? 1.2 : 3.8
      p.vx *= Math.max(0, 1 - dt * friction)
      p.vz *= Math.max(0, 1 - dt * friction)
      p.vrx *= Math.max(0, 1 - dt * (friction + 1.2))
      p.vry *= Math.max(0, 1 - dt * (friction + 1.2))
      p.vrz *= Math.max(0, 1 - dt * (friction + 1.2))
    }

    // World bounds bounce for props
    if (p.x < BOUNDS.minX + 1) {
      p.x = BOUNDS.minX + 1
      p.vx = Math.abs(p.vx) * 0.6
    } else if (p.x > BOUNDS.maxX - 1) {
      p.x = BOUNDS.maxX - 1
      p.vx = -Math.abs(p.vx) * 0.6
    }
    if (p.z < BOUNDS.minZ + 1) {
      p.z = BOUNDS.minZ + 1
      p.vz = Math.abs(p.vz) * 0.6
    } else if (p.z > BOUNDS.maxZ - 1) {
      p.z = BOUNDS.maxZ - 1
      p.vz = -Math.abs(p.vz) * 0.6
    }

    // Light prop-to-prop bowling cascade!
    const speedSq = p.vx * p.vx + p.vz * p.vz
    if (speedSq > 2.5) {
      for (let j = 0; j < props.length; j++) {
        if (i === j) continue
        const q = props[j]
        const qdx = q.x - p.x
        const qdz = q.z - p.z
        const minD = p.radius + q.radius
        const dSq = qdx * qdx + qdz * qdz
        if (dSq < minD * minD && dSq > 0.0001) {
          const d = Math.sqrt(dSq)
          const qnx = qdx / d
          const qnz = qdz / d
          q.vx += qnx * Math.sqrt(speedSq) * 0.55
          q.vz += qnz * Math.sqrt(speedSq) * 0.55
          q.vy = Math.max(q.vy, 2.2)
          q.vrx += qnz * 4
          q.vrz -= qnx * 4
          q.active = true
        }
      }
    }

    // Sleep stationary props to save CPU
    if (
      p.y <= p.baseY + 0.01 &&
      Math.abs(p.vy) < 0.05 &&
      speedSq < 0.02 &&
      Math.abs(p.vrx) + Math.abs(p.vry) + Math.abs(p.vrz) < 0.05
    ) {
      p.vx = 0
      p.vz = 0
      p.vrx = 0
      p.vry = 0
      p.vrz = 0
      p.active = false
    }
  }

  return { hitCount, maxImpact }
}
