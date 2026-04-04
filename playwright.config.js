const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './playwright/tests',
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: {
    timeout: 5_000
  },
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    video: 'on',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ],
  webServer: {
    command: 'cmd /c npm.cmd run dev:e2e',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: false,
    timeout: 120_000
  }
});
