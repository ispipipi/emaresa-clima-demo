import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { KpiCard } from '../components/KpiCard'
import { ReportCard } from '../components/ReportCard'
import { StatusPill } from '../components/StatusPill'
import { corporateMonths, corporateQuestions } from '../data/corporativo'
import { clima } from '../lib/clima'
import { formatPercent, resultTone } from '../lib/format'
import { reportDefinitions } from '../lib/reports'

export function CorporatePage() {
  const result = clima.global.resultado_gestion_corporativa

  return (
    <AppShell activeDivision="corporativo">
      <section className="border-b border-slate-200 pb-7">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <Link to="/" className="hover:text-emaresa-blue">Grupo Emaresa</Link>
          <span aria-hidden="true">/</span>
          <span className="text-emaresa-blue">Gestión Corporativa</span>
        </div>
        <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">Nivel compañía</p>
            <h1 className="mt-3 max-w-full break-words whitespace-normal font-display text-4xl font-extrabold sm:text-5xl">Gestión Corporativa</h1>
            <p className="mt-4 min-w-0 max-w-2xl break-words text-base leading-7 text-slate-600">
              El informe separa la percepción sobre la gestión de la organización de la experiencia particular de cada equipo.
            </p>
          </div>
          <div className="border-l-4 border-emaresa-gold bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200/80">
            <p className="text-sm font-semibold text-slate-500">Resultado consolidado semestral</p>
            <p className="mt-1 font-display text-4xl font-extrabold">{formatPercent(result)}</p>
            <div className="mt-2"><StatusPill tone={resultTone(result)} /></div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <KpiCard label="Resultado corporativo" value={result} detail="Consolidado S1 - 2026" />
        <KpiCard label="Meses con resultados" value={corporateMonths.length} detail="Febrero a mayo" asPercent={false} neutral />
        <KpiCard label="Equipos reportados" value={corporateMonths.reduce((total, month) => total + month.equipos.length, 0)} detail="Detalle incluido en el PDF original" asPercent={false} neutral />
      </section>

      <div className="mt-6">
        <ReportCard report={reportDefinitions.corporate} />
      </div>

      <section className="mt-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">Detalle del entregable</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Resultados por equipo y mes</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Esta vista respeta el orden del informe original. El archivo descargable sigue siendo la fuente oficial para el envío.
          </p>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {corporateMonths.map((month) => (
            <section key={month.mes} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
              <div className="flex items-baseline justify-between gap-3 border-b border-slate-200 pb-3">
                <h3 className="font-display text-xl font-bold">{month.mes}</h3>
                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{month.equipos.length} equipos</span>
              </div>
              <ul className="mt-2 divide-y divide-slate-100">
                {month.equipos.map((team) => (
                  <li key={team.equipo} className="flex items-center justify-between gap-4 py-3">
                    <span className="font-semibold text-slate-700">{team.equipo}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="font-display text-lg font-extrabold">{formatPercent(team.resultado)}</span>
                      <StatusPill tone={resultTone(team.resultado)} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-lg bg-emaresa-navy p-5 text-white shadow-sm sm:p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-100">Consolidado semestral</p>
        <h2 className="mt-2 font-display text-2xl font-bold">Preguntas de Gestión Corporativa</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {corporateQuestions.map((question) => (
            <div key={question.pregunta} className="border-t border-blue-300/30 pt-3">
              <p className="text-sm leading-5 text-blue-100">{question.pregunta}</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-emaresa-gold">{formatPercent(question.resultado)}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
