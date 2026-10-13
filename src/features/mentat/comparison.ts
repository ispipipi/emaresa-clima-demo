import { corporateMonths } from '../../data/corporativo'
import { clima, unitPath } from '../../lib/clima'
import { formatPercent, formatPlain } from '../../lib/format'
import type { MentatContext, MentatReply, VisualRow } from './types'
import {
  areaRecords,
  comparisonMetric,
  findAreas,
  findUnit,
  findUnits,
  includesAny,
  isCategoryRankingQuery,
  isUnitRankingQuery,
  metricLabel,
  rankedUnits,
  rankingDirection,
  rankingLimit,
  unitAction,
  unitMetric,
  visualBlocks,
  visualRequest,
} from './query'

export function answerComparison(query: string, context?: MentatContext): MentatReply | undefined {
  const normalizedQuery = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const request = visualRequest(query)
  const asksRankedUnits = isUnitRankingQuery(query)
  const asksCategoryRanking = isCategoryRankingQuery(query)
  if (!request.comparison && !request.chart && !request.table && !request.ranking && !asksRankedUnits && !asksCategoryRanking) return undefined

  const explicitUnits = findUnits(query)
  const contextUnit = findUnit('', context)
  const asksUnits = includesAny(normalizedQuery, ['unidades de negocio', 'unidades', 'unidad de negocio'])
  const metric = comparisonMetric(query)
  const requestedLimit = rankingLimit(query, asksRankedUnits || asksCategoryRanking)
  const allUnitsRequested = request.ranking && !includesAny(normalizedQuery, ['area', 'subarea', 'buk'])
  const rankedUnitSelection = rankedUnits(query, metric)
  const units = allUnitsRequested
    ? requestedLimit ? rankedUnitSelection.slice(0, requestedLimit) : rankedUnitSelection
    : explicitUnits.length > 0 ? explicitUnits : contextUnit ? [contextUnit] : []

  if (request.comparison && asksUnits && !request.ranking && explicitUnits.length < 2) {
    return {
      text: 'Para comparar dos unidades necesito sus nombres. Por ejemplo: “Compara A&J con Construcción”.',
      source: 'Comparativa de unidades',
    }
  }

  if (asksCategoryRanking) {
    const categoryScope = contextUnit ?? clima.global
    const categories = [...categoryScope.categorias].sort((left, right) => {
      const difference = right.resultado - left.resultado
      return rankingDirection(query) === 'asc' ? -difference : difference
    })
    const selectedCategories = requestedLimit ? categories.slice(0, requestedLimit) : categories
    const rows = selectedCategories.map((category) => ({
      label: category.categoria,
      value: category.resultado,
      displayValue: formatPercent(category.resultado),
      columns: [category.categoria, formatPercent(category.resultado)],
    }))
    const scopeLabel = contextUnit ? contextUnit.unidad : 'Grupo Emaresa'
    const directionLabel = rankingDirection(query) === 'asc' ? 'menor' : 'mejor'
    return {
      text: `Interpreté “áreas evaluadas” como las categorías de clima medidas. Estas son las ${selectedCategories.length} categorías con ${directionLabel} resultado en ${scopeLabel}.`,
      source: `Categorías de clima · ${scopeLabel}`,
      sourceHref: contextUnit ? unitPath(contextUnit.unidad) : '/',
      blocks: visualBlocks(query, `Categorías de clima · ${scopeLabel}`, 'Resultado (%)', rows.map((row) => ({ label: row.label, value: row.value, displayValue: row.displayValue })), ['Categoría', 'Resultado'], rows, 100),
      actions: contextUnit ? [unitAction(contextUnit)] : undefined,
    }
  }

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
    const selectedMonths = corporateMonths.filter((month) => normalizedQuery.includes(month.mes.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()))
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
    const rows: VisualRow[] = unitsForComparison.map((unit) => ({
      label: unit.unidad,
      value: unitMetric(unit, metric),
      displayValue: metric === 'personas' ? '—' : formatPercent(unitMetric(unit, metric)),
      columns: [unit.unidad, formatPercent(unit.resultado_global), formatPercent(unit.participacion), formatPercent(unit.resultado_gestion_corporativa)],
    }))
    const chartItems = unitsForComparison.map((unit) => ({ label: unit.unidad, value: unitMetric(unit, metric), displayValue: metric === 'personas' ? '—' : formatPercent(unitMetric(unit, metric)) }))
    const scope = requestedLimit
      ? rankingDirection(query) === 'asc' ? `${unitsForComparison.length} unidades con menor ${metricLabel(metric)}` : `${unitsForComparison.length} unidades mejor evaluadas por ${metricLabel(metric)}`
      : `${unitsForComparison.length} unidades por ${metricLabel(metric)}`
    return {
      text: `Comparé ${scope}. La tabla conserva también clima, participación y Gestión Corporativa para que puedas leer la diferencia completa.`,
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
