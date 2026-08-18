import type { Categoria } from '../types/clima'
import { formatPercent, toneMeta, toneOf } from '../lib/format'
import { Card } from './Card'
import { SectionHeader } from './SectionHeader'

interface CategoryBarsProps {
  categorias: Categoria[]
  title?: string
}

export function CategoryBars({ categorias, title = 'Resultado por categoría' }: CategoryBarsProps) {
  return (
    <Card className="min-w-0 p-[22px]" animationDelay={100}>
      <SectionHeader title={title} subtitle="Escala 0–100 · marcas en 60 y 80" chip={<span className="rounded-full bg-surface-muted px-3 py-1.5 text-[11px] font-medium tabular-nums text-ink-soft">{categorias.length} categorías</span>} />
      <div className="mt-[22px] flex flex-col gap-[17px]">
        {categorias.map((categoria) => {
          const tone = toneOf(categoria.resultado)
          const meta = toneMeta[tone]
          return (
            <div key={categoria.categoria}>
              <div className="mb-2 flex items-baseline justify-between gap-3.5">
                <span className="text-[13px] font-semibold text-ink">{categoria.categoria}</span>
                <span className="flex shrink-0 items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.dot }} /><span className="font-display text-sm font-extrabold tracking-[-0.02em] tabular-nums text-ink">{formatPercent(categoria.resultado)}</span></span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-bar-track">
                <div className="h-2 rounded-full transition-[width] duration-500" style={{ width: `${typeof categoria.resultado === 'number' ? categoria.resultado : 0}%`, backgroundColor: meta.fill }} />
                <span className="absolute left-[60%] top-[-2px] h-3 w-px bg-navy/15" /><span className="absolute left-[80%] top-[-2px] h-3 w-px bg-navy/15" />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
