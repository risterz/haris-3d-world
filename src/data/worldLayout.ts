import type {
  JourneySignDef,
  ProjectBillboardDef,
  SkillIslandDef,
  SmashPropDef,
  Vec2,
  Vec3,
  WorldZoneId,
  ZonePadTarget,
} from '@/types/world'

export const WORLD_BOUNDS = {
  minX: -52,
  maxX: 52,
  minZ: -54,
  maxZ: 38,
} as const

export const CAR_SPAWN = {
  x: 0,
  z: 7,
  heading: 0, // 0 faces -Z (North toward HARIS blocks & Projects Alley)
} as const

export const ZONE_TELEPORTS: Record<
  WorldZoneId,
  { label: string; x: number; z: number; heading: number; color: string }
> = {
  start: { label: 'Start', x: 0, z: 7, heading: 0, color: '#EF4B34' },
  projects: { label: 'Projects', x: -10, z: -28, heading: -Math.PI / 2, color: '#2355F5' },
  skills: { label: 'Skills', x: 26, z: 0, heading: -Math.PI / 2, color: '#F9DA19' },
  journey: { label: 'Journey', x: -26, z: 0, heading: Math.PI / 2, color: '#39A96B' },
  contact: { label: 'Contact', x: 0, z: 25.5, heading: 0, color: '#FF7A59' },
}

export const STUNT_RAMP = {
  x: 36,
  z: 14,
  width: 6.4,
  length: 8.5,
  maxHeight: 2.4,
  /** Ramp rises from z = z + length/2 (south) toward z = z - length/2 (north) */
  directionZ: -1,
} as const

export interface RoadSegment {
  id: string
  position: Vec3
  width: number
  length: number
  dashedAxis: 'x' | 'z' | 'none'
}

export const ROAD_SEGMENTS: RoadSegment[] = [
  // Central N-S spine from Contact Pit-Stop through Start Plaza to Projects Alley
  { id: 'spine-ns', position: [0, 0.02, -1], width: 7.2, length: 62, dashedAxis: 'z' },
  // Grand Projects Drive-In Boulevard (all 10 projects line the North edge facing camera!)
  { id: 'projects-ew', position: [0, 0.02, -28], width: 96, length: 7.5, dashedAxis: 'x' },
  // East-West avenue connecting Journey Road (West) and Skills Playground (East)
  { id: 'central-ew', position: [0, 0.02, 0], width: 92, length: 6.8, dashedAxis: 'x' },
  // Ramp approach lane in Skills Playground
  { id: 'skills-ramp-lane', position: [36, 0.02, 8], width: 6.4, length: 16, dashedAxis: 'none' },
]

export const PROJECT_BILLBOARDS: ProjectBillboardDef[] = [
  // Single grand North Drive-In row — all 10 face South/Southeast toward the camera!
  {
    id: 'bb-cosmic-odyssey',
    projectId: 'cosmic-odyssey',
    position: [-40.5, 0, -39.5],
    rotationY: 0.14,
    padPosition: [-40.5, -33.2],
    accentColor: '#3B82F6',
  },
  {
    id: 'bb-brawl-arena',
    projectId: 'brawl-arena',
    position: [-31.5, 0, -39.5],
    rotationY: 0.14,
    padPosition: [-31.5, -33.2],
    accentColor: '#8B4DFF',
  },
  {
    id: 'bb-donutverse',
    projectId: 'donutverse',
    position: [-22.5, 0, -39.5],
    rotationY: 0.14,
    padPosition: [-22.5, -33.2],
    accentColor: '#D92B4B',
  },
  {
    id: 'bb-keythock',
    projectId: 'keythock',
    position: [-13.5, 0, -39.5],
    rotationY: 0.14,
    padPosition: [-13.5, -33.2],
    accentColor: '#2355F5',
  },
  {
    id: 'bb-roomforge',
    projectId: 'roomforge-3d',
    position: [-4.5, 0, -39.5],
    rotationY: 0.14,
    padPosition: [-4.5, -33.2],
    accentColor: '#E07A47',
  },
  {
    id: 'bb-uno',
    projectId: 'uno-card-game',
    position: [4.5, 0, -39.5],
    rotationY: 0.14,
    padPosition: [4.5, -33.2],
    accentColor: '#EF4B34',
  },
  {
    id: 'bb-win98',
    projectId: 'windows98-emulator',
    position: [13.5, 0, -39.5],
    rotationY: 0.14,
    padPosition: [13.5, -33.2],
    accentColor: '#008080',
  },
  {
    id: 'bb-papercraft',
    projectId: 'papercraft-pdf',
    position: [22.5, 0, -39.5],
    rotationY: 0.14,
    padPosition: [22.5, -33.2],
    accentColor: '#F9DA19',
  },
  {
    id: 'bb-ember',
    projectId: 'ember-olive',
    position: [31.5, 0, -39.5],
    rotationY: 0.14,
    padPosition: [31.5, -33.2],
    accentColor: '#B85D3B',
  },
  {
    id: 'bb-hivatlas',
    projectId: 'hiv-atlas',
    position: [40.5, 0, -39.5],
    rotationY: 0.14,
    padPosition: [40.5, -33.2],
    accentColor: '#C84B31',
  },
]

