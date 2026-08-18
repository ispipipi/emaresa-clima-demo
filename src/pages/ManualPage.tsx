import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Card } from '../components/Card'
import { Icon, type IconName } from '../components/IconSprite'

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

const steps: Array<{
  number: string
  icon: IconName
  title: string
  intro: string
  bullets: string[]
  image: string
  caption: string
  href?: string
  cta?: string
}> = [
  {
    number: '01',
    icon: 'grid',
    title: 'Resultado global',
    intro: 'Comienza en el resumen ejecutivo para entender el pulso general del Grupo Emaresa.',
    bullets: ['Lee el resultado en el aro segmentado.', 'Revisa participación y cantidad de respuestas.', 'Usa las categorías para ubicar los temas centrales.'],
    image: 'manual/01-resumen.png',
    caption: 'Resumen ejecutivo con resultado, cobertura e informes.',
    href: '/',
    cta: 'Ir al resumen',
  },
  {
    number: '02',
    icon: 'bars',
    title: 'Indicadores accionables',
    intro: 'Cada KPI es una puerta de entrada a su composición y contexto.',
    bullets: ['Haz clic sobre cualquier KPI.', 'Compara el valor con sus datos de origen.', 'Cierra el detalle y continúa la lectura.'],
    image: 'manual/02-indicadores.png',
    caption: 'Los indicadores se pueden abrir para consultar su detalle.',
  },
  {
    number: '03',
    icon: 'doc',
    title: 'Ficha de detalle',
    intro: 'La ficha muestra cómo se construye cada indicador sin salir de la pantalla.',
    bullets: ['Revisa el estado del indicador.', 'Consulta la explicación y sus componentes.', 'Usa Escape, la X o el botón inferior para cerrar.'],
    image: 'manual/03-detalle.png',
    caption: 'Modal de detalle con composición y explicación.',
  },
  {
    number: '04',
    icon: 'ring',
    title: 'Categorías y preguntas',
    intro: 'Baja desde el resultado general hacia los temas y preguntas que explican la percepción.',
    bullets: ['Compara las categorías con las marcas de referencia.', 'Alterna entre preguntas mejor evaluadas y oportunidades.', 'Observa el semáforo para priorizar la lectura.'],
    image: 'manual/04-categorias.png',
    caption: 'Categorías y preguntas con semáforo de lectura.',
  },
  {
    number: '05',
    icon: 'unit',
    title: 'Bajar a una unidad',
    intro: 'Elige una unidad en el menú lateral o desde la tira de hermanos para comparar su resultado.',
    bullets: ['Selecciona una unidad de negocio.', 'Revisa su posición, participación y divisiones.', 'Continúa con sus categorías y preguntas.'],
    image: 'manual/05-unidad.png',
    caption: 'Vista de unidad de negocio con acceso a sus divisiones.',
    href: '/unidad/A%26J',
    cta: 'Ver una unidad',
  },
  {
    number: '06',
    icon: 'layer',
    title: 'Llegar a la división',
    intro: 'La navegación conserva el contexto para llegar hasta la división legal más pequeña disponible.',
    bullets: ['Abre una división desde la unidad.', 'Compara divisiones hermanas en la tabla.', 'Interpreta el resultado junto a participación y respuestas.'],
    image: 'manual/06-division.png',
    caption: 'Detalle de división legal y sus divisiones hermanas.',
  },
  {
    number: '07',
    icon: 'down',
    title: 'Descargar informes',
    intro: 'Los informes publicados están disponibles para descarga directa y envío.',
    bullets: ['Elige el informe corporativo o el de unidad.', 'Descarga el PDF original desde su tarjeta.', 'Usa la portada y el alcance para identificarlo.'],
    image: 'manual/07-informes.png',
    caption: 'Tarjetas de descarga con los informes PDF originales.',
    href: '/',
    cta: 'Ver informes',
  },
  {
    number: '08',
    icon: 'org',
    title: 'Estructura organizacional',
    intro: 'Consulta la fotografía agregada de la organización sincronizada desde BUK.',
    bullets: ['Expande empresas y áreas con los controles + y −.', 'Revisa conteos de áreas, subáreas y personas.', 'No se muestran respuestas ni datos personales.'],
    image: 'manual/08-organizacion.png',
    caption: 'Árbol organizacional agregado, sin datos personales.',
    href: '/organizacion',
    cta: 'Ver organización',
  },
]

