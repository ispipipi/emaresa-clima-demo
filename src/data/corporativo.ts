export interface CorporateTeamResult {
  equipo: string
  resultado: number
}

export interface CorporateMonth {
  mes: string
  equipos: CorporateTeamResult[]
}

export const corporateMonths: CorporateMonth[] = [
  {
    mes: 'Febrero',
    equipos: [
      { equipo: 'Emakip', resultado: 90 },
      { equipo: 'Marketing', resultado: 68.57 },
      { equipo: 'Inamar Izaje', resultado: 69.79 },
      { equipo: 'Gestión de Personas', resultado: 74 },
    ],
  },
  {
    mes: 'Marzo',
    equipos: [
      { equipo: 'Ematerra', resultado: 90.5 },
      { equipo: 'Ferretek', resultado: 80 },
      { equipo: 'Finanzas', resultado: 80 },
      { equipo: 'TI', resultado: 80 },
    ],
  },
  {
    mes: 'Abril',
    equipos: [
      { equipo: 'Emafex', resultado: 90.5 },
      { equipo: 'Inamar Vapor', resultado: 90.5 },
      { equipo: 'Centro de Distribución', resultado: 90.5 },
      { equipo: 'Emafab', resultado: 90.5 },
    ],
  },
  {
    mes: 'Mayo',
    equipos: [
      { equipo: 'Rental', resultado: 70.8 },
      { equipo: 'Contabilidad', resultado: 94 },
      { equipo: 'Control de Gestión', resultado: 56.67 },
    ],
  },
]

export const corporateQuestions = [
  {
    pregunta: 'Condiciones de trabajo seguras y adecuadas',
    resultado: 85.67,
  },
  {
    pregunta: 'Propósito de la empresa claro y bien comunicado',
    resultado: 81.06,
  },
  {
    pregunta: 'Información sobre hechos relevantes, internos y externos',
    resultado: 67.58,
  },
  {
    pregunta: 'Los valores se viven en la forma de trabajar y decidir',
    resultado: 79.01,
  },
  {
    pregunta: 'Respeto y dignidad independiente del rol o área',
    resultado: 83.45,
  },
]
