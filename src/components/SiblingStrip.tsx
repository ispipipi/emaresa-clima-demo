import { Link } from 'react-router-dom'
import { Icon, toneIcon } from './IconSprite'
import { clima, divisionPath, findUnit, unitPath } from '../lib/clima'
import { formatPercent, toneMeta, toneOf } from '../lib/format'

interface SiblingStripProps {
  activeUnit?: string
  activeDivision?: string
}

/** Chips navegables (solo móvil): hermanas del nivel actual, con scroll interno. */
export function SiblingStrip({ activeUnit, activeDivision }: SiblingStripProps) {
  const unit = findUnit(activeUnit)
  if (!unit) return null
  const isDivision = Boolean(activeDivision)
  const items = isDivision
    ? unit.divisiones.map((division) => ({ label: division.nombre, value: division.resultado, href: divisionPath(unit.unidad, division.nombre), active: division.nombre === activeDivision }))
    : clima.global.ranking_unidades.map((ranking) => ({ label: ranking.unidad, value: ranking.resultado, href: unitPath(ranking.unidad), active: ranking.unidad === unit.unidad }))
  return (
    <nav aria-label={isDivision ? 'Divisiones de la unidad' : 'Unidades de negocio'} className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
      <span className="shrink-0 pr-1 text-xs font-semibold text-ink-soft">{isDivision ? 'Divisiones' : 'Unidades'}</span>
      {items.map((item) => {
        const tone = toneOf(item.value)
        return (
          <Link key={item.label} to={item.href} aria-current={item.active ? 'page' : undefined} className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-[13px] font-semibold transition ${item.active ? 'bg-ink text-surface' : 'bg-surface text-ink shadow-card hover:bg-sunken'}`}>
            <span style={{ color: item.active ? undefined : toneMeta[tone].fill }}><Icon name={toneIcon[tone]} className="h-3.5 w-3.5" /></span>
            <span className="max-w-[180px] truncate">{item.label}</span>
            <span className="tabular-nums">{formatPercent(item.value as number)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
