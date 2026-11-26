const assert = require('node:assert/strict')
const { execFileSync } = require('node:child_process')
const path = require('node:path')
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core')

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173'
const forest = { entity: 'Forest', module: 'trees', path: 'forest.py', task: 'regression', math_methods: ['Variance'], fused: 1.2, semantic: 0.8, code: 'class Forest:\n    def fit(self, X):\n        for tree in self.trees:\n            return tree.fit(X)' }
const tree = { entity: 'Tree', module: 'trees', path: 'tree.py', task: 'regression', math_methods: ['Variance'], fused: 0.6, semantic: 0.6, code: 'class Tree:\n    def predict(self, X):\n        return X @ self.weights' }
const generatedQuizzes = JSON.parse(execFileSync(process.env.PYTHON_PATH || path.join(__dirname, '../.venv/bin/python'), ['-c', 'import json,sys; from backend.quiz import generate_quiz; print(json.dumps([generate_quiz(item) for item in json.load(sys.stdin)]))'], { input: JSON.stringify([forest, tree]), cwd: path.join(__dirname, '..'), encoding: 'utf8' }))
forest.quiz = generatedQuizzes[0]
tree.quiz = generatedQuizzes[1]

async function run() {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    const errors = []
    const requests = []
    let browseCount = 3
    let recommendationFailure = false
    page.on('pageerror', error => errors.push(error.message))
    await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ body: '', contentType: 'text/css' }))
    await page.route('**/api/**', route => {
      const url = new URL(route.request().url())
      let data = {}
      if (url.pathname === '/api/modules') data = { modules: [{ name: 'trees', readme: 'Trees' }] }
      if (url.pathname === '/api/search') {
        const request = route.request().postDataJSON()
        requests.push(request)
        if (!request.module && recommendationFailure) {
          recommendationFailure = false
          return route.fulfill({ status: 503, json: { detail: 'Recommendation retry fixture' } })
        }
        data = { results: request.module && browseCount === 10 ? Array.from({ length: 10 }, (_, index) => ({ ...tree, entity: `Tree${index}`, fused: 1 })) : [forest, tree, tree] }
      }
      if (url.pathname === '/api/learn/algorithm') data = { algorithm: url.searchParams.get('entity') === 'Tree' ? tree : forest }
      if (url.pathname === '/api/learn/card') data = { cards: [] }
      return route.fulfill({ json: data })
    })
    await page.goto(`${base}/#search`)
    await page.locator('.module-select').first().click()
    await page.locator('.bubble').first().waitFor()
    assert.equal(await page.locator('.bubble').count(), 3)
    const widths = await page.locator('.bubble').evaluateAll(elements => elements.map(element => parseFloat(getComputedStyle(element).width)))
    assert.deepEqual(widths, [136, 99, 99])
    await page.waitForTimeout(600)
    const positions = () => page.locator('.bubble').evaluateAll(elements => elements.map(element => {
      const matrix = new DOMMatrix(getComputedStyle(element).transform)
      return { x: matrix.m41, y: matrix.m42, scale: matrix.m11, size: parseFloat(element.style.width) }
    }))
    const beforeMove = await positions()
    await page.waitForTimeout(300)
    const afterMove = await positions()
    assert.ok(afterMove.some((position, index) => position.x !== beforeMove[index].x || position.y !== beforeMove[index].y))
    for (let firstIndex = 0; firstIndex < afterMove.length; firstIndex++) {
      for (let secondIndex = firstIndex + 1; secondIndex < afterMove.length; secondIndex++) {
        const first = afterMove[firstIndex], second = afterMove[secondIndex]
        assert.ok(Math.hypot(first.x + first.size / 2 - second.x - second.size / 2, first.y + first.size / 2 - second.y - second.size / 2) >= (first.size + second.size) / 2 - 1)
      }
    }
    await page.locator('.bubble').first().hover({ force: true })
    await page.waitForTimeout(700)
    const paused = (await positions())[0]
    await page.waitForTimeout(250)
    const stillPaused = (await positions())[0]
    assert.equal(stillPaused.x, paused.x)
    assert.equal(stillPaused.y, paused.y)
    assert.ok(Math.abs(stillPaused.scale - 1.1) < 0.005)
    await page.locator('.bubble').first().click()
    assert.equal(await page.evaluate(() => document.activeElement.id), 'algorithm-result-0')
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.waitForTimeout(150)
      const bounds = await page.locator('#bubble-field').boundingBox()
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width + 1)
      for (const bubble of await positions()) {
        assert.ok(bubble.x >= 0 && bubble.x + bubble.size <= bounds.width + 1)
        assert.ok(bubble.y >= 0 && bubble.y + bubble.size <= bounds.height - 20)
      }
    }
    await page.setViewportSize({ width: 320, height: 900 })
    browseCount = 10
    await page.locator('#algo-search .search-options summary').click()
    await page.locator('#ak').selectOption('10')
    await page.locator('#ago').click()
    await page.locator('.bubble').nth(9).waitFor()
    await page.waitForTimeout(500)
    const crowded = await positions()
    assert.equal(crowded.length, 10)
    assert.ok(crowded.every(bubble => bubble.size === 136))
    for (let firstIndex = 0; firstIndex < crowded.length; firstIndex++) {
      for (let secondIndex = firstIndex + 1; secondIndex < crowded.length; secondIndex++) {
        assert.ok(Math.hypot(crowded[firstIndex].x - crowded[secondIndex].x, crowded[firstIndex].y - crowded[secondIndex].y) >= 135)
      }
    }
    browseCount = 3
    await page.locator('#ago').click()
    await page.locator('.bubble').filter({ hasText: 'Forest' }).waitFor()
    await page.locator('.learn-open').first().click()
    await page.getByRole('heading', { name: 'Forest', exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: /^切换到 / }).count(), 8)
    recommendationFailure = true
    await page.getByRole('button', { name: '切换到 相似推荐 / Go to Recommend', exact: true }).click()
    await page.getByText(/Recommendation retry fixture/).waitFor()
    await page.getByRole('button', { name: 'Retry / 重试', exact: true }).click()
    await page.getByRole('button', { name: '学习 Tree', exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: '学习 Tree', exact: true }).count(), 1)
    assert.equal(requests.at(-1).top_k, 10)
    assert.equal(requests.at(-1).query, 'Forest regression Variance')
    assert.equal(requests.at(-1).module, '')
    await page.getByText(/shared math: variance/).waitFor()
    await page.getByRole('button', { name: '切换到 理解自测 / Go to Self-check', exact: true }).click()
    await page.locator('summary').filter({ hasText: '遍历哪个对象' }).waitFor()
    await page.getByRole('button', { name: '切换到 相似推荐 / Go to Recommend', exact: true }).click()
    await page.getByRole('button', { name: '学习 Tree', exact: true }).click()
    await page.getByRole('heading', { name: 'Tree', exact: true }).waitFor()
    await page.getByRole('heading', { name: 'Mathematical context · 数学背景', exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: '切换到 数学卡片 / Go to Math Card', exact: true }).getAttribute('aria-pressed'), 'true')
    assert.equal(await page.getByRole('button', { name: '切换到 相似推荐 / Go to Recommend', exact: true }).getAttribute('aria-pressed'), 'false')
    assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('codexray:selectedAlgorithm'))).entity, 'Tree')
    await page.getByRole('button', { name: '切换到 理解自测 / Go to Self-check', exact: true }).click()
    await page.locator('summary').filter({ hasText: '返回点输出什么表达式' }).click()
    await page.getByText('X @ self.weights', { exact: true }).waitFor()
    assert.equal(await page.locator('summary').filter({ hasText: '遍历哪个对象' }).count(), 0)
    await page.goto(`${base}/#search`)
    await page.locator('.module-select').first().click()
    await page.locator('.bubble').first().waitFor()
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.locator('#ago').click()
    await page.waitForTimeout(150)
    await page.mouse.move(0, 0)
    const reducedBefore = await positions()
    await page.waitForTimeout(150)
    const reducedAfter = await positions()
    assert.deepEqual(reducedBefore, reducedAfter)
    assert.deepEqual(errors, [])
    console.log('PASS: main-style bubble normalization/free motion/collision separation/hover pause/scale/jump/responsive bounds; recommendation query/dedup/navigation; algorithm-specific source quiz.')
  } finally {
    await browser.close()
  }
}

run().catch(error => { console.error(error); process.exitCode = 1 })
