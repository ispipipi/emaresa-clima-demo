import { Link, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { KpiCard } from '../components/KpiCard'
import { StatusPill } from '../components/StatusPill'
import { findDivision, findUnit } from '../lib/clima'
import { reportDefinitions, reportUrl } from '../lib/reports'
import { formatPercent, formatPlain, resultTone } from '../lib/format'

export function DivisionDetailPage() {
  const { nombre, division } = useParams()
  const unidad = findUnit(nombre)
  const divisionData = findDivision(nombre, division)

  if (!unidad || !divisionData) {
    return (
      <AppShell>
        <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">División no encontrada</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold">No existe una división para esta ruta</h1>
          <Link
            to={unidad ? `/unidad/${encodeURIComponent(unidad.unidad)}` : '/'}
            className="mt-6 inline-flex rounded-md bg-emaresa-navy px-4 py-2 text-sm font-bold text-white"
          >
            Volver al nivel anterior
          </Link>
        </section>
      </AppShell>
    )
  }

  const parentReport = unidad.unidad === 'A&J' ? reportDefinitions.aj : undefined
  const participation = typeof divisionData.respondidos === 'number'
    ? (divisionData.respondidos / divisionData.enviados) * 100
    : '-'

  return (
    <AppShell activeUnit={unidad.unidad} activeDivision={divisionData.nombre}>
      <section className="border-b border-slate-200 pb-7">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <Link to="/" className="hover:text-emaresa-blue">Grupo Emaresa</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/unidad/${encodeURIComponent(unidad.unidad)}`} className="hover:text-emaresa-blue">
            {unidad.unidad}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-emaresa-blue">{divisionData.nombre}</span>
        </div>
        <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">División legal</p>
            <h1 className="mt-3 max-w-full break-words whitespace-normal font-display text-3xl font-extrabold sm:max-w-3xl sm:text-4xl">
              {divisionData.nombre}
            </h1>
            <p className="mt-4 min-w-0 max-w-2xl break-words text-base leading-7 text-slate-600">
              Unidad de negocio: <span className="font-bold text-emaresa-text">{unidad.unidad}</span>.
              Este es el nivel más pequeño disponible en el dataset entregado.
            </p>
          </div>
          {parentReport && (
            <a
              href={reportUrl(parentReport.file)}
              download={parentReport.file}
              className="inline-flex w-fit items-center rounded-md bg-emaresa-navy px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emaresa-blue focus:outline-none focus:ring-2 focus:ring-emaresa-gold focus:ring-offset-2"
            >
              Descargar PDF de la unidad <span aria-hidden="true" className="ml-2 text-emaresa-gold">-&gt;</span>
            </a>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Resultado"
          value={divisionData.resultado}
          detail="Resultado reportado para esta división"
        />
        <KpiCard
          label="Participación"
          value={participation}
          detail={`${formatPlain(divisionData.respondidos)} respuestas de ${divisionData.enviados} enviadas`}
        />
        <KpiCard
          label="Nivel de reporte"
          value="3"
          detail="Grupo → unidad → división legal"
          asPercent={false}
          neutral
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">Lectura del nivel</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="font-display text-4xl font-extrabold">{formatPercent(divisionData.resultado)}</p>
            <StatusPill tone={resultTone(divisionData.resultado)} />
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            El dataset contiene para esta división únicamente resultado, personas encuestadas y participación derivada.
            No se muestran categorías ni preguntas porque no vienen informadas para este nivel.
          </p>
        </section>

        <section className="rounded-lg bg-emaresa-navy p-5 text-white shadow-sm sm:p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-100">Ruta de navegación</p>
          <p className="mt-4 font-display text-2xl font-bold">Grupo Emaresa</p>
          <p className="mt-2 text-sm text-blue-100">↓ {unidad.unidad}</p>
          <p className="mt-1 text-sm font-bold text-emaresa-gold">-&gt; {divisionData.nombre}</p>
          <Link
            to={`/unidad/${encodeURIComponent(unidad.unidad)}`}
            className="mt-6 inline-flex text-sm font-bold text-white underline decoration-emaresa-gold decoration-2 underline-offset-4 hover:text-emaresa-gold"
          >
            Volver a la unidad
          </Link>
        </section>
      </section>
    </AppShell>
  )
}
