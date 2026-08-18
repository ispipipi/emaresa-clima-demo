import { useEffect, useMemo, useState } from 'react'
import { formatPercent, formatPlain, toneLabel, toneMeta, toneOf } from '../lib/format'
import { Icon, type IconName } from './IconSprite'

interface DetailRow {
  label: string
  value: string
}

interface KpiCardProps {
  label: string
  value: number | string
  detail: string
  asPercent?: boolean
  neutral?: boolean
  explanation?: string
  rows?: DetailRow[]
  sparkline?: number[]
  icon?: IconName
}

export function KpiCard({ label, value, detail, asPercent = true, neutral = false, explanation = 'Este indicador está disponible en el resumen del periodo seleccionado.', rows = [], sparkline, icon = 'ring' }: KpiCardProps) {
  const [open, setOpen] = useState(false)
  const tone = neutral ? 'neutral' : toneOf(value)
  const meta = toneMeta[tone]
  const displayValue = asPercent ? formatPercent(value) : formatPlain(value)
  const bars = useMemo(() => buildSparkline(sparkline ?? (typeof value === 'number' ? [value - 5, value - 2, value, value + 1, value - 1, value] : [])), [sparkline, value])
  const titleId = `kpi-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button type="button" aria-haspopup="dialog" aria-label={`Ver detalle de ${label}`} className="group flex min-h-[142px] w-full flex-col justify-between gap-[18px] rounded-panel border-0 bg-surface p-5 text-left shadow-card transition duration-200 hover:-translate-y-[3px] hover:shadow-card-hover" onClick={() => setOpen(true)}>
        <span className="flex items-start justify-between gap-3.5">
          <span className="min-w-0 text-[13px] leading-[1.4] font-medium text-ink-soft">{label}</span>
          <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#E1EBF5] text-teal transition group-hover:border-teal"><Icon name="arrow" className="h-[13px] w-[13px]" /></span>
        </span>
        <span className="flex items-end justify-between gap-3.5">
          <span className="min-w-0">
            <span className="block font-display text-[31px] font-bold leading-none tracking-[-0.032em] tabular-nums text-navy-ink">{displayValue}</span>
            <span className="mt-[9px] block text-[11.5px] leading-[1.45] text-ink-faint">{detail}</span>
          </span>
          <span aria-hidden="true" className="flex h-[30px] shrink-0 items-end gap-0.5">
            {bars.map((bar, index) => <span key={index} className="w-[2.5px] rounded-[1.5px]" style={{ height: `${bar.height}px`, backgroundColor: bar.active ? '#0B7180' : '#D2E1EF' }} />)}
          </span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/40 p-[18px] backdrop-blur-[3px]" role="presentation" onMouseDown={() => setOpen(false)}>
          <section role="dialog" aria-modal="true" aria-labelledby={`${titleId}-title`} className="max-h-[86vh] w-full max-w-[520px] overflow-y-auto rounded-[22px] bg-surface px-7 pb-6 pt-[26px] shadow-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[13px] bg-surface-accent text-teal"><Icon name={icon} className="h-[19px] w-[19px]" /></span>
                <div className="min-w-0">
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.19em] text-teal">Detalle del indicador</p>
                  <h2 id={`${titleId}-title`} className="mt-1 font-display text-[21px] font-bold leading-tight text-navy-ink">{label}</h2>
                </div>
              </div>
              <button type="button" aria-label="Cerrar detalle" className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl bg-surface-sunken text-ink-soft hover:text-teal" onClick={() => setOpen(false)}><Icon name="close" className="h-4 w-4" /></button>
            </div>
            <div className="mt-[18px] flex items-center justify-between gap-4 rounded-2xl bg-surface-sunken px-5 py-[18px]">
              <p className="font-display text-[42px] font-bold leading-none tracking-[-0.045em] tabular-nums text-navy-ink">{displayValue}</p>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10.5px] font-bold" style={{ color: meta.text, backgroundColor: meta.background }}><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.dot }} />{neutral ? 'Conteo' : toneLabel[tone]}</span>
            </div>
            <p className="mt-4 text-[13px] leading-[1.7] text-ink-soft">{explanation}</p>
            {rows.length > 0 && <dl className="mt-[18px] flex flex-col gap-0.5">{rows.map((row) => <div key={row.label} className="flex items-center justify-between gap-4 rounded-xl bg-surface-sunken px-3 py-[11px] text-[12.5px]"><dt className="text-ink-soft">{row.label}</dt><dd className="font-bold text-ink">{row.value}</dd></div>)}</dl>}
            <button type="button" className="mt-[18px] w-full rounded-[14px] bg-navy px-4 py-[13px] text-[13px] font-bold text-white transition hover:bg-teal" onClick={() => setOpen(false)}>Cerrar detalle</button>
          </section>
        </div>
      )}
    </>
  )
}

function buildSparkline(values: number[]) {
  return values.slice(-8).map((value) => ({
    height: 8 + Math.max(0, Math.min(1, (value - 48) / 47)) * 22,
    active: value >= 80,
  }))
}
