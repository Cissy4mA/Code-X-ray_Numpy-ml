import type { LearnMode } from '@/data/learn'

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
  functions?: Array<string | { name?: string; meaning?: string; signature?: string }>
  code?: string
  docstring_math?: string
}

/* Orbit light-theme tokens (from the home/search pages) */
const TXT = '#1c2434'
const SUB = 'rgba(28,36,52,0.62)'
const SUB2 = 'rgba(28,36,52,0.42)'
const FAINT = 'rgba(28,36,52,0.3)'
const LINE = 'rgba(20,28,40,0.12)'
const LINE2 = 'rgba(20,28,40,0.24)'
const DARK = '#101318'

/* ---------- shared bits ---------- */

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: SUB2 }}>
      {children}
    </p>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border p-5 backdrop-blur-md sm:p-7 md:p-9"
      style={{
        borderColor: LINE,
        background: 'rgba(255,255,255,0.52)',
        boxShadow: '0 18px 40px -24px rgba(20,28,40,0.25)',
      }}
    >
      {children}
    </div>
  )
}

function algoName(algo: AlgorithmResult) {
  return algo.entity || algo.name || algo.class_name || 'Selected Algorithm'
}

function functionName(fn: string | { name?: string; meaning?: string; signature?: string }) {
  if (typeof fn === 'string') return fn
  return fn.signature || fn.name || 'function'
}

function functionMeaning(fn: string | { name?: string; meaning?: string; signature?: string }) {
  if (typeof fn === 'string') return ''
  return fn.meaning || ''
}

function AlgoHeader({ algo }: { algo: AlgorithmResult }) {
  const name = algoName(algo)
  return (
    <div
      className="mb-7 flex flex-wrap items-end justify-between gap-3 border-b pb-6"
      style={{ borderColor: LINE }}
    >
      <div>
        <div className="flex items-baseline gap-3">
          <h3 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: TXT }}>
            {name}
          </h3>
          <span className="text-lg" style={{ color: SUB }}>
            {algo.module || 'numpy-ml'}
          </span>
        </div>
        <p className="mt-1 font-mono text-xs" style={{ color: SUB2 }}>
          {[algo.family, algo.task, algo.path].filter(Boolean).join(' · ') || 'Indexed source entity'}
        </p>
      </div>
      <span
        className="rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-wide"
        style={{ borderColor: LINE2, color: TXT, background: 'rgba(255,255,255,0.6)' }}
      >
        {algo.lines ? `Lines ${algo.lines}` : 'Database result'}
      </span>
    </div>
  )
}

/* ---------- 01 Math Card ---------- */

