import { expect, test } from '@playwright/test'
import { captureSpacingSnapshot } from '../spacing-capture'

// DOM evidence and screenshots are outputs of this real isolated browser pass.
test('editorial layout, fonts and dialog controls fit the supported viewports', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'This test captures all viewport sizes in one browser context.')
  const states: ReturnType<typeof captureSpacingSnapshot>[] = []
  for (const width of [1440, 1728, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/demo')
    await page.evaluate(() => localStorage.setItem('news-reader:preferences:v1', JSON.stringify({ country: 'in', category: 'general', theme: 'light' })))
    await page.reload()
    await page.getByRole('button', { name: 'A community garden makes room for a new season', exact: true }).waitFor()
    const fonts = await page.evaluate(async () => {
      await document.fonts.load('400 16px Inter')
      await document.fonts.ready
      return { body: getComputedStyle(document.body).fontFamily, heading: getComputedStyle(document.querySelector('h1')!).fontFamily, inter: [...document.fonts].some((font) => font.family === 'Inter' && font.status === 'loaded') }
    })
    expect(fonts.body).toContain('Inter')
    expect(fonts.heading).toContain('serif')
    expect(fonts.inter).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: testInfo.outputPath(`headlines-${width}.png`), fullPage: true })
    states.push(await page.evaluate(captureSpacingSnapshot))
    await page.getByRole('button', { name: 'Filters', exact: true }).click()
    await page.getByLabel('Search stories').focus()
    const open = await page.evaluate(captureSpacingSnapshot); open.name = `filters-focus-${width}`; states.push(open)
    await page.screenshot({ path: testInfo.outputPath(`filters-${width}.png`) })
    await page.getByLabel('Appearance').selectOption('dark')
    await page.getByRole('button', { name: 'Show stories' }).click()
    await page.screenshot({ path: testInfo.outputPath(`headlines-dark-${width}.png`) })
    const dark = await page.evaluate(captureSpacingSnapshot); dark.name = `dark-${width}`; states.push(dark)
  }
  await testInfo.attach('spacing-states', { body: JSON.stringify(states), contentType: 'application/json' })
  // The reporter preserves attachments; attach the exact geometry for the MCP review.
  const { writeFile } = await import('node:fs/promises')
  await writeFile(testInfo.outputPath('spacing-states.json'), JSON.stringify(states, null, 2))
})
