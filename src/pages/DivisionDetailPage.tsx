import { Link, useParams } from 'react-router-dom'
import { DivisionCompare } from '../components/DivisionCompare'
import { Icon } from '../components/IconSprite'
import { KpiCard, ScoreCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { Card, Delta, EmptyState, ErrorState, Meter, StatusChip, btnBrandOutline, btnOutline, btnPrimary } from '../components/ui'
import { clima, findDivision, findUnit, unitPath } from '../lib/clima'
import { formatPercent, formatPlain, toneMeta, toneOf } from '../lib/format'
import { FAVORABLE_THRESHOLD, GROUP_RESULT, unitRows } from '../lib/insights'
import { unitReportsForUnit } from '../lib/reports'

export function DivisionDetailPage() {
  const { nombre, division } = useParams()
  const unidad = findUnit(nombre)
  const data = findDivision(nombre, division)

  if (!unidad || !data) {
    return (
      <ErrorState title="No encontramos esa división" actions={<Link to={unidad ? unitPath(unidad.unidad) : '/'} className={btnPrimary}>Volver al nivel anterior</Link>}>
        La dirección no corresponde a una división legal del S1 2026.
      </ErrorState>
    )
  }

  const result = typeof data.resultado === 'number' ? data.resultado : undefined
  const tone = toneOf(result)
  const participation = typeof data.respondidos === 'number' && data.enviados > 0 ? (data.respondidos / data.enviados) * 100 : undefined
  const siblings = [...unidad.divisiones].sort((a, b) => (typeof b.resultado === 'number' ? b.resultado : -1) - (typeof a.resultado === 'number' ? a.resultado : -1))
  const unitRank = unitRows.find((item) => item.name === unidad.unidad)?.rank
  const report = unitReportsForUnit(unidad.unidad)[0]

  return (
    <>
      <PageHeader
        tone={tone}
        chipLabel={result === undefined ? 'Sin datos' : undefined}
        eyebrow={<span className="inline-flex items-center gap-2"><Icon name="layer" className="h-[17px] w-[17px]" />División legal · Tercer nivel · Semestre 1 · 2026</span>}
        title={data.nombre}
        subtitle={<>Unidad <Link to={unitPath(unidad.unidad)} className="font-bold text-brand-deep hover:underline">{unidad.unidad}</Link> · {formatPlain(data.enviados)} personas invitadas · {formatPlain(data.respondidos)} respondieron</>}
        actions={
          <>
            <a href={`${import.meta.env.BASE_URL}reportes/unidades/${report.file}`} download={report.file} className={`${btnPrimary} h-[46px]`}>
              <Icon name="down" className="h-[19px] w-[19px]" />Descargar informe de {unidad.unidad}<span className="border-l border-white/45 pl-2.5 text-xs font-semibold">PDF</span>
            </a>
            <Link to={unitPath(unidad.unidad)} className={`${btnOutline} h-[46px]`}><Icon name="back" className="h-[17px] w-[17px]" />Volver a {unidad.unidad}</Link>
          </>
        }
        aside={
          result !== undefined ? (
            <ScoreCard
              title="Resultado de la división"
              value={result}
              comparisons={[
                { label: `vs. unidad ${unidad.unidad} (${formatPercent(unidad.resultado_global)})`, value: <Delta value={result - unidad.resultado_global} /> },
                { label: `vs. Grupo (${formatPercent(GROUP_RESULT)})`, value: <Delta value={result - GROUP_RESULT} /> },
                { label: 'Puesto en la unidad', value: `${siblings.findIndex((item) => item.nombre === data.nombre) + 1} de ${siblings.length}` },
              ]}
              explanation="Resultado de clima de la división legal. Esta entrega informa resultado y participación en este nivel."
              rows={[
                { label: 'Resultado', value: formatPercent(result) },
                { label: 'Unidad', value: formatPercent(unidad.resultado_global) },
                { label: 'Umbral Favorable', value: `${FAVORABLE_THRESHOLD}%` },
              ]}
            />
          ) : (
            <Card className="flex items-center gap-4 p-5">
              <span className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full border-[10px] border-dashed border-line text-2xl font-extrabold text-ink-faint">—</span>
              <div><StatusChip tone="neutral" label="Sin datos" /><p className="mt-2 text-sm leading-5 text-ink-soft">Sin respuestas informadas: el resultado no se calcula ni se compara. El resultado de la unidad no incluye esta división.</p></div>
            </Card>
          )
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Participación"
          value={participation ?? '—'}
          chipLabel={participation === undefined ? 'Sin datos' : undefined}
          neutral={participation === undefined}
          detail={participation === undefined ? 'Sin respuestas informadas' : `${formatPlain(data.respondidos)} de ${formatPlain(data.enviados)} respuestas`}
          icon="people"
          delta={participation === undefined ? undefined : <Delta value={participation - clima.global.participacion} suffix=" pts vs. Grupo" />}
          visual={participation === undefined ? undefined : <Meter value={participation} color={toneMeta[toneOf(participation)].fill} marks />}
          rows={[{ label: 'Respondidas', value: formatPlain(data.respondidos) }, { label: 'Enviadas', value: formatPlain(data.enviados) }, { label: 'Nivel', value: 'División legal' }]}
          explanation="Cobertura de respuestas de la división respecto del universo invitado."
        />
        <KpiCard
          label="Respuestas"
          value={typeof data.respondidos === 'number' ? data.respondidos : '—'}
          asPercent={false}
          neutral
          detail={`de ${formatPlain(data.enviados)} personas invitadas`}
          icon="bars"
          visual={<span aria-hidden="true" className="flex gap-1">{Array.from({ length: Math.min(data.enviados, 12) }, (_, index) => <span key={index} className="h-2.5 flex-1 rounded-full" style={{ background: typeof data.respondidos === 'number' && index < data.respondidos ? 'var(--brand-mid)' : 'var(--sunken)', boxShadow: typeof data.respondidos === 'number' && index < data.respondidos ? undefined : 'inset 0 0 0 1.5px var(--line)' }} />)}</span>}
          rows={[{ label: 'Respondidas', value: formatPlain(data.respondidos) }, { label: 'Enviadas', value: formatPlain(data.enviados) }, { label: 'Resultado', value: formatPercent(result) }]}
          explanation="Cantidad de respuestas disponibles para esta división legal."
        />
        <KpiCard
          label="Resultado de la unidad"
          value={unidad.resultado_global}
          detail={`${unidad.unidad} · puesto ${unitRank ?? '—'} de ${unitRows.length}`}
          icon="unit"
          visual={<Meter value={unidad.resultado_global} color={toneMeta[toneOf(unidad.resultado_global)].fill} marks />}
          rows={[{ label: 'Unidad', value: unidad.unidad }, { label: 'Resultado', value: formatPercent(unidad.resultado_global) }, { label: 'Posición', value: `#${unitRank ?? '—'}` }]}
          explanation="Resultado de clima de la unidad de negocio que contiene esta división."
        />
        <KpiCard
          label="Resultado del Grupo"
          value={GROUP_RESULT}
          detail="Grupo Emaresa"
          icon="grid"
          visual={<Meter value={GROUP_RESULT} color={toneMeta[toneOf(GROUP_RESULT)].fill} marks />}
          rows={[{ label: 'Grupo', value: 'Grupo Emaresa' }, { label: 'Resultado', value: formatPercent(GROUP_RESULT) }, { label: 'Nivel', value: 'Grupo' }]}
          explanation="Resultado global consolidado para comparar esta división con el Grupo."
        />
      </div>

      {result === undefined ? null : <DivisionCompare unit={unidad} current={data} />}

      <EmptyState title="Este nivel no trae categorías ni preguntas" action={<Link to={unitPath(unidad.unidad)} className={btnBrandOutline}>Ver categorías y preguntas de {unidad.unidad}<Icon name="go" className="h-[17px] w-[17px]" /></Link>}>
        La entrega S1 2026 informa resultado y participación por división. La lectura temática está en la unidad de negocio.
      </EmptyState>
    </>
  )
}
