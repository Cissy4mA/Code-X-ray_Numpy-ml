import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { LearnMode } from '@/data/learn'
import {
  algorithmName, learnUrl, useLearnResource,
  type AlgorithmResult, type CallGraph, type LearningPath, type MemberFunction,
} from '@/data/learning'
import { completedCount, parseProgress, progressKey, PROGRESS_KEY, type LearningProgress } from '@/data/progress'

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
  return <Notice error>{message}{retryable && <button className={`${buttonClass} ml-3`} onClick={retry}>Retry / 重试</button>}</Notice>
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
    <Heading>Mathematical context · 数学背景</Heading>
    {resource.error && <LoadError message={`数学卡片加载失败：${resource.error} 仍可查看下方的源码文档。`} retry={resource.retry} retryable={resource.retryable} />}
    {!resource.data && !resource.error && <Notice>Loading curated math cards…</Notice>}
    {cards.map((card, index) => <article key={index} className="my-4 rounded-xl border border-slate-200 bg-white/60 p-4">
      <h5 className="font-semibold">{card.title || card.algorithm || algorithmName(algo)}</h5>
      <p className={mutedClass}>{card.description || card.intuition || card.summary || card.math}</p>
      <pre className="mt-3 whitespace-pre-wrap break-words text-sm">{card.formula || card.formulas?.join('\n')}</pre>
      {card.references?.length ? <TextList items={card.references} /> : null}
    </article>)}
    <div className="grid gap-6 md:grid-cols-2"><section><Heading>Indexed mathematical methods · 数学标签</Heading><TextList items={algo.math_methods || []} /></section>
      <section><Heading>Constructor parameters · 参数</Heading><TextList items={algo.params || []} /></section></div>
    <Heading>Indexed documentation · 源码文档</Heading>
    <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-white/60 p-4 text-sm leading-7">{algo.docstring_math || 'No mathematical description is available in the index.'}</pre>
    <Heading>References · 参考文献</Heading><TextList items={algo.references || []} />
    <details className="mt-6 rounded-xl border border-slate-200 p-4"><summary className="cursor-pointer text-sm font-medium">View indexed source · 查看源码</summary>
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
  if (resource.error) return <LoadError message={`学习路径加载失败：${resource.error}`} retry={resource.retry} retryable={resource.retryable} />
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
    <Notice>根据算法信息整理的阅读建议，可按需调整顺序。</Notice>
    <details className="mt-3 text-sm text-slate-500"><summary className="cursor-pointer">路径说明</summary><p className="mt-2 leading-6">路径依据数学标签、所属模块和源码信息生成，不代表已验证的先修依赖关系。</p></details>
    <div className="my-5 flex flex-wrap items-center gap-3"><span className="text-sm">已读 {completed}/{data.steps.length} 步</span>
      <progress aria-label="Algorithm reading progress" max={data.steps.length} value={completed} className="h-2 min-w-24 flex-1 accent-slate-700" />
      <button className={buttonClass} onClick={() => save({ ...progress, [key]: [] })}>Reset progress · 重置进度</button></div>
    {storageError && <Notice error>浏览器无法保存进度；当前会话仍可勾选，但刷新后可能丢失。</Notice>}
    <ol className="space-y-3">{data.steps.map(step => <li key={step.kind} className="rounded-xl border border-slate-200 bg-white/50 p-4">
      <label className="flex cursor-pointer items-start gap-3"><input type="checkbox" className="mt-1 size-4 accent-slate-700" checked={(progress[key] || []).includes(step.kind)} onChange={event => {
        const current = progress[key] || []
        save({ ...progress, [key]: event.target.checked ? [...new Set([...current, step.kind])] : current.filter(kind => kind !== step.kind) })
      }} /><span className="font-medium">{step.step}. {step.title}</span></label>
      <p className={`mb-3 mt-2 ${mutedClass}`}>{step.detail}</p>
      <TextList items={step.items.map(item => `${item.name}: ${item.note}`)} empty="No additional items for this step." />
    </li>)}</ol>
    <Heading>Module roadmap · 模块阅读列表</Heading>
    <p className={mutedClass}>按名称排序，不表示难度或先修顺序。模块已完成 {finished}/{roadmap.length} 个算法；点击切换学习目标。</p>
    <div className="mt-3 grid gap-2 sm:grid-cols-2">{roadmap.map(item => {
      const count = completedCount(progress, progressKey(data.module, item.name, item.path), kinds)
      return <button key={`${item.path}:${item.name}`} aria-pressed={item.is_target} className={`${buttonClass} text-left ${item.is_target ? 'ring-2 ring-slate-500' : ''}`} onClick={() => onSelect({ entity: item.name, module: data.module, path: item.path })}>
        <span className="block break-all font-medium">{item.name}</span><span className="mt-1 block text-slate-500">已读 {count}/{kinds.length} 步{item.is_target ? ' · 当前算法' : ''}</span>
      </button>
    })}</div>
  </>
}

