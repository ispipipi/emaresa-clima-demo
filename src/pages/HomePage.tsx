import { CategoryBars } from '../components/CategoryBars'
import { AppShell } from '../components/AppShell'
import { KpiCard } from '../components/KpiCard'
import { QuestionList } from '../components/QuestionList'
import { ReportCard } from '../components/ReportCard'
import { StatusPill } from '../components/StatusPill'
import { clima, unitPath } from '../lib/clima'
import { reportDefinitions } from '../lib/reports'
import { formatPercent, resultTone } from '../lib/format'
import { Link } from 'react-router-dom'

export function HomePage() {
  const { global } = clima

  return (
    <AppShell>
      <section className="border-b border-slate-200 pb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">
          Desarrollo Organizacional / Reporte ejecutivo
        </p>
        <div className="mt-4 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="max-w-full break-words whitespace-normal font-display text-4xl font-extrabold sm:max-w-3xl sm:text-5xl">
              Encuesta Pulso de Clima
            </h1>
            <p className="mt-4 min-w-0 max-w-2xl break-words text-base leading-7 text-slate-600">
              Grupo Emaresa · Semestre 1 - 2026. Explora el resultado consolidado,
              baja a cada unidad y llega hasta la razón social disponible en la fuente.
            </p>
          </div>
          <div className="border-l-4 border-emaresa-gold bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200/80">
            <p className="font-bold text-emaresa-text">Fuente del resultado</p>
            <p className="mt-1 text-slate-500">Porcentaje de Promotores · escala 0 a 100</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">
              Entregables
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold">Informes listos para envío</h2>
          </div>
          <p className="text-sm text-slate-500">Descargas directas de los PDF originales</p>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <ReportCard report={reportDefinitions.corporate} />
          <ReportCard report={reportDefinitions.aj} />
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">
              Nivel compañía
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold">Resumen consolidado</h2>
          </div>
          <Link
            to="/gestion-corporativa"
            className="text-sm font-bold text-emaresa-blue hover:text-emaresa-navy"
          >
            Ver Gestión Corporativa -&gt;
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Clima organizacional"
            value={global.resultado_global}
            detail="Resultado global sin Gestión Corporativa"
          />
          <KpiCard
            label="Gestión Corporativa"
            value={global.resultado_gestion_corporativa}
            detail="Resultado consolidado del informe corporativo"
          />
          <KpiCard
            label="Participación"
            value={global.participacion}
            detail={`${global.respondidas} respuestas de ${global.enviadas} enviadas`}
          />
          <KpiCard
            label="Unidades de negocio"
            value={global.ranking_unidades.length}
            detail="15 unidades con resultado agregado"
            asPercent={false}
            neutral
          />
        </div>
      </section>

      <div className="mt-8 grid min-w-0 items-start gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <CategoryBars categorias={global.categorias} />
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-1">
          <QuestionList title="Preguntas mejor evaluadas" preguntas={global.top5} />
          <QuestionList title="Preguntas con mayor oportunidad" preguntas={global.bottom5} />
        </div>
      </div>

      <section className="mt-8 min-w-0 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">
              Segundo nivel
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold">Unidades de negocio</h2>
          </div>
          <p className="text-sm text-slate-500">Selecciona una unidad para abrir sus divisiones legales</p>
        </div>

        <div className="mt-5 min-w-0 overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3 pr-4 font-semibold">Unidad</th>
                <th className="px-4 py-3 font-semibold">Resultado</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Participación</th>
                <th className="py-3 pl-4 font-semibold">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {global.ranking_unidades.map((unidad) => (
                <tr key={unidad.unidad} className="group">
                  <td className="py-4 pr-4 font-bold text-emaresa-text">{unidad.unidad}</td>
                  <td className="px-4 py-4 font-bold">{formatPercent(unidad.resultado)}</td>
                  <td className="px-4 py-4">
                    <StatusPill tone={resultTone(unidad.resultado)} />
                  </td>
                  <td className="px-4 py-4">{formatPercent(unidad.participacion)}</td>
                  <td className="py-4 pl-4">
                    <Link
                      to={unitPath(unidad.unidad)}
                      className="font-bold text-emaresa-blue hover:text-emaresa-navy"
                    >
                      Abrir nivel -&gt;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  )
}
