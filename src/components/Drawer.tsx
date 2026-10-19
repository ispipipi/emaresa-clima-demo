import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Icon, type IconName } from './IconSprite'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  eyebrow?: string
  icon?: IconName
  children: ReactNode
}

/** Panel de detalle: lateral en escritorio, hoja inferior en móvil. Esc, fondo y × lo cierran; el foco se atrapa y se devuelve. */
export function Drawer({ open, onClose, title, eyebrow = 'Detalle del indicador', icon = 'ring', children }: DrawerProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex justify-end" role="presentation">
      <button type="button" aria-label="Cerrar detalle" tabIndex={-1} className="absolute inset-0 animate-fade bg-[var(--scrim)]" onClick={onClose} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative flex max-h-[90vh] w-full animate-sheet flex-col gap-4 self-end overflow-y-auto rounded-t-[20px] bg-surface p-6 shadow-float sm:max-h-none sm:h-full sm:w-[440px] sm:animate-drawer sm:self-stretch sm:rounded-none">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-brand-soft text-brand-deep"><Icon name={icon} className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-ink-soft">{eyebrow}</p>
              <h2 id={titleId} className="mt-0.5 text-[22px] font-extrabold leading-7 tracking-[-0.03em]">{title}</h2>
            </div>
          </div>
          <button ref={closeRef} type="button" aria-label="Cerrar detalle" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-sunken text-ink-soft transition hover:text-ink">
            <Icon name="close" className="h-[18px] w-[18px]" />
          </button>
        </div>
        {children}
        <button type="button" onClick={onClose} className="mt-auto h-11 w-full rounded-ctl bg-ink text-sm font-bold text-surface transition hover:bg-brand-deep">Cerrar detalle</button>
      </div>
    </div>
  )
}
