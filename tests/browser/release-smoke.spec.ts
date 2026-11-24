import { test, expect } from "@playwright/test";
test("standalone release serves protected headers, published content and working assets", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const path of ["/", "/work", "/about", "/services", "/blog", "/contact"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response?.headers()["x-frame-options"]).toBe("DENY");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  const response = await page.goto("/admin");
  const csp = response?.headers()["content-security-policy"] ?? "";
  expect(csp).toContain("'nonce-");
  expect(csp.split(";").find(rule => rule.trim().startsWith("script-src "))).not.toContain("'unsafe-inline'");
  expect(csp).toContain("frame-ancestors 'none'");
  const nonces = await page.locator("script[nonce]").evaluateAll(nodes => nodes.map(node => (node as HTMLScriptElement).nonce));
  expect(nonces.length).toBeGreaterThan(0);
  await expect(page.getByRole("button", { name: "Sign In" })).toBeEnabled();
  expect(await page.locator("h1").evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeLessThanOrEqual(30);
  expect((await request.get("/api/admin/bootstrap")).status()).toBe(401);
  const health = await request.get("/api/health");
  expect(health.status()).toBe(200);
  expect((await health.json()).revision).toBe("a".repeat(40));
  expect(health.headers()["cache-control"]).toContain("no-store");
  expect(await (await request.get("/sitemap.xml")).text()).toContain("http://127.0.0.1:3100/blog");
  await page.screenshot({ path: ".impeccable/review/admin-release-1440.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.screenshot({ path: ".impeccable/review/admin-release-390.png", fullPage: true });
  expect(errors).toEqual([]);
});
