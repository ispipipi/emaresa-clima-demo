import type { Categoria } from '../types/clima'
import { formatPercent, resultTone, toneClasses } from '../lib/format'

interface CategoryBarsProps {
  categorias: Categoria[]
}

export function CategoryBars({ categorias }: CategoryBarsProps) {
  return (
    <section className="min-w-0 border-t border-emaresa-line pt-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emaresa-blue">Lectura temática</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-emaresa-text">Resultado por categoría</h2>
        </div>
        <span className="hidden text-xs font-semibold text-emaresa-muted sm:block">Escala 0 - 100</span>
      </div>
      <div className="mt-6 space-y-5">
        {categorias.map((categoria) => {
          const tone = resultTone(categoria.resultado)
          return (
            <div key={categoria.categoria}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-emaresa-text">{categoria.categoria}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${toneClasses(tone)}`}>{formatPercent(categoria.resultado)}</span>
              </div>
              <div className="h-2 rounded-full bg-emaresa-line/60">
                <div className="h-2 rounded-full bg-emaresa-blue" style={{ width: `${categoria.resultado}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
