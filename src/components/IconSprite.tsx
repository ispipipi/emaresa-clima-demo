export type IconName = 'grid' | 'bars' | 'org' | 'doc' | 'down' | 'unit' | 'people' | 'ring' | 'layer' | 'chev' | 'arrow' | 'book' | 'play' | 'cursor' | 'close' | 'spark' | 'send'

export function IconSprite() {
  return (
    <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
      <defs>
        <symbol id="ico-grid" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="5" height="5" rx="1.4" fill="currentColor" stroke="none" opacity=".8" /><rect x="12" y="3" width="5" height="5" rx="1.4" /><rect x="3" y="12" width="5" height="5" rx="1.4" /><rect x="12" y="12" width="5" height="5" rx="1.4" fill="currentColor" stroke="none" opacity=".45" /></symbol>
        <symbol id="ico-bars" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 15.5V10M8 15.5V6.5M12 15.5V8.5M16 15.5V4" /></symbol>
        <symbol id="ico-org" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2.5" width="6" height="4.2" rx="1.4" fill="currentColor" stroke="none" opacity=".8" /><rect x="2.5" y="13.3" width="5.2" height="4.2" rx="1.4" /><rect x="12.3" y="13.3" width="5.2" height="4.2" rx="1.4" /><path d="M10 6.7v3.2M5.1 13.2V11h9.8v2.2M14.9 13.2V11" opacity=".65" /></symbol>
        <symbol id="ico-doc" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="4.2" y="2.6" width="11.6" height="14.8" rx="2.6" /><path d="M7.2 7.2h5.6M7.2 10.2h5.6M7.2 13.2h3.2" opacity=".7" /></symbol>
        <symbol id="ico-down" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 3v8.4M6.6 8.4 10 11.9l3.4-3.5M4.4 16.2h11.2" /></symbol>
        <symbol id="ico-unit" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="2.8" y="4.6" width="14.4" height="11.4" rx="2.6" /><path d="M2.8 8.6h14.4" opacity=".7" /><rect x="5.4" y="10.8" width="3.2" height="3" rx="1" fill="currentColor" stroke="none" opacity=".55" /></symbol>
        <symbol id="ico-people" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="10" cy="6.8" r="3" /><path d="M4 16.6c0-2.7 2.7-4.4 6-4.4s6 1.7 6 4.4" /></symbol>
        <symbol id="ico-ring" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="10" cy="10" r="7" strokeDasharray="1 4.1" opacity=".85" /><circle cx="10" cy="10" r="2.8" fill="currentColor" stroke="none" /></symbol>
        <symbol id="ico-layer" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3.4" y="2.8" width="13.2" height="4.2" rx="1.6" fill="currentColor" stroke="none" /><rect x="3.4" y="8.4" width="13.2" height="4.2" rx="1.6" opacity=".65" /><rect x="3.4" y="14" width="13.2" height="3.4" rx="1.4" opacity=".35" /></symbol>
        <symbol id="ico-chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m7.6 4.4 5.6 5.6-5.6 5.6" /></symbol>
        <symbol id="ico-arrow" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6.4 13.6 13.6 6.4M7.9 6.4h5.7v5.7" /></symbol>
        <symbol id="ico-book" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3.4 4.2c0-.9.7-1.6 1.6-1.6h4.2c.8 0 1.4.6 1.4 1.4v12.4c0-.7-.6-1.3-1.4-1.3H5c-.9 0-1.6-.7-1.6-1.6z" fill="currentColor" stroke="none" opacity=".9" /><path d="M16.6 4.2c0-.9-.7-1.6-1.6-1.6h-4.2c-.8 0-1.4.6-1.4 1.4v12.4c0-.7.6-1.3 1.4-1.3H15c.9 0 1.6-.7 1.6-1.6z" /></symbol>
        <symbol id="ico-play" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.2" /><path d="M8.6 7.3 12.8 10l-4.2 2.7z" fill="currentColor" stroke="none" /></symbol>
        <symbol id="ico-cursor" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4.6 3.4l3.1 12.4 2.1-4.6 4.6-2.1z" fill="currentColor" stroke="none" opacity=".9" /><path d="M11.6 11.6l3.4 3.4" opacity=".55" /></symbol>
        <symbol id="ico-close" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="m5.5 5.5 9 9M14.5 5.5l-9 9" /></symbol>
        <symbol id="ico-spark" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"><path d="m10 2.8 1.2 4.1a2.8 2.8 0 0 0 1.9 1.9l4.1 1.2-4.1 1.2a2.8 2.8 0 0 0-1.9 1.9L10 17.2l-1.2-4.1a2.8 2.8 0 0 0-1.9-1.9l-4.1-1.2 4.1-1.2a2.8 2.8 0 0 0 1.9-1.9z" /><path d="m16.2 3.2.35 1.2M17.8 4.8l-1.2.35" opacity=".65" /></symbol>
        <symbol id="ico-send" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.4 3.8 13.2 5.4-13.2 5.4 2.1-5.4z" fill="currentColor" stroke="none" opacity=".3" /><path d="m3.4 3.8 13.2 5.4-13.2 5.4 2.1-5.4zM5.5 9.2h7.2" /></symbol>
      </defs>
    </svg>
  )
}

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return <svg aria-hidden="true" className={className}><use href={`#ico-${name}`} /></svg>
}
