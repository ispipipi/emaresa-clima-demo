import { Link, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Card } from '../components/Card'
import { Icon } from '../components/IconSprite'
import { KpiCard } from '../components/KpiCard'
import { SectionHeader } from '../components/SectionHeader'
import { SegmentedGauge } from '../components/SegmentedGauge'
import { StatusPill } from '../components/StatusPill'
import { clima, divisionPath, findDivision, findUnit } from '../lib/clima'
import { formatParticipation, formatPercent, formatPlain, resultTone } from '../lib/format'

export function DivisionDetailPage() {
  const { nombre, division } = useParams()
  const unidad = findUnit(nombre)
  const divisionData = findDivision(nombre, division)

  if (!unidad || !divisionData) {
    return (
      <AppShell>
        <Card className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">División no encontrada</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-navy-ink">No existe una división para esta ruta</h1>
          <Link to={unidad ? `/unidad/${encodeURIComponent(unidad.unidad)}` : '/'} className="mt-6 inline-flex rounded-[14px] bg-navy px-4 py-3 text-sm font-bold text-white hover:bg-teal">
            Volver al nivel anterior
          </Link>
        </Card>
      </AppShell>
    )
  }

  const participation = typeof divisionData.respondidos === 'number' && divisionData.enviados > 0
    ? (divisionData.respondidos / divisionData.enviados) * 100
    : '-'
  const unitRank = clima.global.ranking_unidades.findIndex((item) => item.unidad === unidad.unidad) + 1

  return (
    <AppShell activeUnit={unidad.unidad} activeDivision={divisionData.nombre}>
      <Card className="grid min-w-0 gap-7 p-6 lg:grid-cols-[1.06fr_1fr] lg:p-7">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-[0.02em] text-teal">División legal · Tercer nivel</p>
          <h1 className="mt-2.5 max-w-[30ch] break-words font-display text-[clamp(24px,2.5vw,32px)] font-bold leading-[1.14] tracking-[-0.026em] text-navy-ink">{divisionData.nombre}</h1>
          <p className="mt-3 max-w-[48ch] text-[13.5px] leading-[1.65] text-ink-soft">
            Unidad de negocio: <span className="font-semibold text-ink">{unidad.unidad}</span>. Este es el nivel más pequeño informado para esta entrega.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-7 rounded-2xl bg-surface-sunken p-5 sm:justify-start">
          <SegmentedGauge value={divisionData.resultado} label="Resultado de la división" />
          <div>
            <StatusPill tone={resultTone(divisionData.resultado)} />
            <p className="mt-3 max-w-[22ch] text-[13px] leading-6 text-ink-soft">La entrega no trae categorías ni preguntas a este nivel.</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-[14px] xl:grid-cols-4">
        <KpiCard
          label="Participación"
          value={participation}
          detail={`${formatPlain(divisionData.respondidos)} de ${formatPlain(divisionData.enviados)} respuestas`}
          icon="people"
          sparkline={[60, 68, 72, typeof participation === 'number' ? participation : 0]}
          rows={[{ label: 'Respondidas', value: formatPlain(divisionData.respondidos) }, { label: 'Enviadas', value: formatPlain(divisionData.enviados) }, { label: 'Nivel', value: 'División legal' }]}
          explanation="Cobertura de respuestas de la división respecto del universo invitado."
        />
        <KpiCard
          label="Respuestas"
          value={divisionData.respondidos}
          detail={`de ${formatPlain(divisionData.enviados)} enviadas`}
          asPercent={false}
          neutral
          icon="bars"
          sparkline={[0, typeof divisionData.respondidos === 'number' ? divisionData.respondidos : 0]}
          rows={[{ label: 'Respondidas', value: formatPlain(divisionData.respondidos) }, { label: 'Enviadas', value: formatPlain(divisionData.enviados) }, { label: 'Resultado', value: formatPercent(divisionData.resultado) }]}
          explanation="Cantidad de respuestas disponibles para esta división legal."
        />
        <KpiCard
          label="Resultado de la unidad"
          value={unidad.resultado_global}
          detail={unidad.unidad}
          icon="unit"
          sparkline={[unidad.resultado_global - 4, unidad.resultado_global - 2, unidad.resultado_global]}
          rows={[{ label: 'Unidad', value: unidad.unidad }, { label: 'Resultado', value: formatPercent(unidad.resultado_global) }, { label: 'Posición', value: `#${unitRank}` }]}
          explanation="Resultado de clima de la unidad de negocio que contiene esta división."
        />
        <KpiCard
          label="Resultado del grupo"
          value={clima.global.resultado_global}
          detail="Grupo Emaresa"
          icon="grid"
          sparkline={[75, 77, 78, clima.global.resultado_global]}
          rows={[{ label: 'Grupo', value: 'Grupo Emaresa' }, { label: 'Resultado', value: formatPercent(clima.global.resultado_global) }, { label: 'Nivel', value: 'Grupo' }]}
          explanation="Resultado global consolidado para comparar esta división con el grupo."
        />
      </div>

      <Card className="min-w-0 p-[22px]">
        <SectionHeader title="Divisiones hermanas" subtitle="Navega entre las razones sociales de la unidad" />
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
              {unidad.divisiones.map((item) => (
                <tr key={item.nombre} className="transition hover:bg-surface-sunken">
                  <td className="max-w-[300px] truncate px-2.5 py-3 font-semibold text-ink">{item.nombre}</td>
                  <td className="px-2.5 py-3">
                    <span className="flex items-center gap-2 font-display text-[15px] font-extrabold tabular-nums text-ink">
                      {formatPercent(item.resultado)}
                      <StatusPill tone={resultTone(item.resultado)} />
                    </span>
                  </td>
                  <td className="px-2.5 py-3 text-[12px] text-ink-soft">{formatParticipation(item.respondidos, item.enviados)}</td>
                  <td className="px-2.5 py-3 text-right">
                    <Link to={divisionPath(unidad.unidad, item.nombre)} className="inline-flex h-8 w-8 items-center justify-center rounded-[11px] bg-surface-accent text-teal hover:bg-[#EAF6F7]" aria-label={`Abrir ${item.nombre}`}>
                      <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="p-4"><p className="border-l-[3px] border-[#DCE8F4] pl-3 text-[12px] leading-6 text-ink-soft">La entrega S1 2026 no trae categorías ni preguntas para este nivel. La lectura temática vive en la unidad de negocio.</p></Card>
    </AppShell>
  )
}
