import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const captureStyle = ".skip-link:not(:focus),nextjs-portal{visibility:hidden}";
test.beforeEach(async () =>
  mkdir(".impeccable/review/interior-refresh", { recursive: true }),
);

test("toolkit choices expose genuine tools and keep keyboard focus", async ({
  page,
}) => {
  await page.goto("/about");
  const choices = page
    .getByRole("group", { name: "Choose a technical discipline" })
    .getByRole("button");
  const next = choices.nth(1);
  const title = (await next.innerText()).trim();
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(next).toHaveAttribute("aria-pressed", "true");
  await expect(next).toBeFocused();
  await expect(page.locator("#toolkit-details h3")).toHaveText(title);
  await expect(page.locator("#toolkit-details li").first()).toBeVisible();
  await page.locator(".about-tools").screenshot({
    path: ".impeccable/review/interior-refresh/toolkit-selected.png",
    animations: "disabled",
    style: captureStyle,
  });
});

test("service disclosures, diagrams and direct hash navigation stay synchronized", async ({
  page,
}) => {
  await page.goto("/services");
  const details = page.locator(".service-list details");
  const target = details.nth(1);
  const title = (await target.locator("h2").innerText()).trim();
  await target.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(target).toHaveAttribute("open", "");
  await expect(details.first()).not.toHaveAttribute("open", "");
  await expect(page.locator(".service-blueprint figcaption strong")).toHaveText(
    title,
  );
  const deep = details.nth(3);
  const id = await deep.getAttribute("id");
  await page.goto(`/services#${id}`);
  await expect(page.locator(`#${id}`)).toHaveAttribute("open", "");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator(".service-blueprint figure").screenshot({
    path: ".impeccable/review/interior-refresh/service-selected.png",
    animations: "disabled",
    style: captureStyle,
  });
  await page.setViewportSize({ width: 390, height: 1000 });
  await expect(page.locator(`#${id} .service-mobile-diagram`)).toBeVisible();
  await expect(page.locator(".service-blueprint")).toBeHidden();
  await page.locator(`#${id}`).screenshot({
    path: ".impeccable/review/interior-refresh/service-selected-mobile.png",
    animations: "disabled",
    style: captureStyle,
  });
});

test("contact actions copy the actual email and display a real clock", async ({
  page,
  context,
}) => {
  await page.goto("/contact");
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: new URL(page.url()).origin,
  });
  const email = await page.locator(".contact-email-link span").innerText();
  await expect(page.locator(".contact-email-link")).toHaveAttribute(
    "href",
    `mailto:${email}`,
  );
  await page.getByRole("button", { name: "Copy email" }).click();
  await expect(page.getByRole("status")).toHaveText("Email copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(email);
  await expect(page.locator(".contact-clock time")).toHaveText(/^\d{2}:\d{2}$/);
});

test("the connected process stays in one sequence at tablet and desktop widths", async ({
  page,
}) => {
  await page.goto("/services");
  for (const width of [1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const positions = await page
      .locator(".process-timeline li")
      .evaluateAll((items) =>
        items.map((item) => {
          const rect = item.getBoundingClientRect();
          return { x: Math.round(rect.x), y: Math.round(rect.y) };
        }),
      );
    expect(positions.length).toBeGreaterThan(1);
    if (width === 1024)
      expect(new Set(positions.map((position) => position.x)).size).toBe(1);
    else expect(new Set(positions.map((position) => position.y)).size).toBe(1);
  }
});

test("clipboard failure remains recoverable", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("Clipboard unavailable in test");
        },
      },
    }),
  );
  await page.goto("/contact");
  await page.getByRole("button", { name: "Copy email" }).click();
  await expect(page.getByRole("status")).toContainText("Could not copy");
  await expect(page.locator(".contact-email-link")).toBeVisible();
});

test("reduced motion and static content remain usable, with Home excluded", async ({
  page,
  browser,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/services");
  expect(
    await page
      .locator(".service-blueprint .diagram-trace")
      .first()
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto(new URL("/services", page.url()).href);
  const nativeDetails = staticPage.locator(".service-list details").nth(1);
  await nativeDetails.locator("summary").click();
  await expect(nativeDetails.locator(".lead")).toBeVisible();
  await context.close();
  await page.goto("/");
  await expect(page.locator(".hero-frame")).toBeVisible();
  await expect(page.locator(".interior-motion")).toHaveCount(0);
});