export const SKILL_ISLANDS: SkillIslandDef[] = [
  {
    id: 'skill-programming',
    title: 'Programming',
    subtitle: 'Python · TypeScript · JavaScript · C++ · Java · PHP',
    position: [23, 0, -10],
    padPosition: [23, -5.2],
    color: '#2355F5',
    skills: ['Python', 'TypeScript', 'JavaScript', 'C++', 'Java', 'PHP'],
  },
  {
    id: 'skill-frameworks',
    title: 'Frameworks & 3D',
    subtitle: 'Next.js · React · Three.js · Node · Laravel · Flutter',
    position: [34, 0, -10],
    padPosition: [34, -5.2],
    color: '#EF4B34',
    skills: ['Next.js', 'React', 'Three.js', 'Node.js', 'Laravel', 'Flutter'],
  },
  {
    id: 'skill-cloud',
    title: 'Cloud & Infra',
    subtitle: 'Cloudflare · Vercel · Supabase · Render · Netlify',
    position: [45, 0, -10],
    padPosition: [45, -5.2],
    color: '#39A96B',
    skills: ['Cloudflare', 'Vercel', 'Supabase', 'Render', 'Netlify'],
  },
  {
    id: 'skill-tools',
    title: 'Tools & Craft',
    subtitle: 'GitHub · Tailwind · GSAP · Linux · Docker · WordPress',
    position: [22, 0, 10],
    padPosition: [22, 15.2],
    color: '#F9DA19',
    skills: ['GitHub', 'Tailwind', 'GSAP', 'Linux', 'WordPress'],
  },
]

export const JOURNEY_SIGNS: JourneySignDef[] = [
  // All 5 milestone boards sit along the North side of Journey Road facing the camera!
  {
    id: 'j-alev',
    entryId: 'work-alev',
    title: 'Web Developer',
    organization: 'Alev Global Sdn. Bhd.',
    period: 'Sep – Dec 2025',
    position: [-19, 0, -8.5],
    rotationY: 0.16,
    color: '#2355F5',
  },
  {
    id: 'j-uitm',
    entryId: 'edu-uitm',
    title: 'B.Sc (Hons.) Netcentric',
    organization: 'UiTM Kampus Jasin',
    period: '2022 – 2025 · CGPA 3.27',
    position: [-26.5, 0, -8.5],
    rotationY: 0.16,
    color: '#EF4B34',
  },
  {
    id: 'j-ctf',
    entryId: 'achieve-ctf',
    title: 'RawSEC CTF Competitor',
    organization: 'UiTM Jasin Campus',
    period: 'Oct 2023',
    position: [-34, 0, -8.5],
    rotationY: 0.16,
    color: '#F9DA19',
  },
  {
    id: 'j-stpm',
    entryId: 'edu-stpm',
    title: 'STPM (CGPA 3.59)',
    organization: 'SMK Mengkarak, Pahang',
    period: '2020 – 2022',
    position: [-41.5, 0, -8.5],
    rotationY: 0.16,
    color: '#39A96B',
  },
  {
    id: 'j-open',
    entryId: 'career-target',
    title: 'Open for Hire!',
    organization: 'Software Dev & Data Centre',
    period: 'Available Now',
    position: [-48, 0, 0],
    rotationY: Math.PI / 2 - 0.15,
    color: '#FF7A59',
  },
]

