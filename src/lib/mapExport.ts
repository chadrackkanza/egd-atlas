import Map from 'ol/Map'

export type MapExportFormat = 'PDF' | 'PNG' | 'JPG'

export interface ExportLegendItem {
  label: string
  color: string
  variant?: 'dot' | 'line' | 'box'
}

interface MapExportOptions {
  map: Map
  format: MapExportFormat
  filename: string
  title: string
  subtitle: string
  legendItems: ExportLegendItem[]
  details?: string[]
}

function sanitizeFilenamePart(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function parseCanvasTransform(transform: string) {
  if (!transform || transform === 'none') {
    return null
  }

  const values = transform
    .match(/matrix(3d)?\((.+)\)/)?.[2]
    ?.split(',')
    .map((value) => Number.parseFloat(value.trim()))

  if (!values) {
    return null
  }

  if (values.length === 6) {
    return values as [number, number, number, number, number, number]
  }

  if (values.length === 16) {
    return [values[0], values[1], values[4], values[5], values[12], values[13]] as [number, number, number, number, number, number]
  }

  return null
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (ctx.measureText(candidate).width <= maxWidth || !line) {
      line = candidate
      continue
    }

    lines.push(line)
    line = word
  }

  if (line) {
    lines.push(line)
  }

  for (const [index, content] of lines.entries()) {
    ctx.fillText(content, x, y + index * lineHeight)
  }

  return lines.length * lineHeight
}

function renderMapCanvas(map: Map) {
  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    const size = map.getSize()
    if (!size) {
      reject(new Error('La carte n’est pas prête pour l’export.'))
      return
    }

    // `rendercomplete` waits for every tile source. A pending remote tile can
    // keep it from firing indefinitely, even when the visible map is ready.
    map.renderSync()
    requestAnimationFrame(() => {
      try {
        const [width, height] = size
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const context = canvas.getContext('2d')
        if (!context) {
          reject(new Error('Impossible de préparer le rendu de la carte.'))
          return
        }

        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, width, height)

        const layerCanvases = map
          .getViewport()
          .querySelectorAll<HTMLCanvasElement>('.ol-layer canvas, canvas.ol-layer')

        layerCanvases.forEach((layerCanvas) => {
          if (layerCanvas.width === 0 || layerCanvas.height === 0) {
            return
          }

          context.save()

          const parentOpacity = layerCanvas.parentElement?.style.opacity
          const opacity = parentOpacity === '' || parentOpacity == null ? 1 : Number.parseFloat(parentOpacity)
          context.globalAlpha = Number.isFinite(opacity) ? opacity : 1

          const transform = parseCanvasTransform(layerCanvas.style.transform || getComputedStyle(layerCanvas).transform)
          if (transform) {
            context.setTransform(...transform)
          } else {
            const { left, top } = layerCanvas.style
            context.translate(Number.parseFloat(left || '0'), Number.parseFloat(top || '0'))
          }

          context.drawImage(layerCanvas, 0, 0)
          context.restore()
        })

        resolve(canvas)
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Échec du rendu de la carte.'))
      }
    })
  })
}

