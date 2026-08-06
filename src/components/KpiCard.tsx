import { formatPercent, resultTone, toneClasses } from '../lib/format'

interface KpiCardProps {
  label: string
  value: number | string
  detail: string
  asPercent?: boolean
  neutral?: boolean
}

export function KpiCard({
  label,
  value,
  detail,
  asPercent = true,
  neutral = false,
}: KpiCardProps) {
  const tone = neutral ? 'neutral' : resultTone(value)
  const displayValue = asPercent ? formatPercent(value) : value

  return (
    <article className="rounded-lg bg-emaresa-card p-5 shadow-sm ring-1 ring-slate-200/80">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ring-1 ${toneClasses(tone)}`}>
          {neutral ? 'Demo' : '80/60'}
        </span>
      </div>
      <p className="mt-4 font-display text-3xl font-extrabold text-emaresa-text">
        {displayValue}
      </p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </article>
  )
}