export const CONTACT_PAD = {
  position: [0, 26] as Vec2,
  mailboxPosition: [-7.2, 0, 25.5] as Vec3,
  radius: 3.8,
}

export const JOURNEY_PAD = {
  position: [-33, 0] as Vec2,
  radius: 3.6,
}

export const ALL_PARKING_PADS: ZonePadTarget[] = [
  ...PROJECT_BILLBOARDS.map((b) => ({
    id: b.id,
    kind: 'project' as const,
    label: b.projectId,
    subtitle: 'Open Project Window',
    position: b.padPosition,
    radius: 3.1,
    projectId: b.projectId,
  })),
  ...SKILL_ISLANDS.map((s) => ({
    id: s.id,
    kind: 'skills' as const,
    label: s.title,
    subtitle: s.subtitle,
    position: s.padPosition,
    radius: 3.0,
    zoneId: 'skills' as const,
  })),
  {
    id: 'pad-journey',
    kind: 'journey',
    label: 'Haris’s Journey',
    subtitle: 'Education, Experience & Achievements',
    position: JOURNEY_PAD.position,
    radius: JOURNEY_PAD.radius,
    zoneId: 'journey',
  },
  {
    id: 'pad-contact',
    kind: 'contact',
    label: 'Contact Pit-Stop',
    subtitle: 'Email · GitHub · LinkedIn · Phone',
    position: CONTACT_PAD.position,
    radius: CONTACT_PAD.radius,
    zoneId: 'contact',
  },
]

export const TREE_POSITIONS: Array<{ position: Vec3; scale: number; tint: string }> = [
  // Framing Start Plaza
  { position: [-11, 0, 9], scale: 1.15, tint: '#4FAF6A' },
  { position: [-14, 0, 14], scale: 0.9, tint: '#63BF78' },
  { position: [11, 0, 9], scale: 1.1, tint: '#4FAF6A' },
  { position: [15, 0, 15], scale: 0.95, tint: '#3F9658' },
  // Flanking North Projects Alley (shifted outside x = -44..+44 row)
  { position: [-48.5, 0, -42], scale: 1.25, tint: '#4FAF6A' },
  { position: [-49.5, 0, -33], scale: 0.95, tint: '#63BF78' },
  { position: [48.5, 0, -42], scale: 1.2, tint: '#4FAF6A' },
  { position: [49.5, 0, -33], scale: 1.0, tint: '#3F9658' },
  { position: [-38, 0, -18], scale: 1.05, tint: '#63BF78' },
  { position: [38, 0, -18], scale: 1.1, tint: '#4FAF6A' },
  // West Journey Road grove
  { position: [-47, 0, -12], scale: 1.3, tint: '#3F9658' },
  { position: [-46, 0, 13], scale: 1.15, tint: '#4FAF6A' },
  { position: [-18, 0, 16], scale: 0.95, tint: '#63BF78' },
  // East Skills Playground grove
  { position: [48, 0, -16], scale: 1.2, tint: '#4FAF6A' },
  { position: [48, 0, 18], scale: 1.25, tint: '#3F9658' },
  { position: [16, 0, -9], scale: 0.85, tint: '#63BF78' },
  // South Contact Pit-Stop grove
  { position: [-13, 0, 29], scale: 1.15, tint: '#4FAF6A' },
  { position: [13, 0, 29], scale: 1.2, tint: '#63BF78' },
  { position: [-8, 0, 33], scale: 0.9, tint: '#3F9658' },
  { position: [8, 0, 33], scale: 0.95, tint: '#4FAF6A' },
]

