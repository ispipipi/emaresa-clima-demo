import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './IconSprite'
import { Card } from './ui'
import { clima, unitPath } from '../lib/clima'
import { formatPercent, tileBackground, toneOf } from '../lib/format'
import { unitRows } from '../lib/insights'

const names = clima.global.categorias.map((categoria) => categoria.categoria)
const cols = 'grid-cols-[190px_repeat(5,minmax(96px,1fr))_88px]'

function Cell({ value, to }: { value?: number; to?: string }) {
  if (typeof value !== 'number') return <span className="flex h-9 items-center justify-center rounded-ctl bg-sunken text-sm text-ink-soft">—</span>
  const body = (
    <>
      {value < 60 ? <Icon name="crit" className="h-3 w-3" /> : null}
      {formatPercent(value).replace('%', '')}
    </>
  )
  const style = { background: tileBackground(value), color: toneOf(value) === 'red' ? 'var(--crit-ink)' : toneOf(value) === 'yellow' ? 'var(--att-ink)' : 'var(--fav-ink)' }
  const className = 'flex h-9 items-center justify-center gap-1 rounded-ctl text-[13px] font-bold tabular-nums transition hover:shadow-[inset_0_0_0_2px_var(--ink)]'
  return to ? <Link to={to} className={className} style={style}>{body}</Link> : <span className={className} style={style}>{body}</span>
}

/** Mapa de calor categorías × unidades, colapsado por defecto: se abre con un clic. */
export function HeatmapTable() {
  const [open, setOpen] = useState(false)
  const critical = unitRows.reduce((sum, row) => sum + row.unit.categorias.filter((categoria) => categoria.resultado < 60).length, 0)
  return (
    <Card className="overflow-hidden">
      <button type="button" aria-expanded={open} aria-controls="mapa-calor" onClick={() => setOpen(!open)} className="flex w-full flex-wrap items-center gap-4 p-5 text-left transition hover:bg-brand-wash sm:px-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-brand-soft text-brand-deep"><Icon name="grid" className="h-5 w-5" /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-xl font-extrabold leading-[26px] tracking-[-0.025em]">Categorías por unidad</span>
          <span className="block text-[13.5px] text-ink-soft">Promedio 0–100 · {names.length} categorías en {unitRows.length} unidades</span>
        </span>
        {critical > 0 ? <span className="inline-flex h-[30px] items-center gap-1.5 rounded-full bg-crit-soft pl-2 pr-3 text-[12.5px] font-bold text-crit-ink"><Icon name="crit" className="h-3.5 w-3.5" />{critical} {critical === 1 ? 'celda' : 'celdas'} en Crítico</span> : null}
        <span className="inline-flex h-10 items-center gap-2 rounded-ctl px-3.5 text-[13px] font-bold shadow-[inset_0_0_0_1.5px_var(--line)]">{open ? 'Ocultar tabla' : 'Ver tabla'}<Icon name="chevDown" className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} /></span>
      </button>
      {open ? (
        <div id="mapa-calor" className="border-t border-line-soft px-5 pb-6 pt-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-ink-soft">
            <span>Cada celda abre la unidad.</span>
            <span className="flex items-center gap-4 font-semibold">
              <span className="inline-flex items-center gap-1.5"><span className="h-3.5 w-[22px] rounded" style={{ background: 'var(--fav-tile)' }} />≥ 80</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3.5 w-[22px] rounded" style={{ background: 'linear-gradient(90deg,var(--att-strong),var(--att-weak))' }} />60–79</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3.5 w-[22px] rounded" style={{ background: 'var(--crit-tile)' }} />&lt; 60, con rombo</span>
            </span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <div className="min-w-[860px]">
              <div className={`grid ${cols} items-end gap-1.5 pb-2 text-[12.5px] font-bold leading-4 text-ink-soft`}>
                <span>Unidad</span>
                {names.map((name) => <span key={name} className="text-center">{name}</span>)}
                <span className="text-center">Resultado</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className={`grid ${cols} items-center gap-1.5 pb-2`}>
                  <span className="text-sm font-bold">Grupo Emaresa</span>
                  {clima.global.categorias.map((categoria) => <Cell key={categoria.categoria} value={categoria.resultado} />)}
                  <Cell value={clima.global.resultado_global} />
                </div>
                {unitRows.map((row) => (
                  <div key={row.name} className={`grid ${cols} items-center gap-1.5`}>
                    <Link to={unitPath(row.name)} className="truncate text-sm font-semibold hover:underline">{row.name}</Link>
                    {names.map((name) => <Cell key={name} value={row.unit.categorias.find((categoria) => categoria.categoria === name)?.resultado} to={unitPath(row.name)} />)}
                    <Cell value={row.result} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  )
}
