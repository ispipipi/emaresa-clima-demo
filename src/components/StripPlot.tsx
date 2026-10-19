import { Link } from 'react-router-dom'
import { Icon } from './IconSprite'
import { unitPath } from '../lib/clima'
import { formatPercent, toneMeta } from '../lib/format'
import { useElementWidth } from '../lib/hooks'
import { GROUP_RESULT, unitRows } from '../lib/insights'

const zoneLabel = 'absolute top-3 flex items-center gap-1.5 text-xs font-bold'

/** Cada punto es una unidad sobre los umbrales (escala 50–100); la unidad actual se destaca y el Grupo lleva su marca. */
export function StripPlot({ highlight }: { highlight?: string }) {
  const { ref, width } = useElementWidth<HTMLDivElement>(800)
  const ends: number[] = []
  const dots = [...unitRows].sort((a, b) => a.result - b.result).map((row) => {
    const x = ((row.result - 50) / 50) * width
    let lane = 0
    while (ends[lane] !== undefined && x - ends[lane] < 18) lane += 1
    ends[lane] = x
    return { row, left: ((row.result - 50) / 50) * 100, top: 40 + lane * 22 }
  })
  const current = highlight ? unitRows.find((row) => row.name === highlight) : undefined
  const pos = (value: number) => `${((value - 50) / 50) * 100}%`

  return (
    <div ref={ref} className={`relative h-[186px] ${current ? 'mt-14' : 'mt-2'}`}>
      <div className="absolute inset-x-0 top-0 flex h-[120px] overflow-hidden rounded-ctl" aria-hidden="true">
        <span className="h-full bg-crit-soft" style={{ width: '20%' }} />
        <span className="h-full bg-att-soft" style={{ width: '40%' }} />
        <span className="h-full bg-fav-soft" style={{ width: '40%' }} />
      </div>
      <span className="absolute top-0 h-[120px] w-0.5 bg-surface" style={{ left: '20%' }} aria-hidden="true" />
      <span className="absolute top-0 h-[120px] w-0.5 bg-surface" style={{ left: '60%' }} aria-hidden="true" />
      <span className={`${zoneLabel} text-crit-ink`} style={{ left: 12 }}><Icon name="crit" className="h-3.5 w-3.5" />Crítico &lt; 60</span>
      <span className={`${zoneLabel} text-att-ink`} style={{ left: 'calc(20% + 12px)' }}><Icon name="warn" className="h-3.5 w-3.5" />Atención 60–79</span>
      <span className={`${zoneLabel} text-fav-ink`} style={{ left: 'calc(60% + 12px)' }}><Icon name="ok" className="h-3.5 w-3.5" />Favorable ≥ 80</span>

      {dots.map(({ row, left, top }) => {
        const isCurrent = row.name === highlight
        const size = isCurrent ? 22 : 16
        return (
          <Link key={row.name} to={unitPath(row.name)} title={`${row.name} · ${formatPercent(row.result)}`} aria-label={`${row.name}, ${formatPercent(row.result)}`} className="absolute rounded-full transition hover:scale-125" style={{ left: `${left}%`, top: top - (isCurrent ? 3 : 0), width: size, height: size, marginLeft: -size / 2, background: toneMeta[row.tone].fill, zIndex: isCurrent ? 3 : 1, boxShadow: isCurrent ? '0 0 0 3px var(--surface), 0 0 0 6px var(--brand)' : '0 0 0 2.5px var(--surface), 0 2px 6px rgba(32,26,44,.25)' }} />
        )
      })}

      {current ? (
        <>
          <span className="absolute z-[2] w-0.5 bg-brand" style={{ left: pos(current.result), top: -14, height: 48, marginLeft: -1 }} aria-hidden="true" />
          <span className="absolute z-[2] -translate-x-1/2 whitespace-nowrap rounded-[10px] bg-brand px-3 py-1.5 text-[13px] font-bold text-white" style={{ left: pos(current.result), top: -46 }}>{current.name} {formatPercent(current.result)}</span>
        </>
      ) : null}

      <span className="absolute w-0.5 bg-ink" style={{ left: pos(GROUP_RESULT), top: 30, height: 90, marginLeft: -1 }} aria-hidden="true" />
      <span className="absolute -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-bold text-surface" style={{ left: pos(GROUP_RESULT), top: 124 }}>Grupo {formatPercent(GROUP_RESULT)}</span>
      {[50, 60, 70, 80, 90, 100].map((tick) => (
        <span key={tick} className="absolute top-[162px] -translate-x-1/2 text-[11.5px] font-semibold text-ink-soft" style={{ left: pos(tick) }}>{tick}</span>
      ))}
    </div>
  )
}
