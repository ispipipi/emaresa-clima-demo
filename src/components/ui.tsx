import type { CSSProperties, ReactNode } from 'react'
import { Icon, type IconName } from './IconSprite'
import { formatSigned, toneLabel, toneMeta, toneOf, type Tone } from '../lib/format'
import { useCountUp, useMounted } from '../lib/hooks'

/* Botones: clases compartidas para <button>, <a> y <Link> */
export const btnPrimary =
  'inline-flex h-11 items-center justify-center gap-2 rounded-ctl bg-brand px-5 text-sm font-bold text-white transition duration-150 hover:bg-brand-deep'
export const btnOutline =
  'inline-flex h-11 items-center justify-center gap-2 rounded-ctl bg-surface px-4 text-sm font-bold text-ink shadow-[inset_0_0_0_1.5px_var(--line)] transition duration-150 hover:bg-sunken'
export const btnBrandOutline =
  'inline-flex h-11 items-center justify-center gap-2 rounded-ctl bg-surface px-4 text-sm font-bold text-brand-deep shadow-[inset_0_0_0_1.5px_var(--brand)] transition duration-150 hover:bg-brand-wash'

interface CardProps {
  children: ReactNode
  className?: string
  delay?: number
  style?: CSSProperties
}

export function Card({ children, className = '', delay, style }: CardProps) {
  return (
    <section className={`animate-rise rounded-card bg-surface shadow-card ${className}`} style={{ animationDelay: delay === undefined ? undefined : `${delay}ms`, ...style }}>
      {children}
    </section>
  )
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[22px] font-extrabold leading-7 tracking-[-0.03em]">{title}</h2>
        {subtitle ? <p className="mt-1 text-[13.5px] leading-5 text-ink-soft">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

const chipTone: Record<Tone, { box: string; icon: IconName }> = {
  green: { box: 'bg-fav-soft text-fav-ink', icon: 'ok' },
  yellow: { box: 'bg-att-soft text-att-ink', icon: 'warn' },
  red: { box: 'bg-crit-soft text-crit-ink', icon: 'crit' },
  neutral: { box: 'bg-sunken text-ink-soft', icon: 'info' },
}

/** Estado siempre con icono y etiqueta: nunca solo color. */
export function StatusChip({ tone, label, size = 'md' }: { tone: Tone; label?: string; size?: 'sm' | 'md' | 'lg' }) {
  const style = chipTone[tone]
  const sizes = { sm: 'h-6 gap-1 pl-2 pr-2.5 text-xs', md: 'h-7 gap-1.5 pl-2 pr-3 text-[12.5px]', lg: 'h-[34px] gap-2 pl-2.5 pr-4 text-sm' }
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-[17px] w-[17px]' : 'h-3.5 w-3.5'
  return (
    <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full font-bold ${style.box} ${sizes[size]}`}>
      <Icon name={style.icon} className={iconSize} />
      {label ?? toneLabel[tone]}
    </span>
  )
}

/** Variación con ▲▼ y signo, siempre con texto para lectores de pantalla. */
export function Delta({ value, suffix = ' pts', className = '' }: { value: number; suffix?: string; className?: string }) {
  const up = value >= 0
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold tabular-nums ${className}`}>
      <span aria-hidden="true" className={`text-[9px] ${up ? 'text-fav' : 'text-crit'}`}>{up ? '▲' : '▼'}</span>
      <span className="sr-only">{up ? 'Sube' : 'Baja'}</span>
      {formatSigned(value)}{suffix}
    </span>
  )
}

export function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const animated = useCountUp(value)
  return <>{format(animated)}</>
}

/** Barra de progreso; con marks muestra los cortes de 60 y 80. */
export function Meter({ value, color, marks = false, size = 'md', className = '' }: { value: number; color: string; marks?: boolean; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const mounted = useMounted()
  const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-2.5' : 'h-2'
  return (
    <span aria-hidden="true" className={`relative block ${height} w-full overflow-hidden rounded-full bg-sunken ${className}`}>
      <span className="block h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: mounted ? `${pct}%` : '0%', background: color }} />
      {marks ? (
        <>
          <span className="absolute top-0 h-full w-0.5 bg-surface" style={{ left: '60%' }} />
          <span className="absolute top-0 h-full w-0.5 bg-surface" style={{ left: '80%' }} />
        </>
      ) : null}
    </span>
  )
}

const RING_LENGTH = 2 * Math.PI * 52

function ringTick(pct: number) {
  const angle = ((-90 + pct * 3.6) * Math.PI) / 180
  return <line key={pct} x1={60 + 46 * Math.cos(angle)} y1={60 + 46 * Math.sin(angle)} x2={60 + 58 * Math.cos(angle)} y2={60 + 58 * Math.sin(angle)} stroke="var(--surface)" strokeWidth="2.4" />
}

/** Anillo de resultado con las zonas Crítico / Atención / Favorable y el valor animado. */
export function Ring({ value, size = 124, children }: { value: number; size?: number; children?: ReactNode }) {
  const mounted = useMounted()
  const tone = toneOf(value)
  const clamped = Math.max(0, Math.min(100, value))
  const zone = (from: number, to: number, color: string) => (
    <circle cx="60" cy="60" r="52" stroke={color} strokeDasharray={`${(RING_LENGTH * (to - from)) / 100} ${RING_LENGTH}`} strokeDashoffset={(-RING_LENGTH * from) / 100} />
  )
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
        <g transform="rotate(-90 60 60)" fill="none" strokeWidth="10">
          {zone(0, 60, 'var(--crit-soft)')}
          {zone(60, 80, 'var(--att-soft)')}
          {zone(80, 100, 'var(--fav-soft)')}
          <circle cx="60" cy="60" r="52" stroke={toneMeta[tone].fill} strokeLinecap="round" strokeDasharray={`${mounted ? (RING_LENGTH * clamped) / 100 : 0} ${RING_LENGTH}`} style={{ transition: 'stroke-dasharray 900ms cubic-bezier(.2,.7,.3,1)' }} />
        </g>
        <g transform="rotate(0 60 60)">{ringTick(60)}{ringTick(80)}</g>
      </svg>
      {children ? <span className="absolute inset-0 flex items-center justify-center">{children}</span> : null}
    </span>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton animate-shimmer rounded-ctl ${className}`} />
}

export function EmptyState({ icon = 'info', title, children, action }: { icon?: IconName; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-5 rounded-card border-[1.5px] border-dashed border-line p-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-sunken text-ink-soft"><Icon name={icon} className="h-6 w-6" /></span>
      <div className="min-w-[240px] flex-1">
        <h3 className="text-xl font-extrabold leading-[26px] tracking-[-0.025em]">{title}</h3>
        {children ? <p className="mt-1 max-w-[70ch] text-[14.5px] leading-[22px] text-ink-soft">{children}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function ErrorState({ title, children, actions }: { title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3.5 rounded-card bg-surface p-7 shadow-card">
      <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-crit-soft text-crit-ink"><Icon name="crit" className="h-6 w-6" /></span>
      <h1 className="text-2xl font-extrabold leading-[30px] tracking-[-0.03em]">{title}</h1>
      {children ? <p className="max-w-[52ch] text-[14.5px] leading-[22px] text-ink-soft">{children}</p> : null}
      {actions ? <div className="flex flex-wrap gap-2.5">{actions}</div> : null}
    </div>
  )
}
