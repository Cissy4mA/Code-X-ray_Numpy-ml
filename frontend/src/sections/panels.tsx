import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { LearnMode } from '@/data/learn'
import {
  algorithmName, learnUrl, useLearnResource,
  type AlgorithmResult, type CallGraph, type LearningPath, type MemberFunction,
} from '@/data/learning'
import { completedCount, parseProgress, progressKey, PROGRESS_KEY, type LearningProgress } from '@/data/progress'
import { recommendationQuery, recommendationReasons, recommendationScore, rankRecommendations } from '@/data/discovery'
import { readApiResponse, describeApiError } from '@/data/api-errors'

export type { AlgorithmResult } from '@/data/learning'

const buttonClass = 'rounded-lg border border-slate-300 bg-white/70 px-3 py-2 text-xs text-slate-800 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:cursor-not-allowed disabled:opacity-50'
const mutedClass = 'text-sm leading-6 text-slate-500'

function Shell({ children }: { children: ReactNode }) {
  return <div className="learn-glass rounded-2xl border p-5 text-slate-800 shadow-sm sm:p-8">{children}</div>
}

function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return <p role={error ? 'alert' : 'status'} className={`rounded-xl border p-4 text-sm leading-6 ${error ? 'border-red-200 bg-red-50 text-red-800' : 'border-slate-200 bg-white/50 text-slate-600'}`}>{children}</p>
}

function LoadError({ message, retry, retryable = true }: { message: string; retry: () => void; retryable?: boolean }) {
  return <Notice error>{message}{retryable && <button className={`${buttonClass} ml-3`} onClick={retry}>Retry</button>}</Notice>
}

function Heading({ children }: { children: ReactNode }) {
  return <h4 className="mb-3 mt-6 font-mono text-xs uppercase tracking-widest text-slate-500">{children}</h4>
}

function AlgoHeader({ algo }: { algo: AlgorithmResult }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-slate-300/60 pb-5">
    <div><h3 className="break-all text-3xl font-semibold tracking-tight">{algorithmName(algo)}</h3>
      <p className={mutedClass}>{[algo.module, algo.family, algo.task].filter(Boolean).join(' · ')}</p></div>
    <span className="break-all font-mono text-xs text-slate-500">{algo.path}{algo.lines ? `:${algo.lines}` : ''}</span>
  </div>
}

function TextList({ items, empty = 'Not available in the index.' }: { items: string[]; empty?: string }) {
  return items.length ? <ul className="space-y-2 text-sm leading-6">{items.map((item, index) => <li className="break-words rounded-lg border border-slate-200 bg-white/50 px-3 py-2" key={`${index}:${item}`}>{item}</li>)}</ul> : <p className={mutedClass}>{empty}</p>
}

interface CuratedCard {
  algorithm?: string
  title?: string
  formula?: string
  formulas?: string[]
  description?: string
  intuition?: string
  math?: string
  summary?: string
  references?: string[]
}

function MathCardPanel({ algo }: { algo: AlgorithmResult }) {
  const resource = useLearnResource<{ cards: CuratedCard[] }>(learnUrl('card', algo))
  const cards = resource.data?.cards || []
  return <>
    <Heading>Mathematical context</Heading>
    {resource.error && <LoadError message={`Math card failed to load: ${resource.error} You can still view the source documentation below.`} retry={resource.retry} retryable={resource.retryable} />}
    {!resource.data && !resource.error && <Notice>Loading curated math cards…</Notice>}
    {cards.map((card, index) => <article key={index} className="my-4 rounded-xl border border-slate-200 bg-white/60 p-4">
      <h5 className="font-semibold">{card.title || card.algorithm || algorithmName(algo)}</h5>
      <p className={mutedClass}>{card.description || card.intuition || card.summary || card.math}</p>
      <pre className="mt-3 whitespace-pre-wrap break-words text-sm">{card.formula || card.formulas?.join('\n')}</pre>
      {card.references?.length ? <TextList items={card.references} /> : null}
    </article>)}
    <div className="grid gap-6 md:grid-cols-2"><section><Heading>Indexed mathematical methods</Heading><TextList items={algo.math_methods || []} /></section>
      <section><Heading>Constructor parameters</Heading><TextList items={algo.params || []} /></section></div>
    <Heading>Indexed documentation</Heading>
    <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-white/60 p-4 text-sm leading-7">{algo.docstring_math || 'No mathematical description is available in the index.'}</pre>
    <Heading>References</Heading><TextList items={algo.references || []} />
    <details className="mt-6 rounded-xl border border-slate-200 p-4"><summary className="cursor-pointer text-sm font-medium">View indexed source</summary>
      <pre className="mt-4 max-h-96 overflow-auto text-xs leading-6">{algo.code || 'No source is indexed.'}</pre></details>
  </>
}

