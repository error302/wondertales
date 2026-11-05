import { expect, test } from '@playwright/test';

async function finishDialogue(
  page: import('@playwright/test').Page,
  doneLabel: string,
  nextClicks: number,
) {
  for (let i = 0; i < nextClicks; i += 1) {
    await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await page.getByRole('button', { name: doneLabel }).click();
}

test('full adventure: s1-s6 with remediation, celebration, and zero page errors', async ({
  page,
}) => {
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      failures.push(`console.error: ${message.text()}`);
    }
  });

  await page.goto('/adventure', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'Garden Awakens' })).toBeVisible();
  await finishDialogue(page, 'Enter the Reservoir', 3);

  await expect(page.getByRole('heading', { name: 'Reservoir' })).toBeVisible();
  await finishDialogue(page, 'Look at the tanks', 2);
  await page.getByRole('button', { name: 'Choose The middle tank' }).click();
  await expect(page.getByRole('heading', { name: 'The channel fills!' })).toBeVisible();
  await page.screenshot({ path: '.screenshots/e2e-feedback-correct.png' });
  await page.getByRole('button', { name: 'Follow the channel' }).click();

  await expect(page.getByRole('heading', { name: 'Two Small Buckets' })).toBeVisible();
  await finishDialogue(page, 'Try the valve', 2);
  await page.getByRole('button', { name: 'Choose No — two quarters make one quarter' }).click();
  await expect(page.getByRole('heading', { name: 'The channel sputters...' })).toBeVisible();
  await page.getByRole('button', { name: 'See what happened' }).click();

  await expect(page.getByRole('heading', { name: 'The Overflow' })).toBeVisible();
  await finishDialogue(page, 'Try the valve again', 2);

  await expect(page.getByRole('heading', { name: 'Two Small Buckets' })).toBeVisible();
  await finishDialogue(page, 'Try the valve', 2);
  await page.getByRole('button', { name: 'Choose Yes — two quarters make one half' }).click();
  await expect(page.getByRole('heading', { name: 'The valve swings open!' })).toBeVisible();
  await page.getByRole('button', { name: 'Open the garden gates' }).click();

  await expect(page.getByRole('heading', { name: 'The Garden Wakes' })).toBeVisible();
  await finishDialogue(page, 'Share the water', 2);
  await page.getByRole('button', { name: 'Choose The low pipe' }).click();
  await expect(page.getByRole('heading', { name: 'Sunflowers watered!' })).toBeVisible();
  await page.screenshot({ path: '.screenshots/e2e-s5-pipe.png' });
  await page.getByRole('button', { name: 'Water the berry bushes' }).click();
  await page.getByRole('button', { name: 'Choose The middle jug' }).click();
  await expect(page.getByRole('heading', { name: 'The garden blooms!' })).toBeVisible();
  await page.getByRole('button', { name: 'Celebrate' }).click();

  await expect(page.getByRole('heading', { name: 'Celebration' })).toBeVisible();
  await finishDialogue(page, 'Celebrate', 2);

  await expect(
    page.getByRole('heading', { name: 'The Clockwork Garden blooms!' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What you learned' })).toBeVisible();
  await expect(page.getByText('Finding one-half')).toBeVisible();
  await expect(page.getByText('Two quarters make one half', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Play again' })).toBeVisible();
  await page.screenshot({ path: '.screenshots/e2e-celebration.png' });

  expect(failures).toEqual([]);
});

test('progress resumes on this device after a reload', async ({ page }) => {
  await page.goto('/adventure', { waitUntil: 'networkidle' });
  await finishDialogue(page, 'Enter the Reservoir', 3);
  await finishDialogue(page, 'Look at the tanks', 2);
  await page.getByRole('button', { name: 'Choose The middle tank' }).click();
  await page.getByRole('button', { name: 'Follow the channel' }).click();
  await expect(page.getByRole('heading', { name: 'Two Small Buckets' })).toBeVisible();

  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'Two Small Buckets' })).toBeVisible();
  await expect(page.getByText('✓ Channel filled')).toBeVisible();
});
