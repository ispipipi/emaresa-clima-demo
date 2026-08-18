import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  chip?: ReactNode
  className?: string
}

export function SectionHeader({ title, subtitle, chip, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <h2 className="font-display text-[18px] font-bold leading-tight tracking-[-0.022em] text-navy-ink">{title}</h2>
        {subtitle && <p className="mt-2 text-xs leading-5 text-ink-faint">{subtitle}</p>}
      </div>
      {chip && <div className="shrink-0">{chip}</div>}
    </div>
  )
}
