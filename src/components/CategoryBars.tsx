import type { Categoria } from '../types/clima'
import { formatPercent, resultTone, toneClasses } from '../lib/format'

interface CategoryBarsProps {
  categorias: Categoria[]
}

export function CategoryBars({ categorias }: CategoryBarsProps) {
  return (
    <section className="min-w-0 rounded-lg bg-emaresa-card p-5 shadow-sm ring-1 ring-slate-200/80">
      <div>
        <p className="text-sm font-semibold uppercase text-emaresa-blue">
          Categorías
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold">
          Resultado por categoría
        </h2>
      </div>

      <div className="mt-6 space-y-5">
        {categorias.map((categoria) => {
          const tone = resultTone(categoria.resultado)

          return (
            <div key={categoria.categoria}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-700">
                  {categoria.categoria}
                </span>
                <span className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${toneClasses(tone)}`}>
                  {formatPercent(categoria.resultado)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emaresa-blue"
                  style={{ width: `${categoria.resultado}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
