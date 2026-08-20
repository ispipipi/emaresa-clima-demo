import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { replyToMentat, type MentatContext, type MentatDataBlock, type MentatReply } from '../lib/mentat'
import { Icon } from './IconSprite'

interface ChatMessage {
  id: number
  role: 'assistant' | 'user'
  text: string
  source?: string
  sourceHref?: string
  actions?: MentatReply['actions']
  blocks?: MentatReply['blocks']
}

const initialMessage: ChatMessage = {
  id: 1,
  role: 'assistant',
  text: 'Hola, soy Mentat. Puedo buscar datos del clima, BUK, áreas, subáreas y notas disponibles. ¿Qué quieres revisar?',
  source: 'Mentat · listo para consultar',
}

function MentatAvatar({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`mentat-avatar ${compact ? 'mentat-avatar--compact' : ''}`} aria-hidden="true">
      <span className="mentat-avatar__halo" />
      <span className="mentat-avatar__face"><span /><span /></span>
      <span className="mentat-avatar__mark">M</span>
    </span>
  )
}

function renderMessageText(text: string) {
  return text.split('\n').map((line, index) => <span key={`${line}-${index}`} className="block">{line}</span>)
}

function MentatDataBlocks({ blocks }: { blocks: MentatDataBlock[] }) {
  return <div className="mentat-data-blocks">
    {blocks.map((block, index) => block.type === 'bars' ? <section key={`${block.type}-${index}`} className="mentat-data-card" aria-label={block.title}>
      <div className="mentat-data-card__heading"><strong>{block.title}</strong><span>{block.valueLabel}</span></div>
      <div className="mentat-bars">
        {block.items.map((item) => <div key={item.label} className="mentat-bar-row">
          <div className="mentat-bar-label"><span title={item.label}>{item.label}</span><strong>{item.displayValue}</strong></div>
          <div className="mentat-bar-track"><span className="mentat-bar-fill" style={{ width: `${Math.max(4, Math.min(100, (item.value / block.maxValue) * 100))}%`, backgroundColor: item.fill }} /></div>
        </div>)}
      </div>
    </section> : <section key={`${block.type}-${index}`} className="mentat-data-card" aria-label={block.title}>
      <div className="mentat-data-card__heading"><strong>{block.title}</strong><span>Detalle</span></div>
      <div className="mentat-table-wrap"><table className="mentat-table"><thead><tr>{block.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={`${row[0] ?? rowIndex}-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className={cellIndex === 0 ? 'mentat-table__label' : ''}>{cell}</td>)}</tr>)}</tbody></table></div>
    </section>)}
  </div>
}

export function MentatCopilot({ context }: { context: MentatContext }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage])
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKeyDown)
    window.setTimeout(() => inputRef.current?.focus(), 80)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [messages, open])

  function submitQuestion(event: FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    const answer = replyToMentat(trimmed, context)
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: 'user', text: trimmed },
      { id: Date.now() + 1, role: 'assistant', ...answer },
    ])
    setQuery('')
  }

  function askSuggestedQuestion(value: string) {
    setQuery(value)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <>
      {!open && <button type="button" className="mentat-launcher" aria-label="Abrir Mentat, copiloto de clima" onClick={() => setOpen(true)}><MentatAvatar compact /><span><strong>Mentat</strong><small>Copiloto de clima</small></span><Icon name="spark" className="h-4 w-4 text-teal-light" /></button>}

      {open && <section className="mentat-panel" role="dialog" aria-modal="false" aria-label="Chat de Mentat">
        <header className="mentat-panel__header">
          <div className="flex min-w-0 items-center gap-3"><MentatAvatar /><div className="min-w-0"><p className="truncate text-[15px] font-bold text-white">Mentat</p><p className="mt-0.5 truncate text-[11px] text-white/55">Copiloto de clima · datos conectados</p></div></div>
          <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/65 transition hover:bg-white/10 hover:text-white" aria-label="Cerrar Mentat" onClick={() => setOpen(false)}><Icon name="close" className="h-5 w-5" /></button>
        </header>

        <div className="mentat-panel__context"><span className="h-1.5 w-1.5 rounded-full bg-[#45D596]" />{context.activeDivision ? `${context.activeUnit ?? 'Grupo'} · ${context.activeDivision}` : context.activeUnit ? `Unidad activa · ${context.activeUnit}` : 'Contexto: Grupo Emaresa'}</div>

        <div ref={scrollRef} className="mentat-panel__messages" aria-live="polite">
          {messages.map((message) => <div key={message.id} className={`mentat-message ${message.role === 'user' ? 'mentat-message--user' : ''}`}>
            {message.role === 'assistant' && <MentatAvatar compact />}
            <div className="min-w-0 max-w-[calc(100%-42px)]">
              <div className="mentat-bubble">{renderMessageText(message.text)}</div>
              {message.blocks && <MentatDataBlocks blocks={message.blocks} />}
              {message.source && <div className="mt-1.5 px-1 text-[10px] text-ink-faint">{message.sourceHref ? <Link to={message.sourceHref} className="font-semibold text-teal hover:underline">{message.source}</Link> : message.source}</div>}
              {message.actions && message.actions.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{message.actions.map((action) => <Link key={action.href} to={action.href} onClick={() => setOpen(false)} className="inline-flex max-w-full items-center gap-1 rounded-lg border border-[#DCE9F4] bg-white px-2.5 py-1.5 text-[10.5px] font-semibold text-teal hover:border-teal"><span className="truncate">{action.label}</span><Icon name="arrow" className="h-3 w-3 shrink-0" /></Link>)}</div>}
            </div>
          </div>)}
        </div>

        <div className="mentat-panel__suggestions"><span className="text-[9px] font-bold uppercase tracking-[0.17em] text-ink-ghost">Sugerencias</span><div className="mt-2 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><button type="button" onClick={() => askSuggestedQuestion('¿Cuál es el resultado global?')}>Resultado global</button><button type="button" onClick={() => askSuggestedQuestion(context.activeUnit ? `¿Cuál es la principal oportunidad de ${context.activeUnit}?` : '¿Cuál es la principal oportunidad?')}>Oportunidad</button><button type="button" onClick={() => askSuggestedQuestion('¿Qué área tiene más personas?')}>Área con más personas</button></div></div>

        <form className="mentat-panel__form" onSubmit={submitQuestion}><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pregunta por un dato del sistema..." aria-label="Pregunta a Mentat" /><button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-40" aria-label="Enviar pregunta" disabled={!query.trim()}><Icon name="send" className="h-[17px] w-[17px]" /></button></form>
      </section>}
    </>
  )
}