function readProgress() {
  try { return parseProgress(localStorage.getItem(PROGRESS_KEY)) } catch { return {} }
}

function PathPanel({ algo, onSelect }: { algo: AlgorithmResult; onSelect: (algorithm: AlgorithmResult) => void }) {
  const resource = useLearnResource<LearningPath>(learnUrl('path', algo))
  const [progress, setProgress] = useState<LearningProgress>(readProgress)
  const [storageError, setStorageError] = useState(false)
  useEffect(() => {
    const syncProgress = (event: StorageEvent) => {
      if (event.key === PROGRESS_KEY || event.key === null) setProgress(readProgress())
    }
    window.addEventListener('storage', syncProgress)
    return () => window.removeEventListener('storage', syncProgress)
  }, [])
  if (resource.error) return <LoadError message={`Learning path failed to load: ${resource.error}`} retry={resource.retry} retryable={resource.retryable} />
  if (!resource.data) return <Notice>Loading the reading path for this algorithm…</Notice>
  const data = resource.data
  if (!data.steps.length) return <Notice>{data.note || 'No reading path is available for this algorithm.'}</Notice>
  const key = progressKey(algo.module || '', algorithmName(algo), algo.path || '')
  const kinds = data.steps.map(step => step.kind)
  const completed = completedCount(progress, key, kinds)
  function save(next: LearningProgress) {
    const merged = { ...readProgress(), [key]: next[key] || [] }
    setProgress(merged)
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(merged)); setStorageError(false) } catch { setStorageError(true) }
  }
  const roadmap = data.roadmap || []
  const finished = roadmap.filter(item => completedCount(progress, progressKey(data.module, item.name, item.path), kinds) === kinds.length).length
  return <>
    <Notice>Reading suggestions organized from algorithm information; the order can be adjusted as needed.</Notice>
    <details className="mt-3 text-sm text-slate-500"><summary className="cursor-pointer">About this path</summary><p className="mt-2 leading-6">The path is generated from math tags, module membership, and source information; it does not represent verified prerequisite dependencies.</p></details>
    <div className="my-5 flex flex-wrap items-center gap-3"><span className="text-sm">Read {completed}/{data.steps.length} steps</span>
      <progress aria-label="Algorithm reading progress" max={data.steps.length} value={completed} className="h-2 min-w-24 flex-1 accent-slate-700" />
      <button className={buttonClass} onClick={() => save({ ...progress, [key]: [] })}>Reset progress</button></div>
    {storageError && <Notice error>This browser could not save progress; you can still check items in this session, but they may be lost after refresh.</Notice>}
    <ol className="space-y-3">{data.steps.map(step => <li key={step.kind} className="rounded-xl border border-slate-200 bg-white/50 p-4">
      <label className="flex cursor-pointer items-start gap-3"><input type="checkbox" className="mt-1 size-4 accent-slate-700" checked={(progress[key] || []).includes(step.kind)} onChange={event => {
        const current = progress[key] || []
        save({ ...progress, [key]: event.target.checked ? [...new Set([...current, step.kind])] : current.filter(kind => kind !== step.kind) })
      }} /><span className="font-medium">{step.step}. {step.title}</span></label>
      <p className={`mb-3 mt-2 ${mutedClass}`}>{step.detail}</p>
      <TextList items={step.items.map(item => `${item.name}: ${item.note}`)} empty="No additional items for this step." />
    </li>)}</ol>
    <Heading>Module roadmap</Heading>
    <p className={mutedClass}>Sorted by name, not by difficulty or prerequisite order. {finished}/{roadmap.length} algorithms completed in this module; click to switch the learning target.</p>
    <div className="mt-3 grid gap-2 sm:grid-cols-2">{roadmap.map(item => {
      const count = completedCount(progress, progressKey(data.module, item.name, item.path), kinds)
      return <button key={`${item.path}:${item.name}`} aria-pressed={item.is_target} className={`${buttonClass} text-left ${item.is_target ? 'ring-2 ring-slate-500' : ''}`} onClick={() => onSelect({ entity: item.name, module: data.module, path: item.path })}>
        <span className="block break-all font-medium">{item.name}</span><span className="mt-1 block text-slate-500">Read {count}/{kinds.length} steps{item.is_target ? ' · Current algorithm' : ''}</span>
      </button>
    })}</div>
  </>
}

