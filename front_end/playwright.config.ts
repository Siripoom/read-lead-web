import { defineConfig, devices } from "@playwright/test";

const port = process.env.PORT ?? "3000";
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]],

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium-guest",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
      testIgnore: /.*\.(user|creator|admin)\.spec\.ts/,
    },
    {
      name: "chromium-user",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
      testMatch: /.*\.user\.spec\.ts/,
    },
    {
      name: "chromium-creator",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/creator.json",
      },
      dependencies: ["setup"],
      testMatch: /.*\.creator\.spec\.ts/,
    },
    {
      name: "chromium-admin",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/admin.json",
      },
      dependencies: ["setup"],
      testMatch: /.*\.admin\.spec\.ts/,
    },
  ],

  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
