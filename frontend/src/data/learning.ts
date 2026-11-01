import { useEffect, useState } from 'react'
import { readApiResponse, describeApiError } from './api-errors'

export interface MemberFunction {
  name: string
  meaning?: string
  code?: string
}

export interface AlgorithmResult {
  entity?: string
  name?: string
  class_name?: string
  module?: string
  family?: string
  task?: string
  path?: string
  lines?: string
  math_methods?: string[]
  params?: string[]
  references?: string[]
  functions?: Array<string | MemberFunction>
  code?: string
  docstring_math?: string
  complexity?: number | null
  source_signals?: {
    lines: number
    for_loops: number
    while_loops: number
    comprehensions: number
    branches: number
    matrix_operators: number
  } | null
}

export interface PathStep {
  step: number
  kind: string
  title: string
  detail: string
  items: Array<{ name: string; note: string }>
}

export interface RoadmapItem {
  name: string
  path: string
  lines: string
  is_target: boolean
}

export interface LearningPath {
  module: string
  algorithm: string
  steps: PathStep[]
  roadmap?: RoadmapItem[]
  note?: string
}

export interface CallGraph {
  nodes: Array<{ id: string; entity: string; path: string; lines: string; role: string }>
  edges: Array<{ source: string; target: string; symbol: string }>
  unresolved_calls: string[]
  message?: string
  note?: string
}

export function algorithmName(algorithm: AlgorithmResult) {
  return algorithm.entity || algorithm.name || algorithm.class_name || ''
}

export function learnUrl(endpoint: string, algorithm: AlgorithmResult) {
  const query = new URLSearchParams({
    module: algorithm.module || '',
    algorithm: algorithmName(algorithm),
    entity: algorithmName(algorithm),
    path: algorithm.path || '',
  })
  return `/api/learn/${endpoint}?${query}`
}

export function useLearnResource<T>(url: string | null) {
  const [attempt, setAttempt] = useState(0)
  const [resource, setResource] = useState<{ url: string | null; data?: T; error?: string; retryable?: boolean }>({ url: null })
  const key = `${url || ''}:${attempt}`
  useEffect(() => {
    if (!url) return
    const controller = new AbortController()
    fetch(url, { signal: controller.signal })
      .then(response => readApiResponse<T>(response))
      .then(data => {
        if (!controller.signal.aborted) setResource({ url: key, data })
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          const problem = describeApiError(error)
          setResource({ url: key, error: problem.message, retryable: problem.retryable })
        }
      })
    return () => controller.abort()
  }, [url, key])
  return { ...(resource.url === key ? resource : { url }), retry: () => setAttempt(value => value + 1) }
}
