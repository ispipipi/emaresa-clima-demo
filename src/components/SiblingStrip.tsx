import { Link } from 'react-router-dom'
import { clima, divisionPath, findUnit, unitPath } from '../lib/clima'
import { formatPercent, toneMeta, toneOf } from '../lib/format'

interface SiblingStripProps {
  activeUnit?: string
  activeDivision?: string
}

export function SiblingStrip({ activeUnit, activeDivision }: SiblingStripProps) {
  const isDivision = Boolean(activeUnit && activeDivision && activeDivision !== 'corporativo')
  const unit = findUnit(activeUnit)
  const items = isDivision
    ? (unit?.divisiones ?? []).map((division) => ({ label: division.nombre, value: division.resultado, href: divisionPath(unit?.unidad ?? '', division.nombre), active: division.nombre === activeDivision }))
    : clima.global.ranking_unidades.map((ranking) => ({ label: ranking.unidad, value: ranking.resultado, href: unitPath(ranking.unidad), active: ranking.unidad === activeUnit }))

  if (!activeUnit || items.length === 0 || activeDivision === 'corporativo' || activeDivision === 'organizacion') return null

  return (
    <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="shrink-0 pr-1 text-[9.5px] font-bold uppercase tracking-[0.18em] text-ink-faint">{isDivision ? 'Divisiones' : 'Unidades'}</span>
      {items.map((item) => {
        const tone = toneOf(item.value)
        const meta = toneMeta[tone]
        return (
          <Link key={item.label} to={item.href} className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition hover:border-teal ${item.active ? 'border-navy bg-navy text-white' : 'border-line bg-surface text-ink-soft'}`}>
            <span className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: item.active ? '#8FC9D1' : meta.dot }} />
            <span className="max-w-[190px] truncate">{item.label}</span>
            <span className={`font-display text-[11.5px] font-bold tabular-nums ${item.active ? 'text-teal-light' : 'text-ink'}`}>{formatPercent(item.value)}</span>
          </Link>
        )
      })}
    </div>
  )
}
