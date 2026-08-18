import { AppShell } from '../components/AppShell'
import { Card } from '../components/Card'
import { CategoryBars } from '../components/CategoryBars'
import { KpiCard } from '../components/KpiCard'
import { QuestionList } from '../components/QuestionList'
import { ReportCard } from '../components/ReportCard'
import { SectionHeader } from '../components/SectionHeader'
import { SegmentedGauge } from '../components/SegmentedGauge'
import { formatPercent, formatPlain, toneLabel, toneMeta, toneOf } from '../lib/format'
import { clima } from '../lib/clima'
import { reportDefinitions } from '../lib/reports'

export function HomePage() {
  const { global } = clima
  const favorableUnits = global.ranking_unidades.filter((unit) => unit.resultado >= 80).length
  const heroTone = toneOf(global.resultado_global)
  const heroMeta = toneMeta[heroTone]

  return (
    <AppShell>
      <div className="grid min-w-0 gap-[14px] xl:grid-cols-[1.06fr_1fr]">
        <Card className="flex min-w-0 flex-col gap-5 p-6 lg:p-7" animationDelay={0}>
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-[0.02em] text-teal">Encuesta Pulso de Clima · Semestre 1 · 2026</p>
            <h1 className="mt-2.5 max-w-[24ch] font-display text-[clamp(24px,2.5vw,32px)] font-bold leading-[1.14] tracking-[-0.026em] text-navy-ink">Clima organizacional del Grupo Emaresa</h1>
          </div>
          <div className="flex flex-wrap items-center gap-7">
            <SegmentedGauge value={global.resultado_global} label="Global" />
            <div className="min-w-[190px] flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold" style={{ color: heroMeta.text, backgroundColor: heroMeta.background }}><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: heroMeta.dot }} />{toneLabel[heroTone]}</span>
              <p className="mt-3.5 max-w-[46ch] text-[13.5px] leading-[1.65] text-ink-soft">Una lectura ejecutiva del pulso de clima, con navegación desde la compañía hasta la división legal disponible.</p>
              <div className="mt-[18px] flex flex-wrap gap-5 border-t border-line-soft pt-4">
                <HeroStat value={formatPercent(global.participacion)} label="participación" />
                <HeroStat value={`${formatPlain(global.respondidas)} / ${formatPlain(global.enviadas)}`} label="respuestas" />
                <HeroStat value={`${favorableUnits} / ${global.ranking_unidades.length}`} label="unidades favorables" />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-[14px]">
          <KpiCard label="Gestión Corporativa" value={global.resultado_gestion_corporativa} detail="Indicador separado" sparkline={[74, 78, 79, 80, 79, global.resultado_gestion_corporativa]} icon="bars" rows={[{ label: 'Resultado clima', value: formatPercent(global.resultado_global) }, { label: 'Diferencia', value: formatPercent(global.resultado_gestion_corporativa - global.resultado_global) }, { label: 'Fuente', value: 'Informe corporativo' }]} explanation="Percepción de la gestión de la organización, mostrada fuera del resultado de clima global." />
          <KpiCard label="Participación" value={global.participacion} detail={`${formatPlain(global.respondidas)} de ${formatPlain(global.enviadas)} respuestas`} sparkline={[70, 74, 78, 82, 84, global.participacion]} icon="people" rows={[{ label: 'Respondidas', value: formatPlain(global.respondidas) }, { label: 'Enviadas', value: formatPlain(global.enviadas) }, { label: 'Cobertura', value: 'Grupo Emaresa' }]} explanation="Porcentaje de personas que respondieron la encuesta respecto del universo invitado." />
          <KpiCard label="Unidades de negocio" value={global.ranking_unidades.length} detail="Con resultado agregado" asPercent={false} neutral sparkline={[11, 12, 13, 14, 15]} icon="unit" rows={[{ label: 'Unidades', value: formatPlain(global.ranking_unidades.length) }, { label: 'Favorables', value: `${favorableUnits} unidades` }, { label: 'Nivel siguiente', value: 'División legal' }]} explanation="Unidades de negocio con resultado disponible en el dataset de clima." />
          <KpiCard label="Categorías medidas" value={global.categorias.length} detail="Lectura temática" asPercent={false} neutral sparkline={[3, 4, 4, 5, 5]} icon="layer" rows={global.categorias.map((category) => ({ label: category.categoria, value: formatPercent(category.resultado) }))} explanation="Categorías que componen el resultado de clima organizacional." />
        </div>
      </div>

      <div className="grid min-w-0 gap-[14px] xl:grid-cols-[1fr_1.04fr]">
        <CategoryBars categorias={global.categorias} />
        <QuestionList title="Preguntas mejor evaluadas" preguntas={global.top5} alternatePreguntas={global.bottom5} alternateTitle="Preguntas con mayor oportunidad" />
      </div>

      <Card className="p-[22px]" animationDelay={200}>
        <SectionHeader title="Informes listos para envío" subtitle="PDF originales · Semestre 1 · 2026" chip={<span className="rounded-full bg-surface-muted px-3 py-1.5 text-[11px] font-medium text-ink-soft">Descarga directa</span>} />
        <div className="mt-[18px] grid gap-[10px] lg:grid-cols-2">
          <ReportCard report={reportDefinitions.corporate} />
          <ReportCard report={reportDefinitions.aj} />
        </div>
      </Card>
    </AppShell>
  )
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return <div><span className="block font-display text-xl font-bold tracking-[-0.026em] tabular-nums text-navy-ink">{value}</span><span className="mt-1 block text-[11.5px] text-ink-faint">{label}</span></div>
}
