import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, toneIcon } from './IconSprite'
import { Card, Delta, Meter, StatusChip, btnOutline, btnPrimary } from './ui'
import { unitPath } from '../lib/clima'
import { formatPercent, formatPlain, tileBackground, toneLabel, toneMeta, type Tone } from '../lib/format'
import { useElementWidth } from '../lib/hooks'
import { commonWeakness, priorityUnits, squarify, statusCounts, unitRows, type UnitRow } from '../lib/insights'
import { unitReportsForUnit } from '../lib/reports'

const tileBorder: Record<Tone, string> = {
  green: 'var(--fav-line)',
  yellow: 'var(--att-line)',
  red: 'var(--crit-tile)',
  neutral: 'var(--line)',
}

function reportHref(name: string) {
  const report = unitReportsForUnit(name)[0]
  return { href: `${import.meta.env.BASE_URL}reportes/unidades/${report.file}`, file: report.file, label: report.label }
}

function ReportButton({ name, compact = false }: { name: string; compact?: boolean }) {
  const report = reportHref(name)
  return (
    <a href={report.href} download={report.file} title={`Descargar ${report.label}`} aria-label={`Descargar ${report.label} de ${name}`} className={compact ? 'flex h-8 w-8 items-center justify-center rounded-[10px] text-ink shadow-[inset_0_0_0_1.5px_var(--line)] transition hover:bg-sunken' : `${btnOutline} px-3.5`}>
      <Icon name="doc" className="h-4 w-4" />
      {compact ? null : report.label}
    </a>
  )
}

function Tile({ row, rect, rank, selected, dim, onSelect }: { row: UnitRow; rect: { x: number; y: number; w: number; h: number }; rank: number; selected: boolean; dim: boolean; onSelect: () => void }) {
  const big = rect.w >= 190 && rect.h >= 168
  const mid = !big && rect.w >= 110 && rect.h >= 100
  const meta = toneMeta[row.tone]
  return (
    <button type="button" aria-pressed={selected} aria-label={`${row.name}, ${formatPercent(row.result)}, ${toneLabel[row.tone]}${rank ? `, prioridad ${rank}` : ''}`} onClick={onSelect} className="absolute p-[3px] text-left transition-opacity" style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h, opacity: dim ? 0.35 : 1 }}>
      {rank ? <span aria-hidden="true" className="absolute -right-1.5 -top-1.5 z-[2] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-ink text-[11.5px] font-extrabold text-surface ring-[2.5px] ring-surface">{rank}</span> : null}
      <span className={`flex h-full w-full flex-col justify-between gap-1.5 overflow-hidden rounded-[12px] border text-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-lift ${big ? 'p-4' : mid ? 'p-3' : 'px-[7px] py-2'}`} style={{ background: tileBackground(row.result), borderColor: tileBorder[row.tone], boxShadow: selected ? 'inset 0 0 0 3px var(--brand)' : undefined }}>
        {big ? (
          <>
            <span className="text-base font-bold leading-[21px]">{row.name}</span>
            <span>
              <span className="block text-4xl font-extrabold leading-9 tracking-[-0.045em] tabular-nums">{formatPercent(row.result)}</span>
              <span className="mt-2 flex flex-wrap items-center gap-2.5"><StatusChip tone={row.tone} size="sm" /><Delta value={row.delta} suffix="" className="text-[13px]" /></span>
              <span className="mt-3 block text-xs font-semibold"><span className="flex justify-between"><span>Participación</span><span className="tabular-nums">{formatPercent(row.participation)}</span></span><Meter value={row.participation} color="var(--ink)" size="sm" className="mt-1" /></span>
            </span>
          </>
        ) : mid ? (
          <>
            <span className="text-sm font-bold leading-[18px]">{row.name}</span>
            <span>
              <span className="block text-[26px] font-extrabold leading-[26px] tracking-[-0.04em] tabular-nums">{formatPercent(row.result)}</span>
              <span className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-bold"><span style={{ color: meta.text }}><Icon name={toneIcon[row.tone]} className="h-[15px] w-[15px]" /></span><Delta value={row.delta} suffix="" /></span>
            </span>
          </>
        ) : (
          <>
            <span className="text-[11px] font-bold leading-[13px]">{row.name}</span>
            <span>
              <span className="flex flex-wrap items-center gap-x-1 gap-y-0.5"><span className="text-lg font-extrabold leading-[18px] tracking-[-0.04em] tabular-nums">{formatPercent(row.result)}</span><span style={{ color: meta.text }}><Icon name={toneIcon[row.tone]} className="h-[13px] w-[13px]" /></span></span>
              {rect.h >= 88 ? <Delta value={row.delta} suffix="" className="mt-1 text-[11px]" /> : null}
            </span>
          </>
        )}
      </span>
    </button>
  )
}

