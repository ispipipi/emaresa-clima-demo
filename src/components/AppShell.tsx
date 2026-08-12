import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HierarchyNav } from './HierarchyNav'

interface AppShellProps {
  children: ReactNode
  activeUnit?: string
  activeDivision?: string
}

export function AppShell({ children, activeUnit, activeDivision }: AppShellProps) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-emaresa-bg text-emaresa-text">
      <div className="flex min-h-screen">
        {menuOpen && (
          <button
            type="button"
            aria-label="Cerrar menú"
            className="fixed inset-0 z-30 bg-emaresa-navy/35 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[286px] -translate-x-full flex-col bg-emaresa-navy px-5 py-5 text-white shadow-2xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${menuOpen ? 'translate-x-0' : ''}`}
        >
          <div className="flex items-start justify-between border-b border-white/15 pb-6">
            <Link to="/" className="block">
              <span className="block text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Grupo Emaresa</span>
              <span className="mt-2 block font-display text-2xl font-extrabold tracking-tight">Clima</span>
            </Link>
            <button
              type="button"
              aria-label="Cerrar navegación"
              className="rounded-md px-2 py-1 text-xl leading-none text-blue-100 hover:bg-white/10 lg:hidden"
              onClick={() => setMenuOpen(false)}
            >
              x
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6">
            <p className="px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200/65">Navegación</p>
            <HierarchyNav activeUnit={activeUnit} activeDivision={activeDivision} />
          </div>

          <div className="border-t border-white/15 pt-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              <span>Fuente conectada</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-blue-100/65">BUK + informes DO · S1 2026</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-emaresa-line/90 bg-emaresa-bg/95 backdrop-blur">
            <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label="Abrir menú"
                  aria-expanded={menuOpen}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-emaresa-line bg-white text-emaresa-navy hover:border-emaresa-blue lg:hidden"
                  onClick={() => setMenuOpen(true)}
                >
                  <span aria-hidden="true" className="text-lg leading-none">=</span>
                </button>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Reporte ejecutivo</p>
                  <p className="mt-1 truncate text-sm font-semibold text-emaresa-muted">Encuesta Pulso de Clima · Sem. 1 - 2026</p>
                </div>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">Datos sincronizados</span>
                <span className="text-xs font-semibold text-emaresa-muted">12 ago 2026</span>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
            <div className="min-w-0">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
