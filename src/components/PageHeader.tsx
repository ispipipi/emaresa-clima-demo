import type { ReactNode } from 'react'
import { StatusChip } from './ui'
import type { Tone } from '../lib/format'

const washes: Record<Tone, string> = {
  green: 'var(--fav-soft)',
  yellow: 'var(--att-soft)',
  red: 'var(--crit-soft)',
  neutral: 'var(--brand-soft)',
}

interface PageHeaderProps {
  eyebrow: ReactNode
  title: string
  /** Color de estado del nivel: tiñe la cabecera y muestra la etiqueta. */
  tone: Tone
  chipLabel?: string
  hideChip?: boolean
  subtitle?: ReactNode
  actions?: ReactNode
  aside?: ReactNode
}

/** Cabecera de contexto común a Grupo, Unidad y División: nombre, estado, acciones y resultado. */
export function PageHeader({ eyebrow, title, tone, chipLabel, hideChip = false, subtitle, actions, aside }: PageHeaderProps) {
  return (
    <section className="animate-rise overflow-hidden rounded-card shadow-card" style={{ background: `radial-gradient(640px 260px at 0% 0%, ${washes[tone]}, transparent 70%), var(--surface)` }}>
      <div className={`grid gap-8 p-6 sm:p-8 ${aside ? 'lg:grid-cols-[minmax(0,1fr)_410px] lg:items-center' : ''}`}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-semibold text-ink-soft">{eyebrow}</div>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-2">
            <h1 className="min-w-0 max-w-[22ch] break-words text-[clamp(30px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.04em]">{title}</h1>
            {hideChip ? null : <StatusChip tone={tone} label={chipLabel} size="lg" />}
          </div>
          {subtitle ? <p className="mt-3 max-w-[60ch] text-base leading-6 text-ink-soft">{subtitle}</p> : null}
          {actions ? <div className="mt-5 flex flex-wrap gap-2.5">{actions}</div> : null}
        </div>
        {aside}
      </div>
    </section>
  )
}
