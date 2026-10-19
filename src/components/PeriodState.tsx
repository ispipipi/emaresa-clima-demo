import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './IconSprite'
import { btnPrimary } from './ui'
import { periodLabel, usePeriod } from '../lib/period'

export function PeriodUnavailableState({ title, children }: { title: string; children: ReactNode }) {
  const { period } = usePeriod()

  return (
    <div className="flex flex-col items-start gap-4 rounded-card bg-surface p-7 shadow-card">
      <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-brand-soft text-brand-deep"><Icon name="calendar" className="h-6 w-6" /></span>
      <div>
        <p className="text-[13px] font-bold text-brand-deep">{periodLabel(period)}</p>
        <h1 className="mt-1.5 text-2xl font-extrabold leading-[30px] tracking-[-0.025em]">{title}</h1>
        <p className="mt-2 max-w-[62ch] text-[14.5px] leading-[22px] text-ink-soft">{children}</p>
      </div>
      <Link to="/unidad/Construcci%C3%B3n" className={btnPrimary}>Abrir datos S2 de Construcción<Icon name="go" className="h-4 w-4" /></Link>
    </div>
  )
}
