export type Tone = 'green' | 'yellow' | 'red' | 'neutral'

export function resultTone(value: number | string): Tone {
  if (typeof value !== 'number') return 'neutral'
  if (value >= 80) return 'green'
  if (value >= 60) return 'yellow'
  return 'red'
}

export function formatPercent(value: number | string) {
  if (typeof value !== 'number') return '-'
  return `${new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)}%`
}

export function formatPlain(value: number | string) {
  if (typeof value !== 'number') return '-'
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function toneLabel(tone: Tone) {
  if (tone === 'green') return 'Favorable'
  if (tone === 'yellow') return 'Atención'
  if (tone === 'red') return 'Crítico'
  return 'Informativo'
}

export function toneClasses(tone: Tone) {
  const classes = {
    green: 'bg-emaresa-greenBg text-emaresa-green ring-emaresa-green/20',
    yellow: 'bg-emaresa-yellowBg text-emaresa-yellow ring-emaresa-yellow/20',
    red: 'bg-emaresa-redBg text-emaresa-red ring-emaresa-red/20',
    neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
  }

  return classes[tone]
}