function RelatedFunctionsPanel({ algo }: { algo: AlgorithmResult }) {
  const functions = (algo.functions || []).map(item => typeof item === 'string' ? { name: item } : item)
  return <>
    <Notice>View the member functions and implementations of this algorithm.</Notice>
    <div className="mt-5 space-y-3">{functions.map((member: MemberFunction, index) => <details key={`${index}:${member.name}`} className="rounded-xl border border-slate-200 bg-white/55 p-4">
      <summary className="cursor-pointer break-all font-mono text-sm">{member.name}</summary>
      <p className={`mt-3 whitespace-pre-wrap ${mutedClass}`}>{member.meaning || 'No function documentation is indexed.'}</p>
      {member.code && <pre className="mt-3 max-h-72 overflow-auto text-xs leading-6">{member.code}</pre>}
    </details>)}{!functions.length && <Notice>No member functions are indexed for this algorithm.</Notice>}</div>
  </>
}

function CallGraphPanel({ algo }: { algo: AlgorithmResult }) {
  const resource = useLearnResource<CallGraph>(learnUrl('call_graph', algo))
  if (resource.error) return <LoadError message={`Call graph failed to load: ${resource.error}`} retry={resource.retry} retryable={resource.retryable} />
  if (!resource.data) return <Notice>Loading indexed call relationships…</Notice>
  const data = resource.data
  if (!data.nodes.length) return <Notice>{data.message || 'No indexed call relationships are available.'}</Notice>
  const selected = data.nodes.find(node => node.role === 'selected')
  const positions = new Map(data.nodes.map(node => {
    const peers = data.nodes.filter(peer => peer.role === node.role)
    return [node.id, { x: node.role === 'selected' ? 340 : node.role === 'caller' ? 20 : 660, y: 30 + peers.findIndex(peer => peer.id === node.id) * 88 }]
  }))
  const height = Math.max(160, ...Array.from(positions.values()).map(position => position.y + 100))
  return <>
    <Notice>Generated by static analysis of the source; some calls may not be resolved.</Notice>
    <details className="mt-3 text-sm text-slate-500"><summary className="cursor-pointer">About this call graph</summary><p className="mt-2 leading-6">Based on call symbols in the AST, matching objects in the same file, module, and class first. This is not runtime tracing; ambiguous calls are not connected, and unresolved symbols are listed below the graph.</p></details>
    <div className="mt-4 overflow-auto rounded-xl border border-slate-200 bg-white/40"><svg viewBox={`0 0 960 ${height}`} className="min-w-[800px] w-full" role="img" aria-label={`Indexed calls for ${algorithmName(algo)}`}>
      <defs><marker id="indexed-call-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#64748b" /></marker></defs>
      {data.edges.map((edge, index) => {
        const source = positions.get(edge.source)
        const target = positions.get(edge.target)
        return source && target ? <line key={index} x1={source.x + 250} y1={source.y + 27} x2={target.x} y2={target.y + 27} stroke="#64748b" markerEnd="url(#indexed-call-arrow)" /> : null
      })}
      {data.nodes.map(node => {
        const position = positions.get(node.id)!
        return <g key={node.id}><title>{node.entity} · {node.path}:{node.lines}</title><rect x={position.x} y={position.y} width="250" height="54" rx="10" fill={node.id === selected?.id ? '#334155' : '#ffffff'} stroke="#94a3b8" />
          <text x={position.x + 12} y={position.y + 23} fontSize="12" fill={node.id === selected?.id ? '#ffffff' : '#1e293b'}>{node.entity.length > 31 ? `${node.entity.slice(0, 30)}…` : node.entity}</text>
          <text x={position.x + 12} y={position.y + 42} fontSize="10" fill={node.id === selected?.id ? '#cbd5e1' : '#64748b'}>{node.role} · {node.lines}</text></g>
      })}
    </svg></div>
    {!data.edges.length && <p className={`mt-3 ${mutedClass}`}>No unambiguous indexed edges were found; no illustrative edges have been added.</p>}
    <Heading>Unresolved call symbols</Heading><TextList items={data.unresolved_calls} empty="No unresolved symbols were reported." />
  </>
}

