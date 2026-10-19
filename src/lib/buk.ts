import snapshot from '../data/generated/buk-organization.json'
import type { BukOrganizationSnapshot } from '../types/buk'

export const bukOrganization = snapshot as BukOrganizationSnapshot

const chileTimeZone = 'America/Santiago'

export function formatBukSyncDate(value: string) {
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: chileTimeZone,
  }).format(new Date(value))
}

export function formatBukSyncDateLabel(value: string) {
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: chileTimeZone,
  }).format(new Date(value)).replace('.', '')
}
