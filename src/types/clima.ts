export interface Pregunta {
  pregunta: string
  categoria: string
  resultado: number
}

export interface Categoria {
  categoria: string
  resultado: number
}

export interface Division {
  nombre: string
  enviados: number
  respondidos: number | string
  resultado: number | string
}

export interface UnidadNegocio {
  unidad: string
  enviadas: number
  respondidas: number
  participacion: number
  resultado_global: number
  resultado_gestion_corporativa: number
  divisiones: Division[]
  categorias: Categoria[]
  top10: Pregunta[]
  bottom10: Pregunta[]
}

export interface RankingUnidad {
  unidad: string
  resultado: number
  participacion: number
  enviadas: number
  respondidas: number
}

export interface GlobalRollup {
  enviadas: number
  respondidas: number
  participacion: number
  resultado_global: number
  resultado_gestion_corporativa: number
  categorias: Categoria[]
  top5: Pregunta[]
  bottom5: Pregunta[]
  ranking_unidades: RankingUnidad[]
}

export interface ClimaDataset {
  global: GlobalRollup
  unidades: UnidadNegocio[]
}