const levels = [
  { number: '01', icon: 'grid' as IconName, title: 'Compañía', detail: 'Resultado global y lectura ejecutiva', count: '1' },
  { number: '02', icon: 'unit' as IconName, title: 'Unidades', detail: 'Comparación y categorías por negocio', count: '15' },
  { number: '03', icon: 'layer' as IconName, title: 'Divisiones', detail: 'Detalle legal más pequeño disponible', count: '2+' },
]

export function ManualPage() {
  return (
    <AppShell activeDivision="manual">
      <Card className="!bg-navy overflow-hidden p-6 text-white lg:p-[30px]">
        <div className="grid gap-8 lg:grid-cols-[1.06fr_1fr] lg:items-center">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-light">Guía de uso · S1 2026</p>
            <h1 className="mt-3 max-w-[18ch] font-display text-[clamp(26px,3vw,38px)] font-bold leading-[1.08] tracking-[-0.034em] text-white">Cómo usar el reporte de Clima Organizacional</h1>
            <p className="mt-4 max-w-[48ch] text-[13.5px] leading-[1.7] text-white/65">Una guía breve para leer resultados, abrir indicadores, recorrer la jerarquía organizacional y descargar los informes oficiales.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Solo lectura', 'Semestre 1 · 2026', 'Sin datos personales'].map((label) => <span key={label} className="rounded-full bg-white/[0.1] px-3 py-1.5 text-[11px] font-semibold text-white/75">{label}</span>)}
            </div>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1">
            {levels.map((level) => <div key={level.number} className="flex items-center gap-3 rounded-2xl bg-white/[0.07] px-3.5 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-light/[0.16] text-teal-light"><Icon name={level.icon} className="h-[17px] w-[17px]" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-teal-light/75">Nivel {level.number}</span><span className="mt-0.5 block font-display text-[15px] font-bold text-white">{level.title}</span><span className="mt-0.5 block truncate text-[11px] text-white/45">{level.detail}</span></span>
              <span className="font-display text-xl font-bold tabular-nums text-white/75">{level.count}</span>
            </div>)}
          </div>
        </div>
      </Card>

      <div className="flex items-end justify-between gap-4 px-1 pt-1"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Recorrido recomendado</p><h2 className="mt-1 font-display text-[22px] font-bold tracking-[-0.022em] text-navy-ink">Ocho pasos para leer el reporte</h2></div><span className="hidden text-[12px] text-ink-faint sm:block">Desde la compañía hasta la división</span></div>

      <div className="flex flex-col gap-[14px]">
        {steps.map((step) => <Card key={step.number} className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_1.12fr] lg:gap-7 lg:p-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3"><span className="flex h-[38px] w-[38px] items-center justify-center rounded-[13px] bg-surface-accent text-teal"><Icon name={step.icon} className="h-[17px] w-[17px]" /></span><span className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-teal">Paso {step.number}</span></div>
            <h2 className="mt-4 font-display text-[21px] font-bold leading-[1.2] tracking-[-0.022em] text-navy-ink">{step.title}</h2>
            <p className="mt-3 max-w-[42ch] text-[13px] leading-[1.7] text-ink-soft">{step.intro}</p>
            <ol className="mt-4 flex flex-col gap-2.5">
              {step.bullets.map((bullet, index) => <li key={bullet} className="flex items-start gap-2.5 text-[12px] leading-[1.55] text-ink-soft"><span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#EAF6F7] text-[9px] font-bold text-teal">{index + 1}</span><span>{bullet}</span></li>)}
            </ol>
            {step.href && step.cta && <Link to={step.href} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-navy px-3.5 py-2.5 text-[12px] font-bold text-white transition hover:bg-teal"><span>{step.cta}</span><Icon name="arrow" className="h-[14px] w-[14px]" /></Link>}
          </div>
          <figure className="min-w-0 rounded-2xl border border-line bg-canvas p-2.5">
            <img src={assetUrl(step.image)} alt={`Captura del paso ${step.number}: ${step.title}`} className="block h-auto w-full rounded-[10px] border border-[#DCEAF4] bg-white object-cover" />
            <figcaption className="px-1.5 pb-0.5 pt-2 text-[11px] font-medium leading-5 text-ink-faint">{step.caption}</figcaption>
          </figure>
        </Card>)}
      </div>

      <Card className="p-5 lg:p-6"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Lectura rápida</p><h2 className="mt-1 font-display text-[22px] font-bold tracking-[-0.022em] text-navy-ink">Cómo leer los colores</h2></div><span className="hidden text-[12px] text-ink-faint sm:block">Umbrales del reporte</span></div><div className="mt-5 grid gap-2.5 lg:grid-cols-3"><ColorBand tone="green" label="Favorable" range="≥ 80" description="Resultado sólido, con una percepción positiva del equipo o indicador." /><ColorBand tone="yellow" label="Atención" range="60–79" description="Resultado intermedio que conviene revisar junto a categorías y preguntas." /><ColorBand tone="red" label="Crítico" range="< 60" description="Resultado bajo que requiere contexto y priorización en la lectura." /></div></Card>

      <Card className="p-5 lg:p-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Alcance de la plataforma</p><h2 className="mt-1 font-display text-[22px] font-bold tracking-[-0.022em] text-navy-ink">Qué puedes hacer aquí</h2><div className="mt-5 grid gap-6 sm:grid-cols-2"><ScopeColumn title="Sí puedes" items={['Consultar los tres niveles de la organización.', 'Abrir la composición de los indicadores.', 'Descargar los PDF originales publicados.', 'Revisar la estructura organizacional agregada.']} positive /><ScopeColumn title="No puedes" items={['Editar o cargar datos en el reporte.', 'Generar informes nuevos desde esta pantalla.', 'Ver respuestas individuales o datos personales.', 'Definir planes de acción dentro de la plataforma.']} /></div></Card>
    </AppShell>
  )
}

function ColorBand({ tone, label, range, description }: { tone: 'green' | 'yellow' | 'red'; label: string; range: string; description: string }) {
  const styles = {
    green: { text: '#15803D', bg: '#EFFAF3', dot: '#16A34A', fill: '#0B7180' },
    yellow: { text: '#A16207', bg: '#FFF8E5', dot: '#CA8A04', fill: '#5D9BA5' },
    red: { text: '#B91C1C', bg: '#FDEEEE', dot: '#DC2626', fill: '#C0524D' },
  }[tone]
  return <div className="rounded-2xl bg-surface-sunken px-4 py-4"><div className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ color: styles.text, backgroundColor: styles.bg }}><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: styles.dot }} />{label}</span><span className="font-display text-[15px] font-bold tabular-nums text-navy-ink">{range}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-bar-track"><span className="block h-full rounded-full" style={{ width: tone === 'green' ? '90%' : tone === 'yellow' ? '68%' : '38%', backgroundColor: styles.fill }} /></div><p className="mt-3 text-[12px] leading-6 text-ink-soft">{description}</p></div>
}

function ScopeColumn({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  return <div><h3 className="font-display text-[16px] font-bold text-navy-ink">{title}</h3><ul className="mt-3 flex flex-col gap-2.5">{items.map((item) => <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-[1.55] text-ink-soft"><span className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${positive ? 'bg-tone-green-dot' : 'bg-ink-ghost'}`} />{item}</li>)}</ul></div>
}
