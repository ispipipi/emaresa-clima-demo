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
  green: { text: '#07558A', background: '#EAF4FB', dot: '#73C438', fill: '#1768B2' },
  yellow: { text: '#8A6000', background: '#FFF4D6', dot: '#FFC845', fill: '#FFC845' },
  red: { text: '#A72C2C', background: '#FBECEC', dot: '#C94C4C', fill: '#C94C4C' },
  neutral: { text: '#4B5B68', background: '#F1F1EF', dot: '#9EA7AC', fill: '#9EA7AC' },
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
