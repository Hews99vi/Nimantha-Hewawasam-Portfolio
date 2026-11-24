// Reproducible delivery variants of user-supplied images. Originals are read only.
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
const root = process.cwd();
const output = resolve(root, 'public/images/optimized');
await mkdir(output, { recursive: true });
const inputs = {
  hero: { source: 'nimantha-hero.png', widths: [480, 768, 1080, 1440, 2048], quality: 90 },
  about: { source: 'nimantha-about.png', widths: [256, 480, 768, 1080, 1440], quality: 95 },
  logo: { source: 'Main logo.png', widths: [64, 128, 192], quality: 90 },
};
const manifest = {};
for (const [name, spec] of Object.entries(inputs)) {
  const original = await readFile(resolve(root, 'public/images', spec.source));
  const metadata = await sharp(original).metadata();
  const variants = [];
  for (const width of [...new Set(spec.widths.map(width => Math.min(width, metadata.width)))]) {
    const { data, info } = await sharp(original).resize({ width, withoutEnlargement: true }).webp({ quality: spec.quality, alphaQuality: 100 }).toBuffer({ resolveWithObject: true });
    const hash = createHash('sha256').update(data).digest('hex').slice(0, 12);
    const filename = `${name}-${info.width}-${hash}.webp`;
    await writeFile(join(output, filename), data);
    variants.push({ src: `/images/optimized/${filename}`, width: info.width, height: info.height, bytes: data.length });
  }
  manifest[name] = { source: `/images/${spec.source}`, quality: spec.quality, width: metadata.width, height: metadata.height, sourceBytes: original.length, sourceHash: createHash('sha256').update(original).digest('hex'), variants };
  console.log(`${name}: ${original.length} source bytes; ${variants.map(v => `${v.width}px=${v.bytes}B`).join(', ')}`);
}
await writeFile(resolve(root, 'lib/local-image-assets.json'), JSON.stringify(manifest, null, 2) + '\n');
