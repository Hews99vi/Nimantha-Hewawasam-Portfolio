import { test, expect } from "@playwright/test";

test("journal filters preserve URL state, search and browser Back", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.locator(".journal-feature")).toHaveCount(1);
  const topic = page.getByRole("navigation", { name: "Filter by topic" }).getByRole("link", { name: "UI & UX", exact: true });
  await topic.click();
  await expect(page).toHaveURL(/topic=ui-ux/);
  await expect(topic).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".journal-feature")).toHaveCount(0);
  await page.getByRole("searchbox", { name: "Search articles" }).fill("portfolio");
  await page.getByRole("button", { name: "Search articles" }).click();
  await expect(page).toHaveURL(/q=portfolio/);
  await expect(page.locator(".journal-card")).toHaveCount(1);
  await page.reload();
  await expect(page.getByRole("searchbox")).toHaveValue("portfolio");
  await page.getByRole("searchbox").fill("no-matching-article-xyz");
  await page.getByRole("button", { name: "Search articles" }).click();
  await expect(page.getByRole("heading", { name: "No articles found." })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("searchbox")).toHaveValue("portfolio");
  await page.getByRole("link", { name: "Clear filters", exact: true }).click();
  await expect(page.locator(".journal-feature")).toHaveCount(1);
});

test("article contents, related reading and not-found navigation work", async ({ page }) => {
  await page.goto("/blog");
  await page.getByRole("link", { name: /Read article/ }).first().click();
  const title = await page.getByRole("heading", { level: 1 }).innerText();
  const contents = page.getByRole("navigation", { name: "Article contents" });
  const anchor = contents.getByRole("link").last();
  const href = await anchor.getAttribute("href");
  await anchor.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator(href!)).toBeInViewport();
  await expect(page.getByRole("progressbar", { name: "Article reading progress" })).toHaveAttribute("aria-valuenow", /\d+/);
  await expect(page.locator(".reader-related .journal-card")).toHaveCount(2);
  await page.locator(".reader-related").getByRole("link", { name: /Read article/ }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(title);
  const response = await page.goto("/blog/not-a-published-article");
  expect(response?.status()).toBe(404);
});

test("journal and contents work without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  await page.goto("/blog?q=portfolio");
  await expect(page.locator(".journal-card")).toHaveCount(1);
  await page.getByRole("link", { name: /Read article/ }).click();
  const links = page.getByRole("navigation", { name: "Article contents" }).getByRole("link");
  await expect(links.first()).toBeVisible();
  await links.first().click();
  expect(new URL(page.url()).hash).toMatch(/^#section-/);
  await context.close();
});

test("reduced motion and long titles reflow across the journal", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/blog");
    expect(await page.locator(".journal-feature .journal-art-line").evaluateAll(nodes => nodes.every(node => getComputedStyle(node).animationName === "none"))).toBe(true);
    await page.locator(".journal-feature h2 a").evaluate(el => { el.textContent = "A long article title about designing understandable systems and interfaces that remain useful as the product grows"; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});
