import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { OrganizationTree } from '../components/OrganizationTree'
import { bukOrganization, formatBukSyncDate } from '../lib/buk'

export function OrganizationPage() {
  return (
    <AppShell activeDivision="organizacion">
      <section className="border-b border-emaresa-line pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emaresa-muted">
          <Link to="/" className="hover:text-emaresa-blue">Grupo Emaresa</Link>
          <span aria-hidden="true">/</span>
          <span className="text-emaresa-blue">Organización BUK</span>
        </div>
        <div className="mt-6 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-emaresa-blue">Fuente conectada</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-emaresa-text sm:text-5xl">Organización</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-emaresa-muted">Explora la estructura real de BUK desde la empresa hasta las áreas y subáreas más pequeñas disponibles.</p>
          </div>
          <div className="border-l-2 border-emaresa-gold pl-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-muted">Última sincronización</p>
            <p className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">{formatBukSyncDate(bukOrganization.generatedAt)}</p>
            <p className="mt-2 text-sm text-emaresa-muted">{bukOrganization.instance}</p>
          </div>
        </div>
      </section>

      <section className="mt-9">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Cobertura BUK</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">Estructura disponible</h2>
          </div>
          <p className="hidden text-sm text-emaresa-muted sm:block">Selecciona un nodo para expandirlo</p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <button type="button" className="group border-t border-emaresa-line pt-4 text-left transition hover:border-emaresa-blue" onClick={() => document.getElementById('buk-tree')?.scrollIntoView({ behavior: 'smooth' })}>
            <span className="text-sm font-semibold text-emaresa-muted">Empresas</span>
            <span className="mt-2 block font-display text-4xl font-extrabold text-emaresa-text">{bukOrganization.companyCount}</span>
            <span className="mt-2 block text-xs font-bold text-emaresa-blue opacity-0 transition group-hover:opacity-100">Ver estructura -&gt;</span>
          </button>
          <button type="button" className="group border-t border-emaresa-line pt-4 text-left transition hover:border-emaresa-blue" onClick={() => document.getElementById('buk-tree')?.scrollIntoView({ behavior: 'smooth' })}>
            <span className="text-sm font-semibold text-emaresa-muted">Áreas y subáreas</span>
            <span className="mt-2 block font-display text-4xl font-extrabold text-emaresa-text">{bukOrganization.areaCount}</span>
            <span className="mt-2 block text-xs font-bold text-emaresa-blue opacity-0 transition group-hover:opacity-100">Ver estructura -&gt;</span>
          </button>
          <button type="button" className="group border-t border-emaresa-line pt-4 text-left transition hover:border-emaresa-blue" onClick={() => document.getElementById('buk-tree')?.scrollIntoView({ behavior: 'smooth' })}>
            <span className="text-sm font-semibold text-emaresa-muted">Personas activas</span>
            <span className="mt-2 block font-display text-4xl font-extrabold text-emaresa-text">{bukOrganization.employeeCount}</span>
            <span className="mt-2 block text-xs font-bold text-emaresa-blue opacity-0 transition group-hover:opacity-100">Ver estructura -&gt;</span>
          </button>
        </div>
      </section>

      <section id="buk-tree" className="mt-10 border-t border-emaresa-line pt-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emaresa-blue">Drill-down organizacional</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">Empresa -&gt; área -&gt; subárea</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-emaresa-muted">Los nombres y conteos se sincronizan desde BUK. El sitio no publica fichas personales, RUT, correos ni información contractual.</p>
        </div>
        <OrganizationTree companies={bukOrganization.companies} />
      </section>
    </AppShell>
  )
}
