import type { APIRequestContext, Page } from "@playwright/test";

/** Serve test backend originals without permitting private-network image optimization. */
export async function routeFixtureImages(
  page: Page,
  request: APIRequestContext,
) {
  await page.route("**/_next/image*", async (route) => {
    const source = new URL(route.request().url()).searchParams.get("url");
    if (source?.startsWith("http://127.0.0.1:4318/")) {
      const image = await request.get(source);
      await route.fulfill({
        contentType: "image/png",
        body: await image.body(),
      });
    } else await route.continue();
  });
}
