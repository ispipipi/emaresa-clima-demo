import type { ReactNode } from 'react'
import type { Tone } from '../lib/format'

export type IconName =
  | 'grid' | 'bars' | 'org' | 'doc' | 'down' | 'unit' | 'people' | 'ring' | 'layer' | 'chev' | 'arrow' | 'book'
  | 'play' | 'cursor' | 'close' | 'spark' | 'send' | 'search' | 'calendar' | 'panel' | 'sync' | 'ok' | 'warn'
  | 'crit' | 'info' | 'lock' | 'eye' | 'go' | 'back' | 'chevDown' | 'enter'

// Los íconos de 20 px del set anterior se escalan a la cuadrícula de 24 px.
const g = (children: ReactNode, width = 1.4) => (
  <g transform="scale(1.2)" strokeWidth={width}>{children}</g>
)

const paths: Record<IconName, ReactNode> = {
  grid: g(<><rect x="3" y="3" width="5" height="5" rx="1.4" fill="currentColor" stroke="none" opacity=".8" /><rect x="12" y="3" width="5" height="5" rx="1.4" /><rect x="3" y="12" width="5" height="5" rx="1.4" /><rect x="12" y="12" width="5" height="5" rx="1.4" fill="currentColor" stroke="none" opacity=".45" /></>),
  bars: g(<path d="M4 15.5V10M8 15.5V6.5M12 15.5V8.5M16 15.5V4" />, 1.5),
  org: g(<><rect x="7" y="2.5" width="6" height="4.2" rx="1.4" fill="currentColor" stroke="none" opacity=".8" /><rect x="2.5" y="13.3" width="5.2" height="4.2" rx="1.4" /><rect x="12.3" y="13.3" width="5.2" height="4.2" rx="1.4" /><path d="M10 6.7v3.2M5.1 13.2V11h9.8v2.2M14.9 13.2V11" opacity=".65" /></>),
  doc: g(<><rect x="4.2" y="2.6" width="11.6" height="14.8" rx="2.6" /><path d="M7.2 7.2h5.6M7.2 10.2h5.6M7.2 13.2h3.2" opacity=".7" /></>),
  down: g(<path d="M10 3v8.4M6.6 8.4 10 11.9l3.4-3.5M4.4 16.2h11.2" />, 1.5),
  unit: g(<><rect x="2.8" y="4.6" width="14.4" height="11.4" rx="2.6" /><path d="M2.8 8.6h14.4" opacity=".7" /><rect x="5.4" y="10.8" width="3.2" height="3" rx="1" fill="currentColor" stroke="none" opacity=".55" /></>),
  people: g(<><circle cx="10" cy="6.8" r="3" /><path d="M4 16.6c0-2.7 2.7-4.4 6-4.4s6 1.7 6 4.4" /></>),
  ring: g(<><circle cx="10" cy="10" r="7" strokeDasharray="1 4.1" opacity=".85" /><circle cx="10" cy="10" r="2.8" fill="currentColor" stroke="none" /></>, 1.5),
  layer: g(<><rect x="3.4" y="2.8" width="13.2" height="4.2" rx="1.6" fill="currentColor" stroke="none" /><rect x="3.4" y="8.4" width="13.2" height="4.2" rx="1.6" opacity=".65" /><rect x="3.4" y="14" width="13.2" height="3.4" rx="1.4" opacity=".35" /></>),
  chev: <path d="M9.5 6l6 6-6 6" strokeWidth="2.2" />,
  arrow: g(<path d="M6.4 13.6 13.6 6.4M7.9 6.4h5.7v5.7" />, 1.6),
  book: g(<><path d="M3.4 4.2c0-.9.7-1.6 1.6-1.6h4.2c.8 0 1.4.6 1.4 1.4v12.4c0-.7-.6-1.3-1.4-1.3H5c-.9 0-1.6-.7-1.6-1.6z" fill="currentColor" stroke="none" opacity=".9" /><path d="M16.6 4.2c0-.9-.7-1.6-1.6-1.6h-4.2c-.8 0-1.4.6-1.4 1.4v12.4c0-.7.6-1.3 1.4-1.3H15c.9 0 1.6-.7 1.6-1.6z" /></>),
  play: g(<><circle cx="10" cy="10" r="7.2" /><path d="M8.6 7.3 12.8 10l-4.2 2.7z" fill="currentColor" stroke="none" /></>),
  cursor: g(<path d="M4.6 3.4l3.1 12.4 2.1-4.6 4.6-2.1z" fill="currentColor" stroke="none" opacity=".9" />),
  close: g(<path d="m5.5 5.5 9 9M14.5 5.5l-9 9" />, 1.6),
  spark: g(<><path d="m10 2.8 1.2 4.1a2.8 2.8 0 0 0 1.9 1.9l4.1 1.2-4.1 1.2a2.8 2.8 0 0 0-1.9 1.9L10 17.2l-1.2-4.1a2.8 2.8 0 0 0-1.9-1.9l-4.1-1.2 4.1-1.2a2.8 2.8 0 0 0 1.9-1.9z" /><path d="m16.2 3.2.35 1.2M17.8 4.8l-1.2.35" opacity=".65" /></>, 1.35),
  send: g(<path d="m3.4 3.8 13.2 5.4-13.2 5.4 2.1-5.4zM5.5 9.2h7.2" />, 1.5),
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>,
  calendar: <><rect x="4" y="5.5" width="16" height="14.5" rx="3" /><path d="M4 10.5h16M8.5 3.5v3.5M15.5 3.5v3.5" /></>,
  panel: <><rect x="3.5" y="4.5" width="17" height="15" rx="3.5" /><path d="M9.5 4.5v15" /></>,
  sync: <path d="M19.5 11A7.5 7.5 0 0 0 6.2 6.8M4.5 4v3.5H8M4.5 13a7.5 7.5 0 0 0 13.3 4.2M19.5 20v-3.5H16" />,
  ok: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM8 12.5l3 3 5-6" strokeWidth="2.2" />,
  warn: <path d="M12 4l9 15.5H3L12 4zM12 10v4M12 16.8v.01" strokeWidth="2.2" />,
  crit: <path d="M12 3l9 9-9 9-9-9 9-9zM9 9l6 6M15 9l-6 6" strokeWidth="2.2" />,
  info: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM12 11v5M12 8v.01" strokeWidth="2" />,
  lock: <><rect x="5" y="10.5" width="14" height="9.5" rx="2.6" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
  go: <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" strokeWidth="2" />,
  chevDown: <path d="M6.5 9.5l5.5 5.5 5.5-5.5" strokeWidth="2" />,
  enter: <path d="M9 7l-4 5 4 5M5 12h11a3 3 0 0 0 3-3V6" />,
}

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  )
}

/** Forma del icono de cada estado: círculo con check, triángulo, rombo con X. */
export const toneIcon: Record<Tone, IconName> = { green: 'ok', yellow: 'warn', red: 'crit', neutral: 'info' }

/** Compatibilidad: el set ahora se dibuja en línea, ya no hace falta un sprite global. */
export function IconSprite() {
  return null
}
