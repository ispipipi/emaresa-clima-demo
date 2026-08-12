import { Link, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { CategoryBars } from '../components/CategoryBars'
import { KpiCard } from '../components/KpiCard'
import { QuestionList } from '../components/QuestionList'
import { StatusPill } from '../components/StatusPill'
import { divisionPath, findUnit } from '../lib/clima'
import { reportDefinitions, reportUrl } from '../lib/reports'
import { formatPercent, formatPlain, resultTone } from '../lib/format'

export function UnitDetailPage() {
  const { nombre } = useParams()
  const unidad = findUnit(nombre)

  if (!unidad) {
    return (
      <AppShell>
        <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">Unidad no encontrada</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold">No existe una unidad para esta ruta</h1>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-md bg-emaresa-navy px-4 py-2 text-sm font-bold text-white"
          >
            Volver al resumen
          </Link>
        </section>
      </AppShell>
    )
  }

  const hasAttachedReport = unidad.unidad === 'A&J'

  return (
    <AppShell activeUnit={unidad.unidad}>
      <section className="border-b border-slate-200 pb-7">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <Link to="/" className="hover:text-emaresa-blue">Grupo Emaresa</Link>
          <span aria-hidden="true">/</span>
          <span className="text-emaresa-blue">{unidad.unidad}</span>
        </div>
        <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">Unidad de negocio</p>
            <h1 className="mt-3 max-w-full break-words whitespace-normal font-display text-4xl font-extrabold sm:text-5xl">{unidad.unidad}</h1>
            <p className="mt-4 min-w-0 max-w-2xl break-words text-base leading-7 text-slate-600">
              Resultado de clima organizacional con {unidad.divisiones.length} división{unidad.divisiones.length === 1 ? '' : 'es'} legales disponibles.
            </p>
          </div>
          {hasAttachedReport ? (
            <a
              href={reportUrl(reportDefinitions.aj.file)}
              download={reportDefinitions.aj.file}
              className="inline-flex w-fit items-center rounded-md bg-emaresa-navy px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emaresa-blue focus:outline-none focus:ring-2 focus:ring-emaresa-gold focus:ring-offset-2"
            >
              Descargar PDF de A&J <span aria-hidden="true" className="ml-2 text-emaresa-gold">-&gt;</span>
            </a>
          ) : (
            <p className="max-w-xs border-l-4 border-slate-300 bg-white px-4 py-3 text-sm leading-5 text-slate-500">
              No hay un PDF adjunto para esta unidad en esta entrega.
            </p>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Resultado de la unidad"
          value={unidad.resultado_global}
          detail="Clima organizacional sin Gestión Corporativa"
        />
        <KpiCard
          label="Gestión Corporativa"
          value={unidad.resultado_gestion_corporativa}
          detail="Indicador mostrado por separado"
        />
        <KpiCard
          label="Participación"
          value={unidad.participacion}
          detail={`${unidad.respondidas} respuestas de ${unidad.enviadas} enviadas`}
        />
      </section>

      <div className="mt-6 grid min-w-0 items-start gap-6 xl:grid-cols-[1fr_0.9fr]">
        <CategoryBars categorias={unidad.categorias} />

        <section className="min-w-0 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">Tercer nivel</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Divisiones legales</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Abre una razón social para revisar su resultado y participación disponibles.
          </p>
          <div className="mt-5 min-w-0 overflow-x-auto">
            <table className="min-w-[580px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-3 pr-4 font-semibold">Razón social</th>
                  <th className="px-4 py-3 font-semibold">Resultado</th>
                  <th className="px-4 py-3 font-semibold">Participación</th>
                  <th className="py-3 pl-4 font-semibold">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {unidad.divisiones.map((division) => (
                  <tr key={division.nombre}>
                    <td className="py-4 pr-4 font-bold text-emaresa-text">{division.nombre}</td>
                    <td className="px-4 py-4 font-bold">
                      <span className="inline-flex items-center gap-2">
                        {formatPercent(division.resultado)}
                        <StatusPill tone={resultTone(division.resultado)} />
                      </span>
                    </td>
                    <td className="px-4 py-4">{formatPlain(division.respondidos)} / {division.enviados}</td>
                    <td className="py-4 pl-4">
                      <Link
                        to={divisionPath(unidad.unidad, division.nombre)}
                        className="font-bold text-emaresa-blue hover:text-emaresa-navy"
                      >
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

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <QuestionList title="10 preguntas mejor evaluadas" preguntas={unidad.top10} />
        <QuestionList title="10 preguntas con mayor oportunidad" preguntas={unidad.bottom10} />
      </div>

      <section className="mt-6 border-l-4 border-emaresa-gold bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm ring-1 ring-slate-200 sm:p-6">
        Nota: La biblioteca de planes de acción por pregunta estará disponible en la versión de producción.
      </section>
    </AppShell>
  )
}