function buildInitialProps(): SmashPropDef[] {
  const props: SmashPropDef[] = []

  // 1. Giant 3D "HARIS" knockable letter blocks across Start Plaza
  const letters = ['H', 'A', 'R', 'I', 'S']
  const letterColors = ['#2355F5', '#EF4B34', '#F9DA19', '#2355F5', '#EF4B34']
  letters.forEach((ch, idx) => {
    props.push({
      id: `letter-${ch}-${idx}`,
      kind: 'letter',
      position: [-6.4 + idx * 3.2, 1.35, -3.8],
      size: [2.2, 2.7, 1.1],
      radius: 1.2,
      color: letterColors[idx],
      label: ch,
    })
  })

  // 2. Bowling pin triangle right after the Stunt Ramp landing zone (x = 36, z = 4..0)
  const pinRows = [
    { z: 4.5, xs: [36] },
    { z: 2.9, xs: [35.1, 36.9] },
    { z: 1.3, xs: [34.2, 36, 37.8] },
    { z: -0.3, xs: [33.3, 35.1, 36.9, 38.7] },
  ]
  let pinIdx = 0
  pinRows.forEach((row) => {
    row.xs.forEach((px) => {
      pinIdx += 1
      props.push({
        id: `pin-${pinIdx}`,
        kind: 'pin',
        position: [px, 0.85, row.z],
        size: [0.55, 1.7, 0.55],
        radius: 0.42,
        color: '#FFFBF2',
      })
    })
  })

  // 3. Playful orange traffic cones lining Start Plaza & road corners
  const coneCoords: Vec2[] = [
    [-4.8, 4.2],
    [4.8, 4.2],
    [-4.8, 10.5],
    [4.8, 10.5],
    [-4.6, -10.5],
    [4.6, -10.5],
    [13.5, -4.4],
    [13.5, 4.4],
    [-13.5, -4.4],
    [-13.5, 4.4],
    [31.5, 18.5],
    [40.5, 18.5],
  ]
  coneCoords.forEach(([cx, cz], i) => {
    props.push({
      id: `cone-${i + 1}`,
      kind: 'cone',
      position: [cx, 0.55, cz],
      size: [0.8, 1.1, 0.8],
      radius: 0.48,
      color: '#FF6B2B',
    })
  })

  // 4. Smashable wooden toy crates near Start Plaza & Skills Playground
  const crateCoords: Vec3[] = [
    [9.5, 0.65, -7.5],
    [11.0, 0.65, -7.5],
    [10.25, 0.65, -9.0],
    [-10.0, 0.65, -8.0],
    [-11.5, 0.65, -8.0],
    [25.5, 0.65, 16.5],
    [27.0, 0.65, 16.5],
  ]
  crateCoords.forEach((pos, i) => {
    props.push({
      id: `crate-${i + 1}`,
      kind: 'crate',
      position: pos,
      size: [1.3, 1.3, 1.3],
      radius: 0.78,
      color: i % 2 === 0 ? '#E8A85C' : '#F9DA19',
    })
  })

  // 5. Giant playful beach/soccer ball to dribble around the world!
  props.push({
    id: 'giant-ball',
    kind: 'ball',
    position: [10.5, 1.35, 3.8],
    size: [2.7, 2.7, 2.7],
    radius: 1.35,
    color: '#FFFBF2',
  })

  // 6. Colored skill toy cubes scattered beside Skills Playground
  const skillCubes: Array<{ pos: Vec2; color: string; label: string }> = [
    { pos: [26, -7], color: '#2355F5', label: 'TS' },
    { pos: [36, -7], color: '#EF4B34', label: '3D' },
    { pos: [39, 5], color: '#39A96B', label: 'CF' },
    { pos: [26, 6], color: '#F9DA19', label: 'JS' },
  ]
  skillCubes.forEach((sc, i) => {
    props.push({
      id: `skill-cube-${i + 1}`,
      kind: 'skillCube',
      position: [sc.pos[0], 0.7, sc.pos[1]],
      size: [1.4, 1.4, 1.4],
      radius: 0.85,
      color: sc.color,
      label: sc.label,
    })
  })

  return props
}

export const INITIAL_PROPS: SmashPropDef[] = buildInitialProps()
