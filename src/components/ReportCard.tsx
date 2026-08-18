import type { ReportDefinition } from '../lib/reports'
import { reportCoverUrl, reportUrl } from '../lib/reports'
import { Icon } from './IconSprite'

interface ReportCardProps {
  report: ReportDefinition
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <a href={reportUrl(report.file)} download={report.file} className="group grid min-w-0 grid-cols-[52px_minmax(0,1fr)_34px] items-center gap-[13px] rounded-2xl border border-line-soft bg-surface-sunken p-3 transition hover:border-[#C8E1E5] hover:bg-white">
      <img src={reportCoverUrl(report.cover)} alt={`Portada del informe ${report.title}`} className="h-[66px] w-[52px] rounded-lg border border-line object-cover object-top" />
      <span className="min-w-0">
        <span className="block truncate text-[9.5px] font-bold uppercase tracking-[0.15em] text-teal">{report.scope}</span>
        <span className="mt-1 block break-words font-display text-[13.5px] font-bold leading-[1.35] text-navy-ink">{report.title}</span>
        <span className="mt-1 block truncate text-[11px] font-medium text-ink-faint">PDF original · descarga directa</span>
      </span>
      <span aria-hidden="true" className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-navy text-white transition group-hover:bg-teal"><Icon name="down" className="h-[15px] w-[15px]" /></span>
    </a>
  )
}
