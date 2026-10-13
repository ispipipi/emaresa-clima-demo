import actionPlanDataset from '../data/action-plans.json'

interface ActionPlanDataset {
  period: string
  source: string
  plans: Record<string, string[]>
}

const dataset = actionPlanDataset as ActionPlanDataset

function normalizeQuestion(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

const plansByQuestion = new Map(
  Object.entries(dataset.plans).map(([question, plans]) => [normalizeQuestion(question), plans]),
)

export function getActionPlans(question: string) {
  return plansByQuestion.get(normalizeQuestion(question)) ?? []
}

export function getActionPlanPeriod() {
  return dataset.period
}

export function getActionPlanSource() {
  return dataset.source
}
