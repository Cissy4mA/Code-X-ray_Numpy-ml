const assert = require('node:assert/strict')
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core')

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8000'

async function run() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  })
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
    await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }))
    const page = await context.newPage()
    page.setDefaultTimeout(15000)
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${base}/#search`)
    await page.locator('#mres .module-select').first().waitFor()
    assert.equal(await page.locator('#ago').isDisabled(), true)
    await page.locator('#mq').fill('random forest')
    await page.locator('#mgo').click()
    await page.locator('#mres .module-select').click()
    await page.locator('.acard').first().waitFor()
    assert.equal(await page.locator('.acard .cname').first().innerText(), 'RandomForest')
    assert.equal(await page.locator('#amod').inputValue(), 'trees')
    assert.equal(await page.locator('#aq').inputValue(), 'random forest')
    assert.equal(await page.locator('.acard').first().locator('.result-score meter').count(), 3)
    assert.match(await page.locator('.result-source').first().innerText(), /class RandomForest/)
    assert.ok(await page.locator('.entity-kind').filter({ hasText: '独立函数' }).count() > 0)
    const browseBackground = await page.locator('.orbit-page').evaluate(element => {
      const style = getComputedStyle(element, '::before')
      return [style.backgroundImage, style.backgroundSize, style.backgroundPosition, style.position]
    })
    const browseGlass = await page.locator('#module-search').evaluate(element => {
      const style = getComputedStyle(element)
      return [style.backgroundColor, style.backdropFilter, style.borderTopColor]
    })
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      for (const selector of ['#module-search', '#algo-search', '.acard', '.result-source pre']) {
        const bounds = await page.locator(selector).first().boundingBox()
        assert.ok(bounds.x >= -1 && bounds.x + bounds.width <= width + 1, `${selector} exceeds ${width}px`)
      }
    }
    await page.setViewportSize({ width: 390, height: 844 })
    const right = await page.locator('.acard .right').first().boundingBox()
    const card = await page.locator('.acard').first().boundingBox()
    assert.ok(right.width > card.width * 0.8)

    let failDetail = true
    await page.route('**/api/learn/algorithm?**', route => {
      if (failDetail) {
        failDetail = false
        return route.fulfill({ status: 503, json: { detail: 'Temporary test failure' } })
      }
      return route.continue()
    })
    await page.locator('.learn-open').first().click()
    await page.getByRole('button', { name: 'Retry / 重试', exact: true }).click()
    await page.getByRole('heading', { name: 'RandomForest', exact: true }).waitFor()
    assert.deepEqual(await page.locator('.learn-page').evaluate(element => {
      const style = getComputedStyle(element, '::before')
      return [style.backgroundImage, style.backgroundSize, style.backgroundPosition, style.position]
    }), browseBackground)
    assert.deepEqual(await page.locator('.learn-glass').evaluate(element => {
      const style = getComputedStyle(element)
      return [style.backgroundColor, style.backdropFilter, style.borderTopColor]
    }), browseGlass)
    assert.equal(await page.evaluate(() => typeof window.__go), 'undefined')
    assert.equal(await page.getByRole('button', { name: 'AUTO', exact: true }).getAttribute('aria-pressed'), 'false')
    await page.getByRole('button', { name: '切换到 学习路径 / Go to Path', exact: true }).click()
    await page.getByRole('checkbox').first().check()
    await page.getByText('已读 1/4 步', { exact: true }).first().waitFor()

    const second = await context.newPage()
    await second.goto(`${base}/#/learn`)
    await second.getByRole('heading', { name: 'RandomForest', exact: true }).waitFor()
    await second.getByRole('button', { name: '切换到 学习路径 / Go to Path', exact: true }).click()
    await second.getByText('已读 1/4 步', { exact: true }).first().waitFor()
    await second.getByRole('checkbox').nth(1).check()
    await page.getByText('已读 2/4 步', { exact: true }).first().waitFor()
    await second.close()

    await page.getByRole('button', { name: /^DecisionTree 已读/ }).click()
    await page.getByRole('heading', { name: 'DecisionTree', exact: true }).waitFor()
    await page.getByText('已读 0/4 步', { exact: true }).first().waitFor()
    for (const mode of ['相关函数 / Go to Related Functions', '调用图 / Go to Call Graph', '算法对比 / Go to Compare', '源码复杂度 / Go to Complexity', '理解自测 / Go to Self-check']) {
      await page.getByRole('button', { name: `切换到 ${mode}`, exact: true }).click()
      await page.getByRole('heading', { name: 'DecisionTree', exact: true }).waitFor()
    }
    await page.locator('summary').filter({ hasText: 'Q1.' }).click()
    await page.getByRole('button', { name: 'Hide all answers · 收起全部答案' }).click()
    assert.equal(await page.locator('details[open]').count(), 0)
    await page.getByRole('region', { name: '学习模式卡盘 / Learning mode card deck' }).focus()
    await page.keyboard.press('ArrowLeft')
    await page.getByText('AST evidence · 静态结构', { exact: true }).waitFor()
    await page.getByRole('link', { name: 'Browse', exact: true }).first().click()
    await page.locator('.learn-open').first().waitFor()
    assert.equal(await page.locator('#mq').inputValue(), 'random forest')
    assert.equal(await page.locator('#amod').inputValue(), 'trees')

    for (let index = 0; index < 3; index++) {
      await page.locator('.learn-open').first().click()
      await page.getByRole('heading', { name: 'RandomForest', exact: true }).waitFor()
      await page.getByRole('link', { name: 'Browse', exact: true }).first().click()
      await page.locator('.learn-open').first().waitFor()
    }
    await page.goBack()
    await page.getByRole('heading', { name: 'RandomForest', exact: true }).waitFor()
    await page.goForward()
    await page.locator('.learn-open').first().waitFor()

    await page.route('**/api/modules', route => route.fulfill({ status: 503, json: { detail: 'Test failure' } }))
    await page.reload()
    await page.locator('#mres .retry-search').waitFor()
    await page.unroute('**/api/modules')
    await page.locator('#ares .retry-search').click()
    await page.locator('#mres .module-select').first().waitFor()
    await page.locator('#mq').fill('svm')
    await page.locator('#mgo').click()
    await page.getByText('Not included in NumPy-ML: Support Vector Machine (SVM). Try another algorithm or topic.', { exact: true }).waitFor()
    assert.equal(await page.locator('#ago').isDisabled(), true)
    await page.getByRole('link', { name: 'Home', exact: true }).first().click()
    await page.locator('#import-input').fill('hmm')
    await page.locator('#import-btn').click()
    await page.locator('#mres .module-select').click()
    await page.locator('.acard .cname').filter({ hasText: /^MultinomialHMM$/ }).waitFor()
    assert.equal(await page.locator('#aq').inputValue(), 'hmm')
    assert.equal(await page.locator('#amod').inputValue(), 'hmm')
    await page.locator('.learn-open').first().click()
    await page.getByRole('heading', { name: 'MultinomialHMM', exact: true }).waitFor()
    await page.getByRole('link', { name: 'Home', exact: true }).first().click()
    await page.locator('#import-input').fill('gmm')
    await page.locator('#import-btn').click()
    await page.locator('#mres .module-select').click()
    await page.locator('.acard .cname').filter({ hasText: /^GMM$/ }).waitFor()
    assert.equal(await page.locator('#aq').inputValue(), 'gmm')
    assert.equal(await page.locator('#amod').inputValue(), 'gmm')
    assert.deepEqual(errors, [])
    console.log('PASS: shared frosted backgrounds and glass panels; live two-stage retrieval; standalone functions; score/source retention; four viewport widths; failure retries; progress persistence/cross-tab sync/isolation; seven modes; keyboard; repeat navigation; history; OOD stop; homepage searches override previous queries; no page errors.')
  } finally {
    await browser.close()
  }
}

run().catch(error => { console.error(error); process.exitCode = 1 })
