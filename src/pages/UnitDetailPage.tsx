import { Link, useParams } from 'react-router-dom'
import { CategoryBars } from '../components/CategoryBars'
import { KpiCard } from '../components/KpiCard'
import { QuestionList } from '../components/QuestionList'
import { StatusPill } from '../components/StatusPill'
import { findUnit } from '../lib/clima'
import { formatPercent, formatPlain, resultTone } from '../lib/format'

export function UnitDetailPage() {
  const { nombre } = useParams()
  const unidad = findUnit(nombre)

  if (!unidad) {
    return (
      <main className="min-h-screen bg-emaresa-bg px-4 py-10 text-emaresa-text">
        <section className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold uppercase text-emaresa-blue">
            Unidad no encontrada
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold">
            No existe una unidad para esta ruta
          </h1>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-md bg-emaresa-blue px-4 py-2 text-sm font-semibold text-white"
          >
            Volver al resumen del grupo
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-emaresa-bg px-4 py-6 text-emaresa-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl min-w-0">
        <header className="py-8">
          <Link
            to="/"
            className="inline-flex rounded-md bg-white px-4 py-2 text-sm font-semibold text-emaresa-blue shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            Volver al resumen del grupo
          </Link>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase text-emaresa-blue">
                Unidad de negocio
              </p>
              <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
                {unidad.unidad}
              </h1>
              <p className="mt-3 max-w-[340px] break-words text-base leading-7 text-slate-600 sm:max-w-3xl">
                Participación de {formatPercent(unidad.participacion)} con{' '}
                {unidad.respondidas} respuestas de {unidad.enviadas} encuestas
                enviadas.
              </p>
            </div>

            <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-medium text-slate-500">
                Resultado global
              </p>
              <p className="mt-2 font-display text-5xl font-extrabold">
                {formatPercent(unidad.resultado_global)}
              </p>
              <div className="mt-4">
                <StatusPill tone={resultTone(unidad.resultado_global)} />
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <KpiCard
            label="Resultado de la unidad"
            value={unidad.resultado_global}
            detail="Excluye Gestión corporativa"
          />
          <KpiCard
            label="Gestión corporativa"
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

          <section className="min-w-0 rounded-lg bg-emaresa-card p-5 shadow-sm ring-1 ring-slate-200/80">
            <p className="text-sm font-semibold uppercase text-emaresa-blue">
              Divisiones legales
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold">
              Detalle por división
            </h2>
            <div className="mt-5 min-w-0 overflow-x-auto">
              <table className="min-w-[560px] w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-3 pr-4 font-semibold">Razón social</th>
                    <th className="px-4 py-3 font-semibold">Enviadas</th>
                    <th className="px-4 py-3 font-semibold">Respondidas</th>
                    <th className="py-3 pl-4 font-semibold">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {unidad.divisiones.map((division) => (
                    <tr key={division.nombre}>
                      <td className="py-4 pr-4 font-semibold">
                        {division.nombre}
                      </td>
                      <td className="px-4 py-4">{division.enviados}</td>
                      <td className="px-4 py-4">
                        {formatPlain(division.respondidos)}
                      </td>
                      <td className="py-4 pl-4 font-bold">
                        {formatPercent(division.resultado)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <QuestionList
            title="10 preguntas mejor evaluadas"
            preguntas={unidad.top10}
          />
          <QuestionList
            title="10 preguntas peor evaluadas"
            preguntas={unidad.bottom10}
          />
        </div>

        <section className="mt-6 rounded-lg bg-white p-5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
          Nota: La biblioteca de planes de acción por pregunta estará disponible
          en la versión de producción.
        </section>
      </div>
    </main>
  )
}
