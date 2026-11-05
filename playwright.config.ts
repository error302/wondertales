import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:3100',
  },
  webServer: {
    command: 'npm run dev -- --port=3100',
    port: 3100,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
