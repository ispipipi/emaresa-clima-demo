import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { CategoryBars } from '../components/CategoryBars'
import { KpiCard } from '../components/KpiCard'
import { QuestionList } from '../components/QuestionList'
import { ReportCard } from '../components/ReportCard'
import { StatusPill } from '../components/StatusPill'
import { formatPercent, formatPlain, resultTone } from '../lib/format'
import { clima, unitPath } from '../lib/clima'
import { reportDefinitions } from '../lib/reports'

export function HomePage() {
  const { global } = clima
  const bestUnit = global.ranking_unidades[0]

  return (
    <AppShell>
      <section className="border-b border-emaresa-line pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emaresa-muted">
          <span>Grupo Emaresa</span>
          <span aria-hidden="true">/</span>
          <span className="text-emaresa-blue">Resumen ejecutivo</span>
        </div>
        <div className="mt-6 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-emaresa-blue">Encuesta Pulso de Clima</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-emaresa-text sm:text-5xl">
              Resumen ejecutivo
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-emaresa-muted">
              Semestre 1 - 2026. Revisa el resultado consolidado y desciende desde la compañía hasta cada unidad y división legal.
            </p>
          </div>
          <div className="border-l-2 border-emaresa-gold pl-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-muted">Resultado global</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="font-display text-5xl font-extrabold tracking-tight text-emaresa-text">{formatPercent(global.resultado_global)}</span>
              <StatusPill tone={resultTone(global.resultado_global)} />
            </div>
            <p className="mt-2 text-sm text-emaresa-muted">Clima organizacional consolidado</p>
          </div>
        </div>
      </section>

      <section className="mt-9 border-t border-emaresa-line pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Entregables</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">Informes listos para envío</h2>
          </div>
          <p className="text-sm text-emaresa-muted">PDF originales de la entrega S1 2026</p>
        </div>
        <div className="mt-5 flex min-w-0 flex-col gap-x-8 lg:grid lg:grid-cols-2">
          <ReportCard report={reportDefinitions.corporate} />
          <ReportCard report={reportDefinitions.aj} />
        </div>
      </section>

      <section className="mt-10 border-t border-emaresa-line pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Lectura rápida</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">Indicadores principales</h2>
          </div>
          <p className="text-sm text-emaresa-muted">Selecciona un indicador para ver su composición</p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Clima organizacional"
            value={global.resultado_global}
            detail="Resultado global sin Gestión Corporativa"
            explanation="Resultado agregado de las preguntas de clima organizacional para el Grupo Emaresa."
            rows={[
              { label: 'Participación', value: formatPercent(global.participacion) },
              { label: 'Respuestas', value: `${formatPlain(global.respondidas)} de ${formatPlain(global.enviadas)}` },
              { label: 'Mejor unidad', value: `${bestUnit.unidad} · ${formatPercent(bestUnit.resultado)}` },
            ]}
          />
          <KpiCard
            label="Gestión Corporativa"
            value={global.resultado_gestion_corporativa}
            detail="Resultado consolidado del informe corporativo"
            explanation="Indicador separado para la percepción sobre la gestión de la organización."
            rows={[
              { label: 'Resultado clima', value: formatPercent(global.resultado_global) },
              { label: 'Diferencia', value: `${formatPercent(global.resultado_gestion_corporativa - global.resultado_global)}` },
              { label: 'Detalle', value: 'Ver informe corporativo' },
            ]}
          />
          <KpiCard
            label="Participación"
            value={global.participacion}
            detail={`${global.respondidas} respuestas de ${global.enviadas} enviadas`}
            explanation="Porcentaje de personas que respondieron la encuesta respecto del universo invitado."
            rows={[
              { label: 'Respondidas', value: formatPlain(global.respondidas) },
              { label: 'Enviadas', value: formatPlain(global.enviadas) },
              { label: 'Cobertura', value: 'Grupo Emaresa' },
            ]}
          />
          <KpiCard
            label="Unidades de negocio"
            value={global.ranking_unidades.length}
            detail="Unidades con resultado agregado"
            asPercent={false}
            neutral
            explanation="Unidades con información agregada en el dataset de clima. Cada una abre sus divisiones legales disponibles."
            rows={[
              { label: 'Mejor resultado', value: `${bestUnit.unidad} · ${formatPercent(bestUnit.resultado)}` },
              { label: 'Menor resultado', value: `${global.ranking_unidades.at(-1)?.unidad} · ${formatPercent(global.ranking_unidades.at(-1)?.resultado ?? '-')}` },
              { label: 'Nivel siguiente', value: 'Divisiones legales' },
            ]}
          />
        </div>
      </section>

      <div className="mt-10 grid min-w-0 items-start gap-10 xl:grid-cols-[1.05fr_0.95fr]">
        <CategoryBars categorias={global.categorias} />
        <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-1">
          <QuestionList title="Preguntas mejor evaluadas" preguntas={global.top5} />
          <QuestionList title="Preguntas con mayor oportunidad" preguntas={global.bottom5} />
        </div>
      </div>

      <section className="mt-10 border-t border-emaresa-line pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Segundo nivel</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">Unidades de negocio</h2>
          </div>
          <p className="text-sm text-emaresa-muted">Abre una unidad para continuar el drill-down</p>
        </div>

        <div className="mt-5 min-w-0 overflow-x-auto border-y border-emaresa-line">
          <table className="min-w-[720px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-emaresa-line text-[11px] uppercase tracking-[0.14em] text-emaresa-muted">
                <th className="py-3 pr-4 font-bold">Unidad</th>
                <th className="px-4 py-3 font-bold">Resultado</th>
                <th className="px-4 py-3 font-bold">Estado</th>
                <th className="px-4 py-3 font-bold">Participación</th>
                <th className="py-3 pl-4 font-bold">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emaresa-line">
              {global.ranking_unidades.map((unidad) => (
                <tr key={unidad.unidad} className="group transition hover:bg-white/70">
                  <td className="py-4 pr-4">
                    <Link to={unitPath(unidad.unidad)} className="font-bold text-emaresa-text hover:text-emaresa-blue">
                      {unidad.unidad}
                    </Link>
                  </td>
                  <td className="px-4 py-4 font-display text-lg font-extrabold text-emaresa-text">{formatPercent(unidad.resultado)}</td>
                  <td className="px-4 py-4"><StatusPill tone={resultTone(unidad.resultado)} /></td>
                  <td className="px-4 py-4 text-sm text-emaresa-muted">{formatPercent(unidad.participacion)}</td>
                  <td className="py-4 pl-4">
                    <Link to={unitPath(unidad.unidad)} className="text-sm font-bold text-emaresa-blue hover:text-emaresa-navy">
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
