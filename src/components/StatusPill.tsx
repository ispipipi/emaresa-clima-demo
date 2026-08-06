import { toneClasses, toneLabel, type Tone } from '../lib/format'

interface StatusPillProps {
  tone: Tone
}

export function StatusPill({ tone }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneClasses(tone)}`}
    >
      {toneLabel(tone)}
    </span>
  )
}
