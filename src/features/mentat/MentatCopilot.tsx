import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { replyToMentat, type MentatContext, type MentatDataBlock, type MentatReply } from './index'
import { createMentatReport } from './pdf/report'
import { Icon } from '../../components/IconSprite'
import { usePrefersReducedMotion } from '../../lib/hooks'

interface ChatMessage {
  id: number
  role: 'assistant' | 'user'
  text: string
  question?: string
  source?: string
  sourceHref?: string
  actions?: MentatReply['actions']
  blocks?: MentatReply['blocks']
}

interface ReportArtifact {
  messageId: number
  url: string
  filename: string
}

const initialMessage: ChatMessage = {
  id: 1,
  role: 'assistant',
  text: 'Hola, soy Mentat. Puedo buscar datos del clima, BUK, áreas, subáreas y notas disponibles. ¿Qué quieres revisar?',
  source: 'Mentat · listo para consultar',
}

function Avatar({ size = 32 }: { size?: number }) {
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-full text-white" style={{ width: size, height: size, background: 'linear-gradient(135deg,var(--brand-mid),var(--brand))' }}>
      <Icon name="spark" className={size > 36 ? 'h-5 w-5' : 'h-4 w-4'} />
    </span>
  )
}

function DataBlocks({ blocks }: { blocks: MentatDataBlock[] }) {
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, index) =>
        block.type === 'bars' ? (
          <section key={`${block.type}-${index}`} aria-label={block.title} className="rounded-[14px] bg-surface p-3.5 shadow-card">
            <div className="mb-2.5 flex items-baseline justify-between gap-2"><b className="text-[13px]">{block.title}</b><span className="text-xs text-ink-soft">{block.valueLabel}</span></div>
            <div className="flex flex-col gap-2.5">
              {block.items.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between gap-2 text-[12.5px] font-semibold"><span className="truncate" title={item.label}>{item.label}</span><b className="font-extrabold tabular-nums">{item.displayValue}</b></div>
                  <div className="h-2 rounded-full bg-sunken"><div className="h-2 rounded-full" style={{ width: `${Math.max(4, Math.min(100, (item.value / block.maxValue) * 100))}%`, background: item.fill }} /></div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section key={`${block.type}-${index}`} aria-label={block.title} className="rounded-[14px] bg-surface p-3.5 shadow-card">
            <div className="mb-2 flex justify-between"><b className="text-[13px]">{block.title}</b><span className="text-xs text-ink-soft">Detalle</span></div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[12.5px]">
                <thead><tr>{block.columns.map((column) => <th key={column} className="whitespace-nowrap bg-sunken px-2.5 py-1.5 text-left text-xs font-bold text-ink-soft">{column}</th>)}</tr></thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${row[0] ?? rowIndex}-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className={`whitespace-nowrap border-t border-line-soft px-2.5 py-2 ${cellIndex === 0 ? 'font-bold' : 'tabular-nums'}`}>{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ),
      )}
    </div>
  )
}

function contextLabel(context: MentatContext) {
  if (context.activeDivision) return `${context.activeUnit ?? 'Grupo'} · ${context.activeDivision}`
  if (context.activeUnit) return `Unidad activa · ${context.activeUnit}`
  if (context.pathname === '/gestion-corporativa') return 'Contexto: Gestión Corporativa'
  if (context.pathname === '/organizacion') return 'Contexto: Organización BUK'
  if (context.pathname === '/manual') return 'Contexto: Manual de usuario'
  return 'Contexto: Grupo Emaresa'
}

