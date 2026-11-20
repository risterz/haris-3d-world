import * as THREE from 'three'

export function createGroundTextTexture(
  lines: string[],
  options?: {
    width?: number
    height?: number
    color?: string
    accentColor?: string
    strokeColor?: string
    fontSize?: number
    subFontSize?: number
  },
): THREE.CanvasTexture {
  const width = options?.width ?? 1280
  const height = options?.height ?? 384
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, width, height)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const mainSize = options?.fontSize ?? 92
  const subSize = options?.subFontSize ?? 52
  const startY = lines.length === 1 ? height / 2 : height * 0.34

  lines.forEach((line, idx) => {
    const isMain = idx === 0
    ctx.font = `900 ${isMain ? mainSize : subSize}px "Fredoka", "Plus Jakarta Sans", system-ui, sans-serif`
    const y = startY + idx * (mainSize * 0.94)
    if (options?.strokeColor) {
      ctx.strokeStyle = options.strokeColor
      ctx.lineWidth = isMain ? 16 : 11
      ctx.lineJoin = 'round'
      ctx.strokeText(line, width / 2, y)
    }
    ctx.fillStyle = isMain ? options?.color ?? '#FFFBF2' : options?.accentColor ?? '#F9DA19'
    ctx.fillText(line, width / 2, y)
  })

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export function createRoadCategoryBannerTexture(
  label: string,
  options: {
    bgColor: string
    textColor?: string
    width?: number
    height?: number
  },
): THREE.CanvasTexture {
  const width = options.width ?? 1280
  const height = options.height ?? 340
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, width, height)

  // Hard offset shadow pill
  const padX = 34
  const padY = 34
  const boxW = width - padX * 2 - 14
  const boxH = height - padY * 2 - 14
  const radius = boxH / 2

  const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  // Offset drop shadow
  drawRoundRect(padX + 14, padY + 14, boxW, boxH, radius)
  ctx.fillStyle = '#1A1E2E'
  ctx.fill()

  // Main bright pill
  drawRoundRect(padX, padY, boxW, boxH, radius)
  ctx.fillStyle = options.bgColor
  ctx.fill()
  ctx.strokeStyle = '#1A1E2E'
  ctx.lineWidth = 18
  ctx.stroke()

  // Big chunky label text
  ctx.fillStyle = options.textColor ?? '#1A1E2E'
  ctx.font = '900 104px "Fredoka", "Plus Jakarta Sans", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, padX + boxW / 2, padY + boxH / 2 + 4, boxW - 96)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export function createNameplateTexture(
  title: string,
  category: string,
  accentColor: string,
): THREE.CanvasTexture {
  const width = 768
  const height = 128
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#FFFBF2'
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = '#1A1E2E'
  ctx.lineWidth = 10
  ctx.strokeRect(5, 5, width - 10, height - 10)

  // Left accent dot
  ctx.fillStyle = accentColor
  ctx.beginPath()
  ctx.arc(46, height / 2, 18, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#1A1E2E'
  ctx.lineWidth = 6
  ctx.stroke()

  // Project title
  ctx.fillStyle = '#1A1E2E'
  ctx.font = '800 50px "Fredoka", "Plus Jakarta Sans", system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(title, 84, height / 2 + 2, 410)

  // Category tag on right
  ctx.fillStyle = '#2355F5'
  ctx.font = '800 28px "Plus Jakarta Sans", system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(category.toUpperCase(), width - 28, height / 2 + 2, 220)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

export function createBlockLetterTexture(
  letter: string,
  bgColor: string,
  textColor = '#FFFBF2',
): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)

  // Crisp inner border
  ctx.strokeStyle = '#1A1E2E'
  ctx.lineWidth = 14
  ctx.strokeRect(10, 10, size - 20, size - 20)

  ctx.fillStyle = textColor
  ctx.font = '800 162px "Fredoka", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(letter, size / 2, size / 2 + 8)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function createRampStripeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#2355F5'
  ctx.fillRect(0, 0, 512, 512)

  // Playful yellow speed chevrons pointing forward (-Z)
  ctx.strokeStyle = '#F9DA19'
  ctx.lineWidth = 34
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (let y = 110; y <= 430; y += 140) {
    ctx.beginPath()
    ctx.moveTo(110, y + 60)
    ctx.lineTo(256, y - 30)
    ctx.lineTo(402, y + 60)
    ctx.stroke()
  }

  // Side coral stripes
  ctx.fillStyle = '#EF4B34'
  ctx.fillRect(0, 0, 32, 512)
  ctx.fillRect(480, 0, 32, 512)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function createCheckerTexture(
  colorA = '#EF4B34',
  colorB = '#FFFBF2',
  tiles = 8,
): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const step = size / tiles
  for (let y = 0; y < tiles; y++) {
    for (let x = 0; x < tiles; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? colorA : colorB
      ctx.fillRect(x * step, y * step, step, step)
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function createSignboardTexture(opts: {
  eyebrow?: string
  title: string
  subtitle?: string
  footer?: string
  accentColor: string
  bgColor?: string
}): THREE.CanvasTexture {
  const width = 640
  const height = 384
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Cream card base
  ctx.fillStyle = opts.bgColor ?? '#FFFBF2'
  ctx.fillRect(0, 0, width, height)

  // Top retro OS titlebar strip
  ctx.fillStyle = opts.accentColor
  ctx.fillRect(0, 0, width, 58)

  // Window control dots
  const dotColors = ['#FFFBF2', '#F9DA19', '#1A1E2E']
  dotColors.forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(width - 34 - i * 32, 29, 9, 0, Math.PI * 2)
    ctx.fill()
  })

  if (opts.eyebrow) {
    ctx.fillStyle = opts.accentColor === '#F9DA19' ? '#1A1E2E' : '#FFFBF2'
    ctx.font = '700 22px "Plus Jakarta Sans", system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(opts.eyebrow.toUpperCase(), 24, 30)
  }

  // Outer border
  ctx.strokeStyle = '#1A1E2E'
  ctx.lineWidth = 12
  ctx.strokeRect(6, 6, width - 12, height - 12)

  // Title
  ctx.fillStyle = '#1A1E2E'
  ctx.font = '800 44px "Fredoka", "Plus Jakarta Sans", system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  wrapText(ctx, opts.title, 32, 86, width - 64, 52, 2)

  // Subtitle
  if (opts.subtitle) {
    ctx.fillStyle = '#3B4254'
    ctx.font = '600 26px "Plus Jakarta Sans", system-ui, sans-serif'
    wrapText(ctx, opts.subtitle, 32, 206, width - 64, 36, 3)
  }

  // Footer pill
  if (opts.footer) {
    ctx.fillStyle = '#2355F5'
    ctx.font = '700 22px "Plus Jakarta Sans", system-ui, sans-serif'
    ctx.fillText(opts.footer, 32, height - 48)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(' ')
  let line = ''
  let lineCount = 0

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i]
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y + lineCount * lineHeight)
      lineCount += 1
      if (lineCount >= maxLines) return
      line = words[i]
    } else {
      line = testLine
    }
  }
  if (line && lineCount < maxLines) {
    ctx.fillText(line, x, y + lineCount * lineHeight)
  }
}