function SelectedPanel({ row, priorities, onSelect }: { row: UnitRow; priorities: UnitRow[]; onSelect: (name: string) => void }) {
  const rank = priorities.findIndex((item) => item.name === row.name) + 1
  const weakness = commonWeakness()
  const others = priorities.filter((item) => item.name !== row.name)
  const report = reportHref(row.name)
  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[15px] font-bold">Unidad seleccionada</h3>
        {rank ? <span className="inline-flex h-[26px] items-center gap-1 rounded-full bg-ink px-3 text-xs font-bold text-surface"><span>Prioridad</span><span>{rank}</span></span> : null}
      </div>
      <div className="flex items-center gap-4">
        <span className="relative inline-flex h-[76px] w-[76px] shrink-0 items-center justify-center">
          <svg viewBox="0 0 76 76" className="absolute inset-0 -rotate-90" aria-hidden="true"><circle cx="38" cy="38" r="32" fill="none" stroke="var(--line-soft)" strokeWidth="8" /><circle cx="38" cy="38" r="32" fill="none" stroke={toneMeta[row.tone].fill} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(201.06 * row.result) / 100} 201.06`} /></svg>
          <span className="relative text-[17px] font-extrabold tracking-[-0.02em] tabular-nums">{formatPlain(row.result)}</span>
        </span>
        <div className="min-w-0">
          <p className="break-words text-2xl font-extrabold leading-[30px] tracking-[-0.03em]">{row.name}</p>
          <p className="mt-0.5 text-[13px] leading-[18px] text-ink-soft">{formatPlain(row.sent)} personas invitadas · {row.divisions === 1 ? '1 división legal' : `${row.divisions} divisiones legales`}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5"><StatusChip tone={row.tone} /><Delta value={row.delta} suffix=" pts vs. Grupo" className="text-[13px]" /></div>
      <div>
        <div className="mb-1.5 flex justify-between text-[12.5px] font-semibold"><span>Participación</span><span className="tabular-nums">{formatPercent(row.participation)} · {formatPlain(row.answered)} de {formatPlain(row.sent)}</span></div>
        <Meter value={row.participation} color="var(--brand-mid)" />
      </div>
      {row.lowestCategory ? (
        <div className="flex items-center justify-between gap-3 rounded-ctl bg-sunken px-3.5 py-3">
          <div className="min-w-0"><p className="text-xs text-ink-soft">Categoría más baja</p><p className="text-[13.5px] font-bold leading-[19px]">{row.lowestCategory.categoria}</p></div>
          <StatusChip tone={row.lowestCategory.resultado >= 80 ? 'green' : row.lowestCategory.resultado >= 60 ? 'yellow' : 'red'} label={formatPercent(row.lowestCategory.resultado)} size="sm" />
        </div>
      ) : null}
      <div className="flex gap-2.5">
        <Link to={unitPath(row.name)} className={`${btnPrimary} flex-1`}>Ver unidad<Icon name="go" className="h-4 w-4" /></Link>
        <a href={report.href} download={report.file} className={`${btnOutline} px-3.5`}><Icon name="doc" className="h-4 w-4" />{report.label}</a>
      </div>
      {others.length > 0 ? (
        <div className="border-t border-line-soft pt-4">
          <p className="mb-1 text-[13px] font-bold text-ink-soft">También en foco</p>
          <ul>
            {others.map((item) => (
              <li key={item.name}>
                <button type="button" onClick={() => onSelect(item.name)} className="-mx-2 flex w-[calc(100%+16px)] items-center gap-3 rounded-ctl px-2 py-2.5 text-left transition hover:bg-sunken">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11.5px] font-extrabold text-surface">{priorities.findIndex((p) => p.name === item.name) + 1}</span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-bold leading-[18px]">{item.name}</span><span className="block truncate text-xs text-ink-soft">{item.lowestCategory ? `${item.lowestCategory.categoria} · ${formatPercent(item.lowestCategory.resultado)}` : ''}</span></span>
                  <span className="text-right"><span className="block text-[15px] font-extrabold tabular-nums">{formatPercent(item.result)}</span><Delta value={item.delta} suffix="" className="text-xs text-ink-soft" /></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {weakness.question ? (
        <div className="mt-auto flex items-start gap-3 rounded-ctl bg-crit-soft px-4 py-3.5 text-crit-ink">
          <Icon name="crit" className="mt-0.5 h-[18px] w-[18px] shrink-0" />
          <div>
            <p className="text-[13.5px] font-bold leading-[19px]">{weakness.question}{weakness.groupResult !== undefined ? ` ${formatPercent(weakness.groupResult)}` : ''}</p>
            <p className="text-[13px] leading-[19px] text-ink">Es la pregunta más baja en {weakness.count} de {weakness.total} unidades.</p>
          </div>
        </div>
      ) : null}
    </Card>
  )
}

/** Mapa de unidades: tamaño = personas invitadas, color = estado. Cada bloque abre su resumen con acceso al informe PDF. */
export function UnitMap() {
  const priorities = useMemo(() => priorityUnits(3), [])
  const counts = statusCounts()
  const [filter, setFilter] = useState<'all' | Tone>('all')
  const [view, setView] = useState<'map' | 'list'>('map')
  const [selectedName, setSelectedName] = useState(priorities[0].name)
  const selected = unitRows.find((row) => row.name === selectedName) ?? unitRows[0]
  const { ref, width } = useElementWidth<HTMLDivElement>(700)
  const compact = width < 560
  const showMap = view === 'map' && !compact
  const height = Math.round(Math.max(420, Math.min(600, width * 0.82)))
  const rects = useMemo(() => squarify(unitRows.map((row) => ({ id: row.name, value: Math.pow(row.sent, 0.6) })), width, height), [width, height])
  const chips: { key: 'all' | Tone; label: string; count: number }[] = [
    { key: 'all', label: 'Todas', count: unitRows.length },
    { key: 'green', label: 'Favorable', count: counts.green },
    { key: 'yellow', label: 'Atención', count: counts.yellow },
    { key: 'red', label: 'Crítico', count: counts.red },
  ]
  const listRows = [...priorities, ...unitRows.filter((row) => !priorities.some((p) => p.name === row.name))]

  return (
    <section aria-labelledby="unidades-titulo" className="flex flex-col gap-4 pt-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="unidades-titulo" className="text-2xl font-extrabold leading-[30px] tracking-[-0.03em]">Unidades de negocio</h2>
          <p className="mt-1 text-sm leading-5 text-ink-soft">Tamaño: personas invitadas · Color: estado · Selecciona un bloque para ver su resumen.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por estado">
          {chips.map((chip) => (
            <button key={chip.key} type="button" disabled={chip.count === 0} aria-pressed={filter === chip.key} onClick={() => setFilter(chip.key)} className={`inline-flex h-[38px] items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${filter === chip.key ? 'bg-ink text-surface' : 'bg-surface text-ink shadow-card hover:bg-sunken'}`}>
              {chip.key === 'all' ? null : <span style={{ color: filter === chip.key ? undefined : toneMeta[chip.key].fill }}><Icon name={toneIcon[chip.key]} className="h-3.5 w-3.5" /></span>}
              {chip.label}<b className={filter === chip.key ? 'font-semibold' : 'font-bold text-ink-soft'}>{chip.count}</b>
            </button>
          ))}
          {compact ? null : (
            <span className="inline-flex gap-0.5 rounded-ctl bg-sunken p-[3px]" role="group" aria-label="Vista">
              {(['map', 'list'] as const).map((key) => (
                <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)} className={`rounded-[9px] px-3.5 py-1.5 text-[13px] ${view === key ? 'bg-surface font-bold shadow-card' : 'font-semibold text-ink-soft'}`}>{key === 'map' ? 'Mapa' : 'Lista'}</button>
              ))}
            </span>
          )}
        </div>
      </div>

      <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="flex min-w-0 flex-col p-5 sm:p-6">
          <div ref={ref} className="relative w-full" style={{ height: showMap ? height : undefined }}>
            {showMap ? rects.map((rect) => {
              const row = unitRows.find((item) => item.name === rect.id) as UnitRow
              return <Tile key={row.name} row={row} rect={rect} rank={priorities.findIndex((p) => p.name === row.name) + 1} selected={row.name === selected.name} dim={filter !== 'all' && row.tone !== filter} onSelect={() => setSelectedName(row.name)} />
            }) : (
              <ul className="flex flex-col gap-2">
                {listRows.map((row) => {
                  const rank = priorities.findIndex((p) => p.name === row.name) + 1
                  return (
                    <li key={row.name} className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-ctl bg-sunken p-3 ${filter !== 'all' && row.tone !== filter ? 'opacity-40' : ''}`}>
                      <span className="flex min-w-[150px] flex-1 items-center gap-2.5">{rank ? <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11.5px] font-extrabold text-surface">{rank}</span> : null}<Link to={unitPath(row.name)} className="text-sm font-bold hover:underline">{row.name}</Link></span>
                      <StatusChip tone={row.tone} size="sm" />
                      <span className="w-16 text-right text-base font-extrabold tabular-nums">{formatPercent(row.result)}</span>
                      <Delta value={row.delta} suffix="" className="w-14 text-[13px]" />
                      <span className="w-24 text-xs text-ink-soft">{formatPercent(row.participation)} particip.</span>
                      <ReportButton name={row.name} compact />
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          {showMap ? (
            <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 text-[12.5px] font-semibold text-ink-soft">
              <span className="inline-flex items-center gap-2"><span className="h-3 w-11 rounded-full" style={{ background: 'linear-gradient(90deg,var(--att-strong),var(--att-weak))' }} />Atención: más intenso, más lejos de 80</span>
              <span className="inline-flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[11px] font-extrabold text-surface">1</span>Prioridad por menor resultado</span>
            </div>
          ) : null}
        </Card>
        <SelectedPanel row={selected} priorities={priorities} onSelect={setSelectedName} />
      </div>
    </section>
  )
}
