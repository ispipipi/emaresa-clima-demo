export interface BukAreaNode {
  id: number
  name: string
  depth: number
  employeeCount: number
  children: BukAreaNode[]
  notes?: string[]
}

export interface BukCompany {
  id: number
  name: string
  employeeCount: number
  areas: BukAreaNode[]
}

export interface BukOrganizationSnapshot {
  source: 'buk'
  instance: string
  generatedAt: string
  companyCount: number
  employeeCount: number
  areaCount: number
  companies: BukCompany[]
}