function RelatedFunctionsPanel({ algo }: { algo: AlgorithmResult }) {
  const functions = (algo.functions || []).map(item => typeof item === 'string' ? { name: item } : item)
  return <>
    <Notice>查看该算法的成员函数及实现。</Notice>
    <div className="mt-5 space-y-3">{functions.map((member: MemberFunction, index) => <details key={`${index}:${member.name}`} className="rounded-xl border border-slate-200 bg-white/55 p-4">
      <summary className="cursor-pointer break-all font-mono text-sm">{member.name}</summary>
      <p className={`mt-3 whitespace-pre-wrap ${mutedClass}`}>{member.meaning || 'No function documentation is indexed.'}</p>
      {member.code && <pre className="mt-3 max-h-72 overflow-auto text-xs leading-6">{member.code}</pre>}
    </details>)}{!functions.length && <Notice>No member functions are indexed for this algorithm.</Notice>}</div>
  </>
}

function CallGraphPanel({ algo }: { algo: AlgorithmResult }) {
  const resource = useLearnResource<CallGraph>(learnUrl('call_graph', algo))
  if (resource.error) return <LoadError message={`调用图加载失败：${resource.error}`} retry={resource.retry} retryable={resource.retryable} />
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
    <Notice>根据源码静态解析生成，部分调用可能无法解析。</Notice>
    <details className="mt-3 text-sm text-slate-500"><summary className="cursor-pointer">调用图说明</summary><p className="mt-2 leading-6">根据 AST 中的调用符号，优先匹配同文件、同模块和同类中的对象。这不是运行时追踪；有歧义的调用不连线，未解析的符号列在图下方。</p></details>
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
    <Heading>Unresolved call symbols · 未解析的调用</Heading><TextList items={data.unresolved_calls} empty="No unresolved symbols were reported." />
  </>
}

function ComparePanel({ algo }: { algo: AlgorithmResult }) {
  const resource = useLearnResource<{ algorithms: AlgorithmResult[] }>(learnUrl('compare', algo))
  const [peerKey, setPeerKey] = useState('')
  if (resource.error) return <LoadError message={`同模块算法加载失败：${resource.error}`} retry={resource.retry} retryable={resource.retryable} />
  if (!resource.data) return <Notice>Loading algorithms from the selected module…</Notice>
  const keyOf = (item: AlgorithmResult) => progressKey(item.module || '', algorithmName(item), item.path || '')
  const peers = resource.data.algorithms.filter(item => keyOf(item) !== keyOf(algo))
  const peer = peers.find(item => keyOf(item) === peerKey) || peers[0]
  if (!peer) return <Notice>No other algorithm classes are indexed in this module.</Notice>
  const rows: Array<[string, (item: AlgorithmResult) => string]> = [
    ['Module · 模块', item => item.module || '—'], ['Family · 算法族', item => item.family || '—'],
    ['Task · 任务', item => item.task || '—'], ['Mathematical methods · 数学标签', item => item.math_methods?.join(', ') || '—'],
    ['Parameters · 参数', item => item.params?.join(', ') || '—'],
    ['Mathematical description · 数学说明', item => item.docstring_math?.trim() || '未收录 / Not indexed'],
    ['References · 参考文献', item => item.references?.filter(value => value.trim()).join('\n') || '未收录 / Not indexed'],
    ['Heuristic source score · 源码启发式指标（非 Big-O）', item => item.complexity == null ? '—' : String(item.complexity)],
    ['Source · 源码', item => `${item.path || '—'}:${item.lines || '—'}`],
  ]
  return <>
    <label className="flex flex-wrap items-center gap-3 text-sm">Compare with · 选择同模块算法<select className={buttonClass} value={keyOf(peer)} onChange={event => setPeerKey(event.target.value)}>{peers.map(item => <option key={keyOf(item)} value={keyOf(item)}>{algorithmName(item)}</option>)}</select></label>
    <p className={`my-4 ${mutedClass}`}>比较两个算法的参数、数学方法、数学说明、参考文献与源码信息。未提供的数学说明和参考文献标注为“未收录”。</p>
    <div className="overflow-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b border-slate-300"><th className="p-3">Feature</th><th className="p-3">{algorithmName(algo)}</th><th className="p-3">{algorithmName(peer)}</th></tr></thead>
      <tbody>{rows.map(([label, value]) => <tr className="border-b border-slate-200 align-top" key={label}><th scope="row" className="p-3 font-normal text-slate-500">{label}</th><td className="max-w-xs whitespace-pre-wrap break-words p-3">{value(algo)}</td><td className="max-w-xs whitespace-pre-wrap break-words p-3">{value(peer)}</td></tr>)}</tbody></table></div>
  </>
}

