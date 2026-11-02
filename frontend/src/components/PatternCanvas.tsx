import { useEffect, useRef } from 'react'
import type { PatternKind } from '@/data/learn'

interface Props {
  kind: PatternKind
  ink: string
  className?: string
}

export default function PatternCanvas({ kind, ink, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let lastDraw = -Infinity
    let visible = true

    const draw = (time: number) => {
      const width = canvas.width / dpr
      const height = canvas.height / dpr
      const radius = width * 0.32
      const phase = time * 0.16
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)
      context.save()
      context.translate(width * 0.5, height * 0.35)

      const halo = context.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius * 1.55)
      halo.addColorStop(0, 'rgba(232,240,255,0.32)')
      halo.addColorStop(0.5, 'rgba(156,183,255,0.19)')
      halo.addColorStop(0.76, 'rgba(197,171,255,0.09)')
      halo.addColorStop(1, 'rgba(170,200,255,0)')
      context.fillStyle = halo
      context.fillRect(-width, -height, width * 2, height * 2)

      const metal = context.createLinearGradient(-radius, -radius, radius, radius)
      metal.addColorStop(0, 'rgba(255,255,255,0.95)')
      metal.addColorStop(0.22, 'rgba(165,184,220,0.44)')
      metal.addColorStop(0.43, 'rgba(247,251,255,0.95)')
      metal.addColorStop(0.64, 'rgba(119,151,209,0.44)')
      metal.addColorStop(0.82, 'rgba(215,200,255,0.8)')
      metal.addColorStop(1, 'rgba(255,255,255,0.9)')

      const ring = (size: number, flatten: number, angle: number, weight = 1) => {
        context.save()
        context.rotate(angle)
        context.beginPath()
        context.ellipse(0, 0, size, size * flatten, 0, 0, Math.PI * 2)
        context.strokeStyle = metal
        context.lineWidth = weight
        context.stroke()
        context.restore()
      }

      context.strokeStyle = ink
      context.lineWidth = 0.6
      if (kind !== 'trajectory') {
        context.beginPath()
        context.arc(0, 0, radius * 1.22, -Math.PI * 0.93, -Math.PI * 0.12)
        context.arc(0, 0, radius * 1.22, Math.PI * 0.08, Math.PI * 0.78)
        context.stroke()
        for (let tick = 0; tick < 48; tick++) {
          const angle = tick / 48 * Math.PI * 2
          const inner = radius * (tick % 4 === 0 ? 1.28 : 1.31)
          context.beginPath()
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner)
          context.lineTo(Math.cos(angle) * radius * 1.35, Math.sin(angle) * radius * 1.35)
          context.stroke()
        }
      }

      if (kind === 'orbit') {
        for (let orbit = 0; orbit < 5; orbit++) {
          ring(radius * (0.79 + orbit * 0.04), 0.38 + orbit * 0.1, -0.65 + orbit * 0.27 + phase, orbit === 2 ? 2.8 : 0.8)
        }
      } else if (kind === 'trajectory') {
        const pointAt = (progress: number): [number, number] => [
          Math.sin(progress * Math.PI * 2 - Math.PI * 0.65) * radius * 0.64,
          radius * (0.93 - progress * 1.98),
        ]
        for (let rail = -1; rail <= 1; rail++) {
          context.beginPath()
          for (let step = 0; step <= 100; step++) {
            const [horizontal, vertical] = pointAt(step / 100)
            if (step === 0) context.moveTo(horizontal + rail * 5, vertical)
            else context.lineTo(horizontal + rail * 5, vertical)
          }
          context.strokeStyle = rail === 0 ? 'rgba(237,247,255,0.95)' : metal
          context.lineWidth = rail === 0 ? 2.2 : 0.8
          context.shadowColor = '#9bc7ff'
          context.shadowBlur = rail === 0 ? 9 : 0
          context.stroke()
        }
        context.shadowBlur = 0
        for (let station = 0; station < 5; station++) {
          const [horizontal, vertical] = pointAt(station / 4)
          context.save()
          context.translate(horizontal, vertical)
          ring(radius * (0.2 + station * 0.014), 0.34, -0.15, 1.4)
          context.fillStyle = '#eef6ff'
          context.shadowColor = '#c0daff'
          context.shadowBlur = 10
          context.beginPath()
          context.arc(0, 0, station === 4 ? 3.5 : 2.2, 0, Math.PI * 2)
          context.fill()
          context.shadowBlur = 0
          context.fillStyle = ink
          context.font = '7px monospace'
          context.fillText(`0${station + 1}`, radius * 0.33, 2)
          context.restore()
        }
        const [signalX, signalY] = pointAt((time * 0.12 + 0.12) % 1)
        const signal = context.createRadialGradient(signalX, signalY, 0, signalX, signalY, 12)
        signal.addColorStop(0, 'rgba(255,255,255,1)')
        signal.addColorStop(0.22, 'rgba(202,229,255,0.95)')
        signal.addColorStop(1, 'rgba(146,186,255,0)')
        context.fillStyle = signal
        context.fillRect(signalX - 12, signalY - 12, 24, 24)
      } else if (kind === 'constellation') {
        const points = Array.from({ length: 12 }, (_, index) => {
          const angle = index * 2.39996 + phase
          const distance = radius * Math.sqrt((index + 1) / 12)
          return [Math.cos(angle) * distance, Math.sin(angle) * distance * 0.85]
        })
        context.strokeStyle = metal
        for (let index = 0; index < points.length; index++) {
          for (let next = index + 1; next < points.length; next++) {
            if (Math.hypot(points[index][0] - points[next][0], points[index][1] - points[next][1]) > radius * 0.95) continue
            context.beginPath()
            context.moveTo(...points[index] as [number, number])
            context.lineTo(...points[next] as [number, number])
            context.stroke()
          }
          context.shadowColor = '#bcd7ff'
          context.shadowBlur = 10
          context.fillStyle = '#eef5ff'
          context.beginPath()
          context.arc(points[index][0], points[index][1], index % 3 === 0 ? 2.8 : 1.5, 0, Math.PI * 2)
          context.fill()
          context.shadowBlur = 0
        }
      } else if (kind === 'lattice') {
        for (let orbit = 0; orbit < 11; orbit++) {
          ring(radius, Math.max(0.07, Math.abs(Math.cos(orbit / 11 * Math.PI + phase))), -0.45, 0.7)
          const offset = (orbit / 10 - 0.5) * radius * 1.85
          context.save()
          context.translate(0, offset)
          ring(Math.sqrt(Math.max(0, radius * radius - offset * offset)), 0.17, -0.12, 0.6)
          context.restore()
        }
      } else if (kind === 'singularity') {
        for (let orbit = 0; orbit < 26; orbit++) {
          ring(radius * (0.26 + orbit * 0.03), 0.58 + orbit * 0.009, orbit * 0.095 + phase, orbit % 5 === 0 ? 1.8 : 0.65)
        }
      } else if (kind === 'wave') {
        context.strokeStyle = metal
        for (let line = 0; line < 24; line++) {
          context.beginPath()
          for (let step = 0; step <= 80; step++) {
            const horizontal = step / 80 * 2 - 1
            const envelope = Math.sqrt(Math.max(0, 1 - horizontal * horizontal))
            const vertical = Math.sin(horizontal * 4 + line * 0.16 + phase * 3) * radius * 0.32 + (line / 23 - 0.5) * radius * 1.4
            const px = horizontal * radius
            const py = vertical * envelope
            if (step === 0) context.moveTo(px, py)
            else context.lineTo(px, py)
          }
          context.stroke()
        }
      } else {
        for (let orbit = 0; orbit < 7; orbit++) {
          context.save()
          context.rotate(-0.3 + phase + orbit * 0.07)
          const size = radius * (0.95 - orbit * 0.08)
          context.strokeStyle = metal
          context.lineWidth = orbit === 0 ? 2 : 0.8
          context.beginPath()
          context.moveTo(0, -size)
          context.lineTo(size * 0.8, 0)
          context.lineTo(0, size)
          context.lineTo(-size * 0.8, 0)
          context.closePath()
          context.stroke()
          context.restore()
        }
      }

      if (kind === 'orbit') {
        const core = context.createRadialGradient(-8, -10, 0, 0, 0, radius * 0.25)
        core.addColorStop(0, '#ffffff')
        core.addColorStop(0.28, '#e3edff')
        core.addColorStop(0.63, '#91a4c2')
        core.addColorStop(0.9, '#45536e')
        core.addColorStop(1, '#c5d8ff')
        context.fillStyle = core
        context.beginPath()
        context.arc(0, 0, radius * 0.25, 0, Math.PI * 2)
        context.fill()
      }

      const lightAngle = phase * 2 - 0.7
      const lightX = Math.cos(lightAngle) * radius * 1.22
      const lightY = Math.sin(lightAngle) * radius * 1.22
      context.shadowColor = '#b5cfff'
      context.shadowBlur = 14
      context.strokeStyle = 'rgba(245,250,255,0.95)'
      context.lineWidth = 0.9
      context.beginPath()
      context.moveTo(lightX - 7, lightY)
      context.lineTo(lightX + 7, lightY)
      context.moveTo(lightX, lightY - 7)
      context.lineTo(lightX, lightY + 7)
      context.stroke()
      context.restore()
    }

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      draw(0)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting })
    intersection.observe(canvas)

    const loop = (now: number) => {
      if (visible && !document.hidden && now - lastDraw >= 40) {
        draw(motion.matches ? 0 : now / 1000)
        lastDraw = now
      }
      if (!motion.matches) frame = requestAnimationFrame(loop)
    }
    const changeMotion = () => {
      cancelAnimationFrame(frame)
      draw(0)
      if (!motion.matches) frame = requestAnimationFrame(loop)
    }
    motion.addEventListener('change', changeMotion)
    changeMotion()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      intersection.disconnect()
      motion.removeEventListener('change', changeMotion)
    }
  }, [kind, ink])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
