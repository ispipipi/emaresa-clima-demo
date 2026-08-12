import type { BukAreaNode, BukCompany } from '../types/buk'

function AreaBranch({ area }: { area: BukAreaNode }) {
  return (
    <details className="group border-l border-slate-200 pl-4" open={area.depth < 2}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md px-3 py-3 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-xs font-bold text-emaresa-blue group-open:rotate-90">-&gt;</span>
          <span className="truncate text-sm font-semibold text-emaresa-text">{area.name}</span>
        </span>
        <span className="shrink-0 text-xs font-bold text-slate-500">
          {area.employeeCount} personas
        </span>
      </summary>
      {area.children.length > 0 && (
        <div className="ml-2 space-y-1 pb-2 pt-1">
          {area.children.map((child) => (
            <AreaBranch key={child.id} area={child} />
          ))}
        </div>
      )}
    </details>
  )
}

export function OrganizationTree({ companies }: { companies: BukCompany[] }) {
  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <details key={company.id} className="rounded-lg bg-white shadow-sm ring-1 ring-slate-200/80" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="block text-xs font-bold uppercase tracking-wide text-emaresa-blue">Empresa</span>
              <span className="mt-1 block font-display text-xl font-bold text-emaresa-text">{company.name}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block font-display text-2xl font-extrabold text-emaresa-text">{company.employeeCount}</span>
              <span className="text-xs font-semibold text-slate-500">personas activas</span>
            </span>
          </summary>
          <div className="border-t border-slate-200 px-5 py-3">
            {company.areas.length > 0 ? (
              <div className="space-y-1">
                {company.areas.map((area) => (
                  <AreaBranch key={area.id} area={area} />
                ))}
              </div>
            ) : (
              <p className="py-3 text-sm text-slate-500">Sin áreas con personas activas en la sincronización.</p>
            )}
          </div>
        </details>
      ))}
    </div>
  )
}
