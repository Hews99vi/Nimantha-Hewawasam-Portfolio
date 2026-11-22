import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { routeFixtureImages } from "./image-fixture";
test.beforeEach(async ({ page, request }) => routeFixtureImages(page, request));

test("testimonial cards keep real content semantics and adapt to review counts", async ({
  page,
}) => {
  await mkdir(".impeccable/review/testimonials", { recursive: true });
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1080 });
    for (const count of [1, 2, 3, 4]) {
      await page.goto("/");
      const section = page.locator("#testimonials");
      await expect(
        section.getByRole("heading", { name: "In their words." }),
      ).toBeVisible();
      await expect(section.locator("figure")).toHaveCount(3);
      await expect(section).not.toContainText("Unpublished fixture");
      await section.locator(".testimonials").evaluate((grid, count) => {
        if (count === 4) grid.append(grid.lastElementChild!.cloneNode(true));
        [...grid.children].slice(count).forEach((card) => card.remove());
      }, count);
      await section.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      const layout = await section.locator("figure").evaluateAll((cards) =>
        cards.map((card) => {
          const rect = card.getBoundingClientRect();
          const attribution = card
            .querySelector("figcaption")
            ?.getBoundingClientRect();
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            bottom: rect.bottom,
            attributionBottom: attribution?.bottom ?? 0,
            overflow: card.scrollWidth > card.clientWidth + 1,
          };
        }),
      );
      expect(
        layout.every(
          (card) => !card.overflow && card.attributionBottom <= card.bottom,
        ),
      ).toBe(true);
      if (count > 1) expect(layout[1].y).toBeGreaterThan(layout[0].y);
      if (width >= 768 && count >= 3) {
        expect(Math.round(layout[1].y)).toBe(Math.round(layout[2].y));
        expect(layout[0].width).toBeGreaterThan(layout[1].width);
      }
      if (width === 390 && count >= 3)
        expect(layout[2].y).toBeGreaterThan(layout[1].y);
      // A lone final review uses the available width instead of leaving an empty column.
      if (count === 2 || count === 4)
        expect(Math.round(layout[count - 1].width)).toBe(
          Math.round(layout[0].width),
        );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      await section.screenshot({
        path: `.impeccable/review/testimonials/cards-${count}-${width}.png`,
        animations: "disabled",
        // Keep offscreen fixed UI and development tooling out of section captures.
        style: ".skip-link:not(:focus), nextjs-portal { visibility: hidden; }",
      });
    }
  }
});

test("long names, roles and quotations remain fully readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1080 });
  await page.goto("/");
  const section = page.locator("#testimonials");
  const card = section.locator("figure").first();
  await card.locator("figcaption strong").evaluate((name) => {
    name.textContent =
      "A very long customer name that must wrap without clipping";
  });
  await card.locator(".testimonial-author > span").evaluate((role) => {
    role.textContent =
      "A very long professional title and company name for layout verification";
  });
  await card.locator("blockquote p").evaluate((quote) => {
    quote.textContent =
      "Long synthetic feedback for checking reflow and readable spacing. ".repeat(
        8,
      );
  });
  await section.scrollIntoViewIfNeeded();
  expect(
    await card.evaluate(
      (card) =>
        card.scrollHeight <= card.clientHeight + 1 &&
        card.scrollWidth <= card.clientWidth + 1,
    ),
  ).toBe(true);
  await section.screenshot({
    path: ".impeccable/review/testimonials/long-content-390.png",
    animations: "disabled",
    style: ".skip-link:not(:focus), nextjs-portal { visibility: hidden; }",
  });
});
