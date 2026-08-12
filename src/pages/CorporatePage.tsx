import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { KpiCard } from '../components/KpiCard'
import { ReportCard } from '../components/ReportCard'
import { StatusPill } from '../components/StatusPill'
import { corporateMonths, corporateQuestions } from '../data/corporativo'
import { clima } from '../lib/clima'
import { formatPercent, formatPlain, resultTone } from '../lib/format'
import { reportDefinitions } from '../lib/reports'

export function CorporatePage() {
  const result = clima.global.resultado_gestion_corporativa
  const teamCount = corporateMonths.reduce((total, month) => total + month.equipos.length, 0)

  return (
    <AppShell activeDivision="corporativo">
      <section className="border-b border-emaresa-line pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emaresa-muted">
          <Link to="/" className="hover:text-emaresa-blue">Grupo Emaresa</Link>
          <span aria-hidden="true">/</span>
          <span className="text-emaresa-blue">Gestión Corporativa</span>
        </div>
        <div className="mt-6 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-emaresa-blue">Nivel compañía</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-emaresa-text sm:text-5xl">Gestión Corporativa</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-emaresa-muted">
              La percepción de la gestión de la organización, separada de la experiencia particular de cada equipo.
            </p>
          </div>
          <div className="border-l-2 border-emaresa-gold pl-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-muted">Resultado consolidado</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="font-display text-5xl font-extrabold tracking-tight text-emaresa-text">{formatPercent(result)}</span>
              <StatusPill tone={resultTone(result)} />
            </div>
            <p className="mt-2 text-sm text-emaresa-muted">Semestre 1 - 2026</p>
          </div>
        </div>
      </section>

      <section className="mt-9">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Lectura rápida</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">Indicadores corporativos</h2>
          </div>
          <p className="hidden text-sm text-emaresa-muted sm:block">Selecciona un indicador para ver el detalle</p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <KpiCard
            label="Resultado corporativo"
            value={result}
            detail="Consolidado S1 - 2026"
            explanation="Resultado semestral consolidado de las preguntas de Gestión Corporativa."
            rows={[
              { label: 'Periodo', value: 'Febrero a mayo' },
              { label: 'Equipos reportados', value: formatPlain(teamCount) },
              { label: 'Fuente', value: 'Informe PDF original' },
            ]}
          />
          <KpiCard
            label="Meses con resultados"
            value={corporateMonths.length}
            detail="Febrero a mayo"
            asPercent={false}
            neutral
            explanation="Meses incluidos en el detalle de Gestión Corporativa para el primer semestre."
            rows={corporateMonths.map((month) => ({ label: month.mes, value: `${month.equipos.length} equipos` }))}
          />
          <KpiCard
            label="Equipos reportados"
            value={teamCount}
            detail="Detalle incluido en el informe"
            asPercent={false}
            neutral
            explanation="Cantidad de equipos con resultado visible en el informe corporativo descargable."
            rows={corporateMonths.map((month) => ({ label: month.mes, value: `${month.equipos.length} equipos` }))}
          />
        </div>
      </section>

      <section className="mt-10 border-t border-emaresa-line pt-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Entregable oficial</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">Informe listo para envío</h2>
        </div>
        <div className="mt-4"><ReportCard report={reportDefinitions.corporate} /></div>
      </section>

      <section className="mt-10 border-t border-emaresa-line pt-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Detalle del entregable</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">Resultados por equipo y mes</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-emaresa-muted">Esta vista respeta el orden del informe original. El PDF descargable sigue siendo la fuente oficial para el envío.</p>
        </div>
        <div className="mt-5 grid gap-8 md:grid-cols-2">
          {corporateMonths.map((month) => (
            <section key={month.mes} className="border-t border-emaresa-line pt-4">
              <div className="flex items-baseline justify-between gap-3 border-b border-emaresa-line pb-3">
                <h3 className="font-display text-xl font-extrabold text-emaresa-text">{month.mes}</h3>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-emaresa-muted">{month.equipos.length} equipos</span>
              </div>
              <ul className="divide-y divide-emaresa-line">
                {month.equipos.map((team) => (
                  <li key={team.equipo} className="flex items-center justify-between gap-4 py-3">
                    <span className="font-semibold text-emaresa-text">{team.equipo}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="font-display text-lg font-extrabold text-emaresa-text">{formatPercent(team.resultado)}</span>
                      <StatusPill tone={resultTone(team.resultado)} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-10 border-t border-emaresa-line pt-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Consolidado semestral</p>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">Preguntas de Gestión Corporativa</h2>
        <div className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-5">
          {corporateQuestions.map((question) => (
            <div key={question.pregunta} className="border-t border-emaresa-line py-4">
              <p className="text-sm leading-5 text-emaresa-muted">{question.pregunta}</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">{formatPercent(question.resultado)}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
