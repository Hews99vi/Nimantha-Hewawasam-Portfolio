import { test, expect } from "@playwright/test";
import { routeFixtureImages } from "./image-fixture";
test.beforeEach(async ({ page, request }) => routeFixtureImages(page, request));

test("published feedback remains ordered and manually browsable", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#testimonials");
  const count = await section.locator("figure").count();
  expect(count).toBeGreaterThan(1);
  await expect(section).not.toContainText("Unpublished fixture");
  await expect(section.getByText(`Review 1 of ${count}`, { exact: true })).toBeVisible();
  await expect(section.getByRole("button", { name: "Previous review" })).toBeDisabled();
  await section.getByRole("button", { name: "Next review" }).click();
  await expect(section.getByText(`Review 2 of ${count}`, { exact: true })).toBeVisible();
  await expect(section.getByRole("button", { name: "Next review" })).toBeFocused();
  await section.locator("figure").last().focus();
  await expect(section.getByText(`Review ${count} of ${count}`, { exact: true })).toBeVisible();
  await expect(section.getByRole("button", { name: "Next review" })).toBeDisabled();
  await section.getByRole("button", { name: "Previous review" }).click();
  await expect(section.getByText(`Review ${count - 1} of ${count}`, { exact: true })).toBeVisible();
});

test("long feedback reflows and native keyboard scrolling reaches every review", async ({ page }) => {
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const cards = page.locator("#testimonials figure");
    await cards.first().locator("figcaption strong").evaluate((name) => {
      name.textContent = "A very long customer name that must wrap without clipping";
    });
    await cards.first().locator("blockquote p").evaluate((quote) => {
      quote.textContent = "Long synthetic feedback for checking readable spacing. ".repeat(12);
    });
    for (const card of await cards.all()) {
      await card.focus();
      await expect(card).toBeFocused();
      expect(await card.evaluate(el => el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1)).toBe(true);
    }
    await expect(page.locator(".feedback-controls")).toContainText(`Review ${await cards.count()} of ${await cards.count()}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});
