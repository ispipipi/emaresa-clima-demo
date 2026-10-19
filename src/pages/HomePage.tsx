import { CategoryBars } from '../components/CategoryBars'
import { HeatmapTable } from '../components/HeatmapTable'
import { KpiCard, ScoreCard } from '../components/KpiCard'
import { QuestionList } from '../components/QuestionList'
import { StripPlot } from '../components/StripPlot'
import { UnitMap } from '../components/UnitMap'
import { PeriodUnavailableState } from '../components/PeriodState'
import { Card, Delta, Meter, SectionHeader, StatusChip } from '../components/ui'
import { clima } from '../lib/clima'
import { formatPercent, formatPlain, toneMeta, toneOf } from '../lib/format'
import { FAVORABLE_THRESHOLD, statusCounts, unitRows } from '../lib/insights'
import { hasGroupPeriodData } from '../lib/periodData'
import { usePeriod } from '../lib/period'

export function HomePage() {
  const { period } = usePeriod()
  if (!hasGroupPeriodData(period)) {
    return <PeriodUnavailableState title="El consolidado del Grupo para S2 aún no está cargado">El período S2 está seleccionado, pero todavía no existe un dataset consolidado para las 15 unidades. La información S2 disponible hoy corresponde a Construcción y se puede revisar desde su ficha.</PeriodUnavailableState>
  }

  const { global } = clima
  const tone = toneOf(global.resultado_global)
  const counts = statusCounts()
  const gap = FAVORABLE_THRESHOLD - global.resultado_global
  const lowestParticipation = [...unitRows].sort((a, b) => a.participation - b.participation)[0]
  const gcDelta = global.resultado_gestion_corporativa - global.resultado_global

  return (
    <>
      <header className="animate-rise pt-1">
        <div className="flex flex-wrap items-center gap-3.5">
          <h1 className="text-[clamp(28px,4vw,34px)] font-extrabold leading-10 tracking-[-0.035em]">Resumen ejecutivo</h1>
          <StatusChip tone={tone} size="lg" />
        </div>
        <p className="mt-2 max-w-[72ch] text-[17px] font-medium leading-[27px] text-ink-soft">
          Clima del Grupo Emaresa en {formatPercent(global.resultado_global)}
          {gap > 0 ? `, ${formatPlain(Math.round(gap * 10) / 10)} puntos bajo el umbral Favorable` : ', sobre el umbral Favorable'}. {counts.green} de {unitRows.length} unidades lo superan
          {counts.yellow ? ` y ${counts.yellow} están en Atención` : ''}
          {counts.red ? `, ${counts.red} en Crítico` : ''}.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[400px_minmax(0,1fr)]">
        <ScoreCard
          title="Resultado global"
          value={global.resultado_global}
          comparisons={[
            { label: 'vs. Favorable (80)', value: <Delta value={global.resultado_global - FAVORABLE_THRESHOLD} suffix=" pts" /> },
            { label: 'Participación', value: formatPercent(global.participacion) },
            { label: 'Unidades favorables', value: `${counts.green} de ${unitRows.length}` },
          ]}
          explanation="Resultado global de clima organizacional, calculado sobre las unidades de negocio disponibles."
          rows={[
            { label: 'Resultado', value: formatPercent(global.resultado_global) },
            { label: 'Período', value: 'S1 · 2026' },
            { label: 'Umbral Favorable', value: '80%' },
          ]}
        />
        <Card className="p-6">
          <SectionHeader title="Unidades frente a los umbrales" subtitle="Cada punto es una unidad de negocio · S1 2026 · pasa el cursor para ver el nombre" />
          <StripPlot />
        </Card>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          label="Gestión Corporativa"
          value={global.resultado_gestion_corporativa}
          detail="Indicador separado del clima"
          icon="bars"
          delta={<Delta value={gcDelta} suffix=" pts vs. clima global" />}
          rows={[
            { label: 'Resultado clima', value: formatPercent(global.resultado_global) },
            { label: 'Diferencia', value: `${formatPlain(Math.round(gcDelta * 10) / 10)} pts` },
            { label: 'Fuente', value: 'Informe corporativo' },
          ]}
          explanation="Percepción de la gestión de la organización, mostrada fuera del resultado de clima global."
        />
        <KpiCard
          label="Participación"
          value={global.participacion}
          detail={`${formatPlain(global.respondidas)} de ${formatPlain(global.enviadas)} respuestas`}
          icon="people"
          visual={<Meter value={global.participacion} color={toneMeta[toneOf(global.participacion)].fill} marks />}
          delta={<span className="text-ink-soft">La más baja: {lowestParticipation.name}, {formatPercent(lowestParticipation.participation)}</span>}
          rows={[
            { label: 'Respondidas', value: formatPlain(global.respondidas) },
            { label: 'Enviadas', value: formatPlain(global.enviadas) },
            { label: 'Cobertura', value: 'Grupo Emaresa' },
          ]}
          explanation="Porcentaje de personas que respondieron la encuesta respecto del universo invitado."
        />
        <KpiCard
          label="Unidades de negocio"
          value={unitRows.length}
          asPercent={false}
          neutral
          detail={`${counts.green} favorables · ${counts.yellow} en atención · ${counts.red} críticas`}
          icon="unit"
          visual={
            <span aria-hidden="true" className="flex h-2.5 gap-1">
              <span className="rounded-full" style={{ flex: counts.green, background: 'var(--fav)' }} />
              <span className="rounded-full" style={{ flex: counts.yellow, background: 'var(--att)' }} />
              {counts.red > 0 ? <span className="rounded-full" style={{ flex: counts.red, background: 'var(--crit)' }} /> : null}
            </span>
          }
          rows={[
            { label: 'Unidades', value: formatPlain(unitRows.length) },
            { label: 'Favorables', value: `${counts.green} unidades` },
            { label: 'Nivel siguiente', value: 'División legal' },
          ]}
          explanation="Unidades de negocio con resultado disponible en el dataset de clima."
        />
      </div>

      <UnitMap />
      <HeatmapTable />

      <div className="grid gap-5 xl:grid-cols-2">
        <CategoryBars categorias={global.categorias} />
        <QuestionList title="Preguntas" preguntas={global.top5} alternatePreguntas={global.bottom5} />
      </div>
    </>
  )
}
