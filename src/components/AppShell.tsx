import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HierarchyNav } from './HierarchyNav'
import { Icon, IconSprite } from './IconSprite'
import { MentatCopilot } from './MentatCopilot'
import { SiblingStrip } from './SiblingStrip'

interface AppShellProps {
  children: ReactNode
  activeUnit?: string
  activeDivision?: string
}

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

export function AppShell({ children, activeUnit, activeDivision }: AppShellProps) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [animFlip, setAnimFlip] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
    setAnimFlip((current) => !current)
  }, [location.pathname])

  const crumbs = useMemo(() => {
    const base = [{ label: 'Resumen ejecutivo', href: '/' }]
    if (activeDivision === 'corporativo') return [...base, { label: 'Gestión Corporativa', href: '/gestion-corporativa' }]
    if (activeDivision === 'organizacion') return [...base, { label: 'Organización BUK', href: '/organizacion' }]
    if (activeDivision === 'manual') return [...base, { label: 'Manual de usuario', href: '/manual' }]
    if (!activeUnit) return base
    const unitHref = `/unidad/${encodeURIComponent(activeUnit)}`
    const result = [...base, { label: activeUnit, href: unitHref }]
    if (activeDivision) result.push({ label: activeDivision, href: location.pathname })
    return result
  }, [activeDivision, activeUnit, location.pathname])

  const levelLabel = activeDivision === 'corporativo'
    ? 'Indicador separado'
    : activeDivision === 'organizacion'
      ? 'Snapshot BUK'
      : activeDivision === 'manual'
        ? 'Guía de uso'
        : activeDivision
          ? 'Nivel 3 de 3'
          : activeUnit
            ? 'Nivel 2 de 3'
            : 'Nivel 1 de 3'

  return (
    <div className="min-h-screen bg-canvas p-3 text-ink lg:p-[14px]">
      <IconSprite />
      {menuOpen && <button type="button" aria-label="Cerrar menú" className="fixed inset-0 z-30 bg-navy/40 lg:hidden" onClick={() => setMenuOpen(false)} />}

      <div className="flex min-h-[calc(100vh-28px)] items-start gap-[14px]">
        <aside className={`fixed inset-3 z-40 flex w-[250px] -translate-x-[calc(100%+16px)] flex-none flex-col rounded-sidebar bg-navy text-white shadow-sidebar transition-transform duration-300 lg:sticky lg:top-[14px] lg:h-[calc(100vh-28px)] lg:translate-x-0 ${menuOpen ? 'translate-x-0' : ''}`}>
          <div className="flex-none p-[18px_16px_16px]">
            <div className="flex items-start justify-between gap-3">
              <Link to="/" className="block min-w-0 flex-1" onClick={() => setMenuOpen(false)}>
                <span className="flex items-center justify-center rounded-[14px] bg-[#15579A] px-3.5 py-4">
                  <img src={assetUrl('emaresa-logo.png')} alt="Grupo Emaresa" className="block h-auto w-full max-w-[175px]" />
                </span>
                <span className="mt-3 block pl-1 text-[9.5px] font-bold uppercase tracking-[0.2em] text-teal-light">Clima organizacional</span>
                <span className="mt-1 block pl-1 text-[11px] font-medium text-white/45">Semestre 1 · 2026</span>
              </Link>
              <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Cerrar navegación" onClick={() => setMenuOpen(false)}>
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-1">
            <HierarchyNav activeUnit={activeUnit} activeDivision={activeDivision} onNavigate={() => setMenuOpen(false)} />
          </div>

          <div className="flex flex-none flex-col gap-[9px] p-[0_12px_14px]">
            <div className="rounded-[14px] bg-white/[0.07] px-3.5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
                <span className="text-[11.5px] font-semibold text-white/[0.82]">Fuente sincronizada</span>
              </div>
              <p className="mt-1.5 text-[10.5px] leading-4 text-white/45">BUK + informes DO · S1 2026</p>
            </div>
            <div className="flex items-center gap-2.5 rounded-[14px] bg-[#2B3239] px-3 py-[9px]">
              <span className="text-[8.5px] font-semibold uppercase tracking-[0.18em] text-white/45">Powered by</span>
              <img src={assetUrl('npr-logo.jpg')} alt="NPR" className="h-5 w-auto rounded-[3px]" />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-[14px]">
          <header className="flex min-h-[62px] items-center justify-between gap-4 rounded-panel bg-surface px-4 py-[11px] shadow-card">
            <div className="flex min-w-0 items-center gap-2.5">
              <button type="button" aria-label="Abrir menú" aria-expanded={menuOpen} className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border border-line bg-[#F7FBFF] text-navy hover:border-teal lg:hidden" onClick={() => setMenuOpen(true)}>
                <span aria-hidden="true" className="block h-[9px] w-3.5 border-y-[1.6px] border-navy" />
              </button>
              <nav aria-label="Ruta actual" className="flex min-w-0 items-center gap-[7px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {crumbs.map((crumb, index) => (
                  <span key={`${crumb.href}-${crumb.label}`} className="flex shrink-0 items-center gap-[7px]">
                    {index > 0 && <Icon name="chev" className="h-[11px] w-[11px] text-[#C2D6E9]" />}
                    <Link to={crumb.href} className={`max-w-[230px] truncate rounded-[10px] px-[11px] py-1.5 text-xs font-semibold transition hover:bg-[#EAF3FB] ${index === crumbs.length - 1 ? 'bg-[#EAF6F7] text-teal' : 'bg-surface-muted text-ink-soft'}`}>
                      {crumb.label}
                    </Link>
                  </span>
                ))}
              </nav>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full bg-[#F1FAF3] px-3 py-1.5 text-[11px] font-semibold text-tone-green lg:flex"><span className="h-1.5 w-1.5 rounded-full bg-tone-green-dot" />{levelLabel}</span>
              <span className="rounded-full bg-surface-muted px-3 py-1.5 text-[11.5px] font-semibold tabular-nums text-ink-soft">12 ago 2026</span>
            </div>
          </header>

          <div className="lg:hidden">
            <SiblingStrip activeUnit={activeUnit} activeDivision={activeDivision} />
          </div>

          <main key={location.pathname} className="flex min-w-0 flex-col gap-[14px] pb-[26px]" style={{ animationName: animFlip ? 'om-in-a' : 'om-in-b', animationDuration: '.44s', animationTimingFunction: 'cubic-bezier(.2,.7,.3,1)', animationFillMode: 'both' }}>
            {children}
          </main>
        </div>
      </div>
      <MentatCopilot context={{ activeUnit, activeDivision, pathname: location.pathname }} />
    </div>
  )
}
