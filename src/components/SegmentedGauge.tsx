import { formatPercent, toneMeta, toneOf } from '../lib/format'

interface SegmentedGaugeProps {
  value: number | string
  label: string
  full?: boolean
  size?: 'default' | 'small'
}

export function SegmentedGauge({ value, label, full = false, size = 'default' }: SegmentedGaugeProps) {
  const numeric = typeof value === 'number' && Number.isFinite(value) ? value : 0
  const progress = full ? 100 : Math.max(0, Math.min(100, numeric))
  const tone = full ? 'neutral' : toneOf(value)
  const color = full ? '#1F3656' : toneMeta[tone].fill
  const scale = size === 'small' ? 'h-[132px] w-[132px]' : 'h-[172px] w-[172px]'
  const lines = Array.from({ length: 34 }, (_, index) => {
    const angle = (-90 + index * (360 / 34) + 1.2) * Math.PI / 180
    const x1 = 60 + 40 * Math.cos(angle)
    const y1 = 60 + 40 * Math.sin(angle)
    const x2 = 60 + 52 * Math.cos(angle)
    const y2 = 60 + 52 * Math.sin(angle)
    const on = (index + 1) / 34 <= progress / 100 + 0.0001
    return { x1, y1, x2, y2, on, opacity: on ? 0.62 + (index / 33) * 0.38 : 1 }
  })
  const markers = [60, 80].map((marker) => {
    const angle = (-90 + marker * 3.6) * Math.PI / 180
    return { cx: 60 + 33 * Math.cos(angle), cy: 60 + 33 * Math.sin(angle) }
  })

  return (
    <div className={`relative ${scale} shrink-0`} aria-label={`${label}: ${full ? formatPlainGaugeValue(value) : formatPercent(value)}`}>
      <svg viewBox="0 0 120 120" className="h-full w-full" role="img">
        {lines.map((line, index) => (
          <line key={index} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={line.on ? color : '#E3EDF7'} strokeWidth="4.6" strokeLinecap="round" opacity={line.opacity} />
        ))}
        {markers.map((marker) => <circle key={marker.cx} cx={marker.cx} cy={marker.cy} r="1.5" fill="#C2D6E9" />)}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="font-display text-[clamp(27px,2.7vw,34px)] font-bold leading-none tracking-[-0.034em] tabular-nums text-navy-ink">{full ? formatPlainGaugeValue(value) : formatPercent(value)}</span>
        <span className="max-w-[126px] truncate text-center text-[11.5px] text-ink-faint">{label}</span>
      </div>
    </div>
  )
}

function formatPlainGaugeValue(value: number | string) {
  return typeof value === 'number' && Number.isFinite(value) ? new Intl.NumberFormat('es-CL').format(value) : '—'
}
