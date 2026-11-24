import { test, expect } from "@playwright/test";

test("Home service links change diagrams through keyboard focus and preserve navigation", async ({ page }) => {
  await page.goto("/");
  const links = page.locator(".home-service-links a");
  expect(await links.count()).toBeGreaterThan(1);
  await links.nth(1).focus();
  await expect(links.nth(1)).toHaveAttribute("data-selected", "true");
  const title = await links.nth(1).locator("h3").innerText();
  await expect(page.locator(".home-service-preview figcaption strong")).toHaveText(title);
  await expect(links.nth(1)).toBeFocused();
  const destination = await links.nth(1).getAttribute("href");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(destination!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"));
  await expect(page.locator("details[open] summary h2")).toHaveText(title);
  await page.goBack();
  await expect(page.locator(".home-services-explorer")).toBeVisible();
});

test("Home excerpts link to complete project descriptions", async ({ page }) => {
  await page.goto("/");
  const card = page.locator(".project-compact").first();
  const teaser = await card.locator(".project-caption > div > p").last().innerText();
  expect(teaser.length).toBeLessThanOrEqual(221);
  await card.getByRole("link", { name: "Explore project" }).click();
  await expect(page).toHaveURL(/\/work\/.+/);
  await expect(page.locator("main")).toContainText(teaser.replace(/…$/, ""));
});

test("reduced motion keeps service graphics static and feedback scrolling immediate", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".home-service-links a").nth(1).focus();
  const traces = page.locator(".home-service-preview .diagram-trace");
  await expect.poll(() => traces.evaluateAll(nodes => nodes.length > 0 && nodes.every(node => getComputedStyle(node).animationName === "none"))).toBe(true);
  const next = page.getByRole("button", { name: "Next review" });
  if (await next.count()) {
    await next.click();
    await expect(page.locator(".feedback-controls")).toContainText("Review 2 of");
  }
});

test("Home remains browsable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".home-service-links a").first()).toBeVisible();
  const cards = page.locator(".feedback-rail figure");
  if (await cards.count()) {
    await cards.last().focus();
    await expect(cards.last()).toBeFocused();
    await expect(page.locator(".feedback-controls")).toBeHidden();
    await expect(page.locator(".feedback-scroll-hint")).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await context.close();
});
