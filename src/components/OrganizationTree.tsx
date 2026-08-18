import { useState } from 'react'
import type { BukAreaNode, BukCompany } from '../types/buk'
import { formatPlain } from '../lib/format'

function ToggleGlyph({ open, leaf = false }: { open: boolean; leaf?: boolean }) {
  return <span aria-hidden="true" className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[9px] text-[15px] font-semibold leading-none ${leaf ? 'text-[#C2D6E9]' : 'border border-[#D8E5F2] bg-white text-teal'}`}>{leaf ? '·' : open ? '−' : '+'}</span>
}

function AreaBranch({ area }: { area: BukAreaNode }) {
  const [open, setOpen] = useState(area.depth < 1)
  const hasChildren = area.children.length > 0
  const contentId = `buk-area-${area.id}`

  return (
    <div>
      <button type="button" aria-expanded={hasChildren ? open : undefined} aria-controls={hasChildren ? contentId : undefined} className="flex w-full items-center gap-2 rounded-xl py-2 text-left hover:bg-surface-accent" style={{ paddingLeft: `${10 + area.depth * 20}px` }} onClick={() => hasChildren && setOpen((current) => !current)}>
        <ToggleGlyph open={open} leaf={!hasChildren} />
        <span className={`min-w-0 flex-1 truncate text-[12px] ${area.depth === 0 ? 'font-semibold' : 'font-medium'} text-ink`}>{area.name}</span>
        <span className="shrink-0 pr-2 text-[11.5px] font-semibold tabular-nums text-ink-soft">{formatPlain(area.employeeCount)} personas</span>
      </button>
      {hasChildren && open && <div id={contentId}>{area.children.map((child) => <AreaBranch key={child.id} area={child} />)}</div>}
    </div>
  )
}

function CompanyBranch({ company }: { company: BukCompany }) {
  const [open, setOpen] = useState(true)
  const contentId = `buk-company-${company.id}`
  return (
    <section className="overflow-hidden rounded-2xl border border-line-soft bg-surface-sunken">
      <button type="button" aria-expanded={open} aria-controls={contentId} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface-accent" onClick={() => setOpen((current) => !current)}>
        <ToggleGlyph open={open} />
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-bold uppercase tracking-[0.17em] text-ink-ghost">Empresa</span>
          <span className="mt-1 block truncate font-display text-[14.5px] font-bold text-navy-ink">{company.name}</span>
        </span>
        <span className="shrink-0 text-right"><span className="block font-display text-[19px] font-extrabold leading-none tracking-[-0.03em] text-navy-ink">{formatPlain(company.employeeCount)}</span><span className="mt-1 block text-[10px] font-semibold text-ink-faint">personas</span></span>
      </button>
      {open && <div id={contentId} className="border-t border-[#E8F1F9] bg-white px-2 pb-2 pt-1">{company.areas.length > 0 ? company.areas.map((area) => <AreaBranch key={area.id} area={area} />) : <p className="px-3 py-4 text-sm text-ink-faint">Sin áreas con personas activas.</p>}</div>}
    </section>
  )
}

export function OrganizationTree({ companies }: { companies: BukCompany[] }) {
  return <div className="flex flex-col gap-[10px]">{companies.map((company) => <CompanyBranch key={company.id} company={company} />)}</div>
}
