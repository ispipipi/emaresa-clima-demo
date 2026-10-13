import type { MentatDataBlock } from '../types'

interface MentatReportInput {
  title: string
  question: string
  summary: string
  source?: string
  context?: string
  blocks: MentatDataBlock[]
}

interface LogoImage {
  width: number
  height: number
  rgb: Uint8Array
}

const PAGE_WIDTH = 841.89
const PAGE_HEIGHT = 595.28
const MARGIN = 42
const HEADER_HEIGHT = 84
const NAVY = '#1F3656'
const NAVY_INK = '#17263C'
const TEAL = '#0B7180'
const TEAL_LIGHT = '#8FC9D1'
const INK_MUTED = '#647792'
const LINE = '#E4EEF8'
const SURFACE = '#F5F9FD'

const WIN_ANSI: Record<string, number> = {
  'á': 0xe1, 'é': 0xe9, 'í': 0xed, 'ó': 0xf3, 'ú': 0xfa,
  'Á': 0xc1, 'É': 0xc9, 'Í': 0xcd, 'Ó': 0xd3, 'Ú': 0xda,
  'ñ': 0xf1, 'Ñ': 0xd1, 'ü': 0xfc, 'Ü': 0xdc, '¿': 0xbf, '¡': 0xa1,
  '·': 0xb7, '€': 0x80, '“': 0x22, '”': 0x22, '‘': 0x27, '’': 0x27,
  '–': 0x2d, '—': 0x2d, '‑': 0x2d, '•': 0x2d,
}

function safeText(value: string) {
  return value.replace(/[–—‑]/g, '-').replace(/•/g, '-')
}

function textHex(value: string) {
  return `<${Array.from(safeText(value)).map((character) => {
    const code = character.charCodeAt(0)
    const byte = code <= 0x7f ? code : WIN_ANSI[character] ?? 0x3f
    return byte.toString(16).padStart(2, '0')
  }).join('')}>`
}

function colorCommand(hex: string, stroke = false) {
  const normalized = hex.replace('#', '')
  const red = parseInt(normalized.slice(0, 2), 16) / 255
  const green = parseInt(normalized.slice(2, 4), 16) / 255
  const blue = parseInt(normalized.slice(4, 6), 16) / 255
  return `${red.toFixed(4)} ${green.toFixed(4)} ${blue.toFixed(4)} ${stroke ? 'RG' : 'rg'}`
}

function approximateWidth(value: string, fontSize: number) {
  return safeText(value).length * fontSize * 0.49
}

function wrapText(value: string, maxCharacters: number) {
  const lines: string[] = []
  safeText(value).split(/\r?\n/).forEach((paragraph) => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean)
    if (words.length === 0) {
      lines.push('')
      return
    }
    let line = ''
    words.forEach((word) => {
      const next = line ? `${line} ${word}` : word
      if (next.length > maxCharacters && line) {
        lines.push(line)
        line = word
      } else {
        line = next
      }
    })
    if (line) lines.push(line)
  })
  return lines
}

function truncate(value: string, width: number, fontSize: number) {
  const maxCharacters = Math.max(8, Math.floor(width / (fontSize * 0.49)))
  const safeValue = safeText(value)
  if (safeValue.length <= maxCharacters) return safeValue
  return `${safeValue.slice(0, Math.max(4, maxCharacters - 3))}...`
}

class PdfDocument {
  private pages: string[][] = []
  private current: string[] = []

  command(value: string) {
    this.current.push(value)
  }

  newPage() {
    if (this.current.length > 0) this.pages.push(this.current)
    this.current = []
  }

  rect(x: number, y: number, width: number, height: number, fill: string, stroke?: string) {
    this.command(`${colorCommand(fill)} ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f`)
    if (stroke) this.command(`${colorCommand(stroke, true)} 0.7 w ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re S`)
  }

  line(x1: number, y1: number, x2: number, y2: number, color: string, width = 0.7) {
    this.command(`${colorCommand(color, true)} ${width.toFixed(2)} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`)
  }

