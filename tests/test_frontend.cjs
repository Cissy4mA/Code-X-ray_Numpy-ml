const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('../frontend/node_modules/typescript')

const root = path.resolve(__dirname, '..')
const source = fs.readFileSync(path.join(root, 'frontend/src/sections/OrbitPages.tsx'), 'utf8')
const scripts = [...source.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1])
for (const script of scripts) new vm.Script(script)

const errorCode = ts.transpileModule(fs.readFileSync(path.join(root, 'frontend/src/data/api-errors.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const errorContext = { exports: {}, Error, TypeError }
vm.runInNewContext(errorCode, errorContext)
const { readApiResponse, describeApiError } = errorContext.exports

const compiled = ts.transpileModule(fs.readFileSync(path.join(root, 'frontend/src/data/progress.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText
const progressContext = { exports: {} }
vm.runInNewContext(compiled, progressContext)
const { parseProgress, progressKey, completedCount } = progressContext.exports
const discoveryCode = ts.transpileModule(fs.readFileSync(path.join(root, 'frontend/src/data/discovery.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const discoveryContext = { exports: {}, require: () => ({ algorithmName: algorithm => algorithm.entity || algorithm.name || algorithm.class_name || '' }) }
vm.runInNewContext(discoveryCode, discoveryContext)
const { recommendationQuery, recommendationScore, recommendationReasons, rankRecommendations } = discoveryContext.exports
const seed = { entity: 'Forest', module: 'trees', path: 'trees/forest.py', task: 'regression', math_methods: ['Variance'] }
assert.equal(recommendationQuery(seed), 'Forest regression Variance')
const similar = { entity: 'Tree', module: 'trees', path: 'trees/tree.py', task: 'regression', math_methods: ['variance'], semantic: 0.4, fused: 0.4 }
assert.equal(recommendationReasons(seed, similar).length, 3)
assert.ok(Math.abs(recommendationScore(seed, similar) - 1.15) < 0.0001)
const recommendations = rankRecommendations(seed, [seed, similar, { ...similar, semantic: 0.1 }, ...Array.from({ length: 9 }, (_, index) => ({ entity: `Other${index}`, semantic: 0.2 }))])
assert.equal(recommendations.length, 6)
assert.equal(recommendations[0].entity, 'Tree')
assert.equal(recommendations[0].semantic, 0.4)
assert.equal(recommendations.filter(item => item.entity === 'Tree').length, 1)
assert.equal(rankRecommendations(seed, [seed]).length, 0)
assert.equal(recommendationReasons({ task: 'other' }, { task: 'other' }).length, 1)
assert.equal(recommendationScore({}, { semantic: 0, fused: 100 }), 100)
assert.equal(recommendationScore({}, { fused: 100 }), 100)
assert.equal(recommendationScore({}, { semantic: -0.2, fused: 100 }), 100)
assert.equal(rankRecommendations(seed, [{ ...seed, module: 'different' }]).length, 0)
assert.equal(rankRecommendations(seed, [{ ...seed, lines: '20-30' }]).length, 1)
const mainReference = require('./main_recommendation_reference.cjs')
const referenceCases = [seed, similar, {},
  { entity: 'Family', path: 'trees/family.py', family: 'Ensemble', task: 'other', math_methods: ['A', 'B', 'C', 'D', 'E'], fused: 0.3, semantic: 0.9 },
  { entity: 'Alias', path: 'elsewhere/alias.py', family: 'ensemble', task: 'other', math_methods: ['a', 'b', 'c', 'd', 'e'], fused: 0.9, semantic: 0.1 },
  { entity: 'Fallback', family: 'other', math_methods: 'A; B|C', semantic: 1 },
  { entity: 'Windows', path: 'trees\\windows.py', family: 'other', methods: ['Variance'], fused: 0 },
]
for (const selected of referenceCases) {
  assert.equal(recommendationQuery(selected), mainReference.query(selected))
  for (const candidate of referenceCases) {
    assert.equal(recommendationScore(selected, candidate), mainReference.score(selected, candidate))
    assert.deepEqual(Array.from(recommendationReasons(selected, candidate)), Array.from(mainReference.reasons(selected, candidate)))
  }
}
assert.deepEqual(Array.from(rankRecommendations(seed, referenceCases.concat(referenceCases))).map(item => item.entity), mainReference.rank(seed, referenceCases.concat(referenceCases)).filter(item => item.entity).map(item => item.entity))
assert.equal(Object.keys(parseProgress('{broken')).length, 0)
assert.equal(Object.keys(parseProgress('["invalid"]')).length, 0)
assert.equal(Object.keys(parseProgress('{"bad":3}')).length, 0)
const first = progressKey('trees', 'RandomForest', 'forest.py')
const second = progressKey('trees', 'DecisionTree', 'tree.py')
const progress = parseProgress(JSON.stringify({ [first]: ['module', 'target'] }))
assert.equal(completedCount(progress, first, ['module', 'target', 'prerequisite']), 2)
assert.equal(completedCount(progress, second, ['module', 'target']), 0)

const elements = new Map()
function element(id) {
  if (!elements.has(id)) {
    elements.set(id, {
      value: '', disabled: false, innerHTML: '', textContent: '', options: [], dataset: {}, style: {},
      addEventListener() {}, querySelectorAll() { return [] }, scrollIntoView() {}, focus() {},
      querySelector() { return { addEventListener() {} } },
      appendChild(option) { this.options.push(option) },
    })
  }
  return elements.get(id)
}

const requests = []
const context = {
  readApiResponse, describeApiError,
  console, setTimeout() {}, requestAnimationFrame() {}, cancelAnimationFrame() {},
  matchMedia: () => ({ matches: true }), location: { hash: '' },
  document: { getElementById: element, querySelectorAll: () => [], createElement: () => ({}) },
  fetch: async (endpoint, options) => {
    const body = options?.body ? JSON.parse(options.body) : null
    requests.push({ endpoint, body })
    const data = endpoint === '/api/modules' ? { modules: [{ name: 'trees' }] }
      : endpoint === '/api/modules/search' ? body.query === 'svm'
        ? { not_in_repo: true, algorithm: 'SVM', results: [] }
        : { results: [{ name: 'trees', readme: 'Trees' }] }
      : { results: [{ entity: 'RandomForest', module: body.module, fused: 1.2, keyword: 3.819, semantic: 0.390, code: 'class RandomForest:\n    pass', task: 'regression' }] }
    return { ok: true, json: async () => data }
  },
}
context.window = context
vm.createContext(context)
vm.runInContext(scripts.find(script => script.includes('var MODULE_CACHE')), context)
const flush = () => new Promise(resolve => setImmediate(resolve))

async function run() {
  assert.deepEqual(await readApiResponse(new Response(JSON.stringify({ results: [] }))), { results: [] })
  for (const [status, detail, retryable, expected] of [
    [503, '查询模型与索引模型不一致。请运行 scripts/reembed_all.py', false, /检索配置异常/],
    [503, '查询向量维度与索引不一致，请检查模型配置并全量重建索引。', false, /检索配置异常/],
    [503, 'Temporary test failure', true, /服务暂时不可用/],
    [400, 'Query is invalid', false, /Query is invalid/],
    [403, 'Admin API is disabled', false, /访问权限/],
    [422, [{ msg: 'Field required' }], false, /Field required/],
    [429, 'Rate limit', true, /请求过于频繁/],
  ]) {
    await assert.rejects(readApiResponse(new Response(JSON.stringify({ detail }), { status })), error => {
      const problem = describeApiError(error)
      assert.equal(problem.retryable, retryable)
      assert.match(problem.message, expected)
      assert.match(problem.message, new RegExp(`HTTP ${status}`))
      return true
    })
  }
  await assert.rejects(readApiResponse(new Response('<html>Gateway error</html>', { status: 502 })), /HTTP 502/)
  await assert.rejects(readApiResponse(new Response('invalid JSON')), /无法读取/)
  assert.match(describeApiError(new TypeError('Failed to fetch')).message, /网络连接失败/)
  context.renderModules([{ name: 'trees', reason: '<img src=x onerror=alert(1)>', readme: 'Trees' }])
  assert.match(element('mres').innerHTML, /Why this module: &lt;img/)
  assert.doesNotMatch(element('mres').innerHTML, /<img/)
  context.renderModules([{ name: 'trees', readme: 'Trees' }])
  assert.doesNotMatch(element('mres').innerHTML, /module-reason/)
  await context.__ensureSearchBooted()
  assert.equal(element('ago').disabled, true)
  context.runAlgoSearch()
  assert.equal(requests.filter(request => request.endpoint === '/api/search').length, 0)
  element('mq').value = 'random forest'
  context.runModuleSearch()
  await flush()
  assert.equal(requests.at(-1).endpoint, '/api/modules/search')
  context.selectModule(context.MODULE_RESULTS[0])
  await flush()
  assert.equal(requests.at(-1).body.module, 'trees')
  assert.equal(requests.at(-1).body.query, 'random forest')
  assert.equal(element('aq').value, 'random forest')
  assert.equal(element('ago').disabled, false)
  assert.match(element('score-summary').innerHTML, /1\.200/)
  assert.match(element('score-summary').innerHTML, /not probabilities/)
  assert.match(element('bubble-field').innerHTML, /class="bubble"/)
  assert.match(element('bubble-field').innerHTML, /data-result="0"/)
  assert.match(element('ares').innerHTML, /id="algorithm-result-0"/)
  context.renderBubbles([{ entity: '<img src=x>', fused: -2 }, { entity: 'B', fused: 2 }])
  assert.match(element('bubble-field').innerHTML, /width:62px/)
  assert.match(element('bubble-field').innerHTML, /width:136px/)
  assert.doesNotMatch(element('bubble-field').innerHTML, /<img/)
  context.renderBubbles([{ entity: 'Equal', fused: 1 }, { entity: 'Equal2', fused: 1 }])
  assert.doesNotMatch(element('bubble-field').innerHTML, /NaN|Infinity/)
  context.renderBubbles([])
  assert.equal(element('bubble-field').hidden, true)
  assert.match(element('ares').innerHTML, /Fused \/ 融合得分/)
  assert.match(element('ares').innerHTML, /Keyword \/ 关键词得分/)
  assert.match(element('ares').innerHTML, /Semantic \/ 语义得分/)
  assert.match(element('ares').innerHTML, /3\.819/)
  assert.match(element('ares').innerHTML, /0\.390/)
  assert.match(element('ares').innerHTML, /class RandomForest:/)
  assert.match(element('ares').innerHTML, /Task \/ 任务/)
  assert.match(element('ares').innerHTML, /regression/)
  element('mq').value = 'svm'
  context.runModuleSearch()
  await flush()
  assert.equal(element('ago').disabled, true)
  assert.match(element('mres').innerHTML, /Not included.*SVM/)
  const count = requests.length
  context.runAlgoSearch()
  assert.equal(requests.length, count)
  let resolveOld
  context.fetch = () => new Promise(resolve => {
    resolveOld = () => resolve({ ok: true, json: async () => ({ results: [{ entity: 'OldResult' }] }) })
  })
  context.selectModule({ name: 'trees' })
  context.resetModuleSelection()
  resolveOld()
  await flush()
  assert.doesNotMatch(element('ares').innerHTML, /OldResult/)
  assert.equal(context.esc('"<unsafe>'), '&quot;&lt;unsafe&gt;')
  context.renderClasses([], [{ entity: 'standalone_example', type: 'function', module: 'trees', code: 'def standalone_example():\n    return 1', fused: 0.5 }])
  assert.match(element('ares').innerHTML, /Function \/ 独立函数/)
  assert.match(element('ares').innerHTML, /def standalone_example/)
  assert.doesNotMatch(element('ares').innerHTML, /No matching algorithms/)
  const runtimeCode = ts.transpileModule(fs.readFileSync(path.join(root, 'frontend/src/data/orbit-runtime.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText
  const listeners = new Map()
  const timers = new Map()
  const frames = new Map()
  let identifier = 0
  const runtimeWindow = {
    addEventListener: (type, listener) => listeners.set(type, listener),
    removeEventListener: type => listeners.delete(type),
    setTimeout: callback => { timers.set(++identifier, callback); return identifier },
    clearTimeout: timer => timers.delete(timer),
    requestAnimationFrame: callback => { frames.set(++identifier, callback); return identifier },
    cancelAnimationFrame: frame => frames.delete(frame),
    fetch: async () => ({ ok: true }),
  }
  const runtimeContext = { exports: {}, window: runtimeWindow, document: runtimeWindow, AbortController, CSS: { escape: value => value }, require: name => {
    assert.equal(name, './api-errors')
    return errorContext.exports
  } }
  vm.runInNewContext(runtimeCode, runtimeContext)
  const dispose = runtimeContext.exports.runOrbitScripts({ querySelector: () => null, querySelectorAll: () => [] }, [
    "window.__probe = 1; window.addEventListener('resize', function(){}); document.addEventListener('click', function(){}); setTimeout(function(){},100); requestAnimationFrame(function(){});",
  ], { current: null })
  assert.equal(listeners.size, 2)
  assert.equal(timers.size, 1)
  assert.equal(frames.size, 1)
  dispose()
  assert.equal(listeners.size, 0)
  assert.equal(timers.size, 0)
  assert.equal(frames.size, 0)
  assert.equal(runtimeWindow.__probe, undefined)
  console.log('PASS: script syntax; progress validation/isolation; module-first gating; query carry-over; scoped search; unsupported algorithms; stale requests; real scores; HTML escaping.')
  console.log('PASS: standalone function results; event/timer/animation/global cleanup.')
  console.log('PASS: module reason rendering/escaping; API details; configuration/network/validation/service errors; retry classification.')
  console.log('PASS: normalized bubble sizes/escaping/empty states; recommendation query/self-exclusion/dedup/ranking.')
}

run().catch(error => { console.error(error); process.exitCode = 1 })
