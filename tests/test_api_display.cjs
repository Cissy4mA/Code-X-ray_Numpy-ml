const assert = require('node:assert/strict')
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core')

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8000'

async function run() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  })
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
    await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }))
    const page = await context.newPage()
    page.setDefaultTimeout(20000)
    const pageErrors = []
    page.on('pageerror', error => pageErrors.push(error.message))
    await page.goto(`${base}/#search`)
    await page.locator('#mres .module-select').first().waitFor()
    const query = async () => {
      await page.locator('#mq').fill('random forest')
      await page.locator('#mgo').click()
    }
    const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/modules/search'))
    await query()
    const data = await (await responsePromise).json()
    const reason = data.results[0].reason
    assert.ok(reason)
    await page.locator('.module-reason').first().waitFor()
    assert.equal(await page.locator('.module-reason').first().innerText(), `Why this module: ${reason}`)

    await page.route('**/api/modules/search', route => route.fulfill({ status: 503, json: {
      detail: '查询模型与索引模型不一致。请运行 scripts/reembed_all.py <img src=x onerror=alert(1)>',
    } }))
    await query()
    await page.locator('#mres [role="alert"]').waitFor()
    assert.match(await page.locator('#mres').innerText(), /检索配置异常.*reembed_all\.py/)
    assert.equal(await page.locator('#mres .retry-search').count(), 0)
    assert.equal(await page.locator('#mres img').count(), 0)

    await page.unroute('**/api/modules/search')
    await page.route('**/api/modules/search', route => route.abort('failed'))
    await query()
    await page.locator('#mres [role="alert"]').filter({ hasText: '网络连接失败，请检查网络或确认服务已启动后重试。' }).waitFor()
    assert.equal(await page.locator('#mres .retry-search').count(), 1)

    await page.unroute('**/api/modules/search')
    await page.route('**/api/modules/search', route => route.fulfill({ status: 400, json: { detail: 'Query is invalid' } }))
    await query()
    await page.getByText(/请求未能完成.*Query is invalid/).waitFor()
    assert.equal(await page.locator('#mres .retry-search').count(), 0)

    await page.unroute('**/api/modules/search')
    await page.route('**/api/modules/search', route => route.fulfill({ json: { results: [] } }))
    await query()
    await page.getByText('No modules matched.', { exact: true }).waitFor()
    assert.equal(await page.locator('#mres [role="alert"]').count(), 0)

    await page.unroute('**/api/modules/search')
    await page.route('**/api/modules/search', route => route.fulfill({ status: 503, json: { detail: 'Temporary test failure' } }))
    await query()
    await page.getByText(/服务暂时不可用.*Temporary test failure/).waitFor()
    await page.unroute('**/api/modules/search')
    await page.locator('#mres .retry-search').click()
    await page.locator('#mres .module-select').first().click()
    await page.locator('.learn-open').first().waitFor()

    await page.route('**/api/learn/algorithm?**', async route => {
      const response = await route.fetch()
      const result = await response.json()
      result.algorithm.docstring_math = 'Selected description fixture\nSecond line <script>alert(1)</script>'
      result.algorithm.references = ['Selected reference fixture 1', 'Selected reference fixture 2']
      await route.fulfill({ response, json: result })
    })
    await page.route('**/api/learn/compare?**', async route => {
      const response = await route.fetch()
      const result = await response.json()
      const peers = result.algorithms.filter(item => item.entity !== 'RandomForest')
      peers[0].docstring_math = 'Peer description fixture'
      peers[0].references = ['Peer reference fixture 1', 'Peer reference fixture 2']
      peers[1].docstring_math = ''
      peers[1].references = []
      await route.fulfill({ response, json: result })
    })
    await page.locator('.learn-open').first().click()
    await page.getByRole('heading', { name: 'RandomForest', exact: true }).waitFor()
    await page.getByRole('button', { name: '切换到 算法对比 / Go to Compare', exact: true }).click()
    const mathRow = page.locator('tr').filter({ has: page.getByRole('rowheader', { name: 'Mathematical description · 数学说明', exact: true }) })
    const referenceRow = page.locator('tr').filter({ has: page.getByRole('rowheader', { name: 'References · 参考文献', exact: true }) })
    await mathRow.waitFor()
    assert.equal(await mathRow.locator('td').first().innerText(), 'Selected description fixture\nSecond line <script>alert(1)</script>')
    assert.equal(await mathRow.locator('td').nth(1).innerText(), 'Peer description fixture')
    assert.equal(await referenceRow.locator('td').first().innerText(), 'Selected reference fixture 1\nSelected reference fixture 2')
    assert.equal(await referenceRow.locator('td').nth(1).innerText(), 'Peer reference fixture 1\nPeer reference fixture 2')
    assert.equal(await mathRow.locator('script').count(), 0)
    const select = page.getByLabel('Compare with · 选择同模块算法')
    await select.selectOption({ index: 1 })
    assert.equal(await mathRow.locator('td').nth(1).innerText(), '未收录 / Not indexed')
    assert.equal(await referenceRow.locator('td').nth(1).innerText(), '未收录 / Not indexed')
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    }
    await page.unroute('**/api/learn/compare?**')
    await page.route('**/api/learn/compare?**', route => route.fulfill({ status: 403, json: { detail: 'Comparison access denied' } }))
    await page.getByRole('button', { name: '切换到 学习路径 / Go to Path', exact: true }).click()
    await page.getByRole('button', { name: '切换到 算法对比 / Go to Compare', exact: true }).click()
    await page.locator('.learn-glass [role="alert"]').filter({ hasText: 'Comparison access denied' }).waitFor()
    assert.equal(await page.getByRole('button', { name: 'Retry / 重试', exact: true }).count(), 0)
    await page.unroute('**/api/learn/compare?**')
    await page.route('**/api/learn/compare?**', route => route.fulfill({ status: 503, json: { detail: 'Comparison temporarily unavailable' } }))
    await page.getByRole('button', { name: '切换到 学习路径 / Go to Path', exact: true }).click()
    await page.getByRole('button', { name: '切换到 算法对比 / Go to Compare', exact: true }).click()
    await page.locator('.learn-glass [role="alert"]').filter({ hasText: 'Comparison temporarily unavailable' }).waitFor()
    await page.unroute('**/api/learn/compare?**')
    await page.getByRole('button', { name: 'Retry / 重试', exact: true }).click()
    await mathRow.waitFor()
    assert.deepEqual(pageErrors, [])
    console.log('PASS: live module reason; safe API detail; configuration/network/validation/service error handling; retry recovery; empty results; both comparison fields, multiline content, missing data and responsive layout. Comparison fixtures only affect browser responses, not the database.')
  } finally {
    await browser.close()
  }
}

run().catch(error => { console.error(error); process.exitCode = 1 })
