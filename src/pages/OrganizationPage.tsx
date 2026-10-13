import { AppShell } from '../components/AppShell'
import { Card } from '../components/Card'
import { KpiCard } from '../components/KpiCard'
import { OrganizationTree } from '../components/OrganizationTree'
import { SectionHeader } from '../components/SectionHeader'
import { SegmentedGauge } from '../components/SegmentedGauge'
import { clima } from '../lib/clima'
import { bukOrganization, formatBukSyncDate } from '../lib/buk'
import { formatPlain } from '../lib/format'

export function OrganizationPage() {
  return (
    <AppShell activeDivision="organizacion">
      <Card className="grid min-w-0 gap-7 p-6 lg:grid-cols-[1.06fr_1fr] lg:p-7">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-[0.02em] text-teal">Fuente conectada · Snapshot BUK</p>
          <h1 className="mt-2.5 font-display text-[clamp(24px,2.5vw,32px)] font-bold leading-[1.14] tracking-[-0.026em] text-navy-ink">Organización</h1>
          <p className="mt-3 max-w-[48ch] text-[13.5px] leading-[1.65] text-ink-soft">Explora la estructura real desde la empresa hasta las áreas y subáreas más pequeñas disponibles.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-7 rounded-2xl bg-surface-sunken p-5 sm:justify-start">
          <SegmentedGauge value={bukOrganization.employeeCount} label="Personas activas" full />
          <div>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.19em] text-teal">Última sincronización</p>
            <p className="mt-2 font-display text-lg font-bold text-navy-ink">{formatBukSyncDate(bukOrganization.generatedAt)}</p>
            <p className="mt-1 text-[11.5px] text-ink-faint">{bukOrganization.instance}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-[14px] xl:grid-cols-4">
        <KpiCard
          label="Empresas"
          value={bukOrganization.companyCount}
          detail="Snapshot BUK"
          asPercent={false}
          neutral
          icon="org"
          sparkline={[4, 5, 6, 7]}
          rows={[{ label: 'Empresas', value: formatPlain(bukOrganization.companyCount) }, { label: 'Fuente', value: 'BUK' }, { label: 'Privacidad', value: 'Datos agregados' }]}
          explanation="Empresas con información organizacional disponible en el snapshot sincronizado."
        />
        <KpiCard
          label="Áreas y subáreas"
          value={bukOrganization.areaCount}
          detail="Estructura disponible"
          asPercent={false}
          neutral
          icon="layer"
          sparkline={[190, 220, 245, 261]}
          rows={[{ label: 'Nodos', value: formatPlain(bukOrganization.areaCount) }, { label: 'Nivel', value: 'Área y subárea' }, { label: 'Fuente', value: 'BUK' }]}
          explanation="Cantidad de áreas y subáreas que forman parte del árbol organizacional publicado."
        />
        <KpiCard
          label="Personas activas"
          value={bukOrganization.employeeCount}
          detail="Conteo agregado"
          asPercent={false}
          neutral
          icon="people"
          sparkline={[600, 650, 700, bukOrganization.employeeCount]}
          rows={[{ label: 'Personas', value: formatPlain(bukOrganization.employeeCount) }, { label: 'Fichas personales', value: 'No publicadas' }, { label: 'Fuente', value: 'BUK' }]}
          explanation="Personas activas contabilizadas para construir el snapshot, sin publicar información individual."
        />
        <KpiCard
          label="Cobertura encuesta"
          value={clima.global.participacion}
          detail={`${formatPlain(clima.global.respondidas)} de ${formatPlain(clima.global.enviadas)} respuestas`}
          icon="bars"
          sparkline={[73, 78, 82, clima.global.participacion]}
          rows={[{ label: 'Respondidas', value: formatPlain(clima.global.respondidas) }, { label: 'Enviadas', value: formatPlain(clima.global.enviadas) }, { label: 'Periodo', value: 'S1 - 2026' }]}
          explanation="Cobertura de la encuesta de clima del mismo periodo disponible en el dashboard."
        />
      </div>

      <Card className="p-[22px]">
        <SectionHeader
          title="Estructura organizacional"
          subtitle="Empresa → área → subárea · Expande solo los niveles que necesitas"
          chip={<span className="rounded-full bg-surface-muted px-3 py-1.5 text-[11px] font-medium text-ink-soft">{formatPlain(bukOrganization.companyCount)} empresas</span>}
        />
        <div className="mt-[18px]"><OrganizationTree companies={bukOrganization.companies} /></div>
      </Card>
      <Card className="p-4"><p className="border-l-[3px] border-[#DCE8F4] pl-3 text-[12px] leading-6 text-ink-soft">La vista publica únicamente conteos agregados de empresas, áreas, subáreas y personas activas. No se muestran nombres, RUT, correos ni datos contractuales.</p></Card>
    </AppShell>
  )
}