function ComplexityPanel({ algo }: { algo: AlgorithmResult }) {
  const signals = algo.source_signals
  return <>
    <Notice>源码结构指标，仅供阅读参考，不代表时间或空间复杂度。</Notice>
    <Heading>Heuristic source score · 源码启发式指标</Heading>
    <p className="text-3xl font-semibold">{algo.complexity ?? 'Not indexed'}</p>
    <details className={`mt-3 ${mutedClass}`}><summary className="cursor-pointer">指标说明</summary><p className="mt-2">计算方式：分支、循环和推导式节点数 + 源码行数 ÷ 10。该值不是标准圈复杂度，也不是 Big-O；判断运行开销还需结合输入维度、循环边界和库函数成本。</p></details>
    <Heading>AST evidence · 静态结构</Heading>
    {signals ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{[
      ['Source lines', signals.lines], ['For loops', signals.for_loops], ['While loops', signals.while_loops],
      ['Comprehensions', signals.comprehensions], ['If branches', signals.branches], ['Matrix @ operators', signals.matrix_operators],
    ].map(([label, value]) => <div className="rounded-xl border border-slate-200 bg-white/60 p-4" key={label}><span className="text-xs text-slate-500">{label}</span><p className="mt-1 text-2xl">{value}</p></div>)}</div> : <Notice>Source could not be parsed, so structural counts are unavailable.</Notice>}
    <Heading>Before claiming Big-O · 进一步核对</Heading><TextList items={['确认样本数、特征数、迭代次数等输入维度。', '检查嵌套循环的边界与提前退出条件。', '核对矩阵运算和外部函数的实际成本、临时数组及数据复制。']} />
  </>
}

function QuizPanel({ algo }: { algo: AlgorithmResult }) {
  const [resetVersion, setResetVersion] = useState(0)
  const questions = [
    { question: '当前学习的是哪个算法？它位于哪个源码文件？', answer: `${algorithmName(algo)} · ${algo.path || 'Path not indexed'}:${algo.lines || '—'}` },
    ...(algo.math_methods?.length ? [{ question: '说出一个索引中标注的数学方法或概念。', answer: algo.math_methods.join(', ') }] : []),
    ...(algo.params?.length ? [{ question: '列举一个构造参数，并回到源码确认它的作用。', answer: `${algo.params.join(', ')}。这些是参数名，含义和默认值请核对源码。` }] : []),
    ...(algo.functions?.length ? [{ question: '找出一个成员函数，并阅读它的实现。', answer: algo.functions.map(item => typeof item === 'string' ? item : item.name).join(', ') }] : []),
    { question: '为什么不能用源码复杂度分数直接得出时间复杂度？', answer: '该分数仅由语法节点数与源码行数计算。Big-O 还取决于输入规模、循环上界和被调用运算的成本。' },
  ]
  return <>
    <Notice>题目依据当前算法的索引元数据生成，用于阅读后的自测，不自动评分。请先思考，再展开参考答案。</Notice>
    <div key={resetVersion} className="my-5 space-y-3">{questions.map((question, index) => <details key={question.question} className="rounded-xl border border-slate-200 bg-white/60 p-4">
      <summary className="cursor-pointer text-sm font-medium">Q{index + 1}. {question.question}</summary><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{question.answer}</p>
    </details>)}</div>
    <button className={buttonClass} onClick={() => setResetVersion(version => version + 1)}>Hide all answers · 收起全部答案</button>
  </>
}

export default function ModePanel({ mode, algorithm, onSelect }: { mode: LearnMode; algorithm: AlgorithmResult; onSelect: (algorithm: AlgorithmResult) => void }) {
  const resource = useLearnResource<{ algorithm: AlgorithmResult | null }>(learnUrl('algorithm', algorithm))
  if (resource.error) return <Shell><LoadError message={`算法详情加载失败：${resource.error}`} retry={resource.retry} retryable={resource.retryable} /></Shell>
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
    {mode.id === 'quiz' && <QuizPanel algo={algo} />}
  </Shell>
}
