import { readApiResponse, describeApiError } from './api-errors'

export function runOrbitScripts(root: HTMLElement, scripts: string[], searchSession: { current: unknown }) {
  let disposed = false
  const cleanups: Array<() => void> = []
  const timers = new Set<number>()
  const frames = new Set<number>()
  const globals = new Map<PropertyKey, PropertyDescriptor | undefined>()
  const requests = new AbortController()
  const listen = (target: EventTarget) => (type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean) => {
    if (disposed) return
    target.addEventListener(type, listener, options)
    cleanups.push(() => target.removeEventListener(type, listener, options))
  }
  const schedule = (callback: () => void, delay = 0) => {
    if (disposed) return 0
    const timer = window.setTimeout(() => {
      timers.delete(timer)
      if (!disposed) callback()
    }, delay)
    timers.add(timer)
    return timer
  }
  const animate = (callback: FrameRequestCallback) => {
    if (disposed) return 0
    const frame = window.requestAnimationFrame(time => {
      frames.delete(frame)
      if (!disposed) callback(time)
    })
    frames.add(frame)
    return frame
  }
  const scopedWindow = new Proxy(window, {
    get(target, property) {
      if (property === 'addEventListener') return listen(window)
      if (property === 'setTimeout') return schedule
      if (property === 'requestAnimationFrame') return animate
      const value = Reflect.get(target, property, target)
      return typeof value === 'function' && !String(property).startsWith('__') ? value.bind(target) : value
    },
    set(target, property, value) {
      if (disposed) return true
      if (!globals.has(property)) globals.set(property, Object.getOwnPropertyDescriptor(target, property))
      return Reflect.set(target, property, value, target)
    },
  })
  const scopedDocument = new Proxy(document, {
    get(target, property) {
      if (property === 'addEventListener') return listen(document)
      if (property === 'querySelector') return root.querySelector.bind(root)
      if (property === 'querySelectorAll') return root.querySelectorAll.bind(root)
      if (property === 'getElementById') return (id: string) => root.querySelector(`#${CSS.escape(id)}`)
      const value = Reflect.get(target, property, target)
      return typeof value === 'function' ? value.bind(target) : value
    },
  })
  const fetchScoped: typeof fetch = (input, options) => window.fetch(input, { ...options, signal: requests.signal })
  const execute = new Function('window', 'document', 'setTimeout', 'requestAnimationFrame', 'addEventListener', 'fetch', 'searchSession', 'readApiResponse', 'describeApiError', scripts.join('\n;\n'))
  function cleanup() {
    disposed = true
    requests.abort()
    cleanups.forEach(remove => remove())
    timers.forEach(timer => window.clearTimeout(timer))
    frames.forEach(frame => window.cancelAnimationFrame(frame))
    globals.forEach((descriptor, property) => {
      if (descriptor) Object.defineProperty(window, property, descriptor)
      else Reflect.deleteProperty(window, property)
    })
  }
  try {
    execute(scopedWindow, scopedDocument, schedule, animate, listen(window), fetchScoped, searchSession, readApiResponse, describeApiError)
  } catch (error) {
    cleanup()
    throw error
  }
  return cleanup
}
