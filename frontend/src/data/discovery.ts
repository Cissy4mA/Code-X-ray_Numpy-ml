import { algorithmName, type AlgorithmResult } from './learning'

function methodList(value: unknown): string[] {
  if (value == null || value === '') return []
  if (Array.isArray(value)) return value.map(item => typeof item === 'object' ? JSON.stringify(item) : String(item))
  if (typeof value === 'string') {
    const text = value.trim()
    if (!text) return []
    try {
      const parsed: unknown = JSON.parse(text)
      if (Array.isArray(parsed)) return methodList(parsed)
    } catch {}
    return text.split(/[,;|]/).map(item => item.trim()).filter(Boolean)
  }
  if (typeof value === 'object') return Object.entries(value).map(([key, item]) => `${key}: ${typeof item === 'object' ? JSON.stringify(item) : item}`)
  return [String(value)]
}

const rawMethods = (algorithm: AlgorithmResult) => {
  const metadata = algorithm as AlgorithmResult & { mathMethods?: unknown; methods?: unknown }
  return methodList(metadata.math_methods || metadata.mathMethods || metadata.methods)
}
const methods = (algorithm: AlgorithmResult) => rawMethods(algorithm).map(value => String(value).toLowerCase())
const identity = (algorithm: AlgorithmResult) => JSON.stringify([algorithmName(algorithm), algorithm.path || '', algorithm.lines || ''])

export function recommendationQuery(algorithm: AlgorithmResult) {
  return [algorithmName(algorithm), algorithm.task, ...rawMethods(algorithm).slice(0, 4)].filter(Boolean).join(' ') || algorithmName(algorithm) || 'algorithm'
}

export function recommendationReasons(base: AlgorithmResult, candidate: AlgorithmResult) {
  const reasons: string[] = []
  const directory = (algorithm: AlgorithmResult) => String(algorithm.path || algorithm.module || '').replace(/\\/g, '/').split('/').slice(0, -1).join('/')
  const baseDirectory = directory(base)
  const candidateDirectory = directory(candidate)
  if (baseDirectory && candidateDirectory && baseDirectory === candidateDirectory) reasons.push('same module')
  if (base.family && candidate.family && String(base.family).toLowerCase() === String(candidate.family).toLowerCase() && String(base.family).toLowerCase() !== 'other') reasons.push('same family')
  if (base.task && candidate.task && String(base.task).toLowerCase() === String(candidate.task).toLowerCase()) reasons.push('same task')
  const shared = methods(base).filter(method => methods(candidate).includes(method))
  if (shared.length) reasons.push(`shared math: ${shared.slice(0, 3).join(', ')}`)
  if (!reasons.length) reasons.push('semantic/source-code similarity')
  return reasons
}

export function recommendationScore(base: AlgorithmResult, candidate: AlgorithmResult) {
  let score = Number(candidate.fused || 0)
  for (const reason of recommendationReasons(base, candidate)) {
    if (reason.includes('same module')) score += 0.3
    if (reason.includes('same family')) score += 0.2
    if (reason.includes('same task')) score += 0.2
    if (reason.includes('shared math')) score += 0.25
  }
  return score
}

export function rankRecommendations(base: AlgorithmResult, candidates: AlgorithmResult[]) {
  const unique = new Map<string, AlgorithmResult>()
  for (const candidate of candidates) {
    if (!algorithmName(candidate) || identity(candidate) === identity(base)) continue
    const key = identity(candidate)
    if (!unique.has(key)) unique.set(key, candidate)
  }
  return [...unique.values()].sort((left, right) => recommendationScore(base, right) - recommendationScore(base, left)).slice(0, 6)
}
