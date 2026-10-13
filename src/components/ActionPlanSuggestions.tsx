import type { Pregunta } from '../types/clima'
import { getActionPlanPeriod, getActionPlans } from '../lib/actionPlans'
import { formatPercent } from '../lib/format'
import { Card } from './Card'
import { SectionHeader } from './SectionHeader'

interface ActionPlanSuggestionsProps {
  preguntas: Pregunta[]
}

export function ActionPlanSuggestions({ preguntas }: ActionPlanSuggestionsProps) {
  const focusQuestions = [...preguntas]
    .sort((left, right) => left.resultado - right.resultado)
    .slice(0, 5)

  return (
    <Card className="min-w-0 p-[22px]">
      <SectionHeader
        title="Planes de acción sugeridos"
        subtitle={`Recomendaciones asociadas a las 5 preguntas con menor resultado · Base oficial ${getActionPlanPeriod()}`}
        chip={<span className="rounded-full bg-surface-accent px-3 py-1.5 text-[11px] font-semibold text-teal">Seguimiento</span>}
      />
      <div className="mt-[18px] grid gap-3 lg:grid-cols-2">
        {focusQuestions.map((question, index) => {
          const plans = getActionPlans(question.pregunta)
          return (
            <article key={question.pregunta} className="rounded-2xl border border-line-soft bg-surface-sunken p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal">Prioridad {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1.5 text-[13px] font-semibold leading-5 text-ink">{question.pregunta}</h3>
                  <p className="mt-1 text-[11px] text-ink-faint">{question.categoria}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 font-display text-xs font-bold tabular-nums text-ink">{formatPercent(question.resultado)}</span>
              </div>
              <ol className="mt-3 space-y-2 border-t border-line-soft pt-3">
                {plans.map((plan, planIndex) => (
                  <li key={plan} className="flex gap-2.5 text-[12px] leading-5 text-ink-soft">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-teal">{planIndex + 1}</span>
                    <span>{plan}</span>
                  </li>
                ))}
              </ol>
            </article>
          )
        })}
      </div>
    </Card>
  )
}
