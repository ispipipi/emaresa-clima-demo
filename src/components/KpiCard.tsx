import { useState } from 'react'
import { formatPercent, resultTone, toneClasses, toneLabel } from '../lib/format'

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
}

export function KpiCard({
  label,
  value,
  detail,
  asPercent = true,
  neutral = false,
  explanation = 'Este indicador está disponible en el resumen del periodo seleccionado.',
  rows = [],
}: KpiCardProps) {
  const [open, setOpen] = useState(false)
  const tone = neutral ? 'neutral' : resultTone(value)
  const displayValue = asPercent ? formatPercent(value) : value

  return (
    <>
      <button
        type="button"
        className="group flex min-h-[156px] w-full flex-col justify-between rounded-xl border border-emaresa-line bg-white p-5 text-left shadow-[0_8px_26px_rgba(31,54,86,0.04)] transition hover:-translate-y-0.5 hover:border-emaresa-blue hover:shadow-[0_14px_34px_rgba(31,54,86,0.1)]"
        onClick={() => setOpen(true)}
        aria-label={`Ver detalle de ${label}`}
      >
        <span className="flex items-start justify-between gap-4">
          <span className="text-sm font-semibold text-emaresa-muted">{label}</span>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${toneClasses(tone)}`}>
            {neutral ? 'Conteo' : toneLabel(tone)}
          </span>
        </span>
        <span>
          <span className="block font-display text-4xl font-extrabold tracking-tight text-emaresa-text">{displayValue}</span>
          <span className="mt-2 flex items-center justify-between gap-3 text-xs font-medium text-emaresa-muted">
            <span>{detail}</span>
            <span className="shrink-0 font-bold text-emaresa-blue opacity-0 transition group-hover:opacity-100">Ver detalle -&gt;</span>
          </span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-emaresa-navy/35 p-4 sm:items-center" role="presentation" onMouseDown={() => setOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${label}-detail-title`}
            className="w-full max-w-lg rounded-2xl border border-emaresa-line bg-white p-6 shadow-2xl sm:p-7"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-5 border-b border-emaresa-line pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Detalle del indicador</p>
                <h2 id={`${label}-detail-title`} className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">{label}</h2>
              </div>
              <button type="button" className="rounded-lg border border-emaresa-line px-2.5 py-1 text-lg leading-none text-emaresa-muted hover:border-emaresa-blue hover:text-emaresa-blue" onClick={() => setOpen(false)} aria-label="Cerrar detalle">x</button>
            </div>
            <div className="mt-6 flex items-end justify-between gap-4">
              <p className="font-display text-5xl font-extrabold text-emaresa-text">{displayValue}</p>
              {!neutral && <span className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${toneClasses(tone)}`}>{toneLabel(tone)}</span>}
            </div>
            <p className="mt-4 text-sm leading-6 text-emaresa-muted">{explanation}</p>
            {rows.length > 0 && (
              <dl className="mt-6 divide-y divide-emaresa-line border-y border-emaresa-line">
                {rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <dt className="text-emaresa-muted">{row.label}</dt>
                    <dd className="font-bold text-emaresa-text">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <button type="button" className="mt-6 w-full rounded-lg bg-emaresa-navy px-4 py-3 text-sm font-bold text-white hover:bg-emaresa-blue" onClick={() => setOpen(false)}>Cerrar detalle</button>
          </section>
        </div>
      )}
    </>
  )
}
