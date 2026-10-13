import snapshot from '../data/generated/buk-organization.json'
import type { BukOrganizationSnapshot } from '../types/buk'

export const bukOrganization = snapshot as BukOrganizationSnapshot

export function formatBukSyncDate(value: string) {
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
