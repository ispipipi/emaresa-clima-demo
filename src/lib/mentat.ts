import { corporateMonths, corporateQuestions } from '../data/corporativo'
import { clima, divisionPath, unitPath } from './clima'
import { bukOrganization } from './buk'
import { formatPercent, formatPlain, toneLabel, toneOf } from './format'
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

export interface MentatReply {
  text: string
  source?: string
  sourceHref?: string
  actions?: MentatAction[]
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

function findUnit(query: string, context?: MentatContext) {
  const normalizedQuery = normalize(query)
  const compactQuery = compact(query)
  const queryTokens = normalizedQuery.split(' ')
  const contextUnit = context?.activeUnit ? clima.unidades.find((unit) => unit.unidad === context.activeUnit) : undefined
  const explicitUnit = clima.unidades.find((unit) => {
    const name = normalize(unit.unidad)
    const compactName = compact(unit.unidad)
    const isShortName = compactName.length <= 3
    return (name.includes(' ') && normalizedQuery.includes(name))
      || (!isShortName && normalizedQuery.includes(name))
      || (!isShortName && compactQuery.includes(compactName))
      || (isShortName && queryTokens.includes(name))
      || (isShortName && queryTokens.includes(compactName))
      || (!isShortName && name.split(' ').every((part) => part.length > 1 && normalizedQuery.includes(part)))
  })
  return explicitUnit ?? contextUnit
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

  return answerArea(trimmed)
    ?? answerOrganization(trimmed)
    ?? answerUnit(trimmed, context)
    ?? answerCorporate(trimmed)
    ?? answerGlobal(trimmed)
    ?? answerSearch(trimmed)
    ?? { text: 'No encontré ese dato en el snapshot disponible. Puedo ayudarte con el resultado global, una unidad de negocio, una división legal, categorías, preguntas, participación o áreas/subáreas de BUK.', source: 'Snapshot actual' }
}
