import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, toneIcon, type IconName } from './IconSprite'
import { clima, divisionPath, unitPath } from '../lib/clima'
import { formatPercent, toneMeta, toneOf, type Tone } from '../lib/format'

interface PaletteItem {
  id: string
  label: string
  hint?: string
  group: 'Vistas' | 'Unidades' | 'Divisiones'
  icon: IconName
  to?: string
  action?: () => void
  tone?: Tone
  value?: string
}

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const items: PaletteItem[] = [
  { id: 'v-home', label: 'Resumen ejecutivo', group: 'Vistas', icon: 'grid', to: '/' },
  { id: 'v-corp', label: 'Gestión Corporativa', group: 'Vistas', icon: 'bars', to: '/gestion-corporativa' },
  { id: 'v-buk', label: 'Organización BUK', group: 'Vistas', icon: 'org', to: '/organizacion' },
  { id: 'v-mentat', label: 'Preguntar a Mentat', group: 'Vistas', icon: 'spark', action: () => window.dispatchEvent(new CustomEvent('mentat:open')) },
  { id: 'v-manual', label: 'Manual de usuario', group: 'Vistas', icon: 'book', to: '/manual' },
  ...clima.global.ranking_unidades.map((ranking): PaletteItem => ({ id: `u-${ranking.unidad}`, label: ranking.unidad, group: 'Unidades', icon: toneIcon[toneOf(ranking.resultado)], to: unitPath(ranking.unidad), tone: toneOf(ranking.resultado), value: formatPercent(ranking.resultado) })),
  ...clima.unidades.flatMap((unit) => unit.divisiones.map((division): PaletteItem => ({ id: `d-${unit.unidad}-${division.nombre}`, label: division.nombre, hint: unit.unidad, group: 'Divisiones', icon: toneIcon[toneOf(division.resultado)], to: divisionPath(unit.unidad, division.nombre), tone: toneOf(division.resultado), value: formatPercent(division.resultado) }))),
]

/** Paleta de comandos (Ctrl/⌘ K): salta a cualquier vista, unidad o división. */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const results = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return items
    return items.filter((item) => normalize(`${item.label} ${item.hint ?? ''}`).includes(q))
  }, [query])

  useEffect(() => {
    if (!open) return undefined
    setQuery('')
    setActive(0)
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30)
    return () => window.clearTimeout(timer)
  }, [open])

  if (!open) return null

  const choose = (item: PaletteItem) => {
    onClose()
    if (item.action) item.action()
    else if (item.to) navigate(item.to)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') onClose()
    else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((current) => Math.min(results.length - 1, current + 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((current) => Math.max(0, current - 1))
    } else if (event.key === 'Enter' && results[active]) {
      event.preventDefault()
      choose(results[active])
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]" role="presentation">
      <button type="button" aria-label="Cerrar búsqueda" tabIndex={-1} className="absolute inset-0 animate-fade bg-[var(--scrim)]" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Buscar unidad, división o vista" className="relative flex max-h-[70vh] w-full max-w-[600px] animate-sheet flex-col overflow-hidden rounded-card bg-surface shadow-float">
        <div className="flex items-center gap-3 border-b border-line-soft px-4">
          <Icon name="search" className="h-5 w-5 shrink-0 text-ink-soft" />
          <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0) }} onKeyDown={onKeyDown} role="combobox" aria-expanded="true" aria-controls={listId} aria-activedescendant={results[active] ? `${listId}-${active}` : undefined} placeholder="Buscar unidad, división o vista" aria-label="Buscar" className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-ink-faint" />
          <kbd className="rounded-[7px] bg-sunken px-2 py-0.5 text-xs font-semibold text-ink-soft">Esc</kbd>
        </div>
        <ul id={listId} role="listbox" aria-label="Resultados" className="overflow-y-auto p-2">
          {results.length === 0 ? <li className="px-4 py-8 text-center text-sm text-ink-soft">Sin resultados para “{query}”.</li> : null}
          {results.map((item, index) => (
            <li key={item.id} role="presentation">
              {index === 0 || results[index - 1].group !== item.group ? <p className="px-3 pb-1 pt-3 text-xs font-semibold text-ink-soft">{item.group}</p> : null}
              <button type="button" id={`${listId}-${index}`} role="option" aria-selected={index === active} onMouseEnter={() => setActive(index)} onClick={() => choose(item)} className={`flex min-h-11 w-full items-center gap-3 rounded-ctl px-3 text-left text-sm transition ${index === active ? 'bg-brand-soft text-brand-deep' : ''}`}>
                <span style={{ color: item.tone ? toneMeta[item.tone].fill : undefined }}><Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" /></span>
                <span className="min-w-0 flex-1 truncate font-semibold">{item.label}{item.hint ? <span className="font-normal text-ink-soft"> · {item.hint}</span> : null}</span>
                {item.value ? <span className="text-[12.5px] font-semibold tabular-nums text-ink-soft">{item.value}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
