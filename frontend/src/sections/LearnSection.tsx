import { useEffect, useState } from 'react'
import { MODES } from '@/data/learn'
import CardDeck from '@/sections/CardDeck'
import ModePanel, { type AlgorithmResult } from '@/sections/panels'
import { algorithmName } from '@/data/learning'

/** Same orbit mark used on the Orbit home / search pages. */
function OrbitMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 26.9 16.6" fill="none" className={className} aria-hidden="true">
      <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="13.25" cy="8.4" r="8.8" fill="#07090f" />
      <circle cx="13.25" cy="8.4" r="8.1" fill="currentColor" />
      <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="#07090f" strokeWidth="0.9" strokeDasharray="28.2 28.2" />
      <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" strokeWidth="1.25" strokeDasharray="28.2 28.2" />
    </svg>
  )
}

export default function LearnSection() {
  const [active, setActive] = useState(0)
  const [algorithm, setAlgorithm] = useState<AlgorithmResult | null>(null)
  const mode = MODES[active]

  useEffect(() => {
    try {
      const raw = localStorage.getItem('codexray:selectedAlgorithm')
      const selected = raw ? JSON.parse(raw) : null
      setAlgorithm(selected && typeof selected === 'object' && typeof selected.entity === 'string' ? selected : null)
    } catch {
      setAlgorithm(null)
    }
  }, [])

  function selectAlgorithm(selected: AlgorithmResult) {
    const identity = { entity: algorithmName(selected), module: selected.module, path: selected.path }
    setAlgorithm(identity)
    try { localStorage.setItem('codexray:selectedAlgorithm', JSON.stringify(identity)) } catch { return }
  }

  return (
    <section className="learn-page relative min-h-screen overflow-hidden pb-16">
      {/* slim header — same brand, same centered glass seg, same GitHub icon as the Orbit pages */}
      <header className="relative mx-auto flex w-full max-w-[1240px] items-center px-5 pt-5 sm:px-8">
        <a
          href="#home"
          className="flex items-center gap-2.5 font-semibold text-[#1c2434]"
          style={{ fontSize: 17, letterSpacing: '-0.02em', textDecoration: 'none' }}
        >
          <OrbitMark className="h-[16px] w-[26px] overflow-visible" />
          Code-X-Ray
        </a>

        <nav className="learn-seg absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 rounded-full border border-[rgba(20,28,40,0.12)] bg-[rgba(255,255,255,0.52)] p-[3px] backdrop-blur-md sm:flex">
          <a href="#home">Home</a>
          <a href="#search">Browse</a>
          <a href="#/learn" aria-current="page">
            Learn
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <a
            href="https://github.com/Cissy4mA/Code-X-ray_Numpy-ml"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex size-9 items-center justify-center rounded-full border border-[rgba(20,28,40,0.14)] bg-[rgba(255,255,255,0.52)] text-[#1c2434] backdrop-blur-md transition-colors hover:border-[rgba(20,28,40,0.3)]"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>
        </div>
      </header>

      {/* mobile nav — the centered pill is hidden on small screens */}
      <nav className="learn-seg relative mx-auto mt-4 flex w-fit items-center gap-0.5 rounded-full border border-[rgba(20,28,40,0.12)] bg-[rgba(255,255,255,0.52)] p-[3px] backdrop-blur-md sm:hidden">
        <a href="#home">Home</a>
        <a href="#search">Browse</a>
        <a href="#/learn" aria-current="page">
          Learn
        </a>
      </nav>

      {/* section heading */}
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-8 pt-10 text-center sm:px-6 md:pb-10 md:pt-14">
        <p
          className="font-mono text-[11px] uppercase"
          style={{ letterSpacing: '0.3em', color: 'rgba(28,36,52,0.42)' }}
        >
          03 — Learning Suite
        </p>
        <h2
          className="mt-3 text-4xl font-semibold text-[#1c2434] md:text-6xl"
          style={{ letterSpacing: '-0.03em' }}
        >
          Learn <span style={{ color: 'rgba(28,36,52,0.35)' }}>/</span>{' '}
          <span style={{ color: 'rgba(28,36,52,0.62)' }}>学习</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed" style={{ color: 'rgba(28,36,52,0.62)' }}>
          拖动卡盘、点击卡牌，或用 <kbd className="rounded border border-[rgba(20,28,40,0.14)] bg-white/70 px-1.5 py-0.5 font-mono text-[11px] text-[#1c2434]">←</kbd>{' '}
          <kbd className="rounded border border-[rgba(20,28,40,0.14)] bg-white/70 px-1.5 py-0.5 font-mono text-[11px] text-[#1c2434]">→</kbd> 切换 {MODES.length} 种学习模式。
          <span className="block" style={{ color: 'rgba(28,36,52,0.42)' }}>
            Explore {MODES.length} learning modes. Reading progress is saved on this browser; automatic rotation is off by default.
          </span>
        </p>
      </div>

      {algorithm ? (
        <>
          {/* rotating card deck */}
          <CardDeck modes={MODES} onActive={setActive} />

          {/* content panel, swaps with a blur-to-clear entrance */}
          <div className="relative mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6 md:mt-14">
            <div key={`${algorithm.module}:${algorithm.path}:${algorithmName(algorithm)}`} className="panel-enter">
              <ModePanel mode={mode} algorithm={algorithm} onSelect={selectAlgorithm} />
            </div>
            <p className="mt-5 text-center font-mono text-[11px]" style={{ color: 'rgba(28,36,52,0.42)' }}>
              {algorithmName(algorithm)} · {algorithm.module || 'NumPy-ML'}
            </p>
          </div>
        </>
      ) : (
        <div className="relative mx-auto mt-8 w-full max-w-2xl px-4 sm:px-6">
          <div
            className="learn-glass rounded-2xl border p-8 text-center"
            style={{
              boxShadow: '0 18px 40px -24px rgba(20,28,40,0.25)',
            }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: 'rgba(28,36,52,0.42)' }}>
              No Algorithm Selected
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#1c2434]">
              先搜索一个算法，再打开学习卡片
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed" style={{ color: 'rgba(28,36,52,0.62)' }}>
              在 Browse 中找到算法后，点击 Open the Learn Page 开始阅读。
            </p>
            <a
              href="#search"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-[10px] bg-[#101318] px-4 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#242a34]"
            >
              Back to Browse
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
