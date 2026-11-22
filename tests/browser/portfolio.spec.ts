import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { routeFixtureImages } from "./image-fixture";
// Local image requests are fulfilled from the test backend. Supabase/Next image
// integration is separately verified against real storage before deployment.
test.beforeEach(async ({ page, request }) => routeFixtureImages(page, request));
test("public routes, gallery navigation, original view and keyboard focus", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Nimantha",
  );
  await page.getByRole("link", { name: "All projects", exact: true }).click();
  await expect(page).toHaveURL(/\/work$/);
  await page
    .getByRole("link", { name: /Explore project/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/work\/studentstay$/);
  const launcher = page.getByRole("button", {
    name: "Open image 1: Synthetic test screenshot 1",
  });
  await launcher.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: /StudentStay/ }),
  ).toContainText("2 / 2");
  await page
    .getByRole("button", { name: "Zoom to original resolution" })
    .click();
  await expect(page.getByRole("button", { name: "Fit image" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(
    page.getByRole("link", { name: "View original image in a new tab" }),
  ).toHaveAttribute("href", /storage\/v1\/object\/public/);
  await mkdir(".impeccable/review", { recursive: true });
  await page.screenshot({ path: ".impeccable/review/gallery-zoom-1440.png" });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(launcher).toBeFocused();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "StudentStay",
  );
  for (const path of ["/about", "/services", "/blog", "/contact"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await page.goto("/services");
  const summary = page.locator("summary").nth(1);
  await summary.click();
  await expect(page.locator("details").nth(1)).toHaveAttribute("open", "");
  await page.screenshot({
    path: ".impeccable/review/services-expanded-1440.png",
    fullPage: true,
  });
  const missing = await page.goto("/work/not-a-project");
  expect(missing?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This page isn’t here." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("responsive layouts and review captures", async ({ page }) => {
  await mkdir(".impeccable/review", { recursive: true });
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [
      "/",
      "/work",
      "/work/studentstay",
      "/about",
      "/services",
      "/blog",
      "/contact",
    ]) {
      await page.goto(path);
      await page
        .getByRole("link", { name: "Nimantha Hewawasam home" })
        .waitFor();
      await page.evaluate(() => document.fonts.ready);
      for (const image of await page.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
      }
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        `${path} at ${width}px`,
      ).toBe(true);
      if (path === "/work/studentstay") {
        const fits = await page
          .locator(".gallery-open img")
          .evaluateAll((images) =>
            images.every((image) => {
              if (!(image instanceof HTMLImageElement) || !image.parentElement)
                return false;
              const rect = image.getBoundingClientRect();
              return (
                rect.width <= image.parentElement.clientWidth + 1 &&
                Math.abs(
                  rect.width / rect.height -
                    image.naturalWidth / image.naturalHeight,
                ) < 0.02
              );
            }),
          );
        expect(fits, `Uncropped gallery at ${width}px`).toBe(true);
      }
      const name = path === "/" ? "home" : path.replaceAll("/", "-").slice(1);
      await page.screenshot({
        path: `.impeccable/review/${name}-${width}.png`,
        fullPage: true,
        animations: "disabled",
      });
    }
  }
  for (const width of [900, 1024]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `.impeccable/review/home-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page.getByRole("link", { name: "Work", exact: true }).first(),
  ).toBeVisible();
  await page.screenshot({ path: ".impeccable/review/menu-390.png" });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("link", { name: "Work", exact: true }).first().click();
  await expect(page).toHaveURL(/\/work$/);
});

test("failed images expose retry without nested interactive controls", async ({
  page,
}) => {
  const fail = async (route: import("@playwright/test").Route) => {
    await route.abort();
  };
  await page.route("**/_next/image*", fail);
  await page.goto("/work/studentstay");
  await expect(page.locator(".project-main-image .image-error")).toBeVisible();
  expect(await page.locator("button button, a button").count()).toBe(0);
  await page.screenshot({
    path: ".impeccable/review/gallery-error-1440.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Open image 1: Synthetic test screenshot 1" })
    .click();
  await expect(page.getByRole("button", { name: "Retry image" })).toBeVisible();
  await page.unroute("**/_next/image*", fail);
  await page.getByRole("button", { name: "Retry image" }).click();
  await expect(
    page.getByRole("dialog").locator(".lightbox-stage img"),
  ).toBeVisible();
});

test("image delivery preserves source bytes and accepts only configured qualities", async ({
  request,
}) => {
  const { readFile } = await import("node:fs/promises");
  const { createHash } = await import("node:crypto");
  const { default: sharp } = await import("sharp");
  const source = await readFile("public/images/nimantha-hero.png");
  const original = await request.get("/images/nimantha-hero.png");
  const digest = (bytes: Buffer) =>
    createHash("sha256").update(bytes).digest("hex");
  expect(digest(await original.body())).toBe(digest(source));
  const sourceMetadata = await sharp(source).metadata();
  for (const quality of [90, 95]) {
    const response = await request.get("/_next/image", {
      params: {
        url: "/images/nimantha-hero.png",
        w: "1080",
        q: String(quality),
      },
      headers: { Accept: "image/webp" },
    });
    expect(response.ok()).toBe(true);
    const metadata = await sharp(await response.body()).metadata();
    expect(metadata.width).toBe(1080);
    expect(metadata.height).toBeGreaterThan(0);
    expect(metadata.hasAlpha).toBe(sourceMetadata.hasAlpha);
  }
  const oversized = await request.get("/_next/image", {
    params: { url: "/images/nimantha-hero.png", w: "3200", q: "95" },
  });
  const dimensions = await sharp(await oversized.body()).metadata();
  expect(dimensions.width).toBeLessThanOrEqual(sourceMetadata.width ?? 0);
  const rejected = await request.get("/_next/image", {
    params: { url: "/images/nimantha-hero.png", w: "1080", q: "75" },
  });
  expect(rejected.status()).toBe(400);
});