async function buildExportCanvas({
  map,
  title,
  subtitle,
  legendItems,
  details = [],
}: Omit<MapExportOptions, 'filename' | 'format'>) {
  const mapCanvas = await renderMapCanvas(map)
  const padding = 40
  const headerHeight = 96
  const footerHeight = 48
  const sidebarWidth = 280
  const gap = 24
  const width = mapCanvas.width + sidebarWidth + gap + padding * 2
  const contentHeight = Math.max(mapCanvas.height, 220 + legendItems.length * 28 + details.length * 22)
  const height = headerHeight + contentHeight + footerHeight + padding * 2

  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = width
  exportCanvas.height = height

  const ctx = exportCanvas.getContext('2d')
  if (!ctx) {
    throw new Error('Impossible de composer le document exporté.')
  }

  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#0f172a'
  ctx.font = '700 28px Arial'
  ctx.fillText(title, padding, padding + 28)

  ctx.fillStyle = '#475569'
  ctx.font = '400 15px Arial'
  ctx.fillText(subtitle, padding, padding + 56)

  ctx.fillStyle = '#16a34a'
  ctx.fillRect(padding, padding + 72, 64, 4)

  const frameX = padding
  const frameY = padding + headerHeight
  const mapWidth = mapCanvas.width
  const mapHeight = mapCanvas.height

  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.fillRect(frameX, frameY, mapWidth, mapHeight)
  ctx.strokeRect(frameX, frameY, mapWidth, mapHeight)
  ctx.drawImage(mapCanvas, frameX, frameY, mapWidth, mapHeight)

  const sidebarX = frameX + mapWidth + gap
  const sidebarY = frameY

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(sidebarX, sidebarY, sidebarWidth, contentHeight)
  ctx.strokeRect(sidebarX, sidebarY, sidebarWidth, contentHeight)

  ctx.fillStyle = '#0f172a'
  ctx.font = '700 18px Arial'
  ctx.fillText('Légende', sidebarX + 20, sidebarY + 28)

  let cursorY = sidebarY + 58
  for (const item of legendItems) {
    ctx.fillStyle = item.color
    if (item.variant === 'line') {
      ctx.fillRect(sidebarX + 20, cursorY - 5, 24, 4)
    } else if (item.variant === 'box') {
      ctx.fillRect(sidebarX + 20, cursorY - 10, 16, 16)
      ctx.strokeStyle = '#0f172a'
      ctx.strokeRect(sidebarX + 20, cursorY - 10, 16, 16)
    } else {
      ctx.beginPath()
      ctx.arc(sidebarX + 28, cursorY - 2, 6, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = '#334155'
    ctx.font = '400 14px Arial'
    cursorY += drawWrappedText(ctx, item.label, sidebarX + 52, cursorY + 2, sidebarWidth - 72, 18)
    cursorY += 8
  }

  if (details.length > 0) {
    cursorY += 10
    ctx.strokeStyle = '#e2e8f0'
    ctx.beginPath()
    ctx.moveTo(sidebarX + 20, cursorY)
    ctx.lineTo(sidebarX + sidebarWidth - 20, cursorY)
    ctx.stroke()
    cursorY += 24

    ctx.fillStyle = '#0f172a'
    ctx.font = '700 16px Arial'
    ctx.fillText('Détails', sidebarX + 20, cursorY)
    cursorY += 20

    ctx.fillStyle = '#475569'
    ctx.font = '400 13px Arial'
    for (const detail of details) {
      cursorY += drawWrappedText(ctx, `- ${detail}`, sidebarX + 20, cursorY, sidebarWidth - 40, 18)
      cursorY += 6
    }
  }

  ctx.fillStyle = '#475569'
  ctx.font = '400 12px Arial'
  ctx.fillText('Export généré par EGD Atlas', padding, height - padding + 4)

  ctx.textAlign = 'right'
  ctx.fillText(
    new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date()),
    width - padding,
    height - padding + 4,
  )
  ctx.textAlign = 'start'

  return exportCanvas
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Impossible de générer le fichier exporté.'))
        return
      }

      resolve(blob)
    }, mimeType, quality)
  })
}

function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
}

export function buildMapExportFilename(commune: string, secteur: string, format: MapExportFormat) {
  const baseName = [
    'carte',
    sanitizeFilenamePart(commune) || 'zone',
    sanitizeFilenamePart(secteur) || 'detail',
  ].join('_')

  return `${baseName}.${format.toLowerCase()}`
}

export async function exportMapDocument(options: MapExportOptions) {
  const exportCanvas = await buildExportCanvas(options)

  if (options.format === 'PDF') {
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({
      orientation: exportCanvas.width >= exportCanvas.height ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [exportCanvas.height, exportCanvas.width],
      compress: true,
    })

    const imageData = exportCanvas.toDataURL('image/jpeg', 0.92)
    pdf.addImage(imageData, 'JPEG', 0, 0, exportCanvas.width, exportCanvas.height)
    pdf.save(options.filename)
    return
  }

  const isJpeg = options.format === 'JPG'
  const blob = await canvasToBlob(exportCanvas, isJpeg ? 'image/jpeg' : 'image/png', isJpeg ? 0.92 : undefined)
  downloadBlob(blob, options.filename)
}
