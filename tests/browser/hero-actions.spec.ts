import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { routeFixtureImages } from "./image-fixture";
test.beforeEach(async ({ page, request }) => routeFixtureImages(page, request));

test("hero links expose distinct destinations and preserve browser navigation", async ({
  page,
}) => {
  await page.goto("/");
  const actions = page.locator(".hero-actions");
  const primary = actions.getByRole("link", {
    name: "View projects",
    exact: true,
  });
  const secondary = actions.getByRole("link", {
    name: "Get in touch",
    exact: true,
  });
  await expect(primary).toHaveAttribute("href", "/work");
  await expect(secondary).toHaveAttribute("href", "/contact");
  await primary.click();
  await expect(page).toHaveURL(/\/work$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await secondary.click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.goBack();
  await expect(primary).toBeVisible();
  await primary.focus();
  await page.keyboard.press("Tab");
  await expect(secondary).toBeFocused();
  expect(
    await secondary.evaluate((link) => getComputedStyle(link).outlineStyle),
  ).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/contact$/);
});

test("home and shared components remain navigable without decorative diagonal arrows", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator(
      "main svg.lucide-arrow-up-right,main svg.lucide-arrow-down-right",
    ),
  ).toHaveCount(0);
  const service = page.locator(".service-summary a").first();
  await expect(service).toHaveAttribute("href", /\/services#service-/);
  await service.click();
  await expect(page).toHaveURL(/\/services#service-/);
  await page.goto("/work");
  await expect(
    page.locator(".project-card svg,.contact-invitation svg"),
  ).toHaveCount(0);
  await page
    .locator(".project-card")
    .first()
    .getByRole("link", { name: "Explore project", exact: true })
    .click();
  await expect(page.locator(".project-pagination a").first()).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Open image 1: Synthetic test screenshot 1",
    }),
  ).toBeVisible();
});

test("hero actions align and long custom labels remain readable across viewport sizes", async ({
  page,
}) => {
  await mkdir(".impeccable/review/actions", { recursive: true });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const links = page.locator(".hero-actions a");
    const primary = await links.nth(0).boundingBox();
    const secondary = await links.nth(1).boundingBox();
    expect(primary).not.toBeNull();
    expect(secondary).not.toBeNull();
    if (primary && secondary) {
      expect(primary.height).toBeGreaterThanOrEqual(48);
      expect(secondary.height).toBeCloseTo(primary.height, 0);
      expect(secondary.y).toBeCloseTo(primary.y, 0);
    }
    await links.nth(1).focus();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `.impeccable/review/actions/hero-${width}.png`,
      fullPage: width <= 1024,
      animations: "disabled",
    });
    // Layout-only synthetic labels; integration tests cover actual customized CMS data.
    await links.nth(0).evaluate((link) => {
      link.textContent = "Explore my selected software development projects";
    });
    await links.nth(1).evaluate((link) => {
      link.textContent = "Get in touch about a development opportunity";
    });
    const fits = await page.locator(".hero-frame").evaluate((frame) => {
      const bounds = frame.getBoundingClientRect();
      const actions = [
        ...frame.querySelectorAll<HTMLElement>(".hero-actions a"),
      ];
      return actions.every((link) => {
        const rect = link.getBoundingClientRect();
        return (
          rect.height >= 48 &&
          rect.right <= bounds.right + 1 &&
          rect.bottom <= bounds.bottom + 1 &&
          link.scrollWidth <= link.clientWidth + 1 &&
          link.scrollHeight <= link.clientHeight + 1
        );
      });
    });
    expect(fits, `Long labels at ${width}px`).toBe(true);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `.impeccable/review/actions/hero-long-${width}.png`,
      fullPage: width <= 1024,
      animations: "disabled",
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
