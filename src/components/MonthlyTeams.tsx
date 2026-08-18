import { corporateMonths } from '../data/corporativo'
import { formatPercent, toneMeta, toneOf } from '../lib/format'
import { Card } from './Card'
import { SectionHeader } from './SectionHeader'

export function MonthlyTeams() {
  return (
    <Card className="p-[22px]" animationDelay={100}>
      <SectionHeader title="Equipos evaluados por mes" subtitle="Resultados incluidos en el informe corporativo S1 2026" />
      <div className="mt-[18px] grid gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
        {corporateMonths.map((month) => {
          const average = month.equipos.reduce((sum, team) => sum + team.resultado, 0) / month.equipos.length
          const averageMeta = toneMeta[toneOf(average)]
          return (
            <div key={month.mes} className="rounded-2xl bg-surface-sunken p-4">
              <div className="flex items-start justify-between gap-3 border-b border-line-soft pb-3">
                <div><h3 className="font-display text-[15px] font-bold text-navy-ink">{month.mes}</h3><p className="mt-1 text-[10.5px] text-ink-faint">{month.equipos.length} equipos</p></div>
                <span className="font-display text-lg font-extrabold tabular-nums" style={{ color: averageMeta.text }}>{formatPercent(average)}</span>
              </div>
              <ul className="divide-y divide-line-soft">
                {month.equipos.map((team) => {
                  const meta = toneMeta[toneOf(team.resultado)]
                  return <li key={team.equipo} className="flex items-center justify-between gap-2 py-2 text-[12px] text-ink"><span className="flex min-w-0 items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: meta.dot }} /><span className="truncate">{team.equipo}</span></span><span className="shrink-0 font-display font-bold tabular-nums" style={{ color: meta.text }}>{formatPercent(team.resultado)}</span></li>
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
