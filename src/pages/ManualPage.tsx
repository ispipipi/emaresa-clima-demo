import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../components/IconSprite'
import { Card, StatusChip, btnBrandOutline, btnPrimary } from '../components/ui'

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

const steps: { number: string; icon: IconName; title: string; intro: string; bullets: string[]; image: string; caption: string; href?: string; cta?: string }[] = [
  { number: '01', icon: 'grid', title: 'Resultado global', intro: 'Comienza en el resumen ejecutivo para entender el pulso general del Grupo Emaresa.', bullets: ['Lee el resultado en el aro segmentado.', 'Revisa participación y cantidad de respuestas.', 'Usa las categorías para ubicar los temas centrales.'], image: 'manual/01-resumen.png', caption: 'Resumen ejecutivo con resultado, cobertura e informes.', href: '/', cta: 'Ir al resumen' },
  { number: '02', icon: 'bars', title: 'Indicadores accionables', intro: 'Cada KPI es una puerta de entrada a su composición y contexto.', bullets: ['Haz clic sobre cualquier KPI.', 'Compara el valor con sus datos de origen.', 'Cierra el detalle y continúa la lectura.'], image: 'manual/02-indicadores.png', caption: 'Los indicadores se pueden abrir para consultar su detalle.' },
  { number: '03', icon: 'doc', title: 'Ficha de detalle', intro: 'La ficha muestra cómo se construye cada indicador sin salir de la pantalla.', bullets: ['Revisa el estado del indicador.', 'Consulta la explicación y sus componentes.', 'Usa Escape, la X o el botón inferior para cerrar.'], image: 'manual/03-detalle.png', caption: 'Modal de detalle con composición y explicación.' },
  { number: '04', icon: 'ring', title: 'Categorías y preguntas', intro: 'Baja desde el resultado general hacia los temas y preguntas que explican la percepción.', bullets: ['Compara las categorías con las marcas de referencia.', 'Alterna entre preguntas mejor evaluadas y oportunidades.', 'Observa el semáforo para priorizar la lectura.'], image: 'manual/04-categorias.png', caption: 'Categorías y preguntas con semáforo de lectura.' },
  { number: '05', icon: 'unit', title: 'Bajar a una unidad', intro: 'Elige una unidad en el menú lateral o desde la tira de hermanos para comparar su resultado.', bullets: ['Selecciona una unidad de negocio.', 'Revisa sus KPI, divisiones, categorías y preguntas.', 'Usa Generar informe de clima para descargar su PDF.'], image: 'manual/05-unidad.png', caption: 'Vista de unidad de negocio con acceso a sus divisiones.', href: '/unidad/A%26J', cta: 'Ver una unidad' },
  { number: '06', icon: 'layer', title: 'Llegar a la división', intro: 'La navegación conserva el contexto para llegar hasta la división legal más pequeña disponible.', bullets: ['Abre una división desde la unidad.', 'Compara divisiones hermanas en la tabla.', 'Interpreta el resultado junto a participación y respuestas.'], image: 'manual/06-division.png', caption: 'Detalle de división legal y sus divisiones hermanas.' },
  { number: '07', icon: 'org', title: 'Informes descargables', intro: 'Genera el informe de clima de una unidad con el formato oficial de EMARESA.', bullets: ['Abre una unidad de negocio.', 'Selecciona Generar informe de clima.', 'Descarga el PDF asociado al período disponible.'], image: 'manual/07-informes.png', caption: 'Acceso al informe oficial desde la ficha de unidad.' },
  { number: '08', icon: 'org', title: 'Estructura organizacional', intro: 'Consulta la fotografía agregada de la organización sincronizada desde BUK.', bullets: ['Expande empresas y áreas con los controles + y −.', 'Revisa conteos de áreas, subáreas y personas.', 'No se muestran respuestas ni datos personales.'], image: 'manual/08-organizacion.png', caption: 'Árbol organizacional agregado, sin datos personales.', href: '/organizacion', cta: 'Ver organización' },
]

const levels: { number: string; icon: IconName; title: string; detail: string; count: string }[] = [
  { number: '01', icon: 'grid', title: 'Compañía', detail: 'Resultado global y lectura ejecutiva', count: '1' },
  { number: '02', icon: 'unit', title: 'Unidades', detail: 'Comparación y categorías por negocio', count: '15' },
  { number: '03', icon: 'layer', title: 'Divisiones', detail: 'Detalle legal más pequeño disponible', count: '2+' },
]

