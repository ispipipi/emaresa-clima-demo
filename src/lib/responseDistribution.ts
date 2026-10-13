import distributionDataset from '../data/response-distribution.json'

export interface ResponseDistribution {
  neutrales?: number
  detractores?: number
}

interface ResponseDistributionDataset {
  period: string
  source: string
  units: Record<string, ResponseDistribution>
}

const dataset = distributionDataset as ResponseDistributionDataset

export function getResponseDistribution(unit: string): ResponseDistribution {
  return dataset.units[unit] ?? {}
}

export function getResponseDistributionPeriod() {
  return dataset.period
}

export function getResponseDistributionSource() {
  return dataset.source
}
