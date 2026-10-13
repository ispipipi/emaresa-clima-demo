import { clima, unitPath } from '../../lib/clima'
import { bukOrganization } from '../../lib/buk'
import { formatPercent, toneLabel, toneMeta, toneOf } from '../../lib/format'
import type { BukAreaNode, BukCompany } from '../../types/buk'
import type { Pregunta, UnidadNegocio } from '../../types/clima'
import type { MentatAction, MentatContext, MentatDataBlock, MentatReply, ComparisonMetric, RankingDirection, VisualRequest, VisualRow } from './types'

export interface AreaRecord {
  area: BukAreaNode
  company: BukCompany
  path: string[]
}

export const areaRecords = flattenAreas()

function flattenAreas() {
  const records: AreaRecord[] = []

  function visit(area: BukAreaNode, company: BukCompany, path: string[]) {
    const nextPath = [...path, area.name]
    records.push({ area, company, path: nextPath })
    area.children.forEach((child) => visit(child, company, nextPath))
  }

  bukOrganization.companies.forEach((company) => company.areas.forEach((area) => visit(area, company, [])))
  return records
}

export function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' y ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function compact(value: string) {
  return normalize(value).replace(/\s/g, '')
}

export function includesAny(value: string, words: string[]) {
  return words.some((word) => value.includes(word))
}

function unitMatchesQuery(unit: UnidadNegocio, normalizedQuery: string, compactQuery: string, queryTokens: string[]) {
  const name = normalize(unit.unidad)
  const compactName = compact(unit.unidad)
  const isShortName = compactName.length <= 3
  return (name.includes(' ') && normalizedQuery.includes(name))
    || (!isShortName && normalizedQuery.includes(name))
    || (!isShortName && compactQuery.includes(compactName))
    || (isShortName && queryTokens.includes(name))
    || (isShortName && queryTokens.includes(compactName))
    || (!isShortName && name.split(' ').every((part) => part.length > 1 && normalizedQuery.includes(part)))
}

export function findUnits(query: string) {
  const normalizedQuery = normalize(query)
  const compactQuery = compact(query)
  const queryTokens = normalizedQuery.split(' ')
  return clima.unidades.filter((unit) => unitMatchesQuery(unit, normalizedQuery, compactQuery, queryTokens))
}

export function findUnit(query: string, context?: MentatContext) {
  const contextUnit = context?.activeUnit ? clima.unidades.find((unit) => unit.unidad === context.activeUnit) : undefined
  return findUnits(query)[0] ?? contextUnit
}

export function findArea(query: string) {
  const normalizedQuery = normalize(query)
  const compactQuery = compact(query)
  return [...areaRecords]
    .sort((a, b) => b.area.name.length - a.area.name.length)
    .find((record) => {
      const name = normalize(record.area.name)
      return name.length > 2 && (normalizedQuery.includes(name) || compactQuery.includes(compact(record.area.name)))
    })
}

export function formatTone(value: number | string) {
  if (typeof value !== 'number') return 'sin resultado'
  return `${formatPercent(value)} · ${toneLabel[toneOf(value)]}`
}

export function unitAction(unit: UnidadNegocio): MentatAction {
  return { label: `Abrir ${unit.unidad}`, href: unitPath(unit.unidad) }
}

export function questionAnswer(question: Pick<Pregunta, 'pregunta' | 'resultado'> & { categoria?: string }, scope: string, href?: string): MentatReply {
  return {
    text: `La pregunta “${question.pregunta}” registra ${formatTone(question.resultado)} en ${scope}.${question.categoria ? ` Está clasificada en ${question.categoria}.` : ''}`,
    source: `Detalle de ${scope}`,
    sourceHref: href,
  }
}

