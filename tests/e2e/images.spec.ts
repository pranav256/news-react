import { expect, test } from '@playwright/test';

test('lead photos keep their frame while loading and preserve the full image', async ({ page }, testInfo) => {
  let releaseImage!: () => void;
  const pendingImage = new Promise<void>((resolve) => { releaseImage = resolve; });
  await page.route('**/demo/garden.jpg', async (route) => {
    await pendingImage;
    await route.continue();
  });
  await page.goto('/demo', { waitUntil: 'domcontentloaded' });
  const frame = page.locator('.story-featured .story-image-link');
  try {
    await expect(frame).toHaveAttribute('data-image-state', 'loading');
    await page.evaluate(() => document.fonts.ready);
    const before = await frame.boundingBox();
    expect(before).not.toBeNull();
    expect(before!.width / before!.height).toBeCloseTo(1.6, 1);
    releaseImage();
    await expect(frame).toHaveAttribute('data-image-state', 'loaded');
    const after = await frame.boundingBox();
    expect(after!.width).toBeCloseTo(before!.width, 0);
    expect(after!.height).toBeCloseTo(before!.height, 0);
    await expect(frame.locator('img')).toHaveCSS('object-fit', 'contain');
    await expect(frame.locator('.story-image-loading')).toHaveCount(0);
    await page.screenshot({ path: testInfo.outputPath('loaded-image.png'), fullPage: true });
  } finally {
    releaseImage();
  }
});

test('failed images become text-only stories and recover when the feed supplies a new image', async ({ page, baseURL }, testInfo) => {
  let leadImage = `${baseURL}/unavailable-photo.jpg`;
  const hiddenRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('unused-brief-photo')) hiddenRequests.push(request.url());
  });
  await page.route('**/unavailable-photo.jpg', (route) => route.fulfill({ status: 404, body: '' }));
  await page.route('https://raw.githubusercontent.com/pranav256/news-api/main/**', (route) => route.fulfill({
    json: {
      fetched_at: '2026-11-07T06:00:00Z',
      providers: ['test'],
      articles: [
        ['Lead report about community gardens', leadImage],
        ['Local sports clubs begin a new season', `${baseURL}/unused-brief-photo-1.jpg`],
        ['Library plans a weekend book exchange', `${baseURL}/unused-brief-photo-2.jpg`],
        ['Neighborhood volunteers reopen a walking route', `${baseURL}/unavailable-photo.jpg`],
      ].map(([title, urlToImage], index) => ({
        title, urlToImage, description: 'Reporting from the local community.',
        url: `https://example.com/report-${index}`, source: { name: 'Community News' },
        publishedAt: `2026-11-07T0${6 - index}:00:00Z`,
      })),
    },
  }));
  await page.goto('/');
  const lead = page.locator('.story-featured');
  await expect(lead).toHaveClass(/story-no-image/);
  await expect(lead.locator('.story-image-link')).toHaveCount(0);
  const latest = page.locator('.story-grid .story').first();
  await latest.scrollIntoViewIfNeeded();
  await expect(latest).toHaveClass(/story-no-image/);
  await expect(latest.locator('.story-image-link')).toHaveCount(0);
  await expect(page.locator('.story-compact img')).toHaveCount(0);
  expect(hiddenRequests).toEqual([]);
  await expect(lead.getByRole('link', { name: 'Lead report about community gardens' })).toHaveAttribute('href', 'https://example.com/report-0');
  await page.screenshot({ path: testInfo.outputPath('failed-images.png'), fullPage: true });

  leadImage = `${baseURL}/demo/garden.jpg`;
  await page.getByRole('button', { name: 'Refresh edition', exact: true }).click();
  await expect(lead.locator('.story-image-link')).toHaveAttribute('data-image-state', 'loaded');
  await expect(lead).not.toHaveClass(/story-no-image/);
  await expect(lead.locator('img')).toHaveAttribute('src', leadImage);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
