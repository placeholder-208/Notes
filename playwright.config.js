import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  use: { channel: process.env.PLAYWRIGHT_CHANNEL, baseURL: 'http://127.0.0.1:4173/Notes/', trace: 'retain-on-failure' },
  webServer: {
    command: 'python3 scripts/serve_site.py',
    url: 'http://127.0.0.1:4173/Notes/',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
