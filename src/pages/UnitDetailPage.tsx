import { Link, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { ActionPlanSuggestions } from '../components/ActionPlanSuggestions'
import { Card } from '../components/Card'
import { CategoryBars } from '../components/CategoryBars'
import { Icon } from '../components/IconSprite'
import { KpiCard } from '../components/KpiCard'
import { QuestionList } from '../components/QuestionList'
import { SectionHeader } from '../components/SectionHeader'
import { SegmentedGauge } from '../components/SegmentedGauge'
import { StatusPill } from '../components/StatusPill'
import { divisionPath, findUnit } from '../lib/clima'
import { formatParticipation, formatPercent, formatPlain, resultTone } from '../lib/format'
import { unitReportFile, unitReportUrl } from '../lib/reports'
import { getResponseDistribution, getResponseDistributionPeriod, getResponseDistributionSource } from '../lib/responseDistribution'

export function UnitDetailPage() {
  const { nombre } = useParams()
  const unidad = findUnit(nombre)

  if (!unidad) {
    return (
      <AppShell>
        <Card className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Unidad no encontrada</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-navy-ink">No existe una unidad para esta ruta</h1>
          <Link to="/" className="mt-6 inline-flex rounded-[14px] bg-navy px-4 py-3 text-sm font-bold text-white hover:bg-teal">Volver al resumen</Link>
        </Card>
      </AppShell>
    )
  }

  const reportFile = unitReportFile(unidad.unidad)
  const tone = resultTone(unidad.resultado_global)
  const responseDistribution = getResponseDistribution(unidad.unidad)
  const distributionPeriod = getResponseDistributionPeriod()
  const distributionSource = getResponseDistributionSource()
  const divisionSummary = unidad.divisiones.length === 1
    ? '1 división legal disponible'
    : `${unidad.divisiones.length} divisiones legales disponibles`

  return (
    <AppShell activeUnit={unidad.unidad}>
      <Card className="grid min-w-0 gap-7 p-6 lg:grid-cols-[1.06fr_1fr] lg:p-7">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-[0.02em] text-teal">Unidad de negocio · Semestre 1 · 2026</p>
          <h1 className="mt-2.5 break-words font-display text-[clamp(24px,2.5vw,32px)] font-bold leading-[1.14] tracking-[-0.026em] text-navy-ink">{unidad.unidad}</h1>
          <p className="mt-3 max-w-[48ch] text-[13.5px] leading-[1.65] text-ink-soft">Resultado de clima con {divisionSummary}.</p>
          <a href={unitReportUrl(unidad.unidad)} download={reportFile} className="mt-5 inline-flex items-center gap-2.5 rounded-xl bg-navy px-4 py-2.5 text-[12.5px] font-bold text-white transition hover:bg-teal"><Icon name="doc" className="h-[15px] w-[15px]" />Generar informe de clima</a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-7 rounded-2xl bg-surface-sunken p-5 sm:justify-start">
          <SegmentedGauge value={unidad.resultado_global} label="Resultado de la unidad" />
          <div><StatusPill tone={tone} /><p className="mt-3 max-w-[22ch] text-[13px] leading-6 text-ink-soft">El resultado global excluye el indicador separado de Gestión Corporativa.</p></div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-[14px] xl:grid-cols-4">
        <KpiCard
          label="Gestión Corporativa"
          value={unidad.resultado_gestion_corporativa}
          detail="Indicador separado"
          icon="bars"
          sparkline={[78, 82, 84, 88, 89, unidad.resultado_gestion_corporativa]}
          rows={[
            { label: 'Clima de la unidad', value: formatPercent(unidad.resultado_global) },
            { label: 'Diferencia', value: formatPercent(unidad.resultado_gestion_corporativa - unidad.resultado_global) },
            { label: 'Periodo', value: 'S1 - 2026' },
          ]}
          explanation="Percepción de la gestión corporativa reportada para esta unidad."
        />
        <KpiCard
          label="Participación"
          value={unidad.participacion}
          detail={`${formatPlain(unidad.respondidas)} de ${formatPlain(unidad.enviadas)} respuestas`}
          icon="people"
          sparkline={[70, 74, 79, 82, 85, unidad.participacion]}
          rows={[
            { label: 'Respondidas', value: formatPlain(unidad.respondidas) },
            { label: 'Enviadas', value: formatPlain(unidad.enviadas) },
            { label: 'Cobertura', value: unidad.unidad },
          ]}
          explanation="Cobertura de respuestas de la unidad respecto del universo invitado."
        />
        <KpiCard
          label="Respuestas neutrales"
          value={responseDistribution.neutrales ?? '—'}
          detail={responseDistribution.neutrales === undefined ? 'No disponible en snapshot' : 'Ni de acuerdo ni en desacuerdo'}
          neutral
          icon="people"
          sparkline={responseDistribution.neutrales === undefined ? [] : [12, 11, 10, responseDistribution.neutrales]}
          rows={[
            { label: 'Definición', value: 'Ni de acuerdo ni en desacuerdo' },
            { label: 'Fuente', value: responseDistribution.neutrales === undefined ? 'No informada' : distributionSource },
            { label: 'Periodo', value: distributionPeriod },
          ]}
          explanation="Porcentaje de respuestas neutrales informado por la fuente oficial. Si no aparece una cifra, debe incorporarse en la próxima carga de datos."
        />
        <KpiCard
          label="Respuestas detractoras"
          value={responseDistribution.detractores ?? '—'}
          detail={responseDistribution.detractores === undefined ? 'No disponible en snapshot' : 'En desacuerdo o totalmente en desacuerdo'}
          neutral
          icon="bars"
          sparkline={responseDistribution.detractores === undefined ? [] : [5, 4, 4, responseDistribution.detractores]}
          rows={[
            { label: 'Definición', value: 'En desacuerdo o totalmente en desacuerdo' },
            { label: 'Fuente', value: responseDistribution.detractores === undefined ? 'No informada' : distributionSource },
            { label: 'Periodo', value: distributionPeriod },
          ]}
          explanation="Porcentaje de respuestas detractoras informado por la fuente oficial. Si no aparece una cifra, debe incorporarse en la próxima carga de datos."
        />
      </div>

      <div className="grid min-w-0 gap-[14px] xl:grid-cols-[1fr_1.04fr]">
        <CategoryBars categorias={unidad.categorias} />
        <QuestionList title="Preguntas mejor evaluadas" preguntas={unidad.top10} alternatePreguntas={unidad.bottom10} alternateTitle="Preguntas con mayor oportunidad" />
      </div>

      <Card className="min-w-0 p-[22px]">
        <SectionHeader
          title="Divisiones legales"
          subtitle="Abre una razón social para revisar el nivel más pequeño disponible"
          chip={<span className="rounded-full bg-surface-muted px-3 py-1.5 text-[11px] font-medium text-ink-soft">Tercer nivel</span>}
        />
        <div className="mt-[18px] min-w-0 overflow-x-auto">
          <table className="min-w-[620px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line-soft text-[9.5px] font-bold uppercase tracking-[0.15em] text-ink-ghost">
                <th className="px-2.5 pb-2.5">Razón social</th>
                <th className="px-2.5 pb-2.5">Resultado</th>
                <th className="px-2.5 pb-2.5">Participación</th>
                <th className="px-2.5 pb-2.5 text-right">Abrir</th>
              </tr>
            </thead>
            <tbody>
              {unidad.divisiones.map((division) => (
                <tr key={division.nombre} className="group transition hover:bg-surface-sunken">
                  <td className="max-w-[260px] truncate px-2.5 py-3 font-semibold text-ink">{division.nombre}</td>
                  <td className="px-2.5 py-3">
                    <span className="flex items-center gap-2 font-display text-[15px] font-extrabold tabular-nums text-ink">
                      {formatPercent(division.resultado)}
                      <StatusPill tone={resultTone(division.resultado)} />
                    </span>
                  </td>
                  <td className="px-2.5 py-3 text-[12px] text-ink-soft">{formatParticipation(division.respondidos, division.enviados)}</td>
                  <td className="px-2.5 py-3 text-right">
                    <Link to={divisionPath(unidad.unidad, division.nombre)} className="inline-flex h-8 w-8 items-center justify-center rounded-[11px] bg-surface-accent text-teal hover:bg-[#EAF6F7]" aria-label={`Abrir ${division.nombre}`}>
                      <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ActionPlanSuggestions preguntas={unidad.bottom10} />
    </AppShell>
  )
}
