import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'small-mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 320, height: 740 },
      },
    },
  ],
  webServer: {
    command: 'pnpm dev --port 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    env: {
      E2E_FIXTURES: '1',
      DATABASE_URI: 'postgresql://fixture:fixture@127.0.0.1:5439/fixture',
      PAYLOAD_SECRET: 'local-fixture-only-not-production',
    },
  },
});
