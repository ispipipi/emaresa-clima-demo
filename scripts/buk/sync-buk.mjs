import { mkdir, rename, unlink, writeFile } from 'node:fs/promises'

const token = process.env.BUK_API_TOKEN
const baseUrl = process.env.BUK_API_BASE_URL || 'https://emaresa.buk.cl/api/v1/chile'
const snapshotPath = 'src/data/generated/buk-organization.json'
const snapshotTempPath = `${snapshotPath}.tmp`

if (!token) {
  throw new Error('BUK_API_TOKEN is required to sync the organization snapshot')
}

const base = new URL(baseUrl)

async function fetchPage(path) {
  const basePath = `${base.origin}${base.pathname.replace(/\/?$/, '/')}`
  const url = /^https?:\/\//.test(path)
    ? new URL(path)
    : new URL(path.replace(/^\/+/, ''), basePath)

  if (url.origin !== base.origin) {
    throw new Error('BUK pagination returned an unexpected origin')
  }

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      auth_token: token,
    },
  })

  if (!response.ok) {
    throw new Error(`BUK request failed (${response.status}) for ${url.pathname}`)
  }

  const payload = await response.json()
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.data)) {
    throw new Error(`BUK response for ${url.pathname} did not contain a data array`)
  }

  return payload
}

async function fetchAll(path) {
  const data = []
  let next = path

  while (next) {
    const page = await fetchPage(next)
    data.push(...(Array.isArray(page.data) ? page.data : []))
    next = page.pagination?.next || null
  }

  return data
}

const [companies, areas, employees] = await Promise.all([
  fetchAll('/companies?page_size=100'),
  fetchAll('/organization/areas/?page_size=100'),
  fetchAll('/employees/active?page_size=100&exclude_pending=true'),
])

if (companies.length === 0 || areas.length === 0) {
  throw new Error('BUK returned an empty organization; previous snapshot kept')
}

function areaNotes(area) {
  const fields = ['notes', 'note', 'description', 'comment', 'comments', 'observation', 'observations', 'additional_info']
  const values = fields.flatMap((field) => {
    const value = area[field]
    if (Array.isArray(value)) return value
    return value ? [value] : []
  })

  return [...new Set(values
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean))]
}

const areaById = new Map(
  areas.map((area) => [area.id, {
    id: area.id,
    name: area.name,
    depth: area.depth || 0,
    parentId: area.parent_area?.id || null,
    notes: areaNotes(area),
  }]),
)

const employeeCountsByCompany = new Map()
const employeeCountsByArea = new Map()
const companyAreaIds = new Map()

for (const employee of employees) {
  const companyId = employee.current_job?.company_id
  const areaId = employee.current_job?.area_id

  if (typeof companyId !== 'number' || typeof areaId !== 'number') continue

  employeeCountsByCompany.set(companyId, (employeeCountsByCompany.get(companyId) || 0) + 1)
  employeeCountsByArea.set(areaId, (employeeCountsByArea.get(areaId) || 0) + 1)

  if (!companyAreaIds.has(companyId)) companyAreaIds.set(companyId, new Set())

  let currentId = areaId
  const seen = new Set()

  while (currentId && !seen.has(currentId)) {
    seen.add(currentId)
    companyAreaIds.get(companyId).add(currentId)
    currentId = areaById.get(currentId)?.parentId || null
  }
}

function buildAreaNode(areaId, allowedIds, visiting = new Set()) {
  const area = areaById.get(areaId)
  if (!area || !allowedIds.has(areaId) || visiting.has(areaId)) return null

  const nextVisiting = new Set(visiting)
  nextVisiting.add(areaId)
  const children = areas
    .filter((candidate) => candidate.parent_area?.id === areaId && allowedIds.has(candidate.id))
    .map((candidate) => buildAreaNode(candidate.id, allowedIds, nextVisiting))
    .filter(Boolean)

  const employeeCount = employeeCountsByArea.get(areaId) || 0
  return {
    id: area.id,
    name: area.name,
    depth: area.depth,
    employeeCount: employeeCount + children.reduce((total, child) => total + child.employeeCount, 0),
    children,
    ...(area.notes.length > 0 ? { notes: area.notes } : {}),
  }
}

const snapshotCompanies = companies.map((company) => {
  const allowedIds = companyAreaIds.get(company.id) || new Set()
  const rootIds = [...allowedIds].filter((areaId) => {
    const parentId = areaById.get(areaId)?.parentId
    return !parentId || !allowedIds.has(parentId)
  })

  return {
    id: company.id,
    name: company.name,
    employeeCount: employeeCountsByCompany.get(company.id) || 0,
    areas: rootIds.map((areaId) => buildAreaNode(areaId, allowedIds)).filter(Boolean),
  }
})

const snapshot = {
  source: 'buk',
  instance: base.origin,
  generatedAt: new Date().toISOString(),
  companyCount: snapshotCompanies.length,
  employeeCount: employees.length,
  areaCount: areas.length,
  companies: snapshotCompanies,
}

async function persistSnapshot(nextSnapshot) {
  await mkdir('src/data/generated', { recursive: true })

  try {
    await writeFile(snapshotTempPath, `${JSON.stringify(nextSnapshot, null, 2)}\n`, 'utf8')
    await rename(snapshotTempPath, snapshotPath)
  } catch (error) {
    await unlink(snapshotTempPath).catch(() => {})
    throw error
  }
}

await persistSnapshot(snapshot)
console.log(`BUK snapshot synced: ${snapshot.companyCount} companies, ${snapshot.areaCount} areas, ${snapshot.employeeCount} active employees`)
