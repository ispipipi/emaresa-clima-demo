import { Link, useParams } from 'react-router-dom'
import { ActionPlanSuggestions } from '../components/ActionPlanSuggestions'
import { CategoryBars } from '../components/CategoryBars'
import { Icon } from '../components/IconSprite'
import { KpiCard, ScoreCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { QuestionList } from '../components/QuestionList'
import { StripPlot } from '../components/StripPlot'
import { Card, Delta, ErrorState, Meter, SectionHeader, StatusChip, btnOutline, btnPrimary } from '../components/ui'
import { clima, divisionPath, findUnit } from '../lib/clima'
import { formatParticipation, formatPercent, formatPlain, toneMeta, toneOf } from '../lib/format'
import { FAVORABLE_THRESHOLD, GROUP_RESULT, unitRows } from '../lib/insights'
import { unitReportsForUnit } from '../lib/reports'
import { getResponseDistribution, getResponseDistributionPeriod, getResponseDistributionSource } from '../lib/responseDistribution'

export function UnitDetailPage() {
  const { nombre } = useParams()
  const unidad = findUnit(nombre)

  if (!unidad) {
    return (
      <ErrorState title="No encontramos esa unidad" actions={<Link to="/" className={btnPrimary}>Volver al resumen</Link>}>
        La dirección no corresponde a una unidad del S1 2026. Revisa el nombre o búscala con el buscador de la barra superior.
      </ErrorState>
    )
  }

  const row = unitRows.find((item) => item.name === unidad.unidad)
  const reports = unitReportsForUnit(unidad.unidad)
  const distribution = getResponseDistribution(unidad.unidad)
  const source = getResponseDistributionSource()
  const period = getResponseDistributionPeriod()
  const tone = toneOf(unidad.resultado_global)
  const noData = (value?: number) => value === undefined
  const missingText = 'Porcentaje informado por la fuente oficial. Si no aparece una cifra, debe incorporarse en la próxima carga de datos.'

  return (
    <>
      <PageHeader
        tone={tone}
        eyebrow={<>
          <span className="inline-flex items-center gap-2"><Icon name="unit" className="h-[17px] w-[17px]" />Unidad de negocio · Semestre 1 · 2026</span>
          {reports.some((report) => report.current) ? <span className="inline-flex h-7 items-center rounded-full bg-fav-soft px-3 text-[12px] font-bold text-fav-ink">Informe S2 2026 disponible</span> : null}
        </>}
        title={unidad.unidad}
        subtitle={`${formatPlain(unidad.enviadas)} personas invitadas · ${unidad.divisiones.length === 1 ? '1 división legal' : `${unidad.divisiones.length} divisiones legales`}`}
        actions={
          <>
            {reports.map((report, index) => (
              <a key={report.id} href={`${import.meta.env.BASE_URL}reportes/unidades/${report.file}`} download={report.file} title={report.description} className={index === 0 ? `${btnPrimary} h-[46px]` : `${btnOutline} h-[46px]`}>
                <Icon name="down" className="h-[19px] w-[19px]" />
                {index === 0 ? `Descargar ${report.label}` : report.label}
                <span className="border-l border-current pl-2.5 text-xs font-semibold opacity-80">PDF</span>
              </a>
            ))}
            <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('mentat:open'))} className={`${btnOutline} h-[46px]`}>
              <Icon name="spark" className="h-[18px] w-[18px] text-brand-deep" />Preguntar a Mentat sobre {unidad.unidad}
            </button>
          </>
        }
        aside={
          <ScoreCard
            title="Resultado de la unidad"
            value={unidad.resultado_global}
            comparisons={[
              { label: `vs. Grupo (${formatPercent(GROUP_RESULT)})`, value: <Delta value={unidad.resultado_global - GROUP_RESULT} /> },
              { label: 'vs. Favorable (80)', value: <Delta value={unidad.resultado_global - FAVORABLE_THRESHOLD} /> },
              { label: 'Puesto', value: `${row?.rank ?? '—'} de ${unitRows.length}` },
            ]}
            explanation={`Resultado de clima de ${unidad.unidad} en el semestre 1 de 2026.`}
            rows={[
              { label: 'Resultado', value: formatPercent(unidad.resultado_global) },
              { label: 'Grupo', value: formatPercent(GROUP_RESULT) },
              { label: 'Divisiones', value: formatPlain(unidad.divisiones.length) },
            ]}
          />
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Gestión Corporativa"
          value={unidad.resultado_gestion_corporativa}
          detail="Indicador separado del clima"
          icon="bars"
          delta={<Delta value={unidad.resultado_gestion_corporativa - unidad.resultado_global} suffix=" pts sobre el clima de la unidad" />}
          rows={[
            { label: 'Clima de la unidad', value: formatPercent(unidad.resultado_global) },
            { label: 'Diferencia', value: `${formatPlain(Math.round((unidad.resultado_gestion_corporativa - unidad.resultado_global) * 10) / 10)} pts` },
            { label: 'Período', value: 'S1 · 2026' },
          ]}
          explanation="Percepción de la gestión corporativa reportada para esta unidad."
        />
        <KpiCard
          label="Participación"
          value={unidad.participacion}
          detail={`${formatPlain(unidad.respondidas)} de ${formatPlain(unidad.enviadas)} respuestas`}
          icon="people"
          delta={<Delta value={unidad.participacion - clima.global.participacion} suffix=" pts vs. Grupo" />}
          visual={<Meter value={unidad.participacion} color={toneMeta[toneOf(unidad.participacion)].fill} marks />}
          rows={[
            { label: 'Respondidas', value: formatPlain(unidad.respondidas) },
            { label: 'Enviadas', value: formatPlain(unidad.enviadas) },
            { label: 'Cobertura', value: unidad.unidad },
          ]}
          explanation="Cobertura de respuestas de la unidad respecto del universo invitado."
          extra={
            <div>
              <p className="mb-2 text-[13px] font-bold text-ink-soft">Por división legal</p>
              <ul className="flex flex-col gap-2.5">
                {unidad.divisiones.map((division) => (
                  <li key={division.nombre}>
                    <div className="mb-1 flex justify-between gap-2 text-[13px] font-semibold"><span className="truncate">{division.nombre}</span><span className="shrink-0 tabular-nums">{formatPlain(division.respondidos)} de {formatPlain(division.enviados)} · {formatParticipation(division.respondidos, division.enviados)}</span></div>
                    <Meter value={typeof division.respondidos === 'number' && division.enviados > 0 ? (division.respondidos / division.enviados) * 100 : 0} color="var(--brand-mid)" />
                  </li>
                ))}
              </ul>
            </div>
          }
        />
        <KpiCard
          label="Respuestas neutrales"
          value={distribution.neutrales ?? '—'}
          neutral
          chipLabel={noData(distribution.neutrales) ? 'Sin datos' : undefined}
          detail={noData(distribution.neutrales) ? 'No disponible en el snapshot' : 'Ni de acuerdo ni en desacuerdo'}
          icon="people"
          visual={noData(distribution.neutrales) ? <span aria-hidden="true" className="block h-2 rounded-full" style={{ background: 'repeating-linear-gradient(90deg,var(--line-soft) 0 8px,var(--sunken) 8px 16px)' }} /> : <Meter value={distribution.neutrales as number} color="var(--ink-3)" />}
          delta={<span className="text-ink-soft">{noData(distribution.neutrales) ? 'Se incorpora en la próxima carga del informe oficial' : `${source} · ${period}`}</span>}
          rows={[
            { label: 'Definición', value: 'Ni de acuerdo ni en desacuerdo' },
            { label: 'Fuente', value: noData(distribution.neutrales) ? 'No informada' : source },
            { label: 'Período', value: period },
          ]}
          explanation={missingText}
        />
        <KpiCard
          label="Respuestas detractoras"
          value={distribution.detractores ?? '—'}
          neutral
          chipLabel={noData(distribution.detractores) ? 'Sin datos' : undefined}
          detail={noData(distribution.detractores) ? 'No disponible en el snapshot' : 'En desacuerdo o totalmente en desacuerdo'}
          icon="bars"
          visual={noData(distribution.detractores) ? <span aria-hidden="true" className="block h-2 rounded-full" style={{ background: 'repeating-linear-gradient(90deg,var(--line-soft) 0 8px,var(--sunken) 8px 16px)' }} /> : <Meter value={distribution.detractores as number} color="var(--ink-3)" />}
          delta={<span className="text-ink-soft">{noData(distribution.detractores) ? 'Se incorpora en la próxima carga del informe oficial' : `${source} · ${period}`}</span>}
          rows={[
            { label: 'Definición', value: 'En desacuerdo o totalmente en desacuerdo' },
            { label: 'Fuente', value: noData(distribution.detractores) ? 'No informada' : source },
            { label: 'Período', value: period },
          ]}
          explanation={missingText}
        />
      </div>

      <Card className="p-6">
        <SectionHeader title="Frente al Grupo y a las demás unidades" subtitle="Cada punto es una unidad de negocio · S1 2026 · pasa el cursor para ver el nombre" />
        <StripPlot highlight={unidad.unidad} />
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <CategoryBars categorias={unidad.categorias} benchmark={clima.global.categorias} />
        <QuestionList title="Preguntas" subtitle={undefined} preguntas={unidad.top10} alternatePreguntas={unidad.bottom10} />
      </div>

      <Card className="p-6">
        <SectionHeader title="Divisiones legales" subtitle="Abre una razón social para ver el tercer nivel" action={<span className="inline-flex h-[30px] items-center rounded-full bg-sunken px-3 text-[12.5px] font-semibold text-ink-soft">Tercer nivel</span>} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="text-[12.5px] font-bold text-ink-soft">
                <th className="px-3 pb-2.5">Razón social</th><th className="px-3 pb-2.5">Resultado</th><th className="px-3 pb-2.5">vs. unidad</th><th className="px-3 pb-2.5">Participación</th><th className="px-3 pb-2.5 text-right">Abrir</th>
              </tr>
            </thead>
            <tbody>
              {unidad.divisiones.map((division) => {
                const value = typeof division.resultado === 'number' ? division.resultado : undefined
                return (
                  <tr key={division.nombre} className="border-t border-line-soft transition hover:bg-brand-wash">
                    <td className="max-w-[300px] px-3 py-3.5 text-sm font-bold leading-5">{division.nombre}</td>
                    <td className="px-3 py-3.5"><span className="flex items-center gap-2.5"><b className="text-lg font-extrabold tabular-nums">{formatPercent(value)}</b><StatusChip tone={toneOf(value)} label={value === undefined ? 'Sin datos' : undefined} size="sm" /></span></td>
                    <td className="px-3 py-3.5 text-[13.5px]">{value === undefined ? <span className="text-ink-soft">—</span> : <Delta value={value - unidad.resultado_global} />}</td>
                    <td className="px-3 py-3.5 text-[13.5px] font-semibold">{formatPlain(division.respondidos)} de {formatPlain(division.enviados)} · {formatParticipation(division.respondidos, division.enviados)}</td>
                    <td className="px-3 py-3.5 text-right"><Link to={divisionPath(unidad.unidad, division.nombre)} aria-label={`Abrir ${division.nombre}`} className="inline-flex h-9 w-9 items-center justify-center rounded-ctl bg-brand-soft text-brand-deep transition hover:bg-brand hover:text-white"><Icon name="go" className="h-[17px] w-[17px]" /></Link></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <ActionPlanSuggestions preguntas={unidad.bottom10} />
    </>
  )
}