function ComparePanel({ algo }: { algo: AlgorithmResult }) {
  const resource = useLearnResource<{ algorithms: AlgorithmResult[] }>(learnUrl('compare', algo))
  const [peerKey, setPeerKey] = useState('')
  if (resource.error) return <LoadError message={`Same-module algorithms failed to load: ${resource.error}`} retry={resource.retry} retryable={resource.retryable} />
  if (!resource.data) return <Notice>Loading algorithms from the selected module…</Notice>
  const keyOf = (item: AlgorithmResult) => progressKey(item.module || '', algorithmName(item), item.path || '')
  const peers = resource.data.algorithms.filter(item => keyOf(item) !== keyOf(algo))
  const peer = peers.find(item => keyOf(item) === peerKey) || peers[0]
  if (!peer) return <Notice>No other algorithm classes are indexed in this module.</Notice>
  const rows: Array<[string, (item: AlgorithmResult) => string]> = [
    ['Module', item => item.module || '—'], ['Family', item => item.family || '—'],
    ['Task', item => item.task || '—'], ['Mathematical methods', item => item.math_methods?.join(', ') || '—'],
    ['Parameters', item => item.params?.join(', ') || '—'],
    ['Mathematical description', item => item.docstring_math?.trim() || 'Not indexed'],
    ['References', item => item.references?.filter(value => value.trim()).join('\n') || 'Not indexed'],
    ['Heuristic source score (not Big-O)', item => item.complexity == null ? '—' : String(item.complexity)],
    ['Source', item => `${item.path || '—'}:${item.lines || '—'}`],
  ]
  return <>
    <label className="flex flex-wrap items-center gap-3 text-sm">Compare with <select className={buttonClass} value={keyOf(peer)} onChange={event => setPeerKey(event.target.value)}>{peers.map(item => <option key={keyOf(item)} value={keyOf(item)}>{algorithmName(item)}</option>)}</select></label>
    <p className={`my-4 ${mutedClass}`}>Compare the parameters, math methods, math descriptions, references, and source information of two algorithms. Missing math descriptions and references are marked as "Not indexed".</p>
    <div className="overflow-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b border-slate-300"><th className="p-3">Feature</th><th className="p-3">{algorithmName(algo)}</th><th className="p-3">{algorithmName(peer)}</th></tr></thead>
      <tbody>{rows.map(([label, value]) => <tr className="border-b border-slate-200 align-top" key={label}><th scope="row" className="p-3 font-normal text-slate-500">{label}</th><td className="max-w-xs whitespace-pre-wrap break-words p-3">{value(algo)}</td><td className="max-w-xs whitespace-pre-wrap break-words p-3">{value(peer)}</td></tr>)}</tbody></table></div>
  </>
}

function ComplexityPanel({ algo }: { algo: AlgorithmResult }) {
  const signals = algo.source_signals
  return <>
    <Notice>Source-structure metrics, for reading reference only; they do not represent time or space complexity.</Notice>
    <Heading>Heuristic source score</Heading>
    <p className="text-3xl font-semibold">{algo.complexity ?? 'Not indexed'}</p>
    <details className={`mt-3 ${mutedClass}`}><summary className="cursor-pointer">About these metrics</summary><p className="mt-2">Computed as: branch, loop, and comprehension node counts + source lines / 10. This value is neither standard cyclomatic complexity nor Big-O; judging runtime cost also requires input dimensions, loop bounds, and library-function costs.</p></details>
    <Heading>AST evidence</Heading>
    {signals ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{[
      ['Source lines', signals.lines], ['For loops', signals.for_loops], ['While loops', signals.while_loops],
      ['Comprehensions', signals.comprehensions], ['If branches', signals.branches], ['Matrix @ operators', signals.matrix_operators],
    ].map(([label, value]) => <div className="rounded-xl border border-slate-200 bg-white/60 p-4" key={label}><span className="text-xs text-slate-500">{label}</span><p className="mt-1 text-2xl">{value}</p></div>)}</div> : <Notice>Source could not be parsed, so structural counts are unavailable.</Notice>}
    <Heading>Before claiming Big-O</Heading><TextList items={['Confirm input dimensions such as sample count, feature count, and iteration count.', 'Check the bounds and early-exit conditions of nested loops.', 'Verify the actual costs of matrix operations and external functions, temporary arrays, and data copies.']} />
  </>
}

