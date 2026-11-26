const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core')

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8000'
const output = process.env.TEST_ARTIFACTS || '/private/tmp/codexray-verification'
const mainReference = require('./main_recommendation_reference.cjs')
const identity = item => JSON.stringify([item.entity || '', item.path || '', item.lines || ''])

function expectedScore(selected, candidate) {
  return mainReference.score(selected, candidate)
}

async function run() {
  fs.mkdirSync(output, { recursive: true })
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ body: '', contentType: 'text/css' }))
    await page.goto(`${base}/#search`)
    await page.locator('#mres .module-select').first().waitFor()
    await page.locator('#mq').fill('random forest')
    const modules = page.waitForResponse(response => new URL(response.url()).pathname === '/api/modules/search')
    await page.locator('#mgo').click()
    assert.equal((await modules).status(), 200)
    const search = page.waitForResponse(response => new URL(response.url()).pathname === '/api/search')
    await page.locator('#mres .module-select').first().click()
    const searchData = await (await search).json()
    await page.locator('.bubble').first().waitFor()
    const results = [...searchData.results, ...(searchData.free_functions || [])]
    assert.equal(await page.locator('.bubble').count(), results.length)
    const maximum = Math.max(0.0001, ...results.map(item => item.fused || 0))
    const sizes = await page.locator('.bubble').evaluateAll(elements => elements.map(element => parseFloat(element.style.width)))
    assert.deepEqual(sizes, results.map(item => Math.round(62 + 74 * Math.max(0, Math.min(1, (item.fused || 0) / maximum)))))
    await page.locator('#bubble-field').scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    const first = page.locator('.bubble').first()
    const state = () => first.evaluate(element => {
      const matrix = new DOMMatrix(getComputedStyle(element).transform)
      return { x: matrix.m41, y: matrix.m42, scale: matrix.m11 }
    })
    const before = await state()
    await page.waitForTimeout(250)
    assert.notDeepEqual(await state(), before)
    await first.hover({ force: true })
    await page.waitForTimeout(700)
    const paused = await state()
    await page.waitForTimeout(250)
    const after = await state()
    assert.equal(paused.x, after.x)
    assert.equal(paused.y, after.y)
    assert.ok(Math.abs(after.scale - 1.1) < 0.005)
    await page.screenshot({ path: path.join(output, '01-bubbles.png') })
    await first.click()
    assert.equal(await page.evaluate(() => document.activeElement.id), 'algorithm-result-0')
    assert.ok(await page.locator('#algorithm-result-0').evaluate(element => element.classList.contains('active')))

    const details = page.waitForResponse(response => new URL(response.url()).pathname === '/api/learn/algorithm')
    await page.locator('.learn-open').first().click()
    const selected = (await (await details).json()).algorithm
    await page.getByRole('heading', { name: selected.entity, exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: /^Go to / }).count(), 8)
    const recommendationResponse = page.waitForResponse(response => new URL(response.url()).pathname === '/api/search')
    await page.getByRole('button', { name: 'Go to Recommend', exact: true }).click()
    const response = await recommendationResponse
    assert.equal(response.status(), 200)
    const request = response.request().postDataJSON()
    assert.deepEqual(request, { query: mainReference.query(selected), top_k: 10, module: '', family: '', task: '' })
    const candidates = (await response.json()).results
    const unique = new Map()
    for (const candidate of candidates) {
      if (identity(candidate) !== identity(selected) && !unique.has(identity(candidate))) unique.set(identity(candidate), candidate)
    }
    const expected = [...unique.values()].sort((left, right) => expectedScore(selected, right) - expectedScore(selected, left)).slice(0, 6)
    const cards = page.locator('.learn-glass article')
    await page.waitForFunction(count => document.querySelectorAll('.learn-glass article').length === count, expected.length)
    assert.deepEqual(await cards.locator('h4').allTextContents(), expected.map(item => item.entity))
    for (let index = 0; index < expected.length; index++) {
      assert.match(await cards.nth(index).innerText(), /Why recommended:/)
      for (const reason of mainReference.reasons(selected, expected[index])) assert.ok((await cards.nth(index).innerText()).includes(reason))
      const text = await cards.nth(index).innerText()
      const shownScore = Number(text.match(/Ranking score: (-?[\d.]+)/)?.[1])
      assert.ok(Math.abs(shownScore - expectedScore(selected, expected[index])) <= 0.00051, JSON.stringify({ text, expected: expectedScore(selected, expected[index]), candidate: expected[index].entity }))
    }
    await page.locator('.learn-glass').scrollIntoViewIfNeeded()
    await page.screenshot({ path: path.join(output, '02-recommend.png'), fullPage: true })

    await page.getByRole('button', { name: 'Go to Self-check', exact: true }).click()
    assert.ok(selected.quiz.length > 0)
    const questions = page.locator('.learn-glass details')
    await page.waitForFunction(count => document.querySelectorAll('.learn-glass details').length === count, selected.quiz.length)
    for (let index = 0; index < selected.quiz.length; index++) {
      const text = await questions.nth(index).textContent()
      assert.ok(text.includes(selected.quiz[index].question))
      assert.ok(text.includes(selected.quiz[index].answer))
      assert.ok(text.includes(selected.quiz[index].evidence))
    }
    await questions.first().locator('summary').click()
    await page.locator('.learn-glass').scrollIntoViewIfNeeded()
    await page.screenshot({ path: path.join(output, '03-quiz.png'), fullPage: true })
    if (expected.length) {
      await page.getByRole('button', { name: 'Go to Recommend', exact: true }).click()
      await page.getByRole('button', { name: `Study ${expected[0].entity}`, exact: true }).click()
      await page.getByRole('heading', { name: expected[0].entity, exact: true }).waitFor()
      await page.getByRole('heading', { name: 'Mathematical context', exact: true }).waitFor()
      assert.equal(await page.getByRole('button', { name: 'Go to Math Card', exact: true }).getAttribute('aria-pressed'), 'true')
      const selectedAfter = JSON.parse(await page.evaluate(() => localStorage.getItem('codexray:selectedAlgorithm')))
      assert.equal(selectedAfter.entity, expected[0].entity)
      assert.equal(selectedAfter.path, expected[0].path)
      await page.screenshot({ path: path.join(output, '04-recommend-navigation.png'), fullPage: true })
    }
    assert.deepEqual(errors, [])
    const report = { selected: selected.entity, bubbles: sizes, recommendationRequest: request, recommendations: expected.map(item => ({ entity: item.entity, score: expectedScore(selected, item) })), quizCount: selected.quiz.length, quizKinds: [...new Set(selected.quiz.map(item => item.kind))], screenshots: output, mockedApi: false }
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2))
    console.log(JSON.stringify(report, null, 2))
    console.log('PASS: live backend bubble interactions, exact recommendation query/ranking/top-six/reasons, and source-backed quiz rendering. No API mocks.')
  } finally {
    await browser.close()
  }
}

run().catch(error => { console.error(error); process.exitCode = 1 })
