import dataset from '../data/clima.json'
import type { ClimaDataset, UnidadNegocio } from '../types/clima'

export const clima = dataset as ClimaDataset

export function unitPath(unidad: string) {
  return `/unidad/${encodeURIComponent(unidad)}`
}

export function findUnit(nombre: string | undefined): UnidadNegocio | undefined {
  if (!nombre) return undefined
  const decodedName = decodeURIComponent(nombre)
  return clima.unidades.find((unidad) => unidad.unidad === decodedName)
}
