import { clima } from './clima'
import { toneOf, type Tone } from './format'
import type { Categoria, UnidadNegocio } from '../types/clima'

export const GROUP_RESULT = clima.global.resultado_global
export const FAVORABLE_THRESHOLD = 80

export interface UnitRow {
  name: string
  result: number
  participation: number
  sent: number
  answered: number
  tone: Tone
  /** Diferencia en puntos contra el resultado del Grupo. */
  delta: number
  /** Puesto por resultado (1 = más alto). */
  rank: number
  unit: UnidadNegocio
  lowestCategory?: Categoria
  divisions: number
}

function buildUnitRows(): UnitRow[] {
  return clima.global.ranking_unidades.map((ranking, index) => {
    const unit = clima.unidades.find((item) => item.unidad === ranking.unidad) as UnidadNegocio
    const lowest = [...unit.categorias].sort((a, b) => a.resultado - b.resultado)[0]
    return {
      name: ranking.unidad,
      result: ranking.resultado,
      participation: ranking.participacion,
      sent: ranking.enviadas,
      answered: ranking.respondidas,
      tone: toneOf(ranking.resultado),
      delta: ranking.resultado - GROUP_RESULT,
      rank: index + 1,
      unit,
      lowestCategory: lowest,
      divisions: unit.divisiones.length,
    }
  })
}

/** Unidades ordenadas por resultado, de mayor a menor (el orden del dataset). */
export const unitRows: UnitRow[] = buildUnitRows()

/** Regla de "requiere atención": las n unidades con menor resultado. */
export function priorityUnits(count = 3): UnitRow[] {
  return [...unitRows].sort((a, b) => a.result - b.result).slice(0, count)
}

export function statusCounts() {
  return {
    green: unitRows.filter((row) => row.tone === 'green').length,
    yellow: unitRows.filter((row) => row.tone === 'yellow').length,
    red: unitRows.filter((row) => row.tone === 'red').length,
  }
}

/** Pregunta que más veces aparece como la más baja de una unidad. */
export function commonWeakness() {
  const counts = new Map<string, number>()
  clima.unidades.forEach((unit) => {
    const lowest = [...unit.bottom10].sort((a, b) => a.resultado - b.resultado)[0]
    if (lowest) counts.set(lowest.pregunta, (counts.get(lowest.pregunta) ?? 0) + 1)
  })
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
  const question = top ? top[0] : ''
  const known = [...clima.global.bottom5, ...clima.global.top5].find((item) => item.pregunta === question)
  return { question, count: top ? top[1] : 0, total: clima.unidades.length, groupResult: known?.resultado }
}

export interface TreeRect {
  id: string
  x: number
  y: number
  w: number
  h: number
}

/** Treemap "squarified": reparte width × height en proporción al valor de cada elemento. */
export function squarify(items: { id: string; value: number }[], width: number, height: number): TreeRect[] {
  const sorted = [...items].sort((a, b) => b.value - a.value)
  const total = sorted.reduce((sum, item) => sum + item.value, 0)
  const cells = sorted.map((item) => ({ id: item.id, area: (item.value / total) * width * height }))
  const out: TreeRect[] = []
  let x = 0
  let y = 0
  let w = width
  let h = height
  let row: { id: string; area: number }[] = []

  const worst = (candidate: { id: string; area: number }[], side: number) => {
    const sum = candidate.reduce((acc, cell) => acc + cell.area, 0)
    const max = Math.max(...candidate.map((cell) => cell.area))
    const min = Math.min(...candidate.map((cell) => cell.area))
    return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min))
  }

  const flush = (candidate: { id: string; area: number }[]) => {
    const sum = candidate.reduce((acc, cell) => acc + cell.area, 0)
    if (w >= h) {
      const columnWidth = sum / h
      let cursor = y
      candidate.forEach((cell) => {
        const cellHeight = cell.area / columnWidth
        out.push({ id: cell.id, x, y: cursor, w: columnWidth, h: cellHeight })
        cursor += cellHeight
      })
      x += columnWidth
      w -= columnWidth
    } else {
      const rowHeight = sum / w
      let cursor = x
      candidate.forEach((cell) => {
        const cellWidth = cell.area / rowHeight
        out.push({ id: cell.id, x: cursor, y, w: cellWidth, h: rowHeight })
        cursor += cellWidth
      })
      y += rowHeight
      h -= rowHeight
    }
  }

  let index = 0
  while (index < cells.length) {
    const side = Math.min(w, h)
    if (row.length === 0 || worst([...row, cells[index]], side) <= worst(row, side)) {
      row.push(cells[index])
      index += 1
    } else {
      flush(row)
      row = []
    }
  }
  if (row.length > 0) flush(row)
  return out
}