export function MentatCopilot({ context }: { context: MentatContext }) {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [pending, setPending] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage])
  const [reportArtifact, setReportArtifact] = useState<ReportArtifact | null>(null)
  const [reportError, setReportError] = useState<string | null>(null)
  const [reportRetry, setReportRetry] = useState(0)
  const [preparingReportId, setPreparingReportId] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)

  const close = () => {
    setOpen(false)
    window.setTimeout(() => launcherRef.current?.focus(), 0)
  }

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('mentat:open', onOpen)
    return () => window.removeEventListener('mentat:open', onOpen)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        window.setTimeout(() => launcherRef.current?.focus(), 0)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [messages, open, pending])

  const latestVisualMessage = [...messages].reverse().find((message) => message.role === 'assistant' && message.blocks?.length)

  useEffect(() => () => {
    if (reportArtifact) URL.revokeObjectURL(reportArtifact.url)
  }, [reportArtifact])

  useEffect(() => {
    if (!latestVisualMessage) {
      setReportArtifact(null)
      setReportError(null)
      setPreparingReportId(null)
      return undefined
    }
    let cancelled = false
    setReportArtifact(null)
    setReportError(null)
    setPreparingReportId(latestVisualMessage.id)
    void createMentatReport({
      title: latestVisualMessage.blocks?.[0]?.title ?? 'Informe visual de Mentat',
      question: latestVisualMessage.question ?? 'Consulta visual de datos del sistema',
      summary: latestVisualMessage.text,
      source: latestVisualMessage.source,
      context: context.activeDivision ? `${context.activeUnit ?? 'Grupo'} · ${context.activeDivision}` : context.activeUnit ?? 'Grupo Emaresa',
      blocks: latestVisualMessage.blocks ?? [],
    }).then(({ blob, filename }) => {
      if (cancelled) return
      setReportArtifact({ messageId: latestVisualMessage.id, url: URL.createObjectURL(blob), filename })
    }).catch(() => {
      if (!cancelled) setReportError('No fue posible preparar el informe. Intenta nuevamente.')
    }).finally(() => {
      if (!cancelled) setPreparingReportId(null)
    })
    return () => {
      cancelled = true
    }
  }, [context.activeDivision, context.activeUnit, latestVisualMessage?.id, reportRetry])

  function submitQuestion(event: FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || pending) return
    const stamp = Date.now()
    setMessages((current) => [...current, { id: stamp, role: 'user', text: trimmed, question: trimmed }])
    setQuery('')
    setPending(true)
    window.setTimeout(() => {
      const answer = replyToMentat(trimmed, context)
      setMessages((current) => [...current, { id: stamp + 1, role: 'assistant', question: trimmed, ...answer }])
      setPending(false)
    }, reduced ? 0 : 320)
  }

  const suggestions = [
    { label: 'Resultado global', question: '¿Cuál es el resultado global?' },
    { label: context.activeUnit ? `Oportunidad de ${context.activeUnit}` : 'Oportunidad', question: context.activeUnit ? `¿Cuál es la principal oportunidad de ${context.activeUnit}?` : '¿Cuál es la principal oportunidad?' },
    { label: 'Área con más personas', question: '¿Qué área tiene más personas?' },
  ]

  return (
    <>
      {!open ? (
        <button ref={launcherRef} type="button" aria-label="Abrir Mentat, copiloto de clima" onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-ink p-2.5 text-surface shadow-float transition duration-200 hover:-translate-y-0.5 hover:bg-brand-deep sm:pr-5 max-sm:h-14 max-sm:w-14 max-sm:justify-center max-sm:p-0">
          <Avatar size={38} />
          <span className="hidden text-left sm:block"><b className="block text-sm font-bold">Mentat</b><span className="text-xs opacity-80">Pregunta a los datos</span></span>
        </button>
      ) : (
        <>
          <button type="button" aria-label="Cerrar Mentat" tabIndex={-1} onClick={close} className="fixed inset-0 z-[55] animate-fade bg-[var(--scrim)] sm:hidden" />
          <section role="dialog" aria-modal="false" aria-label="Chat de Mentat" className="fixed bottom-4 right-4 z-[60] flex max-h-[calc(100vh-32px)] w-[420px] max-w-[calc(100vw-32px)] animate-sheet flex-col overflow-hidden rounded-[18px] bg-surface shadow-float max-sm:inset-x-0 max-sm:bottom-0 max-sm:right-0 max-sm:max-h-[85vh] max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none max-sm:rounded-t-[22px]">
            <header className="flex items-center justify-between gap-3 px-[18px] pb-3.5 pt-4">
              <div className="flex min-w-0 items-center gap-3"><Avatar size={42} /><div className="min-w-0"><p className="text-[17px] font-extrabold leading-[22px] tracking-[-0.02em]">Mentat</p><p className="truncate text-[12.5px] text-ink-soft">Copiloto de clima · datos conectados</p></div></div>
              <button type="button" aria-label="Cerrar Mentat" onClick={close} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-sunken text-ink-soft transition hover:text-ink"><Icon name="close" className="h-[18px] w-[18px]" /></button>
            </header>
            <div className="px-[18px] pb-3"><span className="inline-flex h-[30px] items-center gap-2 rounded-full bg-sunken px-3 text-[12.5px] font-semibold text-ink-soft"><span className="h-[7px] w-[7px] rounded-full bg-fav" />{contextLabel(context)}</span></div>

            <div ref={scrollRef} aria-live="polite" className="flex min-h-[180px] flex-1 flex-col gap-3.5 overflow-y-auto bg-canvas p-4 shadow-[inset_0_1px_0_var(--line-soft)]">
              {messages.map((message) => message.role === 'user' ? (
                <div key={message.id} className="flex justify-end"><p className="max-w-[84%] rounded-[16px_6px_16px_16px] bg-brand px-3.5 py-[11px] text-sm font-semibold leading-[21px] text-white">{message.text}</p></div>
              ) : (
                <div key={message.id} className="flex items-start gap-2.5">
                  <Avatar />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="rounded-[6px_16px_16px_16px] bg-surface px-3.5 py-3 text-sm leading-[21px] shadow-card">{message.text.split('\n').map((line, index) => <span key={`${line}-${index}`} className="block">{line}</span>)}</div>
                    {message.blocks ? <DataBlocks blocks={message.blocks} /> : null}
                    {message.source ? <p className="px-0.5 text-xs text-ink-soft">Fuente: {message.sourceHref ? <Link to={message.sourceHref} onClick={close} className="font-bold text-brand-deep hover:underline">{message.source}</Link> : message.source}</p> : null}
                    {message.actions && message.actions.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {message.actions.map((action) => (
                          <Link key={action.href} to={action.href} onClick={close} className="inline-flex h-8 max-w-full items-center gap-1.5 rounded-[9px] bg-surface pl-3 pr-2.5 text-xs font-bold text-brand-deep shadow-[inset_0_0_0_1.5px_var(--line)] transition hover:bg-brand-wash"><span className="truncate">{action.label}</span><Icon name="go" className="h-3 w-3 shrink-0" /></Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              {pending ? (
                <div className="flex items-start gap-2.5" role="status"><Avatar /><div className="flex items-center gap-2.5 rounded-[6px_16px_16px_16px] bg-surface px-4 py-3.5 shadow-card"><span aria-hidden="true" className="flex gap-1.5"><i className="h-[7px] w-[7px] rounded-full bg-brand-mid opacity-40" /><i className="h-[7px] w-[7px] rounded-full bg-brand-mid opacity-70" /><i className="h-[7px] w-[7px] rounded-full bg-brand-mid" /></span><span className="text-[12.5px] font-semibold text-ink-soft">Revisando el snapshot...</span></div></div>
              ) : null}
            </div>

            {latestVisualMessage ? (
              <div className="border-t border-line-soft bg-surface px-4 py-3">
                {reportArtifact?.messageId === latestVisualMessage.id ? (
                  <a href={reportArtifact.url} download={reportArtifact.filename} aria-label="Descargar informe PDF de Mentat" className="flex h-11 w-full items-center justify-center gap-2 rounded-ctl bg-brand text-sm font-bold text-white transition hover:bg-brand-deep"><Icon name="down" className="h-[18px] w-[18px]" />Descargar informe PDF</a>
                ) : (
                  <button type="button" onClick={() => setReportRetry((current) => current + 1)} disabled={preparingReportId !== null} aria-label="Preparar informe PDF de Mentat" className={`flex h-11 w-full items-center justify-center gap-2 rounded-ctl text-sm font-bold transition disabled:cursor-default ${preparingReportId !== null ? 'bg-sunken text-ink-soft' : 'bg-surface text-brand-deep shadow-[inset_0_0_0_1.5px_var(--brand)] hover:bg-brand-wash'}`}>
                    {preparingReportId === latestVisualMessage.id ? <span aria-hidden="true" className="h-[18px] w-[18px] animate-spin rounded-full border-[3px] border-line border-t-brand" /> : <Icon name="down" className="h-[18px] w-[18px]" />}
                    {preparingReportId === latestVisualMessage.id ? 'Preparando informe...' : 'Preparar informe PDF'}
                  </button>
                )}
                {reportError && preparingReportId === null ? <p role="alert" className="mt-2 flex items-center gap-1.5 text-[12.5px] font-semibold text-crit-ink"><Icon name="crit" className="h-3.5 w-3.5" />{reportError}</p> : null}
              </div>
            ) : null}

            <div className="border-t border-line-soft bg-surface px-4 pt-3">
              <p className="mb-2 text-xs font-bold text-ink-soft">Sugerencias</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((item) => (
                  <button key={item.label} type="button" onClick={() => { setQuery(item.question); window.setTimeout(() => inputRef.current?.focus(), 0) }} className="h-8 rounded-full px-3 text-[12.5px] font-semibold shadow-[inset_0_0_0_1.5px_var(--line)] transition hover:bg-brand-wash">{item.label}</button>
                ))}
              </div>
            </div>
            <form className="flex gap-2 bg-surface px-4 pb-4 pt-3" onSubmit={submitQuestion}>
              <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pregunta por un dato del sistema..." aria-label="Pregunta a Mentat" className="h-[46px] min-w-0 flex-1 rounded-ctl bg-sunken px-3.5 text-sm shadow-[inset_0_0_0_1px_var(--line)] placeholder:text-ink-faint" />
              <button type="submit" aria-label="Enviar pregunta" disabled={!query.trim() || pending} className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-ctl bg-brand text-white transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-sunken disabled:text-ink-faint"><Icon name="send" className="h-5 w-5" /></button>
            </form>
          </section>
        </>
      )}
    </>
  )
}
