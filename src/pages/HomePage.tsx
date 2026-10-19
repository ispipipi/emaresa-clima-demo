import { AppShell } from '../components/AppShell'
import { Card } from '../components/Card'
import { CategoryBars } from '../components/CategoryBars'
import { KpiCard } from '../components/KpiCard'
import { QuestionList } from '../components/QuestionList'
import { formatPercent, formatPlain, toneLabel, toneOf } from '../lib/format'
import { clima } from '../lib/clima'

export function HomePage() {
  const { global } = clima
  const favorableUnits = global.ranking_unidades.filter((unit) => unit.resultado >= 80).length
  const heroTone = toneOf(global.resultado_global)

  return (
    <AppShell>
      <Card className="now-filterbar flex flex-wrap items-center justify-between gap-4 px-4 py-3.5" animationDelay={0}>
        <div className="flex min-w-0 items-center gap-3">
          <span className="now-focus-pill">★ Foco ejecutivo</span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-navy-ink">Clima organizacional del Grupo Emaresa</p>
            <p className="mt-0.5 text-[11px] text-ink-soft">Resultado global · {toneLabel[heroTone]}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-[11px]">
          <span className="now-filter-label">PERÍODO:</span>
          <span className="now-filter-value">S1 · 2026</span>
          <span className="now-filter-status"><span /> BUK conectado</span>
        </div>
      </Card>

      <div className="grid min-w-0 grid-cols-2 gap-[14px] xl:grid-cols-4">
        <KpiCard
          label="Resultado global"
          value={global.resultado_global}
          detail="Clima consolidado del grupo"
          sparkline={[72, 75, 77, 79, 78, global.resultado_global]}
          icon="ring"
          rows={[
            { label: 'Resultado', value: formatPercent(global.resultado_global) },
            { label: 'Estado', value: toneLabel[heroTone] },
            { label: 'Periodo', value: 'S1 - 2026' },
          ]}
          explanation="Resultado global de clima organizacional, calculado sobre las unidades de negocio disponibles."
        />
        <KpiCard
          label="Gestión Corporativa"
          value={global.resultado_gestion_corporativa}
          detail="Indicador separado"
          sparkline={[74, 78, 79, 80, 79, global.resultado_gestion_corporativa]}
          icon="bars"
          rows={[
            { label: 'Resultado clima', value: formatPercent(global.resultado_global) },
            { label: 'Diferencia', value: formatPercent(global.resultado_gestion_corporativa - global.resultado_global) },
            { label: 'Fuente', value: 'Informe corporativo' },
          ]}
          explanation="Percepción de la gestión de la organización, mostrada fuera del resultado de clima global."
        />
        <KpiCard
          label="Participación"
          value={global.participacion}
          detail={`${formatPlain(global.respondidas)} de ${formatPlain(global.enviadas)} respuestas`}
          sparkline={[70, 74, 78, 82, 84, global.participacion]}
          icon="people"
          rows={[
            { label: 'Respondidas', value: formatPlain(global.respondidas) },
            { label: 'Enviadas', value: formatPlain(global.enviadas) },
            { label: 'Cobertura', value: 'Grupo Emaresa' },
          ]}
          explanation="Porcentaje de personas que respondieron la encuesta respecto del universo invitado."
        />
        <KpiCard
          label="Unidades de negocio"
          value={global.ranking_unidades.length}
          detail="Con resultado agregado"
          asPercent={false}
          neutral
          sparkline={[11, 12, 13, 14, 15]}
          icon="unit"
          rows={[
            { label: 'Unidades', value: formatPlain(global.ranking_unidades.length) },
            { label: 'Favorables', value: `${favorableUnits} unidades` },
            { label: 'Nivel siguiente', value: 'División legal' },
          ]}
          explanation="Unidades de negocio con resultado disponible en el dataset de clima."
        />
      </div>

      <div className="grid min-w-0 gap-[14px] xl:grid-cols-[1fr_1.04fr]">
        <CategoryBars categorias={global.categorias} />
        <QuestionList title="Preguntas mejor evaluadas" preguntas={global.top5} alternatePreguntas={global.bottom5} alternateTitle="Preguntas con mayor oportunidad" />
      </div>

    </AppShell>
  )
}
