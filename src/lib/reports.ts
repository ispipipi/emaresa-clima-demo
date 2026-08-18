export interface ReportDefinition {
  id: string
  title: string
  scope: string
  description: string
  file: string
  cover: string
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