/** Captura del paso; si la imagen falta o no carga se muestra el marcador rayado. */
function StepFigure({ number, title, image, caption }: { number: string; title: string; image: string; caption: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className="m-0 min-w-0">
      {failed ? (
        <div role="img" aria-label={`Captura del paso ${number}: ${title}`} className="flex aspect-[16/10] flex-col items-center justify-center gap-1.5 rounded-card p-4 text-center font-mono text-xs text-ink-soft shadow-[inset_0_0_0_1px_var(--line)]" style={{ background: 'repeating-linear-gradient(135deg,var(--sunken) 0 10px,var(--line-soft) 10px 20px)' }}>
          <span className="font-semibold">captura · {title.toLowerCase()}</span><span>{image}</span>
        </div>
      ) : (
        <img src={assetUrl(image)} alt={`Captura del paso ${number}: ${title}`} loading="lazy" onError={() => setFailed(true)} className="block h-auto w-full rounded-card bg-surface object-cover shadow-[inset_0_0_0_1px_var(--line)]" />
      )}
      <figcaption className="px-1 pt-2.5 text-[13px] leading-[19px] text-ink-soft">{caption}</figcaption>
    </figure>
  )
}

const bands: { tone: 'green' | 'yellow' | 'red'; label: string; range: string; from: number; to: number; fill: string; description: string }[] = [
  { tone: 'green', label: 'Favorable', range: '≥ 80', from: 80, to: 100, fill: 'var(--fav)', description: 'Resultado sólido, con una percepción positiva del equipo o indicador.' },
  { tone: 'yellow', label: 'Atención', range: '60–79', from: 60, to: 80, fill: 'var(--att)', description: 'Resultado intermedio que conviene revisar junto a categorías y preguntas.' },
  { tone: 'red', label: 'Crítico', range: '< 60', from: 0, to: 60, fill: 'var(--crit)', description: 'Resultado bajo que requiere contexto y priorización en la lectura.' },
]

