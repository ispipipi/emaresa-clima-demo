import { Link } from 'react-router-dom'
import { clima, divisionPath, findUnit, unitPath } from '../lib/clima'
import { formatPercent } from '../lib/format'

interface HierarchyNavProps {
  activeUnit?: string
  activeDivision?: string
}

const primaryLink = 'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-white/10'

export function HierarchyNav({ activeUnit, activeDivision }: HierarchyNavProps) {
  return (
    <nav className="mt-4 space-y-1" aria-label="Navegación principal">
      <Link to="/" className={`${primaryLink} ${!activeUnit && !activeDivision ? 'bg-white/10 text-white' : 'text-blue-100/75'}`}>
        <span>Resumen ejecutivo</span>
        <span className="text-xs text-cyan-200">{formatPercent(clima.global.resultado_global)}</span>
      </Link>

      <Link to="/gestion-corporativa" className={`${primaryLink} ${activeDivision === 'corporativo' ? 'bg-white/10 text-white' : 'text-blue-100/75'}`}>
        <span>Gestión corporativa</span>
        <span className="text-xs text-cyan-200">{formatPercent(clima.global.resultado_gestion_corporativa)}</span>
      </Link>

      <Link to="/organizacion" className={`${primaryLink} ${activeDivision === 'organizacion' ? 'bg-white/10 text-white' : 'text-blue-100/75'}`}>
        <span>Organización BUK</span>
        <span className="text-cyan-200">-&gt;</span>
      </Link>

      <div className="pt-6">
        <p className="px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200/65">Unidades</p>
        <div className="mt-3 space-y-0.5">
          {clima.global.ranking_unidades.map((ranking) => {
            const unit = findUnit(ranking.unidad)
            const isActive = activeUnit === ranking.unidad

            return (
              <div key={ranking.unidad}>
                <Link
                  to={unitPath(ranking.unidad)}
                  className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-white text-emaresa-navy' : 'text-blue-100/70 hover:bg-white/10 hover:text-white'}`}
                >
                  <span className="min-w-0 truncate">{ranking.unidad}</span>
                  <span className={`shrink-0 text-xs font-bold ${isActive ? 'text-emaresa-blue' : 'text-blue-200/65'}`}>{formatPercent(ranking.resultado)}</span>
                </Link>
                {isActive && unit && unit.divisiones.length > 0 && (
                  <div className="ml-4 border-l border-white/20 pl-2">
                    {unit.divisiones.map((division) => (
                      <Link
                        key={division.nombre}
                        to={divisionPath(unit.unidad, division.nombre)}
                        className={`block truncate rounded-md px-2 py-1.5 text-xs ${activeDivision === division.nombre ? 'font-bold text-cyan-200' : 'text-blue-100/60 hover:text-white'}`}
                      >
                        {division.nombre}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