  text(value: string, x: number, y: number, size: number, font = 'F1', color = NAVY_INK, align: 'left' | 'right' = 'left') {
    const adjustedX = align === 'right' ? x - approximateWidth(value, size) : x
    this.command(`BT /${font} ${size.toFixed(2)} Tf ${colorCommand(color)} ${adjustedX.toFixed(2)} ${y.toFixed(2)} Td ${textHex(value)} Tj ET`)
  }

  wrappedText(value: string, x: number, y: number, maxWidth: number, size: number, leading: number, font = 'F1', color = INK_MUTED) {
    const lines = wrapText(value, Math.max(12, Math.floor(maxWidth / (size * 0.49))))
    lines.forEach((line, index) => this.text(line, x, y - index * leading, size, font, color))
    return y - lines.length * leading
  }

  finish(logo?: LogoImage) {
    if (this.current.length > 0) this.pages.push(this.current)
    const totalPages = this.pages.length
    const fontRegular = 3
    const fontBold = 4
    const imageObject = logo ? 5 : undefined
    const pageContentStart = logo ? 6 : 5
    const pageObjectStart = pageContentStart + totalPages
    const objects: string[] = []

    objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
    const pageObjectNumbers = Array.from({ length: totalPages }, (_, index) => pageObjectStart + index)
    objects[2] = `<< /Type /Pages /Kids [${pageObjectNumbers.map((number) => `${number} 0 R`).join(' ')}] /Count ${totalPages} >>`
    objects[fontRegular] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'
    objects[fontBold] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'
    if (logo) {
      const hex = Array.from(logo.rgb).map((byte) => byte.toString(16).padStart(2, '0')).join('')
      objects[imageObject!] = `<< /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /ASCIIHexDecode /Length ${hex.length + 1} >>\nstream\n${hex}>\nendstream`
    }

    this.pages.forEach((body, index) => {
      const contentObject = pageContentStart + index
      const pageObject = pageObjectNumbers[index]
      const commands = [this.headerBackground(), ...body, this.headerBand(logo), this.footerCommands(index + 1, totalPages)].join('\n')
      objects[contentObject] = `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`
      const resources = `<< /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >>${logo ? ` /XObject << /Im1 ${imageObject} 0 R >>` : ''} >>`
      objects[pageObject] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources ${resources} /Contents ${contentObject} 0 R >>`
    })

    const chunks: string[] = ['%PDF-1.4\n%EMARESA\n']
    const offsets: number[] = [0]
    let offset = new TextEncoder().encode(chunks[0]).length
    for (let index = 1; index < objects.length; index += 1) {
      const object = `${index} 0 obj\n${objects[index]}\nendobj\n`
      offsets[index] = offset
      chunks.push(object)
      offset += new TextEncoder().encode(object).length
    }
    const xrefOffset = offset
    chunks.push(`xref\n0 ${objects.length}\n0000000000 65535 f \n`)
    for (let index = 1; index < objects.length; index += 1) chunks.push(`${String(offsets[index]).padStart(10, '0')} 00000 n \n`)
    chunks.push(`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`)
    return new Blob(chunks, { type: 'application/pdf' })
  }

  private headerBackground() {
    return `q ${colorCommand('#FFFFFF')} 0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT} re f Q`
  }

  private headerBand(logo?: LogoImage) {
    const commands = [
      `q ${colorCommand(NAVY)} 0 ${PAGE_HEIGHT - HEADER_HEIGHT} ${PAGE_WIDTH} ${HEADER_HEIGHT} re f Q`,
      `q ${colorCommand(TEAL)} 0 ${PAGE_HEIGHT - HEADER_HEIGHT} ${PAGE_WIDTH} 3 re f Q`,
    ]
    if (logo) commands.push(`q 154 0 0 37 ${MARGIN} ${PAGE_HEIGHT - 61} cm /Im1 Do Q`)
    else {
      commands.push(`${colorCommand('#F6C13D')} ${MARGIN} ${PAGE_HEIGHT - 56} 18 18 re f`)
      commands.push(`${colorCommand('#FFFFFF')} BT /F2 16 Tf ${MARGIN + 25} ${PAGE_HEIGHT - 51} Td ${textHex('Emaresa')} Tj ET`)
    }
    commands.push(`${colorCommand('#FFFFFF')} BT /F2 9 Tf ${PAGE_WIDTH - MARGIN - 72} ${PAGE_HEIGHT - 45} Td ${textHex('MENTAT')} Tj ET`)
    commands.push(`${colorCommand(TEAL_LIGHT)} BT /F1 7 Tf ${PAGE_WIDTH - MARGIN - 72} ${PAGE_HEIGHT - 57} Td ${textHex('INFORME VISUAL')} Tj ET`)
    return commands.join('\n')
  }

  private footerCommands(page: number, totalPages: number) {
    return [
      `${colorCommand(LINE, true)} 0.7 w ${MARGIN} 30 m ${PAGE_WIDTH - MARGIN} 30 l S`,
      `${colorCommand(INK_MUTED)} BT /F1 7 Tf ${MARGIN} 17 Td ${textHex('Emaresa · Clima Organizacional · Generado por Mentat')} Tj ET`,
      `${colorCommand(INK_MUTED)} BT /F2 7 Tf ${PAGE_WIDTH - MARGIN - 54} 17 Td ${textHex(`Página ${page} de ${totalPages}`)} Tj ET`,
    ].join('\n')
  }
}

function drawCover(doc: PdfDocument, input: MentatReportInput, dateLabel: string, logo?: LogoImage) {
  let y = PAGE_HEIGHT - HEADER_HEIGHT - 52
  doc.text('INFORME ANALÍTICO', MARGIN, y, 9, 'F2', TEAL)
  y -= 25
  y = doc.wrappedText(input.title, MARGIN, y, 560, 25, 31, 'F2', NAVY)
  y -= 12
  y = doc.wrappedText('Comparativa visual de datos consultados en el copiloto de clima.', MARGIN, y, 530, 11, 16, 'F1', INK_MUTED)

  const metaY = 276
  const metaWidth = (PAGE_WIDTH - MARGIN * 2 - 24) / 3
  const meta = [
    ['ALCANCE', input.context ?? 'Grupo Emaresa'],
    ['FUENTE', input.source ?? 'Dataset de clima y BUK'],
    ['FECHA DE EMISIÓN', dateLabel],
  ]
  meta.forEach(([label, value], index) => {
    const x = MARGIN + index * (metaWidth + 12)
    doc.rect(x, metaY, metaWidth, 66, SURFACE, LINE)
    doc.text(label, x + 14, metaY + 46, 7, 'F2', TEAL)
    doc.wrappedText(value, x + 14, metaY + 28, metaWidth - 28, 10, 13, 'F2', NAVY_INK)
  })

  doc.rect(MARGIN, 112, PAGE_WIDTH - MARGIN * 2, 128, '#F8FBFE', LINE)
  doc.text('CONSULTA DE ORIGEN', MARGIN + 18, 215, 7, 'F2', TEAL)
  doc.wrappedText(`“${input.question}”`, MARGIN + 18, 190, PAGE_WIDTH - MARGIN * 2 - 36, 13, 18, 'F2', NAVY_INK)
  doc.line(MARGIN + 18, 155, PAGE_WIDTH - MARGIN - 18, 155, LINE)
  doc.text('LECTURA DE MENTAT', MARGIN + 18, 140, 7, 'F2', TEAL)
  doc.wrappedText(input.summary, MARGIN + 18, 128, PAGE_WIDTH - MARGIN * 2 - 36, 9.5, 13, 'F1', INK_MUTED)

  doc.text('CONTENIDO DEL INFORME', MARGIN, 92, 8, 'F2', NAVY)
  input.blocks.forEach((block, index) => {
    const label = block.type === 'bars' ? 'Gráfico de barras' : 'Tabla de detalle'
    const title = `${index + 1}. ${block.title}`
    const rowY = 70 - index * 15
    doc.rect(MARGIN, rowY - 2, 7, 7, index % 2 === 0 ? TEAL : '#E7B64A')
    doc.text(title, MARGIN + 15, rowY, 8.5, 'F2', NAVY_INK)
    doc.text(label, PAGE_WIDTH - MARGIN, rowY, 8, 'F1', INK_MUTED, 'right')
  })
  if (logo) doc.command('')
}

function drawBlockTitle(doc: PdfDocument, block: MentatDataBlock, continuation: boolean) {
  if (block.type === 'bars') {
    doc.rect(0, PAGE_HEIGHT - HEADER_HEIGHT, PAGE_WIDTH, HEADER_HEIGHT, NAVY)
    doc.rect(0, PAGE_HEIGHT - HEADER_HEIGHT, PAGE_WIDTH, 3, TEAL)
    doc.rect(MARGIN, PAGE_HEIGHT - 56, 18, 18, '#F6C13D')
    doc.text('Emaresa', MARGIN + 25, PAGE_HEIGHT - 51, 16, 'F2', '#FFFFFF')
    doc.text('MENTAT', PAGE_WIDTH - MARGIN - 72, PAGE_HEIGHT - 45, 9, 'F2', '#FFFFFF')
    doc.text('INFORME VISUAL', PAGE_WIDTH - MARGIN - 72, PAGE_HEIGHT - 57, 7, 'F1', TEAL_LIGHT)
  }
  const y = PAGE_HEIGHT - HEADER_HEIGHT - 46
  doc.text(continuation ? 'CONTINUACIÓN' : block.type === 'bars' ? 'GRÁFICO' : 'TABLA', MARGIN, y, 8, 'F2', TEAL)
  doc.text(block.title, MARGIN, y - 24, 19, 'F2', NAVY)
  if (block.type === 'bars') doc.text(block.valueLabel, PAGE_WIDTH - MARGIN, y - 20, 8.5, 'F1', INK_MUTED, 'right')
  doc.line(MARGIN, y - 38, PAGE_WIDTH - MARGIN, y - 38, LINE)
}

function drawBars(doc: PdfDocument, block: Extract<MentatDataBlock, { type: 'bars' }>, start: number, end: number) {
  const x = MARGIN
  const width = PAGE_WIDTH - MARGIN * 2
  const top = PAGE_HEIGHT - HEADER_HEIGHT - 92
  const labelWidth = 170
  const valueWidth = 48
  const barX = x + labelWidth
  const barWidth = width - labelWidth - valueWidth
  const rowHeight = 25
  const cardHeight = 35 + (end - start) * rowHeight
  doc.rect(x, top - cardHeight, width, cardHeight, '#FFFFFF', LINE)
  doc.text('RESULTADO', x + 17, top - 22, 7, 'F2', TEAL)
  doc.text(block.valueLabel, x + width - 17, top - 22, 7, 'F1', INK_MUTED, 'right')
  block.items.slice(start, end).forEach((item, index) => {
    const rowY = top - 50 - index * rowHeight
    if (index % 2 === 1) doc.rect(x + 1, rowY - 10, width - 2, rowHeight, '#FBFDFF')
    doc.text(truncate(item.label, labelWidth - 26, 8.5), x + 17, rowY, 8.5, 'F1', NAVY_INK)
    doc.rect(barX, rowY - 5, barWidth - 18, 6, '#EDF4FA')
    const ratio = block.maxValue > 0 ? Math.max(0.02, Math.min(1, item.value / block.maxValue)) : 0
    doc.rect(barX, rowY - 5, (barWidth - 18) * ratio, 6, item.fill)
    doc.text(item.displayValue, x + width - 17, rowY, 8.5, 'F2', NAVY_INK, 'right')
  })
}

function drawTable(doc: PdfDocument, block: Extract<MentatDataBlock, { type: 'table' }>, start: number, end: number) {
  const x = MARGIN
  const width = PAGE_WIDTH - MARGIN * 2
  const top = PAGE_HEIGHT - HEADER_HEIGHT - 92
  const headerHeight = 29
  const rowHeight = 24
  const columnCount = block.columns.length
  const firstColumnWidth = columnCount > 1 ? width * 0.34 : width
  const remainingWidth = width - firstColumnWidth
  const columnWidths = block.columns.map((_, index) => index === 0 ? firstColumnWidth : remainingWidth / (columnCount - 1))
  const cardHeight = headerHeight + (end - start) * rowHeight
  doc.rect(x, top - cardHeight, width, cardHeight, '#FFFFFF', LINE)
  doc.rect(x, top - headerHeight, width, headerHeight, NAVY)
  let cursorX = x
  block.columns.forEach((column, index) => {
    doc.text(truncate(column, columnWidths[index] - 20, 7.5).toUpperCase(), cursorX + 10, top - 18, 7.5, 'F2', '#FFFFFF')
    cursorX += columnWidths[index]
  })
  block.rows.slice(start, end).forEach((row, rowIndex) => {
    const rowTop = top - headerHeight - rowIndex * rowHeight
    if (rowIndex % 2 === 0) doc.rect(x + 1, rowTop - rowHeight, width - 2, rowHeight, '#FBFDFF')
    let cellX = x
    row.forEach((cell, cellIndex) => {
      const cellColor = cellIndex === 0 ? NAVY_INK : INK_MUTED
      doc.text(truncate(cell, columnWidths[cellIndex] - 20, 8.2), cellX + 10, rowTop - 16, 8.2, cellIndex === 0 ? 'F2' : 'F1', cellColor)
      if (cellIndex < row.length - 1) doc.line(cellX + columnWidths[cellIndex], rowTop - rowHeight, cellX + columnWidths[cellIndex], rowTop, LINE, 0.4)
      cellX += columnWidths[cellIndex]
    })
    doc.line(x, rowTop - rowHeight, x + width, rowTop - rowHeight, LINE, 0.4)
  })
}

function drawBlockPages(doc: PdfDocument, block: MentatDataBlock) {
  const availableRows = block.type === 'bars' ? 15 : 16
  const totalRows = block.type === 'bars' ? block.items.length : block.rows.length
  const pageCount = Math.max(1, Math.ceil(totalRows / availableRows))
  for (let page = 0; page < pageCount; page += 1) {
    if (page > 0) doc.newPage()
    const start = page * availableRows
    const end = Math.min(totalRows, start + availableRows)
    drawBlockTitle(doc, block, page > 0)
    if (block.type === 'bars') drawBars(doc, block, start, end)
    else drawTable(doc, block, start, end)
    if (pageCount > 1) doc.text(`Filas ${start + 1}-${end} de ${totalRows}`, MARGIN, 61, 7.5, 'F1', INK_MUTED)
  }
}

async function loadLogo(): Promise<LogoImage | undefined> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}emaresa-logo.png`)
    if (!response.ok) return undefined
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const element = new Image()
        element.onload = () => resolve(element)
        element.onerror = () => reject(new Error('No se pudo cargar el logo'))
        element.src = objectUrl
      })
      const maxWidth = 360
      const scale = Math.min(1, maxWidth / image.naturalWidth)
      const width = Math.max(1, Math.round(image.naturalWidth * scale))
      const height = Math.max(1, Math.round(image.naturalHeight * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      if (!context) return undefined
      context.drawImage(image, 0, 0, width, height)
      const source = context.getImageData(0, 0, width, height).data
      const background = [31, 54, 86]
      const rgb = new Uint8Array(width * height * 3)
      for (let index = 0, output = 0; index < source.length; index += 4, output += 3) {
        const alpha = source[index + 3] / 255
        rgb[output] = Math.round(source[index] * alpha + background[0] * (1 - alpha))
        rgb[output + 1] = Math.round(source[index + 1] * alpha + background[1] * (1 - alpha))
        rgb[output + 2] = Math.round(source[index + 2] * alpha + background[2] * (1 - alpha))
      }
      return { width, height, rgb }
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  } catch {
    return undefined
  }
}

function filenameFromTitle(title: string) {
  const slug = safeText(title)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
  const date = new Date().toISOString().slice(0, 10)
  return `${slug || 'informe-mentat'}-${date}.pdf`
}

export async function createMentatReport(input: MentatReportInput) {
  const dateLabel = new Intl.DateTimeFormat('es-CL', { dateStyle: 'long' }).format(new Date())
  const logo = await loadLogo()
  const document = new PdfDocument()
  drawCover(document, input, dateLabel, logo)
  input.blocks.forEach((block) => {
    document.newPage()
    drawBlockPages(document, block)
  })
  return {
    blob: document.finish(logo),
    filename: filenameFromTitle(input.title),
  }
}

export async function downloadMentatReport(input: MentatReportInput) {
  const { blob, filename } = await createMentatReport(input)
  const url = URL.createObjectURL(blob)
  const anchor = window.document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'
  window.document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
