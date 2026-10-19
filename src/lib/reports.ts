import type { ClimatePeriod } from './period'

export interface ReportDefinition {
  id: string
  title: string
  scope: string
  description: string
  file: string
  cover: string
}

export interface UnitReportDefinition {
  id: string
  label: string
  period: string
  file: string
  description: string
  current?: boolean
}

export const reportDefinitions = {
  corporate: {
    id: 'gestion-corporativa-s1-2026',
    title: 'Gestión Corporativa · S1 2026',
    scope: 'Compañía',
    description:
      'Resultados por equipo entre febrero y mayo, con consolidado semestral de Gestión Corporativa.',
    file: 'gestion-corporativa-s1-2026.pdf',
    cover: 'gestion-corporativa-s1-2026.png',
  },
  aj: {
    id: 'aj-s1-2026',
    title: 'Agroforestal y Jardines · S1 2026',
    scope: 'Unidad de negocio',
    description:
      'Informe de A&J con datos generales, categorías, preguntas destacadas y sugerencias de planes de acción.',
    file: 'aj-s1-2026.pdf',
    cover: 'aj-s1-2026.png',
  },
} satisfies Record<string, ReportDefinition>

export function reportUrl(file: string) {
  return `${import.meta.env.BASE_URL}reportes/${file}`
}

export function reportCoverUrl(file: string) {
  return `${import.meta.env.BASE_URL}reportes/portadas/${file}`
}

export function unitReportFile(unidad: string) {
  const normalized = unidad
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
  return `${normalized}-s1-2026.pdf`
}

export function unitReportUrl(unidad: string) {
  return `${import.meta.env.BASE_URL}reportes/unidades/${unitReportFile(unidad)}`
}

const s2ReportsByUnit: Record<string, UnitReportDefinition> = {
  Construcción: {
    id: 'construccion-s2-2026',
    label: 'Informe S2 2026',
    period: 'S2-2026',
    file: 'construccion-s2-2026.pdf',
    description: 'Formato oficial comparativo S1, S2 y Global 2026.',
    current: true,
  },
}

export function unitReportsForUnit(unidad: string, period: ClimatePeriod = 'S1-2026'): UnitReportDefinition[] {
  const historical: UnitReportDefinition = {
    id: `${unitReportFile(unidad).replace('.pdf', '')}`,
    label: 'Informe S1 2026',
    period: 'S1-2026',
    file: unitReportFile(unidad),
    description: 'Informe histórico del primer semestre.',
  }

  return period === 'S2-2026' ? (s2ReportsByUnit[unidad] ? [s2ReportsByUnit[unidad]] : []) : [historical]
}
