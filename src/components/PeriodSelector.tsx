import { Icon } from './IconSprite'
import { periodOptions, usePeriod } from '../lib/period'

export function PeriodSelector() {
  const { period, setPeriod } = usePeriod()

  return (
    <label className="relative flex h-11 shrink-0 items-center gap-1.5 rounded-ctl bg-surface px-2.5 text-sm font-semibold text-ink shadow-card sm:gap-2 sm:px-3.5">
      <Icon name="calendar" className="h-[18px] w-[18px] text-ink-soft" />
      <span className="sr-only">Período de medición</span>
      <select value={period} onChange={(event) => setPeriod(event.target.value as typeof period)} aria-label="Seleccionar período de medición" className="w-[68px] cursor-pointer appearance-none bg-transparent pr-4 outline-none sm:w-[118px]">
        {periodOptions.map((option) => <option key={option.value} value={option.value}>{option.shortLabel}</option>)}
      </select>
      <Icon name="chev" className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 rotate-90 text-ink-soft" />
    </label>
  )
}
