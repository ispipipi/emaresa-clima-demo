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

export type ComparisonMetric = 'clima' | 'participacion' | 'gestion' | 'personas'
export type RankingDirection = 'desc' | 'asc'

export interface VisualRequest {
  comparison: boolean
  chart: boolean
  table: boolean
  ranking: boolean
}

export interface VisualRow {
  label: string
  value: number
  displayValue: string
  columns: string[]
}
