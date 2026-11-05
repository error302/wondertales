import { expect, test, type Page } from '@playwright/test';

/** Tab until the named button has focus, then activate it from the keyboard. */
async function tabToButton(page: Page, name: string) {
  for (let i = 0; i < 20; i += 1) {
    const focused = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active) {
        return '';
      }
      return active.getAttribute('aria-label') ?? active.textContent?.trim() ?? '';
    });
    if (focused === name) {
      return;
    }
    await page.keyboard.press('Tab');
  }
  throw new Error(`Could not tab to "${name}"`);
}

test('keyboard: play s1-s2 and answer without a mouse', async ({ page }) => {
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      failures.push(`console.error: ${message.text()}`);
    }
  });

  await page.goto('/adventure', { waitUntil: 'networkidle' });
  for (let i = 0; i < 3; i += 1) {
    await tabToButton(page, 'Next');
    await page.keyboard.press('Enter');
  }
  await tabToButton(page, 'Enter the Reservoir');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Reservoir' })).toBeVisible();

  for (let i = 0; i < 2; i += 1) {
    await tabToButton(page, 'Next');
    await page.keyboard.press('Enter');
  }
  await tabToButton(page, 'Look at the tanks');
  await page.keyboard.press('Enter');
  await tabToButton(page, 'Choose The middle tank');
  await page.keyboard.press('Space');
  await expect(page.getByRole('heading', { name: 'The channel fills!' })).toBeVisible();
  await page.screenshot({ path: '.screenshots/e2e-keyboard-feedback.png' });

  expect(failures).toEqual([]);
});

test('read-aloud: listen and stop controls work without errors', async ({ page }) => {
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      failures.push(`console.error: ${message.text()}`);
    }
  });

  await page.goto('/adventure', { waitUntil: 'networkidle' });
  const listen = page.getByRole('button', { name: 'Listen to this line' });
  if (await listen.isVisible()) {
    await listen.click();
    await page.getByRole('button', { name: 'Stop read-aloud' }).click();
  }

  expect(failures).toEqual([]);
});
