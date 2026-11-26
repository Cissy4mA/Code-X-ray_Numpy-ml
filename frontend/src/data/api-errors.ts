export class ApiRequestError extends Error {
  retryable: boolean

  constructor(message: string, retryable = true) {
    super(message)
    this.name = 'ApiRequestError'
    this.retryable = retryable
  }
}

function errorDetail(data: unknown): string {
  if (!data || typeof data !== 'object' || !('detail' in data)) return ''
  const detail = data.detail
  if (typeof detail === 'string') return detail.trim().slice(0, 1200)
  if (Array.isArray(detail)) {
    return detail.map(item => item && typeof item.msg === 'string' ? item.msg : '')
      .filter(Boolean).join('; ').slice(0, 1200)
  }
  return ''
}

export async function readApiResponse<T>(response: Response): Promise<T> {
  let data: unknown
  try {
    data = await response.json()
  } catch {
    if (response.ok) throw new ApiRequestError('The service returned unreadable data. Please try again.')
  }
  if (response.ok) return data as T
  const detail = errorDetail(data)
  const status = `HTTP ${response.status}`
  if (response.status === 503 && /reembed_all\.py|model.*index|index.*model|vector.*dimension|dimension.*index/.test(detail)) {
    throw new ApiRequestError(`Retrieval configuration error (${status}): ${detail} Please contact the maintainer; retrying will not fix this configuration issue.`, false)
  }
  if (response.status === 429) {
    throw new ApiRequestError(`Too many requests (${status}). Please wait and try again.${detail ? ` ${detail}` : ''}`)
  }
  const retryable = response.status >= 500 || response.status === 408
  const message = retryable ? 'The service is temporarily unavailable. Please try again later' : 'The request could not be completed. Check your input or access permissions'
  throw new ApiRequestError(`${message} (${status}).${detail ? ` ${detail}` : ''}`, retryable)
}

export function describeApiError(error: unknown) {
  if (error instanceof ApiRequestError) return { message: error.message, retryable: error.retryable }
  if (error instanceof TypeError) {
    return { message: 'Network connection failed. Check your network or confirm the service is running, then retry.', retryable: true }
  }
  return {
    message: error instanceof Error ? error.message : 'Request failed. Please try again.',
    retryable: true,
  }
}
