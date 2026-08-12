import { Link, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { CategoryBars } from '../components/CategoryBars'
import { KpiCard } from '../components/KpiCard'
import { QuestionList } from '../components/QuestionList'
import { StatusPill } from '../components/StatusPill'
import { divisionPath, findUnit } from '../lib/clima'
import { formatPercent, formatPlain, resultTone } from '../lib/format'
import { reportDefinitions, reportUrl } from '../lib/reports'

export function UnitDetailPage() {
  const { nombre } = useParams()
  const unidad = findUnit(nombre)

  if (!unidad) {
    return (
      <AppShell>
        <section className="border-t border-emaresa-line pt-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Unidad no encontrada</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-emaresa-text">No existe una unidad para esta ruta</h1>
          <Link to="/" className="mt-6 inline-flex rounded-lg bg-emaresa-navy px-4 py-2.5 text-sm font-bold text-white hover:bg-emaresa-blue">
            Volver al resumen
          </Link>
        </section>
      </AppShell>
    )
  }

  const hasAttachedReport = unidad.unidad === 'A&J'

  return (
    <AppShell activeUnit={unidad.unidad}>
      <section className="border-b border-emaresa-line pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emaresa-muted">
          <Link to="/" className="hover:text-emaresa-blue">Grupo Emaresa</Link>
          <span aria-hidden="true">/</span>
          <span className="text-emaresa-blue">{unidad.unidad}</span>
        </div>
        <div className="mt-6 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-emaresa-blue">Unidad de negocio</p>
            <h1 className="mt-3 max-w-3xl break-words font-display text-4xl font-extrabold tracking-tight text-emaresa-text sm:text-5xl">{unidad.unidad}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-emaresa-muted">
              Resultado de clima con {unidad.divisiones.length} división{unidad.divisiones.length === 1 ? '' : 'es'} legal{unidad.divisiones.length === 1 ? '' : 'es'} disponible{unidad.divisiones.length === 1 ? '' : 's'}.
            </p>
          </div>
          <div className="border-l-2 border-emaresa-gold pl-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-muted">Resultado de la unidad</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="font-display text-5xl font-extrabold tracking-tight text-emaresa-text">{formatPercent(unidad.resultado_global)}</span>
              <StatusPill tone={resultTone(unidad.resultado_global)} />
            </div>
            {hasAttachedReport ? (
              <a href={reportUrl(reportDefinitions.aj.file)} download={reportDefinitions.aj.file} className="mt-4 inline-flex text-sm font-bold text-emaresa-blue hover:text-emaresa-navy">
                Descargar informe PDF -&gt;
              </a>
            ) : (
              <p className="mt-3 text-sm text-emaresa-muted">Sin PDF específico en esta entrega</p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-9">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Lectura rápida</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">Indicadores de la unidad</h2>
          </div>
          <p className="hidden text-sm text-emaresa-muted sm:block">Selecciona un indicador para ver el detalle</p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <KpiCard
            label="Resultado de la unidad"
            value={unidad.resultado_global}
            detail="Clima organizacional"
            explanation="Resultado agregado de las preguntas de clima para esta unidad de negocio."
            rows={[
              { label: 'Gestión Corporativa', value: formatPercent(unidad.resultado_gestion_corporativa) },
              { label: 'Divisiones', value: String(unidad.divisiones.length) },
              { label: 'Estado', value: resultTone(unidad.resultado_global) === 'green' ? 'Favorable' : 'Revisar' },
            ]}
          />
          <KpiCard
            label="Gestión Corporativa"
            value={unidad.resultado_gestion_corporativa}
            detail="Indicador mostrado por separado"
            explanation="Percepción de la gestión corporativa reportada para esta unidad."
            rows={[
              { label: 'Clima unidad', value: formatPercent(unidad.resultado_global) },
              { label: 'Diferencia', value: formatPercent(unidad.resultado_gestion_corporativa - unidad.resultado_global) },
              { label: 'Periodo', value: 'S1 - 2026' },
            ]}
          />
          <KpiCard
            label="Participación"
            value={unidad.participacion}
            detail={`${unidad.respondidas} respuestas de ${unidad.enviadas} enviadas`}
            explanation="Cobertura de respuestas de la unidad respecto del universo invitado."
            rows={[
              { label: 'Respondidas', value: formatPlain(unidad.respondidas) },
              { label: 'Enviadas', value: formatPlain(unidad.enviadas) },
              { label: 'División siguiente', value: 'Razón social' },
            ]}
          />
        </div>
      </section>

      <div className="mt-10 grid min-w-0 items-start gap-10 xl:grid-cols-[1fr_0.9fr]">
        <CategoryBars categorias={unidad.categorias} />

        <section className="min-w-0 border-t border-emaresa-line pt-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Tercer nivel</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">Divisiones legales</h2>
            <p className="mt-3 text-sm leading-6 text-emaresa-muted">Abre una razón social para revisar su resultado y participación.</p>
          </div>
          <div className="mt-5 min-w-0 overflow-x-auto border-y border-emaresa-line">
            <table className="min-w-[580px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-emaresa-line text-[11px] uppercase tracking-[0.14em] text-emaresa-muted">
                  <th className="py-3 pr-4 font-bold">Razón social</th>
                  <th className="px-4 py-3 font-bold">Resultado</th>
                  <th className="px-4 py-3 font-bold">Participación</th>
                  <th className="py-3 pl-4 font-bold">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emaresa-line">
                {unidad.divisiones.map((division) => (
                  <tr key={division.nombre} className="transition hover:bg-white/70">
                    <td className="py-4 pr-4 font-bold text-emaresa-text">{division.nombre}</td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2 font-display text-lg font-extrabold text-emaresa-text">
                        {formatPercent(division.resultado)}
                        <StatusPill tone={resultTone(division.resultado)} />
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-emaresa-muted">{formatPlain(division.respondidos)} / {division.enviados}</td>
                    <td className="py-4 pl-4">
                      <Link to={divisionPath(unidad.unidad, division.nombre)} className="text-sm font-bold text-emaresa-blue hover:text-emaresa-navy">
                        Abrir -&gt;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="mt-10 grid gap-10 xl:grid-cols-2">
        <QuestionList title="10 preguntas mejor evaluadas" preguntas={unidad.top10} />
        <QuestionList title="10 preguntas con mayor oportunidad" preguntas={unidad.bottom10} />
      </div>

      <section className="mt-10 border-t border-emaresa-line pt-5 text-sm leading-6 text-emaresa-muted">
        La biblioteca de planes de acción por pregunta estará disponible en la versión de producción.
      </section>
    </AppShell>
  )
}
