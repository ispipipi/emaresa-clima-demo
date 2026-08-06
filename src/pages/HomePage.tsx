import { useNavigate } from 'react-router-dom'
import { CategoryBars } from '../components/CategoryBars'
import { KpiCard } from '../components/KpiCard'
import { QuestionList } from '../components/QuestionList'
import { StatusPill } from '../components/StatusPill'
import { clima, unitPath } from '../lib/clima'
import { formatPercent, resultTone } from '../lib/format'

export function HomePage() {
  const navigate = useNavigate()
  const { global } = clima

  return (
    <main className="min-h-screen bg-emaresa-bg px-4 py-6 text-emaresa-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl min-w-0">
        <header className="py-8">
          <p className="text-sm font-bold uppercase text-emaresa-blue">
            Grupo Emaresa | Semestre 1 2026
          </p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
                Clima Organizacional
              </h1>
              <p className="mt-3 max-w-[340px] break-words text-base leading-7 text-slate-600 sm:max-w-3xl">
                Resultados consolidados por unidad de negocio para el ciclo
                vigente.
              </p>
            </div>
            <div className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
              Encuestas: {global.respondidas}/{global.enviadas}
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Resultado global"
            value={global.resultado_global}
            detail="Excluye Gestión corporativa"
          />
          <KpiCard
            label="Participación"
            value={global.participacion}
            detail={`${global.respondidas} respuestas de ${global.enviadas} enviadas`}
          />
          <KpiCard
            label="Gestión corporativa"
            value={global.resultado_gestion_corporativa}
            detail="Indicador mostrado por separado"
          />
          <KpiCard
            label="Unidades encuestadas"
            value={global.ranking_unidades.length}
            detail="Ranking completo disponible"
            asPercent={false}
            neutral
          />
        </section>

        <div className="mt-6 grid min-w-0 items-start gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <CategoryBars categorias={global.categorias} />
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-1">
            <QuestionList title="Top 5 preguntas del grupo" preguntas={global.top5} />
            <QuestionList title="Bottom 5 preguntas del grupo" preguntas={global.bottom5} />
          </div>
        </div>

        <section className="mt-6 min-w-0 rounded-lg bg-emaresa-card p-5 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-emaresa-blue">
                Ranking
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold">
                Resultado por unidad de negocio
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              15 unidades encuestadas
            </p>
          </div>

          <div className="mt-5 min-w-0 overflow-x-auto">
            <table className="min-w-[720px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-3 pr-4 font-semibold">Unidad</th>
                  <th className="px-4 py-3 font-semibold">Resultado</th>
                  <th className="px-4 py-3 font-semibold">Semáforo</th>
                  <th className="px-4 py-3 font-semibold">Participación</th>
                  <th className="py-3 pl-4 font-semibold">Respuestas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {global.ranking_unidades.map((unidad) => (
                  <tr
                    key={unidad.unidad}
                    className="cursor-pointer transition hover:bg-slate-50 focus:bg-slate-50"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(unitPath(unidad.unidad))}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        navigate(unitPath(unidad.unidad))
                      }
                    }}
                  >
                    <td className="py-4 pr-4 font-semibold">{unidad.unidad}</td>
                    <td className="px-4 py-4 font-bold">
                      {formatPercent(unidad.resultado)}
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill tone={resultTone(unidad.resultado)} />
                    </td>
                    <td className="px-4 py-4">
                      {formatPercent(unidad.participacion)}
                    </td>
                    <td className="py-4 pl-4">
                      {unidad.respondidas}/{unidad.enviadas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
