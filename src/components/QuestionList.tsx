import { useState } from 'react'
import type { Pregunta } from '../types/clima'
import { formatPercent, toneMeta, toneOf } from '../lib/format'
import { Card } from './Card'

interface QuestionListProps {
  title?: string
  preguntas: Pregunta[]
  alternatePreguntas?: Pregunta[]
  alternateTitle?: string
}

export function QuestionList({ title = 'Preguntas del clima', preguntas, alternatePreguntas, alternateTitle = 'Oportunidades' }: QuestionListProps) {
  const [mode, setMode] = useState<'top' | 'bottom'>('top')
  const showingAlternate = mode === 'bottom' && Boolean(alternatePreguntas)
  const items = showingAlternate ? alternatePreguntas ?? [] : preguntas
  const orderedItems = [...items]
    .sort((left, right) => showingAlternate ? left.resultado - right.resultado : right.resultado - left.resultado)
    .slice(0, 10)

  return (
    <Card className="min-w-0 p-[22px]" animationDelay={150}>
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-[18px] font-bold leading-tight tracking-[-0.022em] text-navy-ink">{showingAlternate ? alternateTitle : title}</h2>
        {alternatePreguntas && <div className="flex shrink-0 gap-0.5 rounded-full bg-surface-muted p-[3px]">
          <button type="button" className={`rounded-full px-[13px] py-1.5 text-[11.5px] font-semibold transition ${!showingAlternate ? 'bg-white text-ink shadow-sm' : 'text-ink-faint'}`} onClick={() => setMode('top')}>Mejores</button>
          <button type="button" className={`rounded-full px-[13px] py-1.5 text-[11.5px] font-semibold transition ${showingAlternate ? 'bg-white text-ink shadow-sm' : 'text-ink-faint'}`} onClick={() => setMode('bottom')}>Oportunidades</button>
        </div>}
      </div>
      <ol className="mt-[14px] flex flex-col gap-0.5">
        {orderedItems.map((pregunta, index) => {
          const tone = toneOf(pregunta.resultado)
          const meta = toneMeta[tone]
          return (
            <li key={`${pregunta.pregunta}-${index}`} className="grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-2.5 py-[11px] transition hover:bg-surface-sunken">
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px] text-[11px] font-bold" style={{ color: meta.text, backgroundColor: meta.background }}>{String(index + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <p className="text-[12.5px] leading-[1.5] text-ink">{pregunta.pregunta}</p>
                <div className="mt-1.5 flex items-center gap-2.5"><span className="h-[5px] max-w-[120px] flex-1 overflow-hidden rounded-full bg-bar-track"><span className="block h-full rounded-full" style={{ width: `${pregunta.resultado}%`, backgroundColor: meta.fill }} /></span><span className="truncate text-[10.5px] text-ink-ghost">{pregunta.categoria}</span></div>
              </div>
              <span className="rounded-full px-2.5 py-1 font-display text-xs font-bold tabular-nums" style={{ color: meta.text, backgroundColor: meta.background }}>{formatPercent(pregunta.resultado)}</span>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}
