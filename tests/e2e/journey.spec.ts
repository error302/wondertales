import { expect, test } from '@playwright/test';

test('journey: worlds to companions to adventure with guide, dashboard, and guide hints', async ({
  page,
}) => {
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      failures.push(`console.error: ${message.text()}`);
    }
  });

  await page.goto('/worlds', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'The Clockwork Kingdom' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The Enchanted Forest' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The Ocean of Discovery' })).toBeVisible();
  await page.getByRole('link', { name: 'Enter The Clockwork Kingdom' }).click();

  await expect(page.getByRole('heading', { name: 'Who travels with you?' })).toBeVisible();
  await page.getByRole('button', { name: 'Choose Nia as your guide' }).click();
  await expect(page.getByText('Begin with Nia')).toBeVisible();
  await page.getByRole('link', { name: 'Begin the adventure' }).click();

  await expect(page.getByRole('heading', { name: 'Garden Awakens' })).toBeVisible();
  await expect(page.getByText('Guide: Nia')).toBeVisible();

  await page.goto('/grown-ups', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'Learning dashboard' })).toBeVisible();
  await page.getByPlaceholder('e.g. Amara').fill('Amara');
  await page.getByText('Ages 9-12').click();
  await page.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.getByText('Saved on this device.')).toBeVisible();
  await expect(page.getByText('0 of 4 puzzles solved')).toBeVisible();
  await page.getByRole('switch').click();
  await expect(page.getByRole('switch', { name: 'Preview on' })).toBeVisible();

  await page.goto('/adventure', { waitUntil: 'networkidle' });
  for (let i = 0; i < 3; i += 1) {
    await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Enter the Reservoir' }).click();
  for (let i = 0; i < 2; i += 1) {
    await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Look at the tanks' }).click();
  await page.getByRole('button', { name: 'Choose The low tank' }).click();
  await page.getByRole('button', { name: 'Ask WonderGuide' }).click();
  const guide = page.getByRole('region', { name: 'WonderGuide preview' });
  await expect(guide.getByText('Good first try')).toBeVisible();

  expect(failures).toEqual([]);
});

test('wonderguide api: valid codes get a demo hint, bad input is rejected', async ({
  request,
}) => {
  const good = await request.post('/api/wonderguide', {
    data: { conceptId: 'half', misconceptionId: 'quarter_is_half', attemptCount: 1 },
  });
  expect(good.ok()).toBe(true);
  const body = (await good.json()) as { explanation: string; source: string };
  expect(body.source).toBe('mock-guide');
  expect(body.explanation.length).toBeGreaterThan(20);

  const bad = await request.post('/api/wonderguide', {
    data: { conceptId: 'nope', misconceptionId: null, attemptCount: 1 },
  });
  expect(bad.status()).toBe(400);
});
