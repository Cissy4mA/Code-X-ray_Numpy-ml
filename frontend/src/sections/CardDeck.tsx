import { useCallback, useEffect, useRef, useState } from 'react'
import type { LearnMode } from '@/data/learn'
import PatternCanvas from '@/components/PatternCanvas'

interface Props {
  modes: LearnMode[]
  onActive: (index: number) => void
}

const mod = (v: number, n: number) => ((v % n) + n) % n

/** Shortest signed circular offset of card i from position pos, in (-n/2, n/2]. */
function circOffset(i: number, pos: number, n: number) {
  let d = mod(i - pos, n)
  if (d > n / 2) d -= n
  return d
}

/** Slight informal scatter for each card at rest. */
const REST_TILT = [-2.2, 1.6, -1.1, 2.0, -1.5]

export default function CardDeck({ modes, onActive }: Props) {
  const n = modes.length
  const [pos, setPos] = useState(0)
  const [vw, setVw] = useState(() => window.innerWidth)
  const [auto, setAuto] = useState(true)

  const posRef = useRef(0)
  const targetRef = useRef(0)
  const velRef = useRef(0)
  const dragRef = useRef(false)
  const dragStartX = useRef(0)
  const dragStartPos = useRef(0)
  const suppressClick = useRef(false)
  const lastRender = useRef(0)
  const lastInteract = useRef(0)
  const activeRef = useRef(0)
  const onActiveRef = useRef(onActive)
  onActiveRef.current = onActive

  const reduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  /* ---- responsive sizing ---- */
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const cardW = vw < 480 ? 172 : vw < 768 ? 200 : 240
  const cardH = Math.round(cardW * 1.3)
  const spacing = Math.round(cardW * 0.68)
  const depth = Math.round(cardW * 0.55)

  /* ---- spring loop: pos chases target with a damped spring ---- */
  useEffect(() => {
    let raf = 0
    const tick = () => {
      if (!dragRef.current) {
        if (reduced.current) {
          posRef.current = targetRef.current
          velRef.current = 0
        } else {
          velRef.current += (targetRef.current - posRef.current) * 0.085
          velRef.current *= 0.78
          posRef.current += velRef.current
        }
      }
      const p = posRef.current
      if (Math.abs(p - lastRender.current) > 0.0004) {
        lastRender.current = p
        setPos(p)
      }
      const a = mod(Math.round(p), n)
      if (a !== activeRef.current) {
        activeRef.current = a
        onActiveRef.current(a)
        lastRender.current = p
        setPos(p)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [n])

  const markInteract = () => {
    lastInteract.current = Date.now()
  }

  const bump = useCallback((dir: number) => {
    targetRef.current = Math.round(targetRef.current) + dir
    markInteract()
  }, [])

  const goTo = useCallback(
    (i: number) => {
      // nearest equivalent of index i relative to current position
      let d = mod(i - posRef.current, n)
      if (d > n / 2) d -= n
      targetRef.current = posRef.current + d
      markInteract()
    },
    [n]
  )

  /* ---- autoplay ---- */
  useEffect(() => {
    if (!auto || reduced.current) return
    const id = window.setInterval(() => {
      if (!dragRef.current && Date.now() - lastInteract.current > 4500) {
        targetRef.current = Math.round(targetRef.current) + 1
      }
    }, 4000)
    return () => window.clearInterval(id)
  }, [auto])

  /* ---- pointer / drag ---- */
  const capturedRef = useRef(false)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = true
    capturedRef.current = false
    dragStartX.current = e.clientX
    dragStartPos.current = posRef.current
    suppressClick.current = false
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragStartX.current
    if (Math.abs(dx) > 8) {
      suppressClick.current = true
      // capture only once a real drag starts, so plain clicks still reach the cards
      if (!capturedRef.current) {
        capturedRef.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
      }
    }
    if (suppressClick.current) {
      posRef.current = dragStartPos.current - dx / spacing
      velRef.current = 0
    }
  }
  const endDrag = () => {
    if (!dragRef.current) return
    dragRef.current = false
    targetRef.current = Math.round(posRef.current)
    markInteract()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      bump(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      bump(1)
    }
  }

  const activeIdx = mod(Math.round(pos), n)

  return (
    <div className="relative">
      {/* stage */}
      <div
        className="relative mx-auto h-[300px] w-full max-w-6xl touch-pan-y select-none outline-none sm:h-[350px] md:h-[400px]"
        style={{ perspective: '1400px' }}
        role="region"
        aria-label="学习模式卡盘 / Learning mode card deck"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {modes.map((m, i) => {
            const d = circOffset(i, pos, n)
            const ad = Math.abs(d)
            const hidden = ad > n / 2 - 0.15
            const isActive = i === activeIdx
            const transform = `translate(-50%, -50%) translateX(${(d * spacing).toFixed(2)}px) translateZ(${(-ad * depth).toFixed(2)}px) rotateY(${(d * 28).toFixed(2)}deg) rotateZ(${(REST_TILT[i % REST_TILT.length] - d * 1.4).toFixed(2)}deg)`
            return (
              <button
                key={m.id}
                type="button"
                aria-label={`${m.en.replace('\n', ' ')} / ${m.zh}`}
                aria-current={isActive}
                onClick={() => {
                  if (suppressClick.current) {
                    suppressClick.current = false
                    return
                  }
                  goTo(i)
                }}
                className="group absolute left-1/2 top-1/2 cursor-pointer overflow-hidden rounded-[16px] text-left"
                style={{
                  width: cardW,
                  height: cardH,
                  background: m.bg,
                  color: m.fg,
                  transform,
                  zIndex: 100 - Math.round(ad * 10),
                  opacity: hidden ? 0 : Math.max(0.4, 1 - ad * 0.14),
                  filter: `brightness(${(1 - ad * 0.16).toFixed(3)})`,
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.4), 0 24px 48px -18px rgba(20,28,40,0.45)',
                  transition: 'opacity 0.3s ease',
                  pointerEvents: hidden ? 'none' : 'auto',
                }}
              >
                <PatternCanvas kind={m.pattern} ink={m.ink} className="absolute inset-0 h-full w-full" />

                {/* card number */}
                <span
                  className="absolute right-4 top-3 font-mono text-xs tracking-widest opacity-70"
                >
                  {m.num}
                </span>

                {/* title block */}
                <span className="absolute inset-x-0 bottom-0 block p-5">
                  <span className="block whitespace-pre-line text-[26px] font-semibold leading-[28px] tracking-tight">
                    {m.en}
                  </span>
                  <span className="mt-1 block text-sm font-medium opacity-80">{m.zh}</span>

                  {/* description: blur-to-clear reveal, spring easing */}
                  <span
                    className={`mt-2 line-clamp-3 block text-[12px] leading-snug transition-all [transition-duration:400ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${
                      isActive
                        ? 'translate-y-0 opacity-90 blur-0'
                        : 'translate-y-2 opacity-0 blur-[4px] group-hover:translate-y-0 group-hover:opacity-90 group-hover:blur-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-90 group-focus-visible:blur-0'
                    }`}
                  >
                    <span className="block">{m.tagZh}</span>
                    <span className="block opacity-70">{m.tagEn}</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* controls */}
      <div className="mx-auto mt-2 flex w-full max-w-6xl items-center justify-center gap-2 px-4 sm:gap-4">
        <button
          type="button"
          onClick={() => bump(-1)}
          aria-label="上一张 / Previous"
          className="flex size-11 items-center justify-center rounded-full border border-[rgba(20,28,40,0.16)] text-[#1c2434]/70 backdrop-blur-sm transition-colors hover:border-[rgba(20,28,40,0.34)] hover:bg-white/50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center">
          {modes.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`切换到 ${m.zh} / Go to ${m.en.replace('\n', ' ')}`}
              className="flex size-11 items-center justify-center"
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: i === activeIdx ? 22 : 7,
                  height: 7,
                  background: i === activeIdx ? '#101318' : 'rgba(20,28,40,0.22)',
                }}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => bump(1)}
          aria-label="下一张 / Next"
          className="flex size-11 items-center justify-center rounded-full border border-[rgba(20,28,40,0.16)] text-[#1c2434]/70 backdrop-blur-sm transition-colors hover:border-[rgba(20,28,40,0.34)] hover:bg-white/50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => setAuto((v) => !v)}
          aria-pressed={auto}
          className={`ml-1 flex h-11 items-center gap-2 rounded-full border px-4 font-mono text-[11px] tracking-widest backdrop-blur-sm transition-colors sm:ml-3 ${
            auto
              ? 'border-[rgba(20,28,40,0.3)] bg-white/60 text-[#1c2434]'
              : 'border-[rgba(20,28,40,0.16)] text-[#1c2434]/50 hover:text-[#1c2434]/80'
          }`}
        >
          <span
            className={`block size-1.5 rounded-full ${auto ? 'bg-[#101318] animate-pulse' : 'bg-[#1c2434]/30'}`}
          />
          AUTO
        </button>
      </div>
    </div>
  )
}
