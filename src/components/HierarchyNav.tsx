import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clima, divisionPath, findUnit, unitPath } from '../lib/clima'
import { formatPercent } from '../lib/format'

interface HierarchyNavProps {
  activeUnit?: string
  activeDivision?: string
}

export function HierarchyNav({ activeUnit, activeDivision }: HierarchyNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeLabel = activeDivision === 'corporativo'
    ? 'Gestión Corporativa'
    : activeDivision ?? activeUnit ?? 'Grupo Emaresa'

  return (
    <nav className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200/80" aria-label="Jerarquía organizacional">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 text-left lg:hidden"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((isOpen) => !isOpen)}
      >
        <span>
          <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">Explorar resultados</span>
          <span className="mt-1 block font-display text-lg font-bold text-emaresa-blue">{activeLabel}</span>
        </span>
        <span className="text-sm font-bold text-emaresa-blue">{mobileOpen ? 'Ocultar' : 'Mostrar'}</span>
      </button>

      <div className={`${mobileOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="border-b border-slate-200 pb-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Explorar resultados
          </p>
          <Link
            to="/"
            className={`mt-3 block font-display text-lg font-bold ${!activeUnit ? 'text-emaresa-blue' : 'text-emaresa-text hover:text-emaresa-blue'}`}
          >
            Grupo Emaresa
          </Link>
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className="flex items-center justify-between rounded-md px-2 py-2 text-sm font-bold text-emaresa-text hover:bg-slate-50"
          >
            <span>Clima organizacional</span>
            <span className="text-xs font-semibold text-slate-400">
              {formatPercent(clima.global.resultado_global)}
            </span>
          </Link>

          <div className="mt-2 border-l border-slate-200 pl-3">
            {clima.global.ranking_unidades.map((ranking) => {
              const unit = findUnit(ranking.unidad)
              const isActive = activeUnit === ranking.unidad

              return (
                <div key={ranking.unidad} className="py-0.5">
                  <Link
                    to={unitPath(ranking.unidad)}
                    className={`flex items-center justify-between gap-2 rounded-md px-2 py-2 text-sm ${isActive ? 'bg-blue-50 font-bold text-emaresa-blue' : 'text-slate-600 hover:bg-slate-50 hover:text-emaresa-blue'}`}
                  >
                    <span className="min-w-0 truncate">{ranking.unidad}</span>
                    <span className="shrink-0 text-xs font-semibold text-slate-400">
                      {formatPercent(ranking.resultado)}
                    </span>
                  </Link>

                  {isActive && unit && unit.divisiones.length > 0 && (
                    <div className="ml-3 border-l border-slate-200 pl-2">
                      {unit.divisiones.map((division) => {
                        const isDivisionActive = activeDivision === division.nombre

                        return (
                          <Link
                            key={division.nombre}
                            to={divisionPath(unit.unidad, division.nombre)}
                            className={`block truncate rounded-md px-2 py-1.5 text-xs ${isDivisionActive ? 'font-bold text-emaresa-blue' : 'text-slate-500 hover:bg-slate-50 hover:text-emaresa-blue'}`}
                          >
                            {division.nombre}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <Link
            to="/gestion-corporativa"
            className={`mt-4 flex items-center justify-between rounded-md border-t border-slate-200 px-2 pt-4 text-sm font-bold ${!activeUnit && activeDivision === 'corporativo' ? 'text-emaresa-blue' : 'text-slate-700 hover:text-emaresa-blue'}`}
          >
            <span>Gestión corporativa</span>
            <span className="text-xs font-semibold text-slate-400">
              {formatPercent(clima.global.resultado_gestion_corporativa)}
            </span>
          </Link>
        </div>

        <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
          La fuente disponible llega hasta división legal. Los niveles inferiores requerirán datos de BUK.
        </p>
      </div>
    </nav>
  )
}
