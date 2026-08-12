import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { OrganizationTree } from '../components/OrganizationTree'
import { bukOrganization, formatBukSyncDate } from '../lib/buk'

export function OrganizationPage() {
  return (
    <AppShell activeDivision="organizacion">
      <section className="border-b border-slate-200 pb-7">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <Link to="/" className="hover:text-emaresa-blue">Grupo Emaresa</Link>
          <span aria-hidden="true">/</span>
          <span className="text-emaresa-blue">Organización BUK</span>
        </div>
        <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">Fuente conectada</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Organización</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Explora la estructura real de BUK desde la empresa hasta las áreas y subáreas más pequeñas disponibles.
            </p>
          </div>
          <div className="border-l-4 border-emaresa-gold bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200/80">
            <p className="text-sm font-semibold text-slate-500">Última sincronización</p>
            <p className="mt-1 font-display text-xl font-extrabold">{formatBukSyncDate(bukOrganization.generatedAt)}</p>
            <p className="mt-1 text-xs text-slate-500">{bukOrganization.instance}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
          <p className="text-sm font-semibold text-slate-500">Empresas</p>
          <p className="mt-3 font-display text-3xl font-extrabold">{bukOrganization.companyCount}</p>
        </article>
        <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
          <p className="text-sm font-semibold text-slate-500">Áreas y subáreas</p>
          <p className="mt-3 font-display text-3xl font-extrabold">{bukOrganization.areaCount}</p>
        </article>
        <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
          <p className="text-sm font-semibold text-slate-500">Personas activas</p>
          <p className="mt-3 font-display text-3xl font-extrabold">{bukOrganization.employeeCount}</p>
        </article>
      </section>

      <section className="mt-8">
        <div className="mb-5">
          <p className="text-sm font-bold uppercase tracking-wide text-emaresa-blue">Drilldown organizacional</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Empresa -&gt; área -&gt; subárea</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Los nombres y conteos se sincronizan desde BUK. El sitio no publica fichas personales, RUT, correos ni información contractual.
          </p>
        </div>
        <OrganizationTree companies={bukOrganization.companies} />
      </section>
    </AppShell>
  )
}