function ScopeColumn({ title, items, positive }: { title: string; items: string[]; positive: boolean }) {
  return (
    <div>
      <h3 className="text-lg font-extrabold tracking-[-0.02em]">{title}</h3>
      <ul className="mt-3.5 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-[21px]">
            <span className={`mt-px shrink-0 ${positive ? 'text-fav' : 'text-ink-faint'}`}><Icon name={positive ? 'ok' : 'crit'} className="h-[18px] w-[18px]" /></span>{item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ManualPage() {
  return (
    <>
      <section className="animate-rise overflow-hidden rounded-card shadow-card" style={{ background: 'radial-gradient(640px 280px at 0% 0%, var(--brand-soft), transparent 70%), var(--surface)' }}>
        <div className="grid gap-9 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
          <div>
            <p className="text-[13px] font-bold text-brand-deep">Guía de uso · S1 2026</p>
            <h1 className="mt-2.5 max-w-[18ch] text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.14] tracking-[-0.04em]">Cómo usar el reporte de Clima Organizacional</h1>
            <p className="mt-3.5 max-w-[50ch] text-base leading-[25px] text-ink-soft">Una guía breve para leer resultados, abrir indicadores, recorrer la jerarquía organizacional y descargar los informes oficiales.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {([['eye', 'Solo lectura'], ['calendar', 'Semestre 1 · 2026'], ['lock', 'Sin datos personales']] as [IconName, string][]).map(([icon, label]) => (
                <span key={label} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-surface px-3 text-[13px] font-semibold text-ink-soft shadow-[inset_0_0_0_1px_var(--line)]"><Icon name={icon} className="h-[15px] w-[15px]" />{label}</span>
              ))}
            </div>
            <a href="#paso-01" className={`${btnPrimary} mt-6 h-[46px]`}>Empezar por el paso 01<Icon name="go" className="h-[17px] w-[17px]" /></a>
          </div>
          <ol className="flex flex-col gap-2.5">
            {levels.map((level, index) => (
              <li key={level.number} className="flex items-center gap-3.5 rounded-card bg-surface px-4 py-3.5 shadow-card" style={{ marginLeft: index * 22 }}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-brand-soft text-brand-deep"><Icon name={level.icon} className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-ink-soft">Nivel {level.number}</span><span className="block text-[17px] font-extrabold leading-[22px] tracking-[-0.02em]">{level.title}</span><span className="block text-[13px] leading-[18px] text-ink-soft">{level.detail}</span></span>
                <span className="text-[26px] font-extrabold tracking-[-0.03em] tabular-nums">{level.count}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="flex flex-wrap items-end justify-between gap-4 pt-6">
        <div><p className="text-[13px] font-bold text-brand-deep">Recorrido recomendado</p><h2 className="mt-1 text-[26px] font-extrabold leading-8 tracking-[-0.03em]">Ocho pasos para leer el reporte</h2></div>
        <span className="text-[13.5px] text-ink-soft">Desde la compañía hasta la división</span>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <nav aria-label="En esta guía" className="rounded-card bg-surface p-4 shadow-card xl:sticky xl:top-24">
          <p className="px-2 pb-2 text-base font-extrabold">En esta guía</p>
          <ul className="flex flex-col gap-0.5">
            {steps.map((step) => (
              <li key={step.number}><a href={`#paso-${step.number}`} className="flex min-h-[38px] items-center gap-2.5 rounded-[10px] px-2.5 py-1.5 text-[13.5px] font-semibold leading-[18px] transition hover:bg-sunken"><span className="w-[22px] text-center text-xs font-bold text-ink-soft">{step.number}</span>{step.title}</a></li>
            ))}
            <li><a href="#colores" className="flex min-h-[38px] items-center gap-2.5 rounded-[10px] px-2.5 py-1.5 text-[13.5px] font-semibold transition hover:bg-sunken"><span className="w-[22px] text-center text-xs font-bold text-ink-soft">·</span>Cómo leer los colores</a></li>
            <li><a href="#alcance" className="flex min-h-[38px] items-center gap-2.5 rounded-[10px] px-2.5 py-1.5 text-[13.5px] font-semibold transition hover:bg-sunken"><span className="w-[22px] text-center text-xs font-bold text-ink-soft">·</span>Qué puedes hacer aquí</a></li>
          </ul>
        </nav>
        <div className="flex min-w-0 flex-col gap-4">
          {steps.map((step) => (
            <Card key={step.number} className="grid scroll-mt-24 gap-7 p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)]">
              <article id={`paso-${step.number}`} className="min-w-0 scroll-mt-24">
                <div className="flex items-center gap-3"><span className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-brand-soft text-brand-deep"><Icon name={step.icon} className="h-[21px] w-[21px]" /></span><span className="text-[13px] font-bold text-brand-deep">Paso {step.number}</span></div>
                <h2 className="mt-4 text-2xl font-extrabold leading-[30px] tracking-[-0.03em]">{step.title}</h2>
                <p className="mt-2.5 max-w-[44ch] text-[15px] leading-[23px] text-ink-soft">{step.intro}</p>
                <ol className="mt-[18px] flex flex-col gap-[11px]">
                  {step.bullets.map((bullet, index) => (
                    <li key={bullet} className="flex items-start gap-[11px] text-sm leading-[21px]"><span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-extrabold text-brand-deep">{index + 1}</span><span>{bullet}</span></li>
                  ))}
                </ol>
                {step.href && step.cta ? <Link to={step.href} className={`${btnBrandOutline} mt-5`}>{step.cta}<Icon name="go" className="h-4 w-4" /></Link> : null}
              </article>
              <StepFigure number={step.number} title={step.title} image={step.image} caption={step.caption} />
            </Card>
          ))}
        </div>
      </div>

      <Card className="scroll-mt-24 p-6 sm:p-7"><div id="colores" className="scroll-mt-24" />
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[13px] font-bold text-brand-deep">Lectura rápida</p><h2 className="mt-1 text-2xl font-extrabold leading-[30px] tracking-[-0.03em]">Cómo leer los colores</h2></div><span className="text-[13.5px] text-ink-soft">Umbrales del reporte · el color siempre va con icono y etiqueta</span></div>
        <div className="mt-5 grid gap-3.5 lg:grid-cols-3">
          {bands.map((band) => (
            <div key={band.label} className="flex flex-col gap-3 rounded-card bg-sunken px-5 py-[18px]">
              <div className="flex items-center justify-between gap-2.5"><StatusChip tone={band.tone} /><b className="text-xl font-extrabold tracking-[-0.02em] tabular-nums">{band.range}</b></div>
              <span aria-hidden="true" className="relative block h-2.5 rounded-full bg-surface"><span className="absolute top-0 h-2.5 rounded-full" style={{ left: `${band.from}%`, width: `${band.to - band.from}%`, background: band.fill }} /></span>
              <p className="text-sm leading-[21px] text-ink-soft">{band.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-7"><div id="alcance" className="scroll-mt-24" />
        <p className="text-[13px] font-bold text-brand-deep">Alcance de la plataforma</p>
        <h2 className="mt-1 text-2xl font-extrabold leading-[30px] tracking-[-0.03em]">Qué puedes hacer aquí</h2>
        <div className="mt-5 grid gap-10 sm:grid-cols-2">
          <ScopeColumn positive title="Sí puedes" items={['Consultar los tres niveles de la organización.', 'Abrir la composición de los indicadores.', 'Generar el informe PDF desde una unidad.', 'Revisar la estructura organizacional agregada.']} />
          <ScopeColumn positive={false} title="No puedes" items={['Editar o cargar datos en el reporte.', 'Ver respuestas individuales o datos personales.', 'Definir planes de acción dentro de la plataforma.']} />
        </div>
      </Card>
    </>
  )
}
