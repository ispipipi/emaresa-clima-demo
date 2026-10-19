import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ClimatePeriod = 'S1-2026' | 'S2-2026'

export const periodOptions: { value: ClimatePeriod; label: string; shortLabel: string }[] = [
  { value: 'S1-2026', label: 'Semestre 1 · 2026', shortLabel: 'S1 · 2026' },
  { value: 'S2-2026', label: 'Semestre 2 · 2026', shortLabel: 'S2 · 2026' },
]

export function periodLabel(period: ClimatePeriod) {
  return periodOptions.find((option) => option.value === period)?.label ?? 'Semestre 1 · 2026'
}

export function periodShortLabel(period: ClimatePeriod) {
  return periodOptions.find((option) => option.value === period)?.shortLabel ?? 'S1 · 2026'
}

interface PeriodContextValue {
  period: ClimatePeriod
  setPeriod: (period: ClimatePeriod) => void
}

const PeriodContext = createContext<PeriodContextValue | null>(null)
const storageKey = 'emaresa-clima:period'

function initialPeriod(): ClimatePeriod {
  if (typeof window === 'undefined') return 'S1-2026'
  return window.localStorage.getItem(storageKey) === 'S2-2026' ? 'S2-2026' : 'S1-2026'
}

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriodState] = useState<ClimatePeriod>(initialPeriod)
  const setPeriod = (nextPeriod: ClimatePeriod) => setPeriodState(nextPeriod)

  useEffect(() => {
    window.localStorage.setItem(storageKey, period)
  }, [period])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey) setPeriodState(event.newValue === 'S2-2026' ? 'S2-2026' : 'S1-2026')
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(() => ({ period, setPeriod }), [period])
  return <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>
}

export function usePeriod() {
  const context = useContext(PeriodContext)
  if (!context) throw new Error('usePeriod debe usarse dentro de PeriodProvider')
  return context
}
