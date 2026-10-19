import type { Pregunta } from '../types/clima'
import { Card, SectionHeader } from './ui'
import { getActionPlanPeriod, getActionPlans } from '../lib/actionPlans'
import { formatPercent, toneMeta, toneOf } from '../lib/format'

/** Planes de acción de la biblioteca oficial, asociados a las 5 preguntas con menor resultado. */
export function ActionPlanSuggestions({ preguntas }: { preguntas: Pregunta[] }) {
  const focus = [...preguntas].sort((a, b) => a.resultado - b.resultado).slice(0, 5)
  return (
    <Card className="min-w-0 p-6">
      <SectionHeader
        title="Planes de acción sugeridos"
        subtitle={`Asociados a las 5 preguntas con menor resultado · Base oficial ${getActionPlanPeriod()}`}
        action={<span className="inline-flex h-[30px] items-center rounded-full bg-brand-soft px-3 text-[12.5px] font-bold text-brand-deep">Seguimiento</span>}
      />
      <div className="mt-[18px] grid gap-4 lg:grid-cols-2">
        {focus.map((question, index) => {
          const plans = getActionPlans(question.pregunta)
          const meta = toneMeta[toneOf(question.resultado)]
          return (
            <article key={question.pregunta} className="flex flex-col gap-3 rounded-card bg-sunken p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12.5px] font-bold text-brand-deep">Prioridad {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 text-sm font-bold leading-[21px]">{question.pregunta}</h3>
                  <p className="mt-0.5 text-[12.5px] text-ink-soft">{question.categoria}</p>
                </div>
                <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-[12.5px] font-bold tabular-nums" style={{ color: meta.text }}>{formatPercent(question.resultado)}</span>
              </div>
              {plans.length > 0 ? (
                <ol className="flex flex-col gap-2.5 border-t border-line pt-3">
                  {plans.map((plan, planIndex) => (
                    <li key={plan} className="flex gap-2.5 text-[13.5px] leading-5">
                      <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-surface text-xs font-extrabold text-brand-deep">{planIndex + 1}</span>
                      <span>{plan}</span>
                    </li>
                  ))}
                </ol>
              ) : <p className="border-t border-line pt-3 text-[13px] text-ink-soft">Sin plan asociado en la base oficial.</p>}
            </article>
          )
        })}
      </div>
    </Card>
  )
}
