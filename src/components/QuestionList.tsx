import type { Pregunta } from '../types/clima'
import { formatPercent, resultTone, toneClasses } from '../lib/format'

interface QuestionListProps {
  title: string
  preguntas: Pregunta[]
}

export function QuestionList({ title, preguntas }: QuestionListProps) {
  return (
    <section className="min-w-0 rounded-lg bg-emaresa-card p-5 shadow-sm ring-1 ring-slate-200/80">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <ol className="mt-5 space-y-3">
        {preguntas.map((pregunta, index) => {
          const tone = resultTone(pregunta.resultado)

          return (
            <li
              key={`${pregunta.pregunta}-${index}`}
              className="grid grid-cols-[2rem_1fr] gap-3 rounded-md border border-slate-100 p-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                {index + 1}
              </span>
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-sm font-semibold leading-6 text-emaresa-text">
                    {pregunta.pregunta}
                  </p>
                  <span className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${toneClasses(tone)}`}>
                    {formatPercent(pregunta.resultado)}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {pregunta.categoria}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
