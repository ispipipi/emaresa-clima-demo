import type { Pregunta } from '../types/clima'
import { formatPercent, resultTone, toneClasses } from '../lib/format'

interface QuestionListProps {
  title: string
  preguntas: Pregunta[]
}

export function QuestionList({ title, preguntas }: QuestionListProps) {
  return (
    <section className="min-w-0 border-t border-emaresa-line pt-5">
      <h2 className="font-display text-xl font-extrabold text-emaresa-text">{title}</h2>
      <ol className="mt-4 divide-y divide-emaresa-line">
        {preguntas.map((pregunta, index) => {
          const tone = resultTone(pregunta.resultado)
          return (
            <li key={`${pregunta.pregunta}-${index}`} className="grid grid-cols-[2rem_1fr_auto] items-start gap-3 py-3">
              <span className="pt-0.5 text-xs font-bold text-emaresa-muted">{String(index + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-5 text-emaresa-text">{pregunta.pregunta}</p>
                <p className="mt-1 text-xs font-medium text-emaresa-muted">{pregunta.categoria}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${toneClasses(tone)}`}>{formatPercent(pregunta.resultado)}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
