import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:5173', serviceWorkers: 'block', headless: true },
  webServer: { command: process.env.READER_TEST_SERVER === 'preview' ? 'npm run preview -- --port 5173 --strictPort' : 'npm run dev -- --port 5173 --strictPort', url: 'http://127.0.0.1:5173/demo', reuseExistingServer: !process.env.CI, timeout: 120_000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
})
