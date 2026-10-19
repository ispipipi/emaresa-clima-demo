import { NavLink, Link } from 'react-router-dom'
import { Icon, toneIcon, type IconName } from './IconSprite'
import { bukOrganization, formatBukSyncDateLabel } from '../lib/buk'
import { clima, divisionPath, findUnit, unitPath } from '../lib/clima'
import { formatPercent, toneMeta, toneOf } from '../lib/format'

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

interface HierarchyNavProps {
  collapsed: boolean
  activeUnit?: string
  activeDivision?: string
  onNavigate: () => void
  onClose: () => void
}

const navItems: { label: string; to: string; icon: IconName; value?: string }[] = [
  { label: 'Resumen ejecutivo', to: '/', icon: 'grid', value: formatPercent(clima.global.resultado_global) },
  { label: 'Gestión Corporativa', to: '/gestion-corporativa', icon: 'bars', value: formatPercent(clima.global.resultado_gestion_corporativa) },
  { label: 'Organización BUK', to: '/organizacion', icon: 'org' },
]

export function HierarchyNav({ collapsed, activeUnit, activeDivision, onNavigate, onClose }: HierarchyNavProps) {
  // En escritorio el modo compacto oculta etiquetas; en el drawer móvil siempre se ven.
  const hideLabel = collapsed ? 'lg:hidden' : ''
  const itemBase = `flex h-11 items-center gap-3 rounded-ctl px-3 text-sm font-semibold transition ${collapsed ? 'lg:justify-center lg:px-0' : ''}`
  const itemClass = (active: boolean) => `${itemBase} ${active ? 'bg-brand-soft font-bold text-brand-deep' : 'text-ink hover:bg-sunken'}`
  return (
    <nav aria-label="Navegación principal" className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3.5 pb-4 pt-5">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Link to="/" onClick={onNavigate} aria-label="Grupo Emaresa, ir al resumen ejecutivo" className="flex min-w-0 flex-1 items-center rounded-card bg-ink px-4 py-3">
            <img src={assetUrl('emaresa-logo.png')} alt="" className={`block h-[34px] w-auto ${collapsed ? 'lg:hidden' : ''}`} />
            {collapsed ? <span className="hidden h-[30px] w-[26px] overflow-hidden lg:block"><img src={assetUrl('emaresa-logo.png')} alt="" className="block h-[30px] max-w-none" /></span> : null}
          </Link>
          <button type="button" aria-label="Cerrar menú" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl text-ink-soft hover:bg-sunken lg:hidden">
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>
        <div className={`flex justify-between px-1.5 pt-2.5 text-[12.5px] font-semibold text-ink-soft ${hideLabel}`}>
          <span>Clima organizacional</span>
          <span>S1 · 2026</span>
        </div>
      </div>

      <div>
        <p className={`px-2.5 pb-2 text-xs font-semibold text-ink-soft ${hideLabel}`}>Análisis</p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end onClick={onNavigate} title={item.label} className={({ isActive }) => itemClass(isActive)}>
                <Icon name={item.icon} className="h-5 w-5 shrink-0" />
                <span className={`min-w-0 flex-1 truncate ${hideLabel}`}>{item.label}</span>
                {item.value ? <span className={`text-[12.5px] tabular-nums text-ink-soft ${hideLabel}`}>{item.value}</span> : null}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/manual" onClick={onNavigate} title="Manual de usuario" className={({ isActive }) => itemClass(isActive)}>
              <Icon name="book" className="h-5 w-5 shrink-0" />
              <span className={`min-w-0 flex-1 truncate ${hideLabel}`}>Manual de usuario</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={hideLabel}>
        <p className="flex justify-between px-2.5 pb-2 text-xs font-semibold text-ink-soft"><span>Unidades de negocio</span><span>{clima.global.ranking_unidades.length}</span></p>
        <ul className="flex flex-col gap-px">
          {clima.global.ranking_unidades.map((ranking) => {
            const unit = findUnit(ranking.unidad)
            const active = activeUnit === ranking.unidad
            const tone = toneOf(ranking.resultado)
            return (
              <li key={ranking.unidad}>
                <Link to={unitPath(ranking.unidad)} onClick={onNavigate} aria-current={active && !activeDivision ? 'page' : undefined} className={`flex h-[34px] items-center gap-2.5 rounded-[10px] px-3 text-[13.5px] transition ${active ? 'bg-brand-soft font-bold text-brand-deep' : 'text-ink hover:bg-sunken'}`}>
                  <Icon name={toneIcon[tone]} className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{ranking.unidad}</span>
                  <span className={`text-[12.5px] font-semibold tabular-nums ${active ? '' : 'text-ink-soft'}`}>{formatPercent(ranking.resultado)}</span>
                </Link>
                {active && unit ? (
                  <ul className="ml-[22px] flex flex-col py-0.5">
                    {unit.divisiones.map((division) => {
                      const current = activeDivision === division.nombre
                      return (
                        <li key={division.nombre}>
                          <Link to={divisionPath(unit.unidad, division.nombre)} onClick={onNavigate} title={division.nombre} aria-current={current ? 'page' : undefined} className={`flex items-center gap-2 rounded-r-lg border-l-2 py-1.5 pl-2.5 pr-2 text-xs leading-4 ${current ? 'border-brand bg-brand-soft font-bold text-brand-deep' : 'border-line text-ink-soft hover:text-ink'}`}>
                            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: toneMeta[toneOf(division.resultado)].fill }} />
                            <span className="min-w-0 flex-1 truncate">{division.nombre}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>

      <div className={`mt-auto flex items-center gap-2.5 border-t border-line-soft px-1.5 pt-3.5 ${hideLabel}`}>
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-fav-soft text-fav-ink"><Icon name="sync" className="h-4 w-4" /></span>
        <div>
          <p className="text-[13px] font-bold">Datos sincronizados</p>
          <p className="text-xs text-ink-soft">BUK · {formatBukSyncDateLabel(bukOrganization.generatedAt)}</p>
        </div>
      </div>
    </nav>
  )
}
