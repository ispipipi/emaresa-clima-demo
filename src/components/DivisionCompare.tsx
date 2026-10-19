import { Link } from 'react-router-dom'
import type { Division, UnidadNegocio } from '../types/clima'
import { Icon } from './IconSprite'
import { Card, EmptyState, SectionHeader, StatusChip, btnPrimary } from './ui'
import { divisionPath, unitPath } from '../lib/clima'
import { formatParticipation, formatPercent, formatPlain, toneMeta, toneOf } from '../lib/format'
import { GROUP_RESULT } from '../lib/insights'

function resultOf(division: Division): number | undefined {
  return typeof division.resultado === 'number' ? division.resultado : undefined
}

/** Compara la división con sus hermanas y con los niveles superiores (unidad y Grupo). */
export function DivisionCompare({ unit, current }: { unit: UnidadNegocio; current: Division }) {
  if (unit.divisiones.length === 1) {
    return (
      <Card className="p-6">
        <EmptyState icon="layer" title={`${current.nombre} es la única división legal de ${unit.unidad}`} action={<Link to={unitPath(unit.unidad)} className={btnPrimary}>Ver la unidad<Icon name="go" className="h-4 w-4" /></Link>}>
          Su resultado y participación coinciden con los de la unidad, por eso se omite la comparación con divisiones hermanas.
        </EmptyState>
      </Card>
    )
  }
  const rows = [...unit.divisiones].sort((a, b) => (resultOf(b) ?? -1) - (resultOf(a) ?? -1))
  const pct = (value: number) => `${Math.max(0, Math.min(100, value))}%`
  return (
    <Card className="p-6">
      <SectionHeader title="Frente a sus hermanas y a los niveles superiores" subtitle={`Cada barra es una división legal de ${unit.unidad} · las líneas marcan la unidad y el Grupo`} />
      <div className="mt-5 hidden gap-5 lg:grid lg:grid-cols-[250px_minmax(0,1fr)_270px]">
        <div className="pt-9">
          {rows.map((division) => (
            <div key={division.nombre} className="flex h-[72px] flex-col justify-center gap-1">
              <span className="text-sm font-bold leading-5">{division.nombre}</span>
              {division.nombre === current.nombre ? <span className="inline-flex h-[22px] w-fit items-center rounded-full bg-brand-soft px-2.5 text-xs font-bold text-brand-deep">Esta división</span> : <span className="text-[12.5px] text-ink-soft">{formatPlain(division.enviados)} personas invitadas</span>}
            </div>
          ))}
        </div>
        <div className="relative" style={{ height: 36 + rows.length * 72 + 24 }}>
          <div className="absolute inset-x-0 flex overflow-hidden rounded-ctl" style={{ top: 36, height: rows.length * 72 }} aria-hidden="true">
            <span className="bg-crit-soft" style={{ width: '60%' }} /><span className="bg-att-soft" style={{ width: '20%' }} /><span className="bg-fav-soft" style={{ width: '20%' }} />
          </div>
          <span className="absolute left-2 top-[42px] flex items-center gap-1.5 text-xs font-bold text-crit-ink"><Icon name="crit" className="h-3.5 w-3.5" />&lt;60</span>
          <span className="absolute top-[42px] flex items-center gap-1.5 text-xs font-bold text-att-ink" style={{ left: 'calc(60% + 8px)' }}><Icon name="warn" className="h-3.5 w-3.5" />60–79</span>
          <span className="absolute right-2 top-[42px] flex items-center gap-1.5 text-xs font-bold text-fav-ink"><Icon name="ok" className="h-3.5 w-3.5" />≥80</span>
          {rows.map((division, index) => {
            const value = resultOf(division)
            const isCurrent = division.nombre === current.nombre
            return value === undefined ? null : (
              <span key={division.nombre} className="absolute left-0 h-6 rounded-r-lg" style={{ top: 36 + index * 72 + 24, width: pct(value), background: toneMeta[toneOf(value)].fill, boxShadow: isCurrent ? '0 0 0 3px var(--surface), 0 0 0 5px var(--brand)' : undefined }} />
            )
          })}
          <span className="absolute w-0.5 bg-brand-deep" style={{ left: pct(unit.resultado_global), top: 22, height: rows.length * 72 + 14, marginLeft: -1 }} aria-hidden="true" />
          <span className="absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-lg bg-brand-deep px-2.5 py-1 text-xs font-bold text-white" style={{ left: pct(unit.resultado_global) }}>Unidad {formatPercent(unit.resultado_global)}</span>
          <span className="absolute w-0.5 bg-ink" style={{ left: pct(GROUP_RESULT), top: 36, height: rows.length * 72 + 14, marginLeft: -1 }} aria-hidden="true" />
          <span className="absolute -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-bold text-surface" style={{ left: pct(GROUP_RESULT), top: 36 + rows.length * 72 + 4 }}>Grupo {formatPercent(GROUP_RESULT)}</span>
        </div>
        <div className="pt-9">
          {rows.map((division) => {
            const value = resultOf(division)
            return (
              <div key={division.nombre} className="flex h-[72px] items-center justify-between gap-2.5">
                <div>
                  <div className="flex items-center gap-2"><b className="text-xl font-extrabold tracking-[-0.02em] tabular-nums">{formatPercent(value)}</b><StatusChip tone={toneOf(value)} label={value === undefined ? 'Sin datos' : undefined} size="sm" /></div>
                  <p className="mt-0.5 text-[12.5px] text-ink-soft">{formatPlain(division.respondidos)} de {formatPlain(division.enviados)} · {formatParticipation(division.respondidos, division.enviados)} participación</p>
                </div>
                {division.nombre === current.nombre ? <span className="shrink-0 text-[12.5px] font-semibold text-ink-soft">Estás aquí</span> : (
                  <Link to={divisionPath(unit.unidad, division.nombre)} aria-label={`Abrir ${division.nombre}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-ctl bg-brand-soft text-brand-deep transition hover:bg-brand hover:text-white"><Icon name="go" className="h-[17px] w-[17px]" /></Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <ul className="mt-5 flex flex-col gap-2 lg:hidden">
        {rows.map((division) => {
          const value = resultOf(division)
          return (
            <li key={division.nombre} className="rounded-ctl bg-sunken p-3.5">
              <div className="flex items-start justify-between gap-3"><span className="text-sm font-bold leading-5">{division.nombre}</span><StatusChip tone={toneOf(value)} label={value === undefined ? 'Sin datos' : undefined} size="sm" /></div>
              <p className="mt-1 text-xl font-extrabold tabular-nums">{formatPercent(value)}</p>
              <p className="text-[12.5px] text-ink-soft">{formatPlain(division.respondidos)} de {formatPlain(division.enviados)} respuestas</p>
              {division.nombre === current.nombre ? <p className="mt-1 text-xs font-bold text-brand-deep">Esta división</p> : <Link to={divisionPath(unit.unidad, division.nombre)} className="mt-1 inline-block text-[13px] font-bold text-brand-deep">Abrir</Link>}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
