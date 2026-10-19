import { useMemo, useState } from 'react'
import type { BukAreaNode, BukCompany } from '../types/buk'
import { Icon } from './IconSprite'
import { formatPercent, formatPlain } from '../lib/format'

interface FlatRow {
  key: string
  name: string
  count: number
  share: number
  depth: number
  isCompany: boolean
  hasKids: boolean
}

/** La raíz del área que repite el nombre de la empresa se omite: empresa → área → subárea. */
function areasOf(company: BukCompany): BukAreaNode[] {
  const only = company.areas.length === 1 ? company.areas[0] : undefined
  return only && only.employeeCount === company.employeeCount ? only.children : company.areas
}

function allKeys(companies: BukCompany[]): Record<string, boolean> {
  const keys: Record<string, boolean> = {}
  const walk = (area: BukAreaNode) => {
    if (area.children.length > 0) {
      keys[`a${area.id}`] = true
      area.children.forEach(walk)
    }
  }
  companies.forEach((company) => {
    keys[`c${company.id}`] = true
    areasOf(company).forEach(walk)
  })
  return keys
}

export function OrganizationTree({ companies }: { companies: BukCompany[] }) {
  const total = companies.reduce((sum, company) => sum + company.employeeCount, 0)
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const biggest = [...companies].sort((a, b) => b.employeeCount - a.employeeCount)[0]
    if (!biggest) return {}
    const topArea = [...areasOf(biggest)].sort((a, b) => b.employeeCount - a.employeeCount)[0]
    return { [`c${biggest.id}`]: true, ...(topArea && topArea.children.length > 0 ? { [`a${topArea.id}`]: true } : {}) }
  })

  const rows = useMemo(() => {
    const out: FlatRow[] = []
    const addArea = (area: BukAreaNode, companyTotal: number, depth: number) => {
      out.push({ key: `a${area.id}`, name: area.name, count: area.employeeCount, share: area.employeeCount / companyTotal, depth, isCompany: false, hasKids: area.children.length > 0 })
      if (area.children.length > 0 && open[`a${area.id}`]) area.children.forEach((child) => addArea(child, companyTotal, depth + 1))
    }
    companies.forEach((company) => {
      out.push({ key: `c${company.id}`, name: company.name, count: company.employeeCount, share: company.employeeCount / total, depth: 0, isCompany: true, hasKids: true })
      if (open[`c${company.id}`]) areasOf(company).forEach((area) => addArea(area, company.employeeCount, 1))
    })
    return out
  }, [companies, open, total])

  const toggle = (key: string) => setOpen((current) => ({ ...current, [key]: !current[key] }))
  const outline = 'h-10 rounded-ctl bg-surface px-4 text-[13px] font-bold shadow-[inset_0_0_0_1.5px_var(--line)] transition hover:bg-sunken'

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13.5px] text-ink-soft">{rows.length} filas visibles</p>
        <div className="flex gap-2">
          <button type="button" className={outline} onClick={() => setOpen(allKeys(companies))}>Expandir todo</button>
          <button type="button" className={outline} onClick={() => setOpen({})}>Contraer todo</button>
        </div>
      </div>
      <div className="mt-3 hidden grid-cols-[minmax(0,1fr)_210px_130px] gap-4 px-3.5 pb-2 text-[12.5px] font-bold text-ink-soft md:grid">
        <span>Empresa y áreas</span><span>Peso dentro del nivel superior</span><span className="text-right">Personas</span>
      </div>
      <ul className="flex flex-col gap-1">
        {rows.map((row) => {
          const content = (
            <>
              <span className="flex min-w-0 items-center gap-2.5" style={{ paddingLeft: Math.max(0, row.depth - 1) * 22 }}>
                {row.hasKids ? (
                  <span aria-hidden="true" className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg bg-surface text-brand-deep shadow-[inset_0_0_0_1.5px_var(--line)]"><Icon name="chev" className={`h-3.5 w-3.5 transition-transform ${open[row.key] ? 'rotate-90' : ''}`} /></span>
                ) : (
                  <span aria-hidden="true" className="flex h-[26px] w-[26px] shrink-0 items-center justify-center"><span className="h-1.5 w-1.5 rounded-full bg-ink-faint" /></span>
                )}
                <span className="min-w-0">
                  {row.isCompany ? <span className="block text-xs font-semibold text-ink-soft">Empresa</span> : null}
                  <span className={`block truncate leading-snug ${row.isCompany ? 'text-[15.5px] font-extrabold' : row.depth <= 1 ? 'text-[14.5px] font-bold' : row.depth === 2 ? 'text-sm font-semibold' : 'text-[13.5px] font-medium'}`}>{row.name}</span>
                </span>
              </span>
              <span className="hidden items-center gap-2.5 md:flex">
                <span aria-hidden="true" className="h-2 flex-1 overflow-hidden rounded-full bg-sunken shadow-[inset_0_0_0_1px_var(--line-soft)]"><span className="block h-full rounded-full" style={{ width: `${Math.max(1.5, row.share * 100)}%`, background: row.isCompany ? 'var(--brand-mid)' : 'var(--ink-3)' }} /></span>
                <span className="w-[46px] text-right text-[12.5px] font-semibold tabular-nums text-ink-soft">{formatPercent(row.share * 100)}</span>
              </span>
              <span className="text-right text-sm font-bold tabular-nums">{formatPlain(row.count)} {row.count === 1 ? 'persona' : 'personas'}</span>
            </>
          )
          const base = `grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-ctl px-3.5 md:grid-cols-[minmax(0,1fr)_210px_130px] ${row.isCompany ? 'min-h-[60px] bg-sunken' : 'min-h-[46px]'}`
          return (
            <li key={row.key}>
              {row.hasKids ? (
                <button type="button" aria-expanded={Boolean(open[row.key])} onClick={() => toggle(row.key)} className={`${base} w-full text-left transition hover:bg-brand-wash`}>{content}</button>
              ) : (
                <div className={base}>{content}</div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
