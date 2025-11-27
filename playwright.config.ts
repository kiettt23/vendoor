import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E Test Configuration
 *
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Thư mục chứa E2E tests
  testDir: "./tests/e2e",

  // Pattern cho test files
  testMatch: "**/*.spec.ts",

  // Chạy tests song song
  fullyParallel: true,

  // Fail build nếu có test.only trong CI
  forbidOnly: !!process.env.CI,

  // Số lần retry khi fail
  retries: process.env.CI ? 2 : 0,

  // Số workers (song song)
  workers: process.env.CI ? 1 : undefined,

  // Reporter: list cho local, html cho debug
  reporter: [["list"], ["html", { open: "never" }]],

  // Shared settings cho tất cả projects
  use: {
    // Base URL của app (dev server)
    baseURL: "http://localhost:3000",

    // Collect trace khi retry test fail
    trace: "on-first-retry",

    // Screenshot khi fail
    screenshot: "only-on-failure",

    // Video recording
    video: "retain-on-failure",
  },

  // Chỉ test trên Chromium (có thể thêm firefox, webkit sau)
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Uncomment khi cần test cross-browser
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "Mobile Chrome",
    //   use: { ...devices["Pixel 5"] },
    // },
  ],

  // Dev server - tự động start Next.js khi chạy test
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 phút để build
  },

  // Timeout settings
  timeout: 30 * 1000, // 30s per test
  expect: {
    timeout: 5 * 1000, // 5s per assertion
  },

  // Output folder cho artifacts
  outputDir: "tests/e2e/results",
});
