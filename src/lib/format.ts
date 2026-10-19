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

/** Diferencia con signo: +8,3 / −1,2 (usa el signo menos tipográfico). */
export function formatSigned(value: number) {
  if (!Number.isFinite(value)) return '—'
  return `${value >= 0 ? '+' : '−'}${nf.format(Math.abs(value))}`
}

/** Umbrales del reporte: Favorable >= 80, Atención 60–79, Crítico < 60. */
export function toneOf(value?: number | string): Tone {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'neutral'
  if (value >= 80) return 'green'
  if (value >= 60) return 'yellow'
  return 'red'
}

export const toneLabel: Record<Tone, string> = {
  green: 'Favorable',
  yellow: 'Atención',
  red: 'Crítico',
  neutral: 'Informativo',
}

/** Misma forma que antes (la usan Mentat y sus gráficos); valores ahora coherentes con el nuevo sistema. */
export const toneMeta: Record<Tone, { text: string; background: string; dot: string; fill: string }> = {
  green: { text: '#00572E', background: '#D9FAE3', dot: '#009956', fill: '#009956' },
  yellow: { text: '#7F4413', background: '#FFEECD', dot: '#DD7000', fill: '#DD7000' },
  red: { text: '#9B1E22', background: '#FFEAE9', dot: '#DE3B3D', fill: '#DE3B3D' },
  neutral: { text: '#4D4757', background: '#F6F3ED', dot: '#8D8A97', fill: '#8D8A97' },
}

/** Fondo suave de bloque para mapas y mapas de calor; en Atención es más intenso mientras más lejos de 80. */
export function tileBackground(value: number): string {
  if (value >= 80) return 'var(--fav-tile)'
  if (value >= 60) {
    const k = Math.max(0, Math.min(1, (value - 60) / 20))
    return `color-mix(in srgb, var(--att-weak) ${Math.round(k * 100)}%, var(--att-strong))`
  }
  return 'var(--crit-tile)'
}

export function toneClasses(tone: Tone) {
  const classes = {
    green: 'bg-fav-soft text-fav-ink',
    yellow: 'bg-att-soft text-att-ink',
    red: 'bg-crit-soft text-crit-ink',
    neutral: 'bg-sunken text-ink-soft',
  }
  return classes[tone]
}

export function resultTone(value: number | string) {
  return toneOf(value)
}