export function isUnitRankingQuery(query: string) {
  const normalizedQuery = normalize(query)
  if (includesAny(normalizedQuery, ['pregunta', 'preguntas', 'categoria', 'categorias', 'area', 'subarea'])) return false

  const hasRankingWord = includesAny(normalizedQuery, ['mejor', 'mejores', 'peor', 'peores', 'top', 'ranking', 'menor', 'menores', 'bajo', 'bajas', 'bottom'])
  const hasUnitContext = includesAny(normalizedQuery, ['unidad', 'unidades', 'negocio', 'lo mismo', 'igual'])
  const hasNumericContext = /\b\d+\b/.test(normalizedQuery) || includesAny(normalizedQuery, ['uno', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'])
  const hasListContext = hasUnitContext || hasNumericContext || includesAny(normalizedQuery, ['dime las', 'cuales son', 'top', 'primeras', 'primeros', 'bottom'])

  return hasRankingWord && hasListContext
}

export function isCategoryRankingQuery(query: string) {
  const normalizedQuery = normalize(query)
  if (!includesAny(normalizedQuery, ['area', 'areas'])) return false
  if (includesAny(normalizedQuery, ['buk', 'organizacion', 'subarea', 'personas activas', 'dotacion', 'estructura'])) return false
  return includesAny(normalizedQuery, ['evaluad', 'clima', 'resultado', 'mejor', 'mejores', 'peor', 'peores', 'ranking', 'top'])
}

export function visualRequest(query: string): VisualRequest {
  const normalizedQuery = normalize(query)
  const tokens = normalizedQuery.split(' ')
  const comparison = includesAny(normalizedQuery, ['compar', 'versus', 'diferencia', 'contrasta']) || tokens.includes('vs')
  const chart = includesAny(normalizedQuery, ['grafico', 'grafica', 'chart', 'barras', 'visualiza'])
  const table = includesAny(normalizedQuery, ['tabla', 'tabular', 'cuadro', 'lista'])
  const ranking = includesAny(normalizedQuery, ['ranking', 'todas las unidades', 'todas unidades']) || isUnitRankingQuery(query) || isCategoryRankingQuery(query)
  return { comparison, chart, table, ranking }
}

export function comparisonMetric(query: string): ComparisonMetric {
  const normalizedQuery = normalize(query)
  if (includesAny(normalizedQuery, ['persona', 'dotacion', 'empleados', 'colaboradores'])) return 'personas'
  if (includesAny(normalizedQuery, ['participacion', 'respuesta', 'cobertura'])) return 'participacion'
  if (includesAny(normalizedQuery, ['gestion corporativa', 'gestion'])) return 'gestion'
  return 'clima'
}

export function metricLabel(metric: ComparisonMetric) {
  return metric === 'participacion'
    ? 'participación'
    : metric === 'gestion'
      ? 'Gestión Corporativa'
      : metric === 'personas'
        ? 'personas activas'
        : 'resultado de clima'
}

export function unitMetric(unit: UnidadNegocio, metric: ComparisonMetric) {
  if (metric === 'participacion') return unit.participacion
  if (metric === 'gestion') return unit.resultado_gestion_corporativa
  return unit.resultado_global
}

const rankingNumberWords: Record<string, number> = {
  uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
  seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
}

export function rankingLimit(query: string, defaultToThree = false) {
  const tokens = normalize(query).split(' ')
  const cueIndex = tokens.findIndex((token) => ['mejor', 'mejores', 'peor', 'peores', 'top', 'primer', 'primera', 'primeras', 'primeros', 'menor', 'menores', 'bajo', 'bajas', 'bottom'].includes(token))
  if (cueIndex < 0) return defaultToThree || isUnitRankingQuery(query) ? 3 : undefined
  const requestedValue = tokens
    .map((token) => /^\d+$/.test(token) ? Number(token) : rankingNumberWords[token])
    .find((value) => value && value > 0)
  if (requestedValue) return Math.min(requestedValue, clima.unidades.length)
  return defaultToThree || isUnitRankingQuery(query) ? 3 : undefined
}

export function rankingDirection(query: string): RankingDirection {
  return includesAny(normalize(query), ['peor', 'peores', 'menor', 'menores', 'bajo', 'bajas', 'bottom', 'menos favorable']) ? 'asc' : 'desc'
}

export function rankedUnits(query: string, metric: ComparisonMetric) {
  const direction = rankingDirection(query)
  return [...clima.unidades].sort((left, right) => {
    const difference = unitMetric(right, metric) - unitMetric(left, metric)
    return direction === 'desc' ? difference : -difference
  })
}

export function visualBlocks(query: string, title: string, valueLabel: string, chartItems: Array<{ label: string; value: number; displayValue: string }>, columns: string[], rows: VisualRow[], maxValue?: number): MentatDataBlock[] {
  const request = visualRequest(query)
  const blocks: MentatDataBlock[] = []
  const showChart = request.chart || request.comparison || request.ranking
  const showTable = request.table || request.comparison || request.ranking

  if (showChart && chartItems.length > 0) {
    const highestValue = Math.max(...chartItems.map((item) => item.value), 1)
    blocks.push({
      type: 'bars',
      title,
      valueLabel,
      maxValue: maxValue ?? highestValue,
      items: chartItems.map((item) => ({ ...item, fill: toneMeta[toneOf(item.value)].fill })),
    })
  }

  if (showTable && rows.length > 0) blocks.push({ type: 'table', title, columns, rows: rows.map((row) => row.columns) })
  return blocks
}

export function findAreas(query: string) {
  const normalizedQuery = normalize(query)
  const compactQuery = compact(query)
  const seen = new Set<number>()
  return [...areaRecords]
    .sort((a, b) => b.area.name.length - a.area.name.length)
    .filter((record) => {
      const name = normalize(record.area.name)
      const matches = name.length > 2 && (normalizedQuery.includes(name) || compactQuery.includes(compact(record.area.name)))
      if (!matches || seen.has(record.area.id)) return false
      seen.add(record.area.id)
      return true
    })
}
