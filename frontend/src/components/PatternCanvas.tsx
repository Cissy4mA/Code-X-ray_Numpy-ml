import { useEffect, useRef } from 'react'
import type { PatternKind } from '@/data/learn'

interface Props {
  kind: PatternKind
  ink: string
  className?: string
}

/** Deterministic pseudo-random from an integer seed. */
function prand(i: number) {
  let x = (i * 2654435761) >>> 0
  x ^= x >>> 15
  x = (x * 2246822519) >>> 0
  x ^= x >>> 13
  return (x >>> 0) / 4294967295
}

/**
 * Animated generative canvas texture for a deck card.
 * Five distinct pattern algorithms, one per learning mode.
 */
export default function PatternCanvas({ kind, ink, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr))
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = (t: number) => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = ink
      ctx.fillStyle = ink
      ctx.lineCap = 'round'

      if (kind === 'stripes') {
        // drifting diagonal stripe field
        const gap = 16 * dpr
        ctx.lineWidth = 1.6 * dpr
        const off = (t * 22 * dpr) % gap
        ctx.beginPath()
        for (let x = -h; x < w + h; x += gap) {
          ctx.moveTo(x + off, 0)
          ctx.lineTo(x + off - h * 0.5, h)
        }
        ctx.stroke()
      } else if (kind === 'lines') {
        // horizontal wave lines
        const gap = 15 * dpr
        const step = 8 * dpr
        ctx.lineWidth = 1.4 * dpr
        for (let y = gap; y < h; y += gap) {
          ctx.beginPath()
          for (let x = 0; x <= w; x += step) {
            const yy = y + Math.sin(x / (20 * dpr) + t * 1.6 + y / (34 * dpr)) * 3 * dpr
            if (x === 0) ctx.moveTo(x, yy)
            else ctx.lineTo(x, yy)
          }
          ctx.stroke()
        }
      } else if (kind === 'dots') {
        // pulsing dot grid
        const gap = 18 * dpr
        let gi = 0
        for (let y = gap; y < h; y += gap) {
          let gj = 0
          for (let x = gap; x < w; x += gap) {
            const r = dpr * (1.5 + 1.15 * Math.sin(t * 2 + (gi + gj) * 0.45))
            ctx.beginPath()
            ctx.arc(x, y, Math.max(0.4 * dpr, r), 0, Math.PI * 2)
            ctx.fill()
            gj++
          }
          gi++
        }
      } else if (kind === 'graph') {
        // connected nodes with marching-dash edges
        const nodes: Array<[number, number]> = [
          [0.2, 0.24],
          [0.76, 0.18],
          [0.5, 0.48],
          [0.2, 0.76],
          [0.8, 0.72],
          [0.48, 0.9],
        ]
        const edges: Array<[number, number]> = [
          [0, 2],
          [1, 2],
          [2, 3],
          [2, 4],
          [3, 5],
          [4, 5],
        ]
        ctx.lineWidth = 1.3 * dpr
        ctx.setLineDash([4 * dpr, 5 * dpr])
        ctx.lineDashOffset = -t * 12 * dpr
        ctx.beginPath()
        for (const [a, b] of edges) {
          ctx.moveTo(nodes[a][0] * w, nodes[a][1] * h)
          ctx.lineTo(nodes[b][0] * w, nodes[b][1] * h)
        }
        ctx.stroke()
        ctx.setLineDash([])
        nodes.forEach(([nx, ny], i) => {
          const r = dpr * (2.4 + 1.1 * Math.sin(t * 2 + i * 1.1))
          ctx.beginPath()
          ctx.arc(nx * w, ny * h, Math.max(1 * dpr, r), 0, Math.PI * 2)
          ctx.fill()
        })
      } else {
        // animated noise field
        const cell = 8 * dpr
        const cols = Math.ceil(w / cell)
        const rows = Math.ceil(h / cell)
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const v = prand(r * 131 + c * 7 + 13)
            const a = 0.15 + 0.85 * Math.abs(Math.sin(t * 1.2 + v * Math.PI * 2))
            ctx.globalAlpha = a
            ctx.fillRect(c * cell + dpr, r * cell + dpr, cell - 2 * dpr, cell - 2 * dpr)
          }
        }
        ctx.globalAlpha = 1
      }
    }

    if (reduced) {
      draw(0)
    } else {
      const loop = (now: number) => {
        draw(now / 1000)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [kind, ink])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
