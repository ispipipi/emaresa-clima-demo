import { Link, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { KpiCard } from '../components/KpiCard'
import { StatusPill } from '../components/StatusPill'
import { findDivision, findUnit } from '../lib/clima'
import { formatPercent, formatPlain, resultTone } from '../lib/format'
import { reportDefinitions, reportUrl } from '../lib/reports'

export function DivisionDetailPage() {
  const { nombre, division } = useParams()
  const unidad = findUnit(nombre)
  const divisionData = findDivision(nombre, division)

  if (!unidad || !divisionData) {
    return (
      <AppShell>
        <section className="border-t border-emaresa-line pt-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">División no encontrada</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-emaresa-text">No existe una división para esta ruta</h1>
          <Link to={unidad ? `/unidad/${encodeURIComponent(unidad.unidad)}` : '/'} className="mt-6 inline-flex rounded-lg bg-emaresa-navy px-4 py-2.5 text-sm font-bold text-white hover:bg-emaresa-blue">
            Volver al nivel anterior
          </Link>
        </section>
      </AppShell>
    )
  }

  const parentReport = unidad.unidad === 'A&J' ? reportDefinitions.aj : undefined
  const participation = typeof divisionData.respondidos === 'number' ? (divisionData.respondidos / divisionData.enviados) * 100 : '-'

  return (
    <AppShell activeUnit={unidad.unidad} activeDivision={divisionData.nombre}>
      <section className="border-b border-emaresa-line pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emaresa-muted">
          <Link to="/" className="hover:text-emaresa-blue">Grupo Emaresa</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/unidad/${encodeURIComponent(unidad.unidad)}`} className="hover:text-emaresa-blue">{unidad.unidad}</Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-[min(55vw,520px)] truncate text-emaresa-blue">{divisionData.nombre}</span>
        </div>
        <div className="mt-6 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-emaresa-blue">División legal</p>
            <h1 className="mt-3 max-w-3xl break-words font-display text-3xl font-extrabold tracking-tight text-emaresa-text sm:text-4xl">{divisionData.nombre}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-emaresa-muted">Unidad de negocio: <span className="font-bold text-emaresa-text">{unidad.unidad}</span>. Este es el nivel más pequeño disponible en el dataset entregado.</p>
          </div>
          <div className="border-l-2 border-emaresa-gold pl-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-muted">Resultado de la división</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="font-display text-5xl font-extrabold tracking-tight text-emaresa-text">{formatPercent(divisionData.resultado)}</span>
              <StatusPill tone={resultTone(divisionData.resultado)} />
            </div>
            {parentReport && <a href={reportUrl(parentReport.file)} download={parentReport.file} className="mt-4 inline-flex text-sm font-bold text-emaresa-blue hover:text-emaresa-navy">Descargar PDF de la unidad -&gt;</a>}
          </div>
        </div>
      </section>

      <section className="mt-9">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Lectura rápida</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">Indicadores de la división</h2>
          </div>
          <p className="hidden text-sm text-emaresa-muted sm:block">Selecciona un indicador para ver el detalle</p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <KpiCard
            label="Resultado"
            value={divisionData.resultado}
            detail="Resultado reportado para esta división"
            explanation="Resultado de clima disponible para la razón social seleccionada."
            rows={[
              { label: 'Unidad', value: unidad.unidad },
              { label: 'Respondidas', value: formatPlain(divisionData.respondidos) },
              { label: 'Enviadas', value: formatPlain(divisionData.enviados) },
            ]}
          />
          <KpiCard
            label="Participación"
            value={participation}
            detail={`${formatPlain(divisionData.respondidos)} respuestas de ${divisionData.enviados} enviadas`}
            explanation="Cobertura de respuestas de la división respecto del universo invitado."
            rows={[
              { label: 'Respondidas', value: formatPlain(divisionData.respondidos) },
              { label: 'Enviadas', value: formatPlain(divisionData.enviados) },
              { label: 'Nivel', value: 'División legal' },
            ]}
          />
          <KpiCard
            label="Nivel de reporte"
            value="3"
            detail="Grupo → unidad → división legal"
            asPercent={false}
            neutral
            explanation="Esta vista representa el tercer nivel del drill-down disponible en el reporte."
            rows={[
              { label: 'Nivel 1', value: 'Grupo Emaresa' },
              { label: 'Nivel 2', value: unidad.unidad },
              { label: 'Nivel 3', value: 'Razón social' },
            ]}
          />
        </div>
      </section>

      <section className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.75fr]">
        <section className="border-t border-emaresa-line pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Lectura del nivel</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="font-display text-4xl font-extrabold text-emaresa-text">{formatPercent(divisionData.resultado)}</p>
            <StatusPill tone={resultTone(divisionData.resultado)} />
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-emaresa-muted">El dataset contiene para esta división únicamente resultado, personas encuestadas y participación derivada. No se muestran categorías ni preguntas porque no vienen informadas para este nivel.</p>
        </section>

        <section className="border-t border-emaresa-line pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Ruta de navegación</p>
          <p className="mt-4 font-display text-2xl font-extrabold text-emaresa-text">Grupo Emaresa</p>
          <p className="mt-2 text-sm text-emaresa-muted">↓ {unidad.unidad}</p>
          <p className="mt-1 text-sm font-bold text-emaresa-blue">-&gt; {divisionData.nombre}</p>
          <Link to={`/unidad/${encodeURIComponent(unidad.unidad)}`} className="mt-6 inline-flex text-sm font-bold text-emaresa-blue hover:text-emaresa-navy">Volver a la unidad -&gt;</Link>
        </section>
      </section>
    </AppShell>
  )
}
