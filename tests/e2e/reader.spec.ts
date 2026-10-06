import { expect, test } from '@playwright/test'

test('demo reader supports discovery, preview, save, and the reading queue', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => { if (/raw\.githubusercontent\.com|\/api\//.test(request.url())) requests.push(request.url()) })
  await page.goto('/demo')
  await expect(page.getByRole('heading', { name: 'Top stories' })).toBeVisible()
  await expect(page.getByText('Demo. Fictional stories and browser-local saved reading.')).toBeVisible()

  await page.getByRole('button', { name: 'A community garden makes room for a new season', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('A community garden makes room for a new season')
  await page.getByRole('dialog').getByRole('button', { name: 'Save story' }).click()
  await page.getByRole('button', { name: 'Close' }).click()

  await page.getByRole('button', { name: 'Saved reading' }).click()
  await expect(page.getByRole('heading', { name: 'Saved reading' })).toBeVisible()
  await expect(page.getByText('A community garden makes room for a new season')).toBeVisible()
  await page.getByRole('button', { name: 'Mark read', exact: true }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Mark unread', exact: true })).toBeVisible()
  await page.getByLabel('Search saved stories').fill('[')
  await expect(page.getByRole('heading', { name: 'No matching saved stories' })).toBeVisible()
  await page.getByRole('button', { name: 'Clear queue filters' }).click()
  await expect(page.getByText('A community garden makes room for a new season')).toBeVisible()
  expect(requests).toEqual([])
})

test('invalid import is visible and leaves the saved queue intact', async ({ page }) => {
  await page.goto('/demo?view=saved')
  await page.getByRole('button', { name: 'Manage queue' }).click()
  await page.getByLabel('Reading queue export').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{"version":1,"articles":[{"read":false}]}') })
  await expect(page.getByRole('status')).toContainText('Choose a valid News Reader export.')
})

test('demo filters are keyboard reachable on a narrow viewport', async ({ page }) => {
  await page.goto('/demo')
  await page.getByRole('button', { name: 'Filters' }).focus()
  await expect(page.getByRole('button', { name: 'Filters' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toContainText('Reader filters')
  await expect(page.getByLabel('Search stories')).toBeVisible()
})
