import type { Categoria } from '../types/clima'
import { Icon, toneIcon } from './IconSprite'
import { Card, Delta, SectionHeader } from './ui'
import { formatPercent, toneMeta, toneOf } from '../lib/format'
import { useMounted } from '../lib/hooks'

interface CategoryBarsProps {
  categorias: Categoria[]
  /** Resultado del nivel superior: se dibuja como marca y diferencia en puntos. */
  benchmark?: Categoria[]
  benchmarkLabel?: string
  title?: string
}

export function CategoryBars({ categorias, benchmark, benchmarkLabel = 'Grupo', title = 'Resultado por categoría' }: CategoryBarsProps) {
  const mounted = useMounted()
  return (
    <Card className="flex min-w-0 flex-col p-6" delay={100}>
      <SectionHeader title={title} subtitle={benchmark ? `Escala 0–100 · la marca negra es el resultado del ${benchmarkLabel}` : 'Escala 0–100 · cortes en 60 y 80'} />
      <ul className="mt-5 flex flex-1 flex-col justify-between gap-5">
        {categorias.map((categoria) => {
          const tone = toneOf(categoria.resultado)
          const reference = benchmark?.find((item) => item.categoria === categoria.categoria)
          return (
            <li key={categoria.categoria}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[14.5px] font-semibold">{categoria.categoria}</span>
                <span className="inline-flex shrink-0 items-center gap-1.5" style={{ color: toneMeta[tone].text }}>
                  <Icon name={toneIcon[tone]} className="h-[15px] w-[15px]" />
                  <b className="text-base font-extrabold tabular-nums text-ink">{formatPercent(categoria.resultado)}</b>
                </span>
              </div>
              <div className="relative mt-2 h-2.5 rounded-full bg-sunken" aria-hidden="true">
                <span className="block h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: mounted ? `${categoria.resultado}%` : '0%', background: toneMeta[tone].fill }} />
                <span className="absolute top-0 h-full w-0.5 bg-surface" style={{ left: '60%' }} />
                <span className="absolute top-0 h-full w-0.5 bg-surface" style={{ left: '80%' }} />
                {reference ? <span className="absolute -top-1 h-[18px] w-0.5 rounded-sm bg-ink" style={{ left: `${reference.resultado}%` }} /> : null}
              </div>
              {reference ? (
                <div className="mt-2 flex items-center justify-between gap-3 text-[12.5px] font-semibold text-ink-soft">
                  <span>{benchmarkLabel} {formatPercent(reference.resultado)}</span>
                  <Delta value={categoria.resultado - reference.resultado} suffix={` pts vs. ${benchmarkLabel}`} className="text-ink" />
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
