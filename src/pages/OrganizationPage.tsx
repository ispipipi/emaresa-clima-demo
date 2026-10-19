import { Icon } from '../components/IconSprite'
import { KpiCard } from '../components/KpiCard'
import { OrganizationTree } from '../components/OrganizationTree'
import { PageHeader } from '../components/PageHeader'
import { Card, Meter, SectionHeader, StatusChip } from '../components/ui'
import type { BukAreaNode } from '../types/buk'
import { bukOrganization, formatBukSyncDate } from '../lib/buk'
import { clima } from '../lib/clima'
import { formatPlain, toneMeta, toneOf } from '../lib/format'
import { usePeriod } from '../lib/period'

function visibleAreas(nodes: BukAreaNode[]): number {
  return nodes.reduce((sum, node) => sum + (node.depth > 0 ? 1 : 0) + visibleAreas(node.children), 0)
}

export function OrganizationPage() {
  const { period } = usePeriod()
  const climateAvailable = period === 'S1-2026'
  const treeAreas = bukOrganization.companies.reduce((sum, company) => sum + visibleAreas(company.areas), 0)
  const ageDays = Math.max(0, Math.floor((Date.now() - Date.parse(bukOrganization.generatedAt)) / 86400000))
  const age = ageDays === 0 ? 'Hoy' : `Hace ${ageDays} ${ageDays === 1 ? 'día' : 'días'}`

  return (
    <>
      <PageHeader
        tone="neutral"
        hideChip
        eyebrow={<span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-fav" />Fuente conectada · Snapshot BUK</span>}
        title="Organización"
        subtitle="Explora la estructura real desde la empresa hasta las áreas y subáreas más pequeñas disponibles."
        aside={
          <Card className="flex flex-col gap-3 p-5 shadow-lift">
            <div className="flex items-center justify-between gap-2.5">
              <span className="flex items-center gap-2 text-[14.5px] font-bold"><Icon name="sync" className="h-[17px] w-[17px] text-brand-deep" />Última sincronización</span>
              <StatusChip tone="green" label="Sincronizado" />
            </div>
            <p className="text-[28px] font-extrabold leading-8 tracking-[-0.03em] tabular-nums">{formatBukSyncDate(bukOrganization.generatedAt)}</p>
            {[['Antigüedad', age], ['Instancia', bukOrganization.instance.replace('https://', '')], ['Datos publicados', 'Solo conteos agregados']].map(([label, value]) => (
              <p key={label} className="flex justify-between gap-3 text-[13px] text-ink-soft"><span>{label}</span><b className="font-bold text-ink">{value}</b></p>
            ))}
          </Card>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Empresas" value={bukOrganization.companyCount} asPercent={false} neutral detail="Con personas activas" icon="org" visual={<span aria-hidden="true" className="flex gap-1">{bukOrganization.companies.map((company) => <span key={company.id} className="h-2.5 flex-1 rounded-full bg-brand-mid" />)}</span>} rows={[{ label: 'Empresas', value: formatPlain(bukOrganization.companyCount) }, { label: 'Fuente', value: 'BUK' }, { label: 'Privacidad', value: 'Datos agregados' }]} explanation="Empresas con información organizacional disponible en el snapshot sincronizado." />
        <KpiCard label="Áreas y subáreas" value={bukOrganization.areaCount} asPercent={false} neutral detail="Hasta 5 niveles bajo cada empresa" icon="layer" delta={<span className="text-ink-soft">{formatPlain(bukOrganization.areaCount)} en el snapshot · {formatPlain(treeAreas)} en el árbol</span>} rows={[{ label: 'En el snapshot', value: formatPlain(bukOrganization.areaCount) }, { label: 'En el árbol', value: formatPlain(treeAreas) }, { label: 'Fuente', value: 'BUK' }]} explanation="Cantidad de áreas y subáreas del snapshot. El árbol muestra las que tienen personas activas; la diferencia debe confirmarse con la fuente." />
        <KpiCard label="Personas activas" value={bukOrganization.employeeCount} asPercent={false} neutral detail="Conteo agregado, sin fichas personales" icon="people" rows={[{ label: 'Personas', value: formatPlain(bukOrganization.employeeCount) }, { label: 'Fichas personales', value: 'No publicadas' }, { label: 'Fuente', value: 'BUK' }]} explanation="Personas activas contabilizadas para construir el snapshot, sin publicar información individual." />
        <KpiCard label="Cobertura de la encuesta" value={climateAvailable ? clima.global.participacion : '—'} detail={climateAvailable ? `${formatPlain(clima.global.respondidas)} de ${formatPlain(clima.global.enviadas)} respuestas · S1 2026` : 'La encuesta S2 todavía no está cargada'} icon="bars" visual={climateAvailable ? <Meter value={clima.global.participacion} color={toneMeta[toneOf(clima.global.participacion)].fill} marks /> : undefined} rows={climateAvailable ? [{ label: 'Respondidas', value: formatPlain(clima.global.respondidas) }, { label: 'Enviadas', value: formatPlain(clima.global.enviadas) }, { label: 'Período', value: 'S1 · 2026' }] : [{ label: 'Período seleccionado', value: 'S2 · 2026' }, { label: 'Estado', value: 'Pendiente de carga' }, { label: 'Fuente', value: 'BUK no contiene resultados de encuesta' }]} explanation={climateAvailable ? 'Cobertura de la encuesta de clima del mismo período disponible en el dashboard.' : 'La estructura BUK es independiente del período, pero la cobertura de encuesta S2 requiere su dataset oficial.'} />
      </div>

      <Card className="p-6">
        <SectionHeader title="Estructura organizacional" subtitle="Empresa → área → subárea · Expande solo los niveles que necesitas" />
        <div className="mt-4"><OrganizationTree companies={bukOrganization.companies} /></div>
      </Card>

      <div className="flex items-center gap-4 rounded-card border-[1.5px] border-dashed border-line px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-sunken text-ink-soft"><Icon name="lock" className="h-5 w-5" /></span>
        <p className="text-sm leading-[21px] text-ink-soft">La vista publica únicamente conteos agregados de empresas, áreas, subáreas y personas activas. No se muestran nombres, RUT, correos ni datos contractuales.</p>
      </div>
    </>
  )
}
