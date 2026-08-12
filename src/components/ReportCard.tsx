import type { ReportDefinition } from '../lib/reports'
import { reportCoverUrl, reportUrl } from '../lib/reports'

interface ReportCardProps {
  report: ReportDefinition
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <article className="group grid w-full max-w-full min-w-0 grid-cols-[112px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 overflow-hidden border-t border-emaresa-line py-5 first:border-t-0 sm:flex sm:gap-5">
      <img
        src={reportCoverUrl(report.cover)}
        alt={`Portada del informe ${report.title}`}
        className="h-20 w-28 shrink-0 rounded-lg border border-emaresa-line object-cover object-top shadow-sm sm:h-24 sm:w-36"
      />
      <div className="min-w-0 max-w-full flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-emaresa-blue">
          <span>{report.scope}</span>
          <span className="text-emaresa-line">/</span>
          <span>PDF original</span>
        </div>
        <h3 className="mt-2 break-words font-display text-lg font-extrabold text-emaresa-text sm:text-xl">{report.title}</h3>
        <p className="mt-1 hidden max-w-2xl truncate text-sm text-emaresa-muted sm:block">{report.description}</p>
      </div>
      <a
        href={reportUrl(report.file)}
        download={report.file}
        className="col-span-2 justify-self-end rounded-lg border border-emaresa-line bg-white px-3 py-2 text-xs font-bold text-emaresa-navy transition hover:border-emaresa-blue hover:text-emaresa-blue sm:col-span-1 sm:shrink-0 sm:px-4 sm:py-2.5 sm:text-sm"
      >
        Descargar <span aria-hidden="true" className="ml-1 text-emaresa-blue">-&gt;</span>
      </a>
    </article>
  )
}
