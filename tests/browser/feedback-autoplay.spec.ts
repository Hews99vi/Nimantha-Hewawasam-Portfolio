import { test, expect } from "@playwright/test";

test("reviews advance every six seconds, pause while reading, and loop without playback controls", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  const section = page.locator("#testimonials");
  const rail = section.locator(".feedback-rail");
  const count = await rail.locator("figure").count();
  expect(count).toBeGreaterThan(1);
  await section.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(section.getByRole("button")).toHaveCount(2);
  expect(await rail.evaluate(el => getComputedStyle(el).scrollbarWidth)).toBe("none");
  await page.clock.runFor(200);
  await page.clock.fastForward(5_000);
  await expect(section.locator(".feedback-controls")).toContainText(`Review 1 of ${count}`);
  await page.clock.fastForward(1_200);
  await page.clock.runFor(800);
  await expect(section.locator(".feedback-controls")).toContainText(`Review 2 of ${count}`);

  await rail.hover();
  await page.clock.fastForward(12_000);
  await expect(section.locator(".feedback-controls")).toContainText(`Review 2 of ${count}`);
  await page.mouse.move(0, 0);
  await page.clock.runFor(200);
  await page.clock.fastForward(6_200);
  await page.clock.runFor(800);
  await expect(section.locator(".feedback-controls")).toContainText(`Review ${count === 2 ? 1 : 3} of ${count}`);

  await rail.locator("figure").last().focus();
  await page.clock.runFor(200);
  await page.clock.fastForward(12_000);
  await expect(section.locator(".feedback-controls")).toContainText(`Review ${count} of ${count}`);
  await rail.locator("figure").last().evaluate(el => (el as HTMLElement).blur());
  await page.clock.runFor(200);
  await page.clock.fastForward(6_200);
  await page.clock.runFor(800);
  await expect(section.locator(".feedback-controls")).toContainText(`Review 1 of ${count}`);
});

test("reduced motion prevents automatic sliding and Home About omits the location", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/");
  await expect(page.locator(".home-about-footer")).not.toContainText("Sri Lanka");
  const section = page.locator("#testimonials");
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole("button")).toHaveCount(2);
  await page.clock.runFor(200);
  await page.clock.fastForward(20_000);
  await expect(section.locator(".feedback-controls")).toContainText("Review 1 of");
  await section.getByRole("button", { name: "Next review" }).click();
  await expect(section.locator(".feedback-controls")).toContainText("Review 2 of");
});
