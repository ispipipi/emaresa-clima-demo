import type { MentatContext, MentatReply } from './types'
import { answerComparison } from './comparison'
import { answerArea, answerCorporate, answerGlobal, answerOrganization, answerSearch, answerUnit } from './responses'
import { includesAny, normalize } from './query'

export function replyToMentat(query: string, context?: MentatContext): MentatReply {
  const trimmed = query.trim()
  const normalizedQuery = normalize(trimmed)

  if (!trimmed) return { text: 'Escribe una pregunta y revisaré el snapshot de clima, la estructura BUK y sus notas disponibles.' }
  if (includesAny(normalizedQuery, ['hola', 'buenas', 'gracias', 'ayuda', 'que puedes'])) {
    return { text: 'Soy Mentat. Puedo consultar resultados, participación, categorías, preguntas, unidades, divisiones legales y la estructura de BUK. También puedo buscar notas de áreas y subáreas cuando estén cargadas.', source: 'Mentat' }
  }

  return answerComparison(trimmed, context)
    ?? answerArea(trimmed)
    ?? answerOrganization(trimmed)
    ?? answerUnit(trimmed, context)
    ?? answerCorporate(trimmed)
    ?? answerGlobal(trimmed)
    ?? answerSearch(trimmed)
    ?? { text: 'No encontré ese dato en el snapshot disponible. Puedo ayudarte con el resultado global, una unidad de negocio, una división legal, categorías, preguntas, participación o áreas/subáreas de BUK.', source: 'Snapshot actual' }
}
