export type Tone = 'green' | 'yellow' | 'red' | 'neutral'

const nf = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

export function formatPercent(value?: number | string) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—'
  return `${nf.format(value)}%`
}

export function formatPlain(value?: number | string) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—'
  return nf.format(value)
}

export function formatParticipation(respondidas: number | string, enviadas: number) {
  if (typeof respondidas !== 'number' || !Number.isFinite(respondidas) || enviadas === 0) return '—'
  return formatPercent((respondidas / enviadas) * 100)
}

export function toneOf(value?: number | string): Tone {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'neutral'
  if (value >= 80) return 'green'
  if (value >= 60) return 'yellow'
  return 'red'
}

export const toneLabel: Record<Tone, string> = {
  green: 'Favorable', yellow: 'Atención', red: 'Crítico', neutral: 'Informativo',
}

export const toneMeta: Record<Tone, { text: string; background: string; dot: string; fill: string }> = {
  green: { text: '#15803D', background: '#EFFAF3', dot: '#16A34A', fill: '#0B7180' },
  yellow: { text: '#A16207', background: '#FFF8E5', dot: '#CA8A04', fill: '#5D9BA5' },
  red: { text: '#B91C1C', background: '#FDEEEE', dot: '#DC2626', fill: '#C0524D' },
  neutral: { text: '#526480', background: '#F1F6FB', dot: '#94A7BE', fill: '#A7BACE' },
}

export function toneClasses(tone: Tone) {
  const classes = {
    green: 'bg-tone-green-bg text-tone-green ring-tone-green-dot/20',
    yellow: 'bg-tone-yellow-bg text-tone-yellow ring-tone-yellow-dot/20',
    red: 'bg-tone-red-bg text-tone-red ring-tone-red-dot/20',
    neutral: 'bg-tone-neutral-bg text-tone-neutral ring-tone-neutral-dot/20',
  }
  return classes[tone]
}

export function resultTone(value: number | string) {
  return toneOf(value)
}
