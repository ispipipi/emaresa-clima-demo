import { useState, type ReactNode } from 'react'
import { Drawer } from './Drawer'
import { Icon, type IconName } from './IconSprite'
import { CountUp, Ring, StatusChip } from './ui'
import { formatPercent, formatPlain, toneOf, type Tone } from '../lib/format'

export interface DetailRow {
  label: string
  value: string
}

function DetailBody({ displayValue, tone, chipLabel, explanation, rows, extra }: { displayValue: string; tone: Tone; chipLabel?: string; explanation: string; rows: DetailRow[]; extra?: ReactNode }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 rounded-card bg-sunken px-5 py-[18px]">
        <p className="text-[44px] font-extrabold leading-none tracking-[-0.045em] tabular-nums">{displayValue}</p>
        <StatusChip tone={tone} label={chipLabel} size="lg" />
      </div>
      <p className="text-sm leading-[22px] text-ink-soft">{explanation}</p>
      {rows.length > 0 ? (
        <dl className="flex flex-col gap-0.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 rounded-ctl bg-sunken px-3.5 py-[11px] text-[13.5px]">
              <dt className="text-ink-soft">{row.label}</dt>
              <dd className="text-right font-bold">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {extra}
    </>
  )
}

interface KpiCardProps {
  label: string
  value: number | string
  detail: ReactNode
  asPercent?: boolean
  neutral?: boolean
  tone?: Tone
  chipLabel?: string
  explanation?: string
  rows?: DetailRow[]
  icon?: IconName
  /** Línea de variación (▲▼) bajo el detalle. */
  delta?: ReactNode
  /** Visual breve (barra, puntos) al pie de la tarjeta. */
  visual?: ReactNode
  /** Contenido adicional del panel de detalle. */
  extra?: ReactNode
}

/** Cada KPI es un botón con flecha visible que abre su panel de detalle. */
export function KpiCard({ label, value, detail, asPercent = true, neutral = false, tone: toneProp, chipLabel, explanation = 'Este indicador está disponible en el resumen del período seleccionado.', rows = [], icon = 'ring', delta, visual, extra }: KpiCardProps) {
  const [open, setOpen] = useState(false)
  const numeric = typeof value === 'number' && Number.isFinite(value)
  const tone: Tone = toneProp ?? (neutral || !numeric ? 'neutral' : toneOf(value))
  const format = (n: number) => (asPercent ? formatPercent(n) : formatPlain(n))
  const displayValue = numeric ? format(value as number) : '—'
  return (
    <>
      <button type="button" aria-haspopup="dialog" aria-label={`Ver detalle de ${label}`} onClick={() => setOpen(true)} className="group flex w-full animate-rise flex-col gap-3 rounded-card bg-surface p-5 text-left shadow-card transition duration-200 hover:-translate-y-[3px] hover:shadow-lift">
        <span className="flex items-center justify-between gap-3">
          <span className="text-[15px] font-bold">{label}</span>
          <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-deep transition group-hover:bg-brand group-hover:text-white"><Icon name="arrow" className="h-4 w-4" /></span>
        </span>
        <span className="flex flex-wrap items-center gap-2.5">
          <span className={`text-[38px] font-extrabold leading-none tracking-[-0.04em] tabular-nums ${numeric ? '' : 'text-ink-faint'}`}>{numeric ? <CountUp value={value as number} format={format} /> : '—'}</span>
          <StatusChip tone={tone} label={chipLabel} />
        </span>
        <span className="text-[13.5px] font-semibold leading-snug">{detail}</span>
        {delta ? <span className="text-[13.5px]">{delta}</span> : null}
        {visual}
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title={label} icon={icon}>
        <DetailBody displayValue={displayValue} tone={tone} chipLabel={chipLabel} explanation={explanation} rows={rows} extra={extra} />
      </Drawer>
    </>
  )
}

interface ScoreCardProps {
  title: string
  value: number
  comparisons: { label: string; value: ReactNode }[]
  explanation: string
  rows?: DetailRow[]
  icon?: IconName
}

/** Resultado protagonista: anillo con zonas, comparaciones y panel de detalle. */
export function ScoreCard({ title, value, comparisons, explanation, rows = [], icon = 'ring' }: ScoreCardProps) {
  const [open, setOpen] = useState(false)
  const tone = toneOf(value)
  return (
    <>
      <button type="button" aria-haspopup="dialog" aria-label={`Ver detalle de ${title}`} onClick={() => setOpen(true)} className="group flex w-full animate-rise items-center gap-5 rounded-card bg-surface p-5 text-left shadow-lift transition duration-200 hover:-translate-y-[3px] hover:shadow-float">
        <Ring value={value}>
          <span className="text-[30px] font-extrabold leading-none tracking-[-0.04em] tabular-nums"><CountUp value={value} format={(n) => formatPercent(Math.round(n * 10) / 10).replace('%', '')} /><span className="text-[17px] tracking-normal">%</span></span>
        </Ring>
        <span className="flex min-w-0 flex-1 flex-col gap-2.5">
          <span className="flex items-center justify-between gap-2">
            <span className="text-[14.5px] font-bold">{title}</span>
            <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft text-brand-deep transition group-hover:bg-brand group-hover:text-white"><Icon name="arrow" className="h-[15px] w-[15px]" /></span>
          </span>
          {comparisons.map((item) => (
            <span key={item.label} className="flex items-center justify-between gap-3 text-[13px] text-ink-soft">
              <span>{item.label}</span>
              <span className="text-[13.5px] font-bold text-ink">{item.value}</span>
            </span>
          ))}
        </span>
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title={title} icon={icon}>
        <DetailBody displayValue={formatPercent(value)} tone={tone} explanation={explanation} rows={rows} />
      </Drawer>
    </>
  )
}
