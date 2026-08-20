import { corporateMonths, corporateQuestions } from '../data/corporativo'
import { clima, divisionPath, unitPath } from './clima'
import { bukOrganization } from './buk'
import { formatPercent, formatPlain, toneLabel, toneMeta, toneOf } from './format'
import type { BukAreaNode, BukCompany } from '../types/buk'
import type { Pregunta, UnidadNegocio } from '../types/clima'

export interface MentatContext {
  activeUnit?: string
  activeDivision?: string
  pathname?: string
}

export interface MentatAction {
  label: string
  href: string
}

export interface MentatTableBlock {
  type: 'table'
  title: string
  columns: string[]
  rows: string[][]
}

export interface MentatBarsBlock {
  type: 'bars'
  title: string
  valueLabel: string
  maxValue: number
  items: Array<{ label: string; value: number; displayValue: string; fill: string }>
}

export type MentatDataBlock = MentatTableBlock | MentatBarsBlock

export interface MentatReply {
  text: string
  source?: string
  sourceHref?: string
  actions?: MentatAction[]
  blocks?: MentatDataBlock[]
}

interface AreaRecord {
  area: BukAreaNode
  company: BukCompany
  path: string[]
}

const areaRecords = flattenAreas()

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

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' y ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function compact(value: string) {
  return normalize(value).replace(/\s/g, '')
}

function includesAny(value: string, words: string[]) {
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

function findUnits(query: string) {
  const normalizedQuery = normalize(query)
  const compactQuery = compact(query)
  const queryTokens = normalizedQuery.split(' ')
  return clima.unidades.filter((unit) => unitMatchesQuery(unit, normalizedQuery, compactQuery, queryTokens))
}

function findUnit(query: string, context?: MentatContext) {
  const contextUnit = context?.activeUnit ? clima.unidades.find((unit) => unit.unidad === context.activeUnit) : undefined
  return findUnits(query)[0] ?? contextUnit
}

function findArea(query: string) {
  const normalizedQuery = normalize(query)
  const compactQuery = compact(query)
  return [...areaRecords]
    .sort((a, b) => b.area.name.length - a.area.name.length)
    .find((record) => {
      const name = normalize(record.area.name)
      return name.length > 2 && (normalizedQuery.includes(name) || compactQuery.includes(compact(record.area.name)))
    })
}

function formatTone(value: number | string) {
  if (typeof value !== 'number') return 'sin resultado'
  return `${formatPercent(value)} · ${toneLabel[toneOf(value)]}`
}

function unitAction(unit: UnidadNegocio): MentatAction {
  return { label: `Abrir ${unit.unidad}`, href: unitPath(unit.unidad) }
}

function questionAnswer(question: Pick<Pregunta, 'pregunta' | 'resultado'> & { categoria?: string }, scope: string, href?: string): MentatReply {
  return {
    text: `La pregunta “${question.pregunta}” registra ${formatTone(question.resultado)} en ${scope}.${question.categoria ? ` Está clasificada en ${question.categoria}.` : ''}`,
    source: `Detalle de ${scope}`,
    sourceHref: href,
  }
}

type ComparisonMetric = 'clima' | 'participacion' | 'gestion' | 'personas'

interface VisualRequest {
  comparison: boolean
  chart: boolean
  table: boolean
  ranking: boolean
}

interface VisualRow {
  label: string
  value: number
  displayValue: string
  columns: string[]
}

function visualRequest(query: string): VisualRequest {
  const normalizedQuery = normalize(query)
  const tokens = normalizedQuery.split(' ')
  const comparison = includesAny(normalizedQuery, ['compar', 'versus', 'diferencia', 'contrasta']) || tokens.includes('vs')
  const chart = includesAny(normalizedQuery, ['grafico', 'grafica', 'chart', 'barras', 'visualiza'])
  const table = includesAny(normalizedQuery, ['tabla', 'tabular', 'cuadro', 'lista'])
  const ranking = includesAny(normalizedQuery, ['ranking', 'todas las unidades', 'todas unidades', 'unidades de negocio'])
  return { comparison, chart, table, ranking }
}

function comparisonMetric(query: string): ComparisonMetric {
  const normalizedQuery = normalize(query)
  if (includesAny(normalizedQuery, ['persona', 'dotacion', 'empleados', 'colaboradores'])) return 'personas'
  if (includesAny(normalizedQuery, ['participacion', 'respuesta', 'cobertura'])) return 'participacion'
  if (includesAny(normalizedQuery, ['gestion corporativa', 'gestion'])) return 'gestion'
  return 'clima'
}

function metricLabel(metric: ComparisonMetric) {
  return metric === 'participacion'
    ? 'participación'
    : metric === 'gestion'
      ? 'Gestión Corporativa'
      : metric === 'personas'
        ? 'personas activas'
        : 'resultado de clima'
}

function unitMetric(unit: UnidadNegocio, metric: ComparisonMetric) {
  if (metric === 'participacion') return unit.participacion
  if (metric === 'gestion') return unit.resultado_gestion_corporativa
  return unit.resultado_global
}

function visualBlocks(query: string, title: string, valueLabel: string, chartItems: Array<{ label: string; value: number; displayValue: string }>, columns: string[], rows: VisualRow[], maxValue?: number): MentatDataBlock[] {
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
      items: chartItems.map((item) => ({
        ...item,
        fill: toneMeta[toneOf(item.value)].fill,
      })),
    })
  }

  if (showTable && rows.length > 0) blocks.push({ type: 'table', title, columns, rows: rows.map((row) => row.columns) })
  return blocks
}

