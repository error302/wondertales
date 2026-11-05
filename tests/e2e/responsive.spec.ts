import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/worlds', '/companions', '/adventure', '/grown-ups'] as const;

for (const width of [375, 1280]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ROUTES) {
      await page.goto(route, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth };
      });
      expect(
        overflow.scrollWidth,
        `${route} overflows at ${width}px: ${JSON.stringify(overflow)}`,
      ).toBeLessThanOrEqual(overflow.clientWidth + 1);
      await page.screenshot({
        path: `.screenshots/e2e-${route === '/' ? 'landing' : route.slice(1)}-${width}.png`,
      });
    }
  });
}
