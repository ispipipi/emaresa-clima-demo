import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { HierarchyNav } from './HierarchyNav'

interface AppShellProps {
  children: ReactNode
  activeUnit?: string
  activeDivision?: string
}

export function AppShell({ children, activeUnit, activeDivision }: AppShellProps) {
  return (
    <div className="min-h-screen bg-emaresa-bg text-emaresa-text">
      <header className="border-b-4 border-emaresa-gold bg-emaresa-navy text-white">
        <div className="mx-auto flex min-w-0 w-full max-w-[1480px] items-center justify-between gap-4 px-4 py-4 sm:gap-5 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0 font-display text-lg font-extrabold">
            Grupo Emaresa
          </Link>
          <p className="min-w-0 max-w-[190px] break-words text-right text-xs font-semibold uppercase tracking-wide text-blue-100 sm:max-w-none sm:text-sm">
            Encuesta Pulso de Clima · Sem. 1 - 2026
          </p>
        </div>
      </header>

      <main className="mx-auto grid min-w-0 w-full max-w-[1480px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8 lg:py-8">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <HierarchyNav activeUnit={activeUnit} activeDivision={activeDivision} />
        </aside>
        <div className="min-w-0 w-full max-w-full overflow-x-hidden">{children}</div>
      </main>
    </div>
  )
}