function findAreas(query: string) {
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

function answerComparison(query: string, context?: MentatContext): MentatReply | undefined {
  const normalizedQuery = normalize(query)
  const request = visualRequest(query)
  if (!request.comparison && !request.chart && !request.table && !request.ranking) return undefined

  const explicitUnits = findUnits(query)
  const contextUnit = findUnit('', context)
  const asksUnits = includesAny(normalizedQuery, ['unidades de negocio', 'unidades', 'unidad de negocio'])
  const allUnitsRequested = (request.ranking || (asksUnits && (request.chart || request.table || request.comparison))) && !includesAny(normalizedQuery, ['area', 'subarea', 'buk'])
  const units = allUnitsRequested
    ? clima.global.ranking_unidades.map((ranking) => clima.unidades.find((unit) => unit.unidad === ranking.unidad)).filter((unit): unit is UnidadNegocio => Boolean(unit))
    : explicitUnits.length > 0 ? explicitUnits : contextUnit ? [contextUnit] : []
  const metric = comparisonMetric(query)
  const globalRequested = includesAny(normalizedQuery, ['global', 'grupo'])
  const asksCorporateVsClimate = includesAny(normalizedQuery, ['gestion corporativa', 'gestion']) && (includesAny(normalizedQuery, ['clima', 'resultado', 'global']) || request.comparison)

  if (asksCorporateVsClimate) {
    const scopes = units.length > 0
      ? units.map((unit) => ({ label: unit.unidad, climate: unit.resultado_global, corporate: unit.resultado_gestion_corporativa, href: unitPath(unit.unidad) }))
      : [{ label: 'Grupo Emaresa', climate: clima.global.resultado_global, corporate: clima.global.resultado_gestion_corporativa, href: '/' }]
    const chartItems = scopes.flatMap((scope) => [
      { label: `${scope.label} · Clima`, value: scope.climate, displayValue: formatPercent(scope.climate) },
      { label: `${scope.label} · Gestión`, value: scope.corporate, displayValue: formatPercent(scope.corporate) },
    ])
    const rows = scopes.map((scope) => ({ label: scope.label, value: scope.climate, displayValue: formatPercent(scope.climate), columns: [scope.label, formatPercent(scope.climate), formatPercent(scope.corporate), formatPercent(scope.corporate - scope.climate)] }))
    return {
      text: `Comparé clima versus Gestión Corporativa${scopes.length === 1 ? ` para ${scopes[0].label}` : ` en ${scopes.length} unidades`}. La última columna muestra la diferencia entre ambos indicadores.`,
      source: 'Dataset de clima · S1 2026',
      sourceHref: scopes[0]?.href,
      blocks: visualBlocks(query, 'Clima versus Gestión Corporativa', 'Resultado (%)', chartItems, ['Alcance', 'Clima', 'Gestión Corporativa', 'Diferencia'], rows, 100),
    }
  }

  const asksCorporateTeams = includesAny(normalizedQuery, ['equipo', 'equipos', 'corporativa', 'corporativo'])
  if (asksCorporateTeams && !asksCorporateVsClimate && (request.chart || request.table || request.comparison)) {
    const selectedMonths = corporateMonths.filter((month) => normalizedQuery.includes(normalize(month.mes)))
    const teams = (selectedMonths.length > 0 ? selectedMonths : corporateMonths).flatMap((month) => month.equipos.map((team) => ({ ...team, mes: month.mes })))
    const rows = teams.map((team) => ({ label: team.equipo, value: team.resultado, displayValue: formatPercent(team.resultado), columns: [team.equipo, team.mes, formatPercent(team.resultado)] }))
    return {
      text: `Comparé ${teams.length} equipos de Gestión Corporativa${selectedMonths.length > 0 ? ` en ${selectedMonths.map((month) => month.mes).join(' y ')}` : ''}.`,
      source: 'Gestión Corporativa',
      sourceHref: '/gestion-corporativa',
      blocks: visualBlocks(query, 'Equipos de Gestión Corporativa', 'Resultado (%)', teams.map((team) => ({ label: team.equipo, value: team.resultado, displayValue: formatPercent(team.resultado) })), ['Equipo', 'Mes', 'Resultado'], rows, 100),
    }
  }

  const explicitAreas = findAreas(query)
  const asksOrganization = includesAny(normalizedQuery, ['area', 'subarea', 'organizacion', 'buk', 'personas'])
  if (explicitAreas.length >= 2 || (asksOrganization && (request.chart || request.table || request.comparison) && units.length === 0)) {
    const areas = explicitAreas.length >= 2
      ? explicitAreas
      : areaRecords.filter((record) => record.area.depth === 1).sort((a, b) => b.area.employeeCount - a.area.employeeCount).slice(0, 10)
    const rows = areas.map((record) => ({ label: record.area.name, value: record.area.employeeCount, displayValue: formatPlain(record.area.employeeCount), columns: [record.area.name, record.company.name, formatPlain(record.area.employeeCount), formatPlain(record.area.children.length)] }))
    return {
      text: explicitAreas.length >= 2 ? `Comparé ${areas.length} áreas o subáreas por cantidad de personas activas.` : 'Ordené las áreas de primer nivel por cantidad de personas activas. Puedes pedirme el nombre de un área para revisar su detalle.',
      source: 'Organización BUK · datos agregados',
      sourceHref: '/organizacion',
      blocks: visualBlocks(query, 'Personas activas por área', 'Personas', areas.map((record) => ({ label: record.area.name, value: record.area.employeeCount, displayValue: formatPlain(record.area.employeeCount) })), ['Área o subárea', 'Empresa', 'Personas', 'Nodos dependientes'], rows),
    }
  }

  const asksDivision = includesAny(normalizedQuery, ['division', 'razon social', 'legal'])
  if (asksDivision && units.length > 0) {
    const unit = units[0]
    const divisions = unit.divisiones.filter((division) => typeof division.resultado === 'number')
    const rows = divisions.map((division) => {
      const result = typeof division.resultado === 'number' ? division.resultado : 0
      const participation = typeof division.respondidos === 'number' && division.enviados > 0 ? (division.respondidos / division.enviados) * 100 : 0
      return { label: division.nombre, value: result, displayValue: formatPercent(result), columns: [division.nombre, formatPercent(result), formatPercent(participation), `${formatPlain(division.respondidos)} / ${formatPlain(division.enviados)}`] }
    })
    return {
      text: `Comparé las divisiones legales de ${unit.unidad} por resultado de clima y participación.`,
      source: `Detalle de ${unit.unidad}`,
      sourceHref: unitPath(unit.unidad),
      blocks: visualBlocks(query, `Divisiones legales · ${unit.unidad}`, 'Resultado (%)', divisions.map((division) => ({ label: division.nombre, value: typeof division.resultado === 'number' ? division.resultado : 0, displayValue: formatPercent(division.resultado) })), ['Razón social', 'Resultado', 'Participación', 'Respuestas'], rows, 100),
      actions: [unitAction(unit)],
    }
  }

  const asksCategory = includesAny(normalizedQuery, ['categoria', 'categorias'])
  if (asksCategory && units.length > 0) {
    const unit = units[0]
    const compareWithGlobal = globalRequested || request.comparison
    const categories = unit.categorias
    const rows = categories.map((category) => {
      const globalCategory = clima.global.categorias.find((item) => item.categoria === category.categoria)
      const columns = compareWithGlobal
        ? [category.categoria, formatPercent(category.resultado), formatPercent(globalCategory?.resultado)]
        : [category.categoria, formatPercent(category.resultado)]
      return { label: category.categoria, value: category.resultado, displayValue: formatPercent(category.resultado), columns }
    })
    const chartItems = compareWithGlobal
      ? categories.flatMap((category) => {
        const globalCategory = clima.global.categorias.find((item) => item.categoria === category.categoria)
        return [
          { label: `${category.categoria} · ${unit.unidad}`, value: category.resultado, displayValue: formatPercent(category.resultado) },
          ...(globalCategory ? [{ label: `${category.categoria} · Grupo`, value: globalCategory.resultado, displayValue: formatPercent(globalCategory.resultado) }] : []),
        ]
      })
      : categories.map((category) => ({ label: category.categoria, value: category.resultado, displayValue: formatPercent(category.resultado) }))
    return {
      text: compareWithGlobal ? `Comparé las categorías de ${unit.unidad} contra el resultado del grupo.` : `Organicé las categorías de ${unit.unidad} de acuerdo con su resultado.`,
      source: `Categorías de ${unit.unidad}`,
      sourceHref: unitPath(unit.unidad),
      blocks: visualBlocks(query, compareWithGlobal ? `Categorías · ${unit.unidad} versus grupo` : `Categorías · ${unit.unidad}`, 'Resultado (%)', chartItems, compareWithGlobal ? ['Categoría', unit.unidad, 'Grupo'] : ['Categoría', 'Resultado'], rows, 100),
      actions: [unitAction(unit)],
    }
  }

  const unitsForComparison = allUnitsRequested || explicitUnits.length >= 2 ? units : []
  if (metric === 'personas' && unitsForComparison.length >= 2) {
    return {
      text: 'El snapshot de BUK permite comparar personas activas por empresa, área y subárea, pero no cruza esa dotación con las unidades de la encuesta. Para una comparación válida, pide “grafica las áreas con más personas”.',
      source: 'Organización BUK · datos agregados',
      sourceHref: '/organizacion',
    }
  }
  if (unitsForComparison.length >= 2) {
    const rows = unitsForComparison.map((unit) => ({
      label: unit.unidad,
      value: unitMetric(unit, metric),
      displayValue: metric === 'personas' ? '—' : formatPercent(unitMetric(unit, metric)),
      columns: [unit.unidad, formatPercent(unit.resultado_global), formatPercent(unit.participacion), formatPercent(unit.resultado_gestion_corporativa)],
    }))
    const chartItems = unitsForComparison.map((unit) => ({ label: unit.unidad, value: unitMetric(unit, metric), displayValue: metric === 'personas' ? '—' : formatPercent(unitMetric(unit, metric)) }))
    return {
      text: `Comparé ${unitsForComparison.length} unidades por ${metricLabel(metric)}. La tabla conserva también clima, participación y Gestión Corporativa para que puedas leer la diferencia completa.`,
      source: 'Ranking de unidades · S1 2026',
      sourceHref: '/',
      blocks: visualBlocks(query, `Comparativa de unidades · ${metricLabel(metric)}`, metric === 'personas' ? 'Personas' : 'Resultado (%)', chartItems, ['Unidad', 'Clima', 'Participación', 'Gestión Corporativa'], rows, metric === 'personas' ? undefined : 100),
    }
  }

  if (units.length === 1 && (request.chart || request.table) && !asksCategory && !asksDivision) {
    const unit = units[0]
    const rows = unit.categorias.map((category) => ({ label: category.categoria, value: category.resultado, displayValue: formatPercent(category.resultado), columns: [category.categoria, formatPercent(category.resultado)] }))
    return {
      text: `Preparé una lectura visual de ${unit.unidad} por categoría.`,
      source: `Detalle de ${unit.unidad}`,
      sourceHref: unitPath(unit.unidad),
      blocks: visualBlocks(query, `Perfil de clima · ${unit.unidad}`, 'Resultado (%)', rows.map((row) => ({ label: row.label, value: row.value, displayValue: row.displayValue })), ['Categoría', 'Resultado'], rows, 100),
      actions: [unitAction(unit)],
    }
  }

  return undefined
}

function answerArea(query: string): MentatReply | undefined {
  const area = findArea(query)
  const asksForNote = includesAny(normalize(query), ['nota', 'notas', 'comentario', 'comentarios', 'observacion', 'observaciones', 'detalle'])

  if (!area && !asksForNote) return undefined

  if (!area) {
    return {
      text: `Puedo buscar notas de áreas y subáreas en el snapshot de BUK, pero necesito el nombre del nodo. Prueba con “¿qué nota tiene PRODUCCIÓN 1?” o “¿qué áreas tiene EMARESA S.A.?”.`,
      source: 'Organización BUK',
      sourceHref: '/organizacion',
    }
  }

  const label = area.area.depth > 0 ? 'subárea' : 'área'
  const location = `${label} ${area.area.name} · ${area.company.name}`
  if (area.area.notes?.length) {
    return {
      text: `Encontré ${area.area.notes.length === 1 ? 'esta nota' : 'estas notas'} para ${location}:\n${area.area.notes.map((note) => `• ${note}`).join('\n')}`,
      source: 'Snapshot BUK',
      sourceHref: '/organizacion',
    }
  }

  return {
    text: `No hay una nota cualitativa cargada para ${location}. El snapshot disponible sí registra ${formatPlain(area.area.employeeCount)} personas activas y ${area.area.children.length} nivel${area.area.children.length === 1 ? '' : 'es'} dependiente${area.area.children.length === 1 ? '' : 's'}.`,
    source: 'Snapshot BUK · datos agregados',
    sourceHref: '/organizacion',
  }
}

function answerOrganization(query: string): MentatReply | undefined {
  const normalizedQuery = normalize(query)
  const asksOrganization = includesAny(normalizedQuery, ['buk', 'organizacion', 'empresa', 'area', 'subarea', 'personas activas', 'estructura'])
  if (!asksOrganization) return undefined

  const area = findArea(query)
  if (area) {
    const children = area.area.children.length
    return {
      text: `${area.area.name} pertenece a ${area.company.name}. Tiene ${formatPlain(area.area.employeeCount)} personas activas y ${children} nodo${children === 1 ? '' : 's'} dependiente${children === 1 ? '' : 's'} en el snapshot.`,
      source: 'Organización BUK',
      sourceHref: '/organizacion',
    }
  }

  if (includesAny(normalizedQuery, ['empresa', 'empresas'])) {
    const biggest = [...bukOrganization.companies].sort((a, b) => b.employeeCount - a.employeeCount)[0]
    return {
      text: `BUK tiene ${formatPlain(bukOrganization.companyCount)} empresas y ${formatPlain(bukOrganization.employeeCount)} personas activas. La empresa con mayor dotación es ${biggest?.name ?? '—'} con ${formatPlain(biggest?.employeeCount)} personas.`,
      source: 'Snapshot BUK',
      sourceHref: '/organizacion',
    }
  }

  if (includesAny(normalizedQuery, ['mas personas', 'mayor dotacion', 'mayor cantidad', 'mas grande'])) {
    const areaWithMostPeople = [...areaRecords]
      .filter((record) => record.area.depth === 1)
      .sort((a, b) => b.area.employeeCount - a.area.employeeCount)[0]
    return {
      text: `El área con más personas activas es ${areaWithMostPeople?.area.name ?? '—'} en ${areaWithMostPeople?.company.name ?? '—'}, con ${formatPlain(areaWithMostPeople?.area.employeeCount)} personas.`,
      source: 'Organización BUK',
      sourceHref: '/organizacion',
    }
  }

  return {
    text: `La estructura BUK contiene ${formatPlain(bukOrganization.companyCount)} empresas, ${formatPlain(bukOrganization.areaCount)} áreas y subáreas, y ${formatPlain(bukOrganization.employeeCount)} personas activas. No se publican fichas personales.`,
    source: 'Snapshot BUK · datos agregados',
    sourceHref: '/organizacion',
  }
}

function answerUnit(query: string, context?: MentatContext): MentatReply | undefined {
  const unit = findUnit(query, context)
  const normalizedQuery = normalize(query)
  if (!unit) return undefined

  const asksForDivision = includesAny(normalizedQuery, ['division', 'razon social', 'legal'])
  if (asksForDivision) {
    return {
      text: `${unit.unidad} tiene ${unit.divisiones.length} ${unit.divisiones.length === 1 ? 'división legal' : 'divisiones legales'}: ${unit.divisiones.map((division) => `${division.nombre} (${formatTone(division.resultado)})`).join('; ')}.`,
      source: `Detalle de ${unit.unidad}`,
      sourceHref: unitPath(unit.unidad),
      actions: unit.divisiones.slice(0, 2).map((division) => ({ label: `Abrir ${division.nombre}`, href: divisionPath(unit.unidad, division.nombre) })),
    }
  }

  if (includesAny(normalizedQuery, ['participacion', 'respuesta', 'respondieron', 'enviadas'])) {
    return {
      text: `${unit.unidad} tiene una participación de ${formatPercent(unit.participacion)}: ${formatPlain(unit.respondidas)} respuestas de ${formatPlain(unit.enviadas)} enviadas.`,
      source: `Detalle de ${unit.unidad}`,
      sourceHref: unitPath(unit.unidad),
      actions: [unitAction(unit)],
    }
  }

  const asksForCategory = includesAny(normalizedQuery, ['categoria', 'categorias'])
  if (asksForCategory) {
    const best = [...unit.categorias].sort((a, b) => b.resultado - a.resultado)[0]
    const opportunity = [...unit.categorias].sort((a, b) => a.resultado - b.resultado)[0]
    return {
      text: `En ${unit.unidad}, la categoría más alta es ${best?.categoria ?? '—'} con ${formatTone(best?.resultado ?? '—')}; la más baja es ${opportunity?.categoria ?? '—'} con ${formatTone(opportunity?.resultado ?? '—')}.`,
      source: `Categorías de ${unit.unidad}`,
      sourceHref: unitPath(unit.unidad),
      actions: [unitAction(unit)],
    }
  }

  const asksForOpportunity = includesAny(normalizedQuery, ['peor', 'bajo', 'oportunidad', 'debilidad', 'critico', 'critica'])
  const asksForBest = includesAny(normalizedQuery, ['mejor', 'alto', 'fortaleza', 'favorable', 'destaca'])
  if (asksForOpportunity || asksForBest) {
    const list = asksForOpportunity ? unit.bottom10 : unit.top10
    const question = list[0]
    return question ? questionAnswer(question, unit.unidad, unitPath(unit.unidad)) : undefined
  }

  const matchingQuestion = [...unit.top10, ...unit.bottom10].find((item) => normalizedQuery.includes(normalize(item.pregunta).slice(0, 28)))
  if (matchingQuestion) return questionAnswer(matchingQuestion, unit.unidad, unitPath(unit.unidad))

  return {
    text: `${unit.unidad} tiene un resultado de clima de ${formatTone(unit.resultado_global)}, una participación de ${formatPercent(unit.participacion)} y ${unit.divisiones.length} ${unit.divisiones.length === 1 ? 'división legal' : 'divisiones legales'}.`,
    source: `Detalle de ${unit.unidad}`,
    sourceHref: unitPath(unit.unidad),
    actions: [unitAction(unit)],
  }
}

function answerGlobal(query: string): MentatReply | undefined {
  const normalizedQuery = normalize(query)
  const asksForGlobal = includesAny(normalizedQuery, ['global', 'grupo', 'empresa', 'clima', 'resultado', 'participacion', 'respuesta'])
  if (!asksForGlobal) return undefined

  if (includesAny(normalizedQuery, ['participacion', 'respuesta', 'respondieron', 'enviadas'])) {
    return {
      text: `El grupo tiene una participación de ${formatPercent(clima.global.participacion)}: ${formatPlain(clima.global.respondidas)} respuestas de ${formatPlain(clima.global.enviadas)} enviadas.`,
      source: 'Resumen ejecutivo',
      sourceHref: '/',
    }
  }

  const isOpportunity = includesAny(normalizedQuery, ['peor', 'bajo', 'oportunidad', 'debilidad', 'critico', 'critica'])
  const isBest = includesAny(normalizedQuery, ['mejor', 'alto', 'fortaleza', 'favorable', 'destaca'])
  if (isOpportunity || isBest) {
    const question = (isOpportunity ? clima.global.bottom5 : clima.global.top5)[0]
    if (question) return questionAnswer(question, 'el grupo', '/')
  }

  const highestUnit = clima.global.ranking_unidades[0]
  const lowestUnit = clima.global.ranking_unidades[clima.global.ranking_unidades.length - 1]
  return {
    text: `El resultado global es ${formatTone(clima.global.resultado_global)} y Gestión Corporativa registra ${formatTone(clima.global.resultado_gestion_corporativa)}. La unidad más alta es ${highestUnit?.unidad ?? '—'} (${formatPercent(highestUnit?.resultado)}) y la más baja es ${lowestUnit?.unidad ?? '—'} (${formatPercent(lowestUnit?.resultado)}).`,
    source: 'Resumen ejecutivo',
    sourceHref: '/',
  }
}

function answerCorporate(query: string): MentatReply | undefined {
  const normalizedQuery = normalize(query)
  if (!includesAny(normalizedQuery, ['corporativa', 'corporativo', 'equipo', 'equipos', 'gestion'])) return undefined

  const teams = corporateMonths.flatMap((month) => month.equipos.map((team) => ({ ...team, mes: month.mes })))
  const best = [...teams].sort((a, b) => b.resultado - a.resultado)[0]
  const opportunity = [...teams].sort((a, b) => a.resultado - b.resultado)[0]

  const month = corporateMonths.find((item) => normalizedQuery.includes(normalize(item.mes)))
  if (month) {
    return {
      text: `En ${month.mes}, Gestión Corporativa midió ${month.equipos.length} equipos: ${month.equipos.map((team) => `${team.equipo} (${formatPercent(team.resultado)})`).join(', ')}.`,
      source: 'Gestión Corporativa',
      sourceHref: '/gestion-corporativa',
    }
  }

  if (includesAny(normalizedQuery, ['pregunta', 'preguntas'])) {
    const question = corporateQuestions.sort((a, b) => b.resultado - a.resultado)[0]
    return question ? questionAnswer(question, 'Gestión Corporativa', '/gestion-corporativa') : undefined
  }

  return {
    text: `Gestión Corporativa registra ${formatTone(clima.global.resultado_gestion_corporativa)}. El equipo con mejor resultado es ${best?.equipo ?? '—'} (${formatPercent(best?.resultado)}) y la mayor oportunidad aparece en ${opportunity?.equipo ?? '—'} (${formatPercent(opportunity?.resultado)}).`,
    source: 'Gestión Corporativa',
    sourceHref: '/gestion-corporativa',
  }
}

function answerSearch(query: string): MentatReply | undefined {
  const normalizedQuery = normalize(query)
  const allQuestions: Array<Pregunta & { unit?: string }> = [
    ...clima.global.top5,
    ...clima.global.bottom5,
    ...clima.unidades.flatMap((unit) => [...unit.top10, ...unit.bottom10].map((question) => ({ ...question, unit: unit.unidad }))),
  ]
  const match = allQuestions.find((question) => {
    const words = normalize(question.pregunta).split(' ').filter((word) => word.length > 4)
    return words.filter((word) => normalizedQuery.includes(word)).length >= Math.min(2, words.length)
  })
  if (!match) return undefined

  const unitName = 'unit' in match ? match.unit : 'el grupo'
  return questionAnswer(match, unitName, 'unit' in match ? unitPath(match.unit) : '/')
}

export function replyToMentat(query: string, context?: MentatContext): MentatReply {
  const trimmed = query.trim()
  const normalizedQuery = normalize(trimmed)

  if (!trimmed) return { text: 'Escribe una pregunta y revisaré el snapshot de clima, la estructura BUK y sus notas disponibles.' }
  if (includesAny(normalizedQuery, ['hola', 'buenas', 'gracias', 'ayuda', 'que puedes'])) {
    return { text: 'Soy Mentat. Puedo consultar resultados, participación, categorías, preguntas, unidades, divisiones legales y la estructura de BUK. También puedo buscar notas de áreas y subáreas cuando estén cargadas.', source: 'Mentat' }
  }

  return answerComparison(trimmed, context)
    ?? answerArea(trimmed)
    ?? answerOrganization(trimmed)
    ?? answerUnit(trimmed, context)
    ?? answerCorporate(trimmed)
    ?? answerGlobal(trimmed)
    ?? answerSearch(trimmed)
    ?? { text: 'No encontré ese dato en el snapshot disponible. Puedo ayudarte con el resultado global, una unidad de negocio, una división legal, categorías, preguntas, participación o áreas/subáreas de BUK.', source: 'Snapshot actual' }
}
