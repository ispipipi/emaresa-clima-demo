import constructionS2 from '../data/construccion-s2-2026.json'
import { clima, findUnit } from './clima'
import type { UnidadNegocio } from '../types/clima'
import type { ClimatePeriod } from './period'

type ConstructionS2 = typeof constructionS2

export interface PeriodUnitData {
  unit: UnidadNegocio
  hasData: boolean
  hasDivisionData: boolean
  hasCorporateData: boolean
  responseDistribution?: { neutrales: number; detractores: number }
}

const constructionS2Data = constructionS2 as ConstructionS2

function countResponses(distribution: Record<string, number>) {
  return Object.values(distribution).reduce((total, value) => total + value, 0)
}

function constructionForS2(base: UnidadNegocio): UnidadNegocio {
  const responses = countResponses(constructionS2Data.enps.distribution)
  const invited = Math.round(responses / (constructionS2Data.semester2.participation / 100))

  return {
    ...base,
    enviadas: invited,
    respondidas: responses,
    participacion: constructionS2Data.semester2.participation,
    resultado_global: constructionS2Data.semester2.promoters,
    categorias: constructionS2Data.categories.map((category) => ({ categoria: category.name, resultado: category.semester2 })),
    top10: constructionS2Data.top10.map((question) => ({ pregunta: question.question, categoria: question.category, resultado: question.semester2 })),
    bottom10: constructionS2Data.bottom5.map((question) => ({ pregunta: question.question, categoria: question.category, resultado: question.semester2 })),
  }
}

export function periodUnitData(unitName: string | undefined, period: ClimatePeriod): PeriodUnitData | undefined {
  const base = findUnit(unitName)
  if (!base) return undefined
  if (period === 'S1-2026') return { unit: base, hasData: true, hasDivisionData: true, hasCorporateData: true }
  if (base.unidad !== constructionS2Data.unit) return { unit: base, hasData: false, hasDivisionData: false, hasCorporateData: false }
  return {
    unit: constructionForS2(base),
    hasData: true,
    hasDivisionData: false,
    hasCorporateData: false,
    responseDistribution: {
      neutrales: constructionS2Data.semester2.neutrals,
      detractores: constructionS2Data.semester2.detractors,
    },
  }
}

export function hasGroupPeriodData(period: ClimatePeriod) {
  return period === 'S1-2026'
}

export function hasCorporatePeriodData(period: ClimatePeriod) {
  return period === 'S1-2026'
}

export function hasOrganizationPeriodData(_period: ClimatePeriod) {
  return true
}

export function periodGroupData(period: ClimatePeriod) {
  return period === 'S1-2026' ? clima.global : undefined
}
