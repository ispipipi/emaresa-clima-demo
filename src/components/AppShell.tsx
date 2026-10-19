import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useMatch } from 'react-router-dom'
import { CommandPalette } from './CommandPalette'
import { HierarchyNav } from './HierarchyNav'
import { Icon, toneIcon } from './IconSprite'
import { SiblingStrip } from './SiblingStrip'
import { MentatCopilot } from '../features/mentat/MentatCopilot'
import { bukOrganization, formatBukSyncDateLabel } from '../lib/buk'
import { clima, findDivision, findUnit } from '../lib/clima'
import { formatPercent, toneOf, type Tone } from '../lib/format'
import { useStoredFlag } from '../lib/hooks'

interface Crumb {
  label: string
  href: string
  tone: Tone
  value?: number
}

const crumbTone: Record<Tone, string> = {
  green: 'bg-fav-soft text-fav-ink',
  yellow: 'bg-att-soft text-att-ink',
  red: 'bg-crit-soft text-crit-ink',
  neutral: 'bg-brand-soft text-brand-deep',
}

function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Ruta actual" className="scrollbar-none min-w-0 overflow-x-auto">
      <ol className="flex items-center gap-1.5 text-sm font-semibold">
        {crumbs.map((crumb, index) => {
          const current = index === crumbs.length - 1
          return (
            <li key={crumb.href + crumb.label} className="flex min-w-0 shrink-0 items-center gap-1.5 last:shrink">
              {index > 0 ? <Icon name="chev" className="h-3.5 w-3.5 shrink-0 text-ink-faint" /> : null}
              <Link
                to={crumb.href}
                aria-current={current ? 'page' : undefined}
                title={crumb.label}
                className={`inline-flex min-w-0 max-w-[260px] items-center gap-2 rounded-[10px] px-3 py-1.5 transition ${current ? `${crumbTone[crumb.tone]} font-bold` : 'text-ink-soft hover:bg-sunken hover:text-ink'}`}
              >
                <Icon name={toneIcon[crumb.tone]} className={`h-[15px] w-[15px] shrink-0 ${current ? '' : 'text-ink-faint'}`} />
                <span className="truncate">{crumb.label}</span>
                {crumb.value !== undefined ? <span className="shrink-0 tabular-nums">{formatPercent(crumb.value)}</span> : null}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function AppShell() {
  const location = useLocation()
  const divisionMatch = useMatch('/unidad/:nombre/division/:division')
  const unitMatch = useMatch('/unidad/:nombre')
  const [collapsed, setCollapsed] = useStoredFlag('emaresa-clima:sidebar-collapsed', false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const activeUnit = divisionMatch?.params.nombre ?? unitMatch?.params.nombre
  const activeDivision = divisionMatch?.params.division

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((current) => !current)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const crumbs = useMemo<Crumb[]>(() => {
    const group: Crumb = { label: 'Grupo Emaresa', href: '/', tone: toneOf(clima.global.resultado_global), value: clima.global.resultado_global }
    const path = location.pathname
    if (path === '/gestion-corporativa') return [{ ...group, value: undefined, tone: 'neutral' }, { label: 'Gestión Corporativa', href: path, tone: toneOf(clima.global.resultado_gestion_corporativa), value: clima.global.resultado_gestion_corporativa }]
    if (path === '/organizacion') return [{ ...group, value: undefined, tone: 'neutral' }, { label: 'Organización BUK', href: path, tone: 'neutral' }]
    if (path === '/manual') return [{ ...group, value: undefined, tone: 'neutral' }, { label: 'Manual de usuario', href: path, tone: 'neutral' }]
    const unit = findUnit(activeUnit)
    if (!unit) return [group]
    const unitCrumb: Crumb = { label: unit.unidad, href: `/unidad/${encodeURIComponent(unit.unidad)}`, tone: toneOf(unit.resultado_global), value: unit.resultado_global }
    const division = findDivision(activeUnit, activeDivision)
    const base: Crumb[] = [{ ...group, value: undefined, tone: 'neutral' }, unitCrumb]
    if (!division) return base
    return [...base, { label: division.nombre, href: path, tone: toneOf(division.resultado), value: typeof division.resultado === 'number' ? division.resultado : undefined }]
  }, [location.pathname, activeUnit, activeDivision])

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      {drawerOpen ? <button type="button" aria-label="Cerrar menú" className="fixed inset-0 z-30 animate-fade bg-[var(--scrim)] lg:hidden" onClick={() => setDrawerOpen(false)} /> : null}

      <div className="flex min-h-screen items-start">
        <aside
          id="navegacion"
          className={`fixed inset-y-0 left-0 z-40 flex w-[290px] max-w-[86vw] flex-col border-r border-line bg-surface transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:max-w-none lg:translate-x-0 lg:transition-[width] ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'lg:w-[76px]' : 'lg:w-[264px]'}`}
        >
          <HierarchyNav collapsed={collapsed} activeUnit={activeUnit} activeDivision={activeDivision} onNavigate={() => setDrawerOpen(false)} onClose={() => setDrawerOpen(false)} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex min-h-[72px] items-center gap-3 bg-canvas px-4 py-3 sm:px-8">
            <button type="button" aria-label="Abrir menú" aria-expanded={drawerOpen} aria-controls="navegacion" onClick={() => setDrawerOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-surface text-ink-soft shadow-card transition hover:text-ink lg:hidden">
              <Icon name="panel" className="h-5 w-5" />
            </button>
            <button type="button" aria-label={collapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'} onClick={() => setCollapsed(!collapsed)} className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-surface text-ink-soft shadow-card transition hover:text-ink lg:flex">
              <Icon name="panel" className="h-5 w-5" />
            </button>
            <Breadcrumb crumbs={crumbs} />
            <div className="min-w-2 flex-1" />
            <button type="button" onClick={() => setPaletteOpen(true)} aria-label="Buscar unidad, división o vista" className="flex h-11 shrink-0 items-center gap-2.5 rounded-ctl bg-surface px-3.5 text-sm text-ink-soft shadow-card transition hover:text-ink sm:w-[300px]">
              <Icon name="search" className="h-[18px] w-[18px]" />
              <span className="hidden flex-1 text-left sm:block">Buscar unidad, división o vista</span>
              <kbd className="hidden rounded-[7px] bg-sunken px-2 py-0.5 text-xs font-semibold sm:block">{isMac ? '⌘ K' : 'Ctrl K'}</kbd>
            </button>
            <span className="hidden h-11 shrink-0 items-center gap-2 rounded-ctl bg-surface px-3.5 text-sm font-semibold shadow-card md:flex"><Icon name="calendar" className="h-[18px] w-[18px] text-ink-soft" />S1 · 2026</span>
            <span className="hidden shrink-0 items-center gap-2 text-[12.5px] text-ink-soft xl:flex"><span className="h-2 w-2 rounded-full bg-fav" />Sinc. {formatBukSyncDateLabel(bukOrganization.generatedAt)}</span>
          </header>

          <div className="px-4 sm:px-8 lg:hidden">
            <SiblingStrip activeUnit={activeUnit} activeDivision={activeDivision} />
          </div>

          <main id="contenido" key={location.pathname} tabIndex={-1} className="flex min-w-0 flex-col gap-5 px-4 pb-[120px] pt-2 outline-none sm:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      <MentatCopilot context={{ activeUnit, activeDivision, pathname: location.pathname }} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}
