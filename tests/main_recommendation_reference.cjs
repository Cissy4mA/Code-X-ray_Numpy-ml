const { execFileSync } = require('node:child_process')
const path = require('node:path')
const vm = require('node:vm')

const source = execFileSync('git', ['show', 'origin/main:frontend/index.html'], { cwd: path.join(__dirname, '..'), encoding: 'utf8' })
const compare = source.slice(source.indexOf('function compareList('), source.indexOf('function removeCompare('))
const recommend = source.slice(source.indexOf('function recMethods('), source.indexOf('function openRecommendation('))
if (!compare || !recommend) throw new Error('main reference functions are missing')
const context = {}
vm.runInNewContext(compare + '\n' + recommend, context)

function query(algorithm) {
  return [algorithm.entity, algorithm.task, ...context.compareMethods(algorithm).slice(0, 4)].filter(Boolean).join(' ') || algorithm.entity || 'algorithm'
}

function rank(selected, candidates) {
  const seen = new Set()
  return candidates.filter(candidate => {
    const key = context.recIdentity(candidate)
    if (key === context.recIdentity(selected) || seen.has(key)) return false
    seen.add(key)
    return true
  }).sort((left, right) => context.recommendationScore(selected, right) - context.recommendationScore(selected, left)).slice(0, 6)
}

module.exports = { query, rank, score: context.recommendationScore, reasons: context.recommendationReasons }
