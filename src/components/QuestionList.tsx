import { useState } from 'react'
import type { Pregunta } from '../types/clima'
import { Icon, toneIcon } from './IconSprite'
import { Card, SectionHeader } from './ui'
import { formatPercent, toneMeta, toneOf } from '../lib/format'

interface QuestionListProps {
  title?: string
  subtitle?: string
  preguntas: Pregunta[]
  alternatePreguntas?: Pregunta[]
  alternateTitle?: string
  /** Muestra primero las oportunidades cuando existe la lista alternativa. */
  startWithOpportunities?: boolean
  limit?: number
}

export function QuestionList({ title = 'Preguntas', subtitle, preguntas, alternatePreguntas, alternateTitle = 'Oportunidades', startWithOpportunities = true, limit = 5 }: QuestionListProps) {
  const [mode, setMode] = useState<'top' | 'bottom'>(alternatePreguntas && startWithOpportunities ? 'bottom' : 'top')
  const showingAlternate = mode === 'bottom' && Boolean(alternatePreguntas)
  const source = showingAlternate ? alternatePreguntas ?? [] : preguntas
  const items = [...source].sort((a, b) => (showingAlternate ? a.resultado - b.resultado : b.resultado - a.resultado)).slice(0, limit)
  return (
    <Card className="min-w-0 p-6" delay={150}>
      <SectionHeader
        title={title}
        subtitle={subtitle ?? (showingAlternate ? `${alternateTitle}, de menor a mayor` : 'Mejor evaluadas, de mayor a menor')}
        action={alternatePreguntas ? (
          <span className="inline-flex gap-0.5 rounded-full bg-sunken p-[3px]" role="group" aria-label="Orden de las preguntas">
            <button type="button" aria-pressed={!showingAlternate} onClick={() => setMode('top')} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12.5px] ${!showingAlternate ? 'bg-surface font-bold shadow-card' : 'font-semibold text-ink-soft'}`}>Mejor evaluadas</button>
            <button type="button" aria-pressed={showingAlternate} onClick={() => setMode('bottom')} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12.5px] ${showingAlternate ? 'bg-surface font-bold shadow-card' : 'font-semibold text-ink-soft'}`}>Oportunidades</button>
          </span>
        ) : undefined}
      />
      <ol className="mt-3.5 flex flex-col">
        {items.map((pregunta, index) => {
          const tone = toneOf(pregunta.resultado)
          const meta = toneMeta[tone]
          return (
            <li key={`${pregunta.pregunta}-${index}`} className="grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-ctl px-2 py-3 transition hover:bg-sunken">
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px] text-xs font-extrabold" style={{ color: meta.text, background: meta.background }}>{String(index + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold leading-5">{pregunta.pregunta}</p>
                <p className="mt-0.5 text-xs leading-4 text-ink-soft">{pregunta.categoria}</p>
              </div>
              <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full pl-2 pr-2.5 text-[12.5px] font-bold tabular-nums" style={{ color: meta.text, background: meta.background }}>
                <Icon name={toneIcon[tone]} className="h-[13px] w-[13px]" />{formatPercent(pregunta.resultado)}
              </span>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}
