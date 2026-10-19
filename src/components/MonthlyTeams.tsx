import { Icon, toneIcon } from './IconSprite'
import { Card, Meter, SectionHeader, StatusChip } from './ui'
import { corporateMonths } from '../data/corporativo'
import { formatPercent, toneMeta, toneOf } from '../lib/format'

export function MonthlyTeams() {
  return (
    <Card className="p-6" delay={100}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeader title="Equipos evaluados por mes" subtitle="Resultados incluidos en el informe corporativo S1 2026 · escala 0–100 · marcas en 60 y 80" />
        <span className="inline-flex max-w-[430px] items-start gap-2 rounded-ctl bg-sunken px-3.5 py-2 text-[12.5px] font-semibold leading-[17px] text-ink-soft">
          <Icon name="info" className="mt-px h-4 w-4 shrink-0" />Cada mes evalúa equipos distintos: compara equipos, no la evolución de un mismo grupo.
        </span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {corporateMonths.map((month) => {
          const average = month.equipos.reduce((sum, team) => sum + team.resultado, 0) / month.equipos.length
          return (
            <div key={month.mes} className="flex flex-col gap-3.5 rounded-card bg-sunken p-[18px]">
              <div className="flex items-start justify-between gap-2.5">
                <div>
                  <h3 className="text-lg font-extrabold leading-6 tracking-[-0.02em]">{month.mes}</h3>
                  <p className="text-[12.5px] text-ink-soft">{month.equipos.length} equipos</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-2xl font-extrabold leading-7 tracking-[-0.03em] tabular-nums">{formatPercent(average)}</span>
                  <StatusChip tone={toneOf(average)} size="sm" />
                </div>
              </div>
              <Meter value={average} color={toneMeta[toneOf(average)].fill} marks className="!bg-surface" />
              <ul className="flex flex-col gap-0.5 border-t border-line pt-1.5">
                {month.equipos.map((team) => {
                  const tone = toneOf(team.resultado)
                  return (
                    <li key={team.equipo} className="rounded-[10px] px-1 py-2 transition hover:bg-surface">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-2 text-[13.5px] font-semibold"><span style={{ color: toneMeta[tone].fill }}><Icon name={toneIcon[tone]} className="h-[13px] w-[13px] shrink-0" /></span><span className="truncate">{team.equipo}</span></span>
                        <b className="shrink-0 text-sm font-extrabold tabular-nums" style={{ color: toneMeta[tone].text }}>{formatPercent(team.resultado)}</b>
                      </div>
                      <Meter value={team.resultado} color={toneMeta[tone].fill} size="sm" className="mt-1.5 !bg-surface" />
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
