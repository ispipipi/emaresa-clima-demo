import { Link } from 'react-router-dom'
import { clima, divisionPath, findUnit, unitPath } from '../lib/clima'
import { formatPercent, toneMeta, toneOf } from '../lib/format'
import { Icon, type IconName } from './IconSprite'

interface HierarchyNavProps {
  activeUnit?: string
  activeDivision?: string
  onNavigate?: () => void
}

const primaryLink = 'now-nav-link flex items-center gap-[11px] rounded-xl px-3 py-2.5 text-[13px] font-semibold transition hover:bg-white/10'

export function HierarchyNav({ activeUnit, activeDivision, onNavigate }: HierarchyNavProps) {
  const primary = [
    { label: 'Resumen ejecutivo', href: '/', icon: 'grid' as IconName, value: formatPercent(clima.global.resultado_global), active: !activeUnit && !activeDivision },
    { label: 'Gestión Corporativa', href: '/gestion-corporativa', icon: 'bars' as IconName, value: formatPercent(clima.global.resultado_gestion_corporativa), active: activeDivision === 'corporativo' },
    { label: 'Organización BUK', href: '/organizacion', icon: 'org' as IconName, value: '', active: activeDivision === 'organizacion' },
    { label: 'Manual de usuario', href: '/manual', icon: 'book' as IconName, value: '', active: activeDivision === 'manual' },
  ]

  return (
    <nav aria-label="Navegación principal">
      <p className="now-nav-section mx-3 mb-2 mt-1">Análisis & clima</p>
      <div className="flex flex-col gap-[3px]">
        {primary.map((item) => (
          <Link key={item.href} to={item.href} onClick={onNavigate} className={`${primaryLink} ${item.active ? 'bg-white/[0.12] text-white' : 'text-white/[0.66]'}`}>
            <Icon name={item.icon} className={`h-[17px] w-[17px] shrink-0 ${item.active ? 'text-teal-light' : 'text-white/40'}`} />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.value && <span className={`shrink-0 text-[11px] font-semibold tabular-nums ${item.active ? 'text-teal-light' : 'text-white/50'}`}>{item.value}</span>}
          </Link>
        ))}
      </div>

      <p className="now-nav-section mx-3 mb-2 mt-6">Unidades de negocio</p>
      <div className="flex flex-col gap-px">
        {clima.global.ranking_unidades.map((ranking) => {
          const unit = findUnit(ranking.unidad)
          const isActive = activeUnit === ranking.unidad
          const meta = toneMeta[toneOf(ranking.resultado)]
          return (
            <div key={ranking.unidad}>
              <Link to={unitPath(ranking.unidad)} onClick={onNavigate} className={`flex items-center gap-2.5 rounded-[11px] px-3 py-2 text-[12.5px] font-medium transition hover:bg-white/10 ${isActive ? 'bg-white text-navy' : 'text-white/[0.66]'}`}>
                <span className="h-[5px] w-[5px] shrink-0 rounded-full" style={{ backgroundColor: isActive ? '#0B7180' : meta.dot }} />
                <span className="min-w-0 flex-1 truncate">{ranking.unidad}</span>
                <span className={`shrink-0 text-[11px] font-semibold tabular-nums ${isActive ? 'text-teal' : 'text-white/50'}`}>{formatPercent(ranking.resultado)}</span>
              </Link>
              {isActive && unit && unit.divisiones.length > 0 && (
                <div className="mb-2 ml-[22px] mt-[3px] flex flex-col gap-px border-l border-white/[0.16] pl-[11px]">
                  {unit.divisiones.map((division) => (
                    <Link key={division.nombre} to={divisionPath(unit.unidad, division.nombre)} onClick={onNavigate} className={`truncate rounded-lg px-2 py-1.5 text-[11.5px] font-medium ${activeDivision === division.nombre ? 'text-teal-light' : 'text-white/50 hover:text-white'}`}>
                      {division.nombre}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
