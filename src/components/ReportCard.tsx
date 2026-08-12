import type { ReportDefinition } from '../lib/reports'
import { reportCoverUrl, reportUrl } from '../lib/reports'

interface ReportCardProps {
  report: ReportDefinition
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <article className="min-w-0 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200/80">
      <div className="grid min-w-0 grid-cols-1 sm:grid-cols-[180px_minmax(0,1fr)]">
        <div className="min-w-0 bg-slate-100 p-3 sm:p-4">
          <img
            src={reportCoverUrl(report.cover)}
            alt={`Portada del informe ${report.title}`}
            className="aspect-video min-w-0 w-full max-w-full rounded-md object-contain shadow-sm"
          />
        </div>
        <div className="flex min-w-0 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-emaresa-blue">
            <span>{report.scope}</span>
            <span className="text-slate-300">/</span>
            <span>PDF original</span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-bold text-emaresa-text">
            {report.title}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            {report.description}
          </p>
          <div className="mt-auto pt-6">
            <a
              href={reportUrl(report.file)}
              download={report.file}
              className="inline-flex items-center rounded-md bg-emaresa-navy px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emaresa-blue focus:outline-none focus:ring-2 focus:ring-emaresa-gold focus:ring-offset-2"
            >
              Descargar informe
              <span aria-hidden="true" className="ml-2 text-emaresa-gold">
                -&gt;
              </span>
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
