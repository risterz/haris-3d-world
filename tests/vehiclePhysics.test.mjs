import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createInitialVehicleState,
  stepVehicle,
  createPropStates,
  stepProps,
  getRampHeight,
} from '../src/lib/vehiclePhysics.ts'

const idleInput = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  boost: false,
  brake: false,
  hop: false,
}

test('accelerates forward along -Z when heading = 0', () => {
  let car = createInitialVehicleState()
  const startZ = car.z
  for (let i = 0; i < 30; i++) {
    car = stepVehicle(car, { ...idleInput, forward: true }, 1 / 60)
  }
  assert.ok(car.speed > 5, `expected speed > 5, got ${car.speed}`)
  assert.ok(car.z < startZ - 1, `expected z to decrease from ${startZ}, got ${car.z}`)
})

test('steering left turns heading counter-clockwise while moving', () => {
  let car = createInitialVehicleState()
  for (let i = 0; i < 30; i++) {
    car = stepVehicle(car, { ...idleInput, forward: true, left: true }, 1 / 60)
  }
  assert.ok(car.heading > 0.1, `expected positive heading turn, got ${car.heading}`)
})

test('turbo boost increases top speed and drains then recharges boost meter', () => {
  let car = createInitialVehicleState()
  for (let i = 0; i < 60; i++) {
    car = stepVehicle(car, { ...idleInput, forward: true, boost: true }, 1 / 60)
  }
  assert.ok(car.speed > 18, `expected boosted speed > 18, got ${car.speed}`)
  assert.ok(car.boost < 0.9, `expected boost meter drained, got ${car.boost}`)

  const drained = car.boost
  for (let i = 0; i < 60; i++) {
    car = stepVehicle(car, idleInput, 1 / 60)
  }
  assert.ok(car.boost > drained, 'expected boost meter to recharge when not boosting')
})

test('clamps high-speed car safely inside world bounds with no NaN', () => {
  let car = createInitialVehicleState()
  car.x = 51.5
  car.z = -53.5
  car.heading = -Math.PI / 4
  car.speed = 35
  for (let i = 0; i < 30; i++) {
    car = stepVehicle(car, { ...idleInput, forward: true, boost: true }, 1 / 60)
  }
  assert.ok(Number.isFinite(car.x) && Number.isFinite(car.z) && Number.isFinite(car.y))
  assert.ok(car.x <= 51.2 && car.x >= -51.2, `x out of bounds: ${car.x}`)
  assert.ok(car.z <= 37.2 && car.z >= -53.2, `z out of bounds: ${car.z}`)
})

test('ramp elevation rises from south to north and launches car cleanly back to ground', () => {
  const southEdge = getRampHeight(36, 17.5)
  const northCrest = getRampHeight(36, 10.2)
  assert.equal(southEdge.onRamp, true)
  assert.equal(northCrest.onRamp, true)
  assert.ok(northCrest.height > southEdge.height + 1.2)

  let car = createInitialVehicleState()
  car.x = 36
  car.z = 18
  car.heading = 0
  car.speed = 22
  let maxY = 0
  for (let i = 0; i < 120; i++) {
    car = stepVehicle(car, { ...idleInput, forward: true }, 1 / 60)
    if (car.y > maxY) maxY = car.y
  }
  assert.ok(maxY > 1.8, `expected airborne jump > 1.8, got ${maxY}`)
  assert.ok(car.y <= 0.05 && car.grounded, `expected car to land smoothly, y=${car.y}`)
})

test('driving into a smashable prop transfers velocity and spin', () => {
  let car = createInitialVehicleState()
  car.x = 0
  car.z = 0
  car.heading = 0
  car.speed = 16

  const props = createPropStates([
    {
      id: 'cone-test',
      kind: 'cone',
      position: [0, 0.55, -0.8],
      size: [0.8, 1.1, 0.8],
      radius: 0.5,
      color: '#FF6B2B',
    },
  ])

  const res = stepProps(props, car, 1 / 60)
  assert.equal(res.hitCount, 1)
  assert.ok(res.maxImpact > 1)
  assert.ok(props[0].vz < -3, `expected prop knocked north, vz=${props[0].vz}`)
  assert.ok(props[0].vy > 1, `expected prop popped upward, vy=${props[0].vy}`)
})
