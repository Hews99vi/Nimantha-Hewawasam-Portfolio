import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import sharp from "sharp";
import assets from "@/lib/local-image-assets.json";
it("delivers smaller portraits with unchanged originals, intrinsic ratios and transparent hero edges", async () => {
  const sources = { hero: "nimantha-hero.png", about: "nimantha-about.png", logo: "Main logo.png" };
  for (const name of ["hero", "about", "logo"] as const) {
    const asset = assets[name];
    const original = await readFile(`public/images/${sources[name]}`);
    expect(createHash("sha256").update(original).digest("hex")).toBe(asset.sourceHash);
    for (const variant of asset.variants) {
      const bytes = await readFile(`public${variant.src}`);
      const metadata = await sharp(bytes).metadata();
      expect(metadata.format).toBe("webp");expect(metadata.width).toBe(variant.width);
      expect(metadata.width).toBeLessThanOrEqual(asset.width);
      expect(Math.abs(variant.height - variant.width * asset.height / asset.width)).toBeLessThanOrEqual(1);
      expect(bytes.length).toBeLessThan(original.length / 10);
      if (name === "hero") expect(metadata.hasAlpha).toBe(true);
    }
  }
});
