import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser", testMatch: "release-smoke.spec.ts", timeout: 45000, workers: 1,
  use: { baseURL: "http://127.0.0.1:3100", browserName: "chromium" },
  webServer: { command: "node --experimental-strip-types tests/fixture-server.mjs --production", url: "http://127.0.0.1:3100", reuseExistingServer: false, timeout: 180000 },
});