function MathCardPanel({ algo }: { algo: AlgorithmResult }) {
  const name = algoName(algo)
  const methods = (algo.math_methods?.length ? algo.math_methods : [algo.family, algo.task].filter(Boolean)).slice(0, 6)
  const params = (algo.params?.length ? algo.params : ['No constructor parameters indexed']).slice(0, 8)
  const edges = [algo.module, name, ...(algo.functions || []).slice(0, 3).map(functionName)].filter(Boolean)
  const description =
    algo.docstring_math ||
    (algo.code ? algo.code.split('\n').slice(0, 10).join('\n') : 'No source excerpt indexed for this result.')

  return (
    <Shell>
      <AlgoHeader algo={algo} />
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <PanelLabel>数学方法 · Methods</PanelLabel>
          <ul className="mt-3 divide-y" style={{ borderColor: LINE }}>
            {methods.map((m) => (
              <li
                key={m}
                className="flex items-baseline justify-between gap-4 py-3"
                style={{ borderColor: LINE }}
              >
                <span className="text-sm" style={{ color: TXT }}>
                  {m}
                </span>
                <span className="text-right text-xs" style={{ color: SUB2 }}>
                  indexed term
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <PanelLabel>关键参数 · Key Parameters</PanelLabel>
          <ul className="mt-3 divide-y" style={{ borderColor: LINE }}>
            {params.map((p) => (
              <li key={p} className="flex items-baseline gap-3 py-3" style={{ borderColor: LINE }}>
                <code className="font-mono text-sm" style={{ color: TXT }}>
                  {p}
                </code>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <PanelLabel>数学描述 · Mathematical Description</PanelLabel>
        <div
          className="mt-3 max-h-72 overflow-auto rounded-xl border p-4 font-mono text-[13px] leading-7 sm:p-5"
          style={{ borderColor: LINE, background: 'rgba(255,255,255,0.72)', color: TXT }}
        >
          <pre className="whitespace-pre-wrap">{description}</pre>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <PanelLabel>参考文献 · References</PanelLabel>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: SUB }}>
            {(algo.references || []).length
              ? algo.references!.join(', ')
              : 'No explicit references were indexed for this class.'}
          </p>
          <p className="mt-1 font-mono text-xs" style={{ color: SUB2 }}>
            {algo.path || 'source path unavailable'}
          </p>
        </div>
        <div>
          <PanelLabel>引用关系 · Reference Edges</PanelLabel>
          <div className="mt-3 flex flex-wrap items-center gap-y-2">
            {edges.map((e, i) => (
              <span key={e} className="flex items-center">
                <span
                  className="rounded-md border px-2.5 py-1 font-mono text-xs"
                  style={
                    e === name
                      ? { borderColor: DARK, color: '#fff', background: DARK, fontWeight: 600 }
                      : { borderColor: LINE, color: SUB, background: 'rgba(255,255,255,0.6)' }
                  }
                >
                  {e}
                </span>
                {i < edges.length - 1 && (
                  <svg width="18" height="10" viewBox="0 0 18 10" className="mx-1" style={{ color: FAINT }}>
                    <path d="M0 5h14m0 0l-3.5-3.5M14 5l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  )
}

/* ---------- 02 Path ---------- */

function PathPanel({ algo }: { algo: AlgorithmResult }) {
  const name = algoName(algo)
  const steps = [
    { en: 'Locate module', zh: '定位模块', note: algo.module || 'module unavailable', s: 2 },
    { en: 'Read source header', zh: '读类定义', note: algo.path || 'source path unavailable', s: 2 },
    { en: 'Understand methods', zh: '理解核心方法', note: (algo.math_methods || []).slice(0, 4).join(', ') || 'method tags unavailable', s: 1 },
    { en: name, zh: '当前算法', note: algo.family || algo.task || 'selected search result', s: 1 },
    { en: 'Inspect functions', zh: '查看成员函数', note: `${(algo.functions || []).length} functions indexed`, s: 0 },
    { en: 'Compare peers', zh: '对比同类算法', note: algo.family || 'same module / family', s: 0 },
  ] as const

  return (
    <Shell>
      <AlgoHeader algo={algo} />
      <PanelLabel>学习路径 · Route to selected algorithm</PanelLabel>
      <ol className="mt-5">
        {steps.map((st, i) => (
          <li key={st.en} className="relative flex gap-4 pb-6 last:pb-0 sm:gap-5">
            {i < steps.length - 1 && (
              <span
                className="absolute left-[13px] top-8 h-[calc(100%-26px)] w-px"
                style={{ background: st.s === 2 ? LINE2 : LINE }}
              />
            )}
            <span
              className="relative z-10 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px]"
              style={
                st.s === 2
                  ? { background: DARK, borderColor: DARK, color: '#fff' }
                  : st.s === 1
                    ? { borderColor: TXT, color: TXT, boxShadow: `0 0 0 4px rgba(20,28,40,0.08)` }
                    : { borderColor: LINE2, color: SUB2, background: 'rgba(255,255,255,0.6)' }
              }
            >
              {st.s === 2 ? '✓' : i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-medium" style={{ color: st.s === 0 ? SUB2 : TXT }}>
                {st.en}{' '}
                <span className="ml-1 text-sm font-normal" style={{ color: SUB2 }}>
                  {st.zh}
                </span>
                {st.s === 1 && (
                  <span
                    className="ml-2 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-widest"
                    style={{ background: 'rgba(20,28,40,0.07)', color: TXT }}
                  >
                    当前 · CURRENT
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: SUB2 }}>
                {st.note}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Shell>
  )
}

/* ---------- 03 Recommend ---------- */

function RecommendPanel({ algo }: { algo: AlgorithmResult }) {
  const items = (algo.functions || []).slice(0, 4).map((fn, i) => ({
    name: functionName(fn),
    zh: functionMeaning(fn) || 'indexed member function',
    score: 0.92 - i * 0.06,
    why: functionMeaning(fn) || `Part of ${algoName(algo)} in ${algo.module || 'the selected module'}`,
  }))

  return (
    <Shell>
      <AlgoHeader algo={algo} />
      <PanelLabel>相关函数 · Indexed member functions</PanelLabel>
      <div className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.name}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[15px] font-medium" style={{ color: TXT }}>
                {it.name}{' '}
                <span className="ml-1 text-sm font-normal" style={{ color: SUB2 }}>
                  {it.zh}
                </span>
              </p>
              <span className="font-mono text-sm" style={{ color: TXT }}>
                {it.score.toFixed(2)}
              </span>
            </div>
            <div
              className="mt-2 h-1 overflow-hidden rounded-full"
              style={{ background: 'rgba(20,28,40,0.1)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${it.score * 100}%`,
                  background: 'linear-gradient(90deg, #454f5c, #101318)',
                }}
              />
            </div>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: SUB2 }}>
              {it.why}
            </p>
          </div>
        ))}
      </div>
      <p
        className="mt-8 border-t pt-4 font-mono text-[11px]"
        style={{ borderColor: LINE, color: SUB2 }}
      >
        当前版本先展示数据库已索引的成员函数；后续可以接相似算法推荐接口。
      </p>
    </Shell>
  )
}

/* ---------- 04 Call Graph ---------- */

function CallGraphPanel({ algo }: { algo: AlgorithmResult }) {
  const sourceFns = (algo.functions || []).slice(0, 5)
  const nodes = (sourceFns.length ? sourceFns : [algoName(algo)]).map((fn, i) => ({
    x: 30 + i * 150,
    y: i % 2 ? 55 : 165,
    en: functionName(fn),
    zh: functionMeaning(fn) || 'indexed call/member',
  }))
  const W = 150
  const H = 56
  const cy = (y: number) => y + H / 2
  const edges = ([
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ] as Array<[number, number]>).filter(([, b]) => b < nodes.length)

  return (
    <Shell>
      <AlgoHeader algo={algo} />
      <PanelLabel>函数结构 · Indexed function structure</PanelLabel>
      <div className="mt-4 overflow-x-auto">
        <svg viewBox="0 0 800 300" className="h-auto min-w-[560px] w-full" role="img" aria-label="函数结构图 / Function structure graph">
          <defs>
            <marker id="cg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill={TXT} fillOpacity="0.6" />
            </marker>
          </defs>
          {edges.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={nodes[a].x + W}
              y1={cy(nodes[a].y)}
              x2={nodes[b].x}
              y2={cy(nodes[b].y)}
              stroke={TXT}
              strokeOpacity="0.4"
              strokeWidth="1.5"
              markerEnd="url(#cg-arrow)"
            />
          ))}
          {nodes.map((nd) => (
            <g key={nd.en}>
              <rect
                x={nd.x}
                y={nd.y}
                width={W}
                height={H}
                rx="12"
                fill="rgba(255,255,255,0.78)"
                stroke={TXT}
                strokeOpacity="0.3"
                strokeWidth="1.2"
              />
              <text x={nd.x + W / 2} y={nd.y + 24} textAnchor="middle" fill={TXT} fontSize="13" fontFamily="ui-monospace, SF Mono, Menlo, monospace">
                {nd.en}
              </text>
              <text x={nd.x + W / 2} y={nd.y + 42} textAnchor="middle" fill={SUB2} fontSize="11">
                {nd.zh}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p
        className="mt-4 border-t pt-4 font-mono text-[11px] leading-relaxed"
        style={{ borderColor: LINE, color: SUB2 }}
      >
        这里使用后端返回的成员函数构建轻量结构图；完整调用图可继续接 /api/learn/call_graph。
      </p>
    </Shell>
  )
}

/* ---------- 05 Compare ---------- */

function ComparePanel({ algo }: { algo: AlgorithmResult }) {
  const rows = [
    { f: '模块 · Module', a: algo.module || '-', b: 'same family', c: algo.family || '-' },
    { f: '任务 · Task', a: algo.task || '-', b: 'query target', c: algoName(algo) },
    { f: '方法标签 · Methods', a: (algo.math_methods || []).slice(0, 2).join(', ') || '-', b: 'indexed terms', c: (algo.math_methods || []).slice(2, 5).join(', ') || '-' },
    { f: '参数 · Params', a: (algo.params || []).slice(0, 2).join(', ') || '-', b: 'constructor', c: (algo.params || []).slice(2, 5).join(', ') || '-' },
    { f: '源码位置 · Source', a: algo.path || '-', b: 'lines', c: algo.lines || '-' },
  ]

  return (
    <Shell>
      <AlgoHeader algo={algo} />
      <PanelLabel>逐项对比 · Side-by-side</PanelLabel>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left text-sm">
          <thead>
            <tr
              className="border-b font-mono text-[11px] uppercase tracking-[0.15em]"
              style={{ borderColor: LINE2, color: SUB2 }}
            >
              <th className="py-3 pr-4 font-medium">特性 · Feature</th>
              <th className="py-3 pr-4 font-medium">Field A</th>
              <th className="py-3 pr-4 font-medium">Context</th>
              <th className="py-3 font-medium" style={{ color: TXT }}>
                Selected
              </th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: LINE }}>
            {rows.map((r) => (
              <tr key={r.f} style={{ borderColor: LINE }}>
                <td className="py-3.5 pr-4" style={{ color: SUB }}>
                  {r.f}
                </td>
                <td className="py-3.5 pr-4 font-mono text-[13px]" style={{ color: SUB }}>
                  {r.a}
                </td>
                <td className="py-3.5 pr-4 font-mono text-[13px]" style={{ color: SUB }}>
                  {r.b}
                </td>
                <td className="py-3.5 font-mono text-[13px] font-semibold" style={{ color: TXT }}>
                  {r.c}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p
        className="mt-6 border-t pt-4 text-xs leading-relaxed"
        style={{ borderColor: LINE, color: SUB }}
      >
        这里先展示当前算法的结构化字段；后续可以扩展为“同类算法横向对比”。
      </p>
    </Shell>
  )
}

/* ---------- dispatcher ---------- */

export default function ModePanel({ mode, algorithm }: { mode: LearnMode; algorithm: AlgorithmResult }) {
  switch (mode.id) {
    case 'math-card':
      return <MathCardPanel algo={algorithm} />
    case 'path':
      return <PathPanel algo={algorithm} />
    case 'recommend':
      return <RecommendPanel algo={algorithm} />
    case 'call-graph':
      return <CallGraphPanel algo={algorithm} />
    default:
      return <ComparePanel algo={algorithm} />
  }
}
