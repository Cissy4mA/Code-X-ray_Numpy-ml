export const PROGRESS_KEY = 'codexray:learning-progress:v1'

export type LearningProgress = Record<string, string[]>

export function progressKey(module: string, name: string, path: string) {
  return JSON.stringify([module, name, path])
}

export function parseProgress(raw: string | null): LearningProgress {
  try {
    const parsed: unknown = JSON.parse(raw || '{}')
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) =>
      Array.isArray(value) && value.every(item => typeof item === 'string')
    ))
  } catch {
    return {}
  }
}

export function completedCount(progress: LearningProgress, key: string, kinds: string[]) {
  return kinds.filter(kind => (progress[key] || []).includes(kind)).length
}
