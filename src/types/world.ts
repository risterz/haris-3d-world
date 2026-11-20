export type WorldZoneId = 'start' | 'projects' | 'skills' | 'journey' | 'contact'

export type Vec2 = [number, number]
export type Vec3 = [number, number, number]

export interface ControlInput {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  boost: boolean
  brake: boolean
  hop: boolean
  /** Optional analog touch steering [-1, 1] and throttle [-1, 1] */
  steerAnalog?: number
  throttleAnalog?: number
}

export interface VehicleTelemetry {
  x: number
  y: number
  z: number
  heading: number
  speed: number
  boost: number
  grounded: boolean
  drifting: boolean
}

export interface TeleportCommand {
  id: number
  x: number
  z: number
  heading: number
  zoneId: WorldZoneId
}

export type PadKind = 'project' | 'skills' | 'journey' | 'contact'

export interface ZonePadTarget {
  id: string
  kind: PadKind
  label: string
  subtitle: string
  position: Vec2
  radius: number
  projectId?: string
  zoneId?: WorldZoneId
}

export type SmashPropKind = 'letter' | 'cone' | 'pin' | 'crate' | 'ball' | 'skillCube'

export interface SmashPropDef {
  id: string
  kind: SmashPropKind
  position: Vec3
  size: Vec3
  radius: number
  color: string
  label?: string
}

export interface ProjectBillboardDef {
  id: string
  projectId: string
  position: Vec3
  rotationY: number
  padPosition: Vec2
  accentColor: string
}

export interface SkillIslandDef {
  id: string
  title: string
  subtitle: string
  position: Vec3
  padPosition: Vec2
  color: string
  skills: string[]
}

export interface JourneySignDef {
  id: string
  entryId: string
  title: string
  organization: string
  period: string
  position: Vec3
  rotationY: number
  color: string
}
