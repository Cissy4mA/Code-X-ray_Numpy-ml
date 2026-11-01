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
    if (response.ok) throw new ApiRequestError('服务返回了无法读取的数据，请稍后重试。')
  }
  if (response.ok) return data as T
  const detail = errorDetail(data)
  const status = `HTTP ${response.status}`
  if (response.status === 503 && /reembed_all\.py|模型.*索引|索引.*模型|向量维度.*索引/.test(detail)) {
    throw new ApiRequestError(`检索配置异常（${status}）：${detail} 请联系维护者处理，重复重试无法修复此配置问题。`, false)
  }
  if (response.status === 429) {
    throw new ApiRequestError(`请求过于频繁（${status}），请稍等后再重试。${detail ? ` ${detail}` : ''}`)
  }
  const retryable = response.status >= 500 || response.status === 408
  const message = retryable ? '服务暂时不可用，请稍后重试' : '请求未能完成，请检查输入或访问权限'
  throw new ApiRequestError(`${message}（${status}）。${detail ? ` ${detail}` : ''}`, retryable)
}

export function describeApiError(error: unknown) {
  if (error instanceof ApiRequestError) return { message: error.message, retryable: error.retryable }
  if (error instanceof TypeError) {
    return { message: '网络连接失败，请检查网络或确认服务已启动后重试。', retryable: true }
  }
  return {
    message: error instanceof Error ? error.message : '请求失败，请稍后重试。',
    retryable: true,
  }
}