function QuizPanel({ algo }: { algo: AlgorithmResult }) {
  const [resetVersion, setResetVersion] = useState(0)
  const questions = algo.quiz || []
  return <>
    {questions.length === 0 && <Notice>There is not enough source or metadata for this algorithm to generate reliable questions.</Notice>}
    <div key={resetVersion} className="my-5 space-y-3">{questions.map((question, index) => <details key={question.question} className="rounded-xl border border-slate-200 bg-white/60 p-4">
      <summary className="cursor-pointer text-sm font-medium">Q{index + 1}. {question.question}</summary><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{question.answer}</p><pre className="mt-3 whitespace-pre-wrap break-words text-xs text-slate-500">Evidence: {question.evidence}</pre>
    </details>)}</div>
    <button className={buttonClass} onClick={() => setResetVersion(version => version + 1)}>Hide all answers</button>
  </>
}

function RecommendPanel({ algo, onSelect }: { algo: AlgorithmResult; onSelect: (algorithm: AlgorithmResult) => void }) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<{ items?: AlgorithmResult[]; error?: string; retryable?: boolean }>({})
  useEffect(() => {
    const controller = new AbortController()
    setState({})
    fetch('/api/search', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
      body: JSON.stringify({ query: recommendationQuery(algo), top_k: 10, module: '', family: '', task: '' }),
    }).then(response => readApiResponse<{ results: AlgorithmResult[] }>(response))
      .then(data => { if (!controller.signal.aborted) setState({ items: rankRecommendations(algo, data.results || []) }) })
      .catch((error: unknown) => { if (!controller.signal.aborted) setState({ error: describeApiError(error).message, retryable: describeApiError(error).retryable }) })
    return () => controller.abort()
  }, [algo, attempt])
  return <>
    {state.error && <LoadError message={state.error} retryable={state.retryable} retry={() => setAttempt(value => value + 1)} />}
    {!state.items && !state.error && <Notice>Finding related algorithms…</Notice>}
    {state.items?.length === 0 && <Notice>No other similar algorithms were found.</Notice>}
    <div className="mt-5 grid gap-4 sm:grid-cols-2">{state.items?.map(item => <article className="rounded-xl border border-slate-200 bg-white/60 p-4" key={`${item.module}:${item.path}:${algorithmName(item)}`}>
      <h4 className="break-words font-semibold">{algorithmName(item)}</h4><p className={mutedClass}>{item.module} · {item.task}</p>
      <p className="my-3 text-sm">Ranking score: {recommendationScore(algo, item).toFixed(3)} · {Number.isFinite(item.semantic) ? `Semantic score: ${item.semantic!.toFixed(3)}` : 'Semantic score unavailable'}</p>
      <p className="mb-3 text-sm">Why recommended: {recommendationReasons(algo, item).join(' · ')}</p>
      <button className={buttonClass} onClick={() => onSelect(item)}>Study {algorithmName(item)}</button>
    </article>)}</div>
  </>
}

export default function ModePanel({ mode, algorithm, onSelect, onOpenRecommendation }: { mode: LearnMode; algorithm: AlgorithmResult; onSelect: (algorithm: AlgorithmResult) => void; onOpenRecommendation: (algorithm: AlgorithmResult) => void }) {
  const resource = useLearnResource<{ algorithm: AlgorithmResult | null }>(learnUrl('algorithm', algorithm))
  if (resource.error) return <Shell><LoadError message={`Algorithm details failed to load: ${resource.error}`} retry={resource.retry} retryable={resource.retryable} /></Shell>
  if (!resource.data) return <Shell><Notice>Loading indexed algorithm details…</Notice></Shell>
  if (!resource.data.algorithm) return <Shell><Notice>The selected algorithm is not present in this index. Return to Browse to select another.</Notice></Shell>
  const algo = resource.data.algorithm
  return <Shell><AlgoHeader algo={algo} />
    {mode.id === 'math-card' && <MathCardPanel algo={algo} />}
    {mode.id === 'path' && <PathPanel algo={algo} onSelect={onSelect} />}
    {mode.id === 'related-functions' && <RelatedFunctionsPanel algo={algo} />}
    {mode.id === 'call-graph' && <CallGraphPanel algo={algo} />}
    {mode.id === 'compare' && <ComparePanel algo={algo} />}
    {mode.id === 'complexity' && <ComplexityPanel algo={algo} />}
    {mode.id === 'quiz' && <QuizPanel key={`${algo.module}:${algo.path}:${algorithmName(algo)}`} algo={algo} />}
    {mode.id === 'recommend' && <RecommendPanel key={`${algo.module}:${algo.path}:${algorithmName(algo)}`} algo={algo} onSelect={onOpenRecommendation} />}
  </Shell>
}
