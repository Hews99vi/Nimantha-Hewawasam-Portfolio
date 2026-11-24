// Isolated browser-test backend. Never loaded by the application or deployment.
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { cp, mkdtemp, rm, symlink, readFile, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { defaultPortfolioContent as content } from "../lib/content-defaults.ts";
const id = "11111111-1111-4111-8111-111111111111";
const image = await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1500"><rect width="2400" height="1500" fill="#eef1ec"/><rect x="80" y="80" width="2240" height="1340" rx="20" fill="#fff"/><text x="160" y="200" font-size="48" font-family="sans-serif" fill="#20282c">Synthetic screenshot · browser test fixture</text><path d="M160 260H2240" stroke="#ddd"/><rect x="160" y="330" width="430" height="960" fill="#173140"/><text x="210" y="420" font-size="32" fill="white" font-family="sans-serif">Project overview</text><rect x="680" y="330" width="1450" height="270" rx="10" fill="#f1f3ed"/><text x="750" y="440" font-size="48" font-family="sans-serif" fill="#173140">A clear view of the work</text><text x="750" y="520" font-size="30" font-family="sans-serif" fill="#53615c">Fixture content only. No customer data.</text><path d="M680 730H2120M680 890H2120M680 1050H2120M680 1210H2120" stroke="#d3d9d4" stroke-width="2"/></svg>`,
  ),
)
  .png()
  .toBuffer();
const projects = content.projects.map((p, index) => ({
  ...p,
  id: index === 0 ? id : p.id,
  images:
    index === 0
      ? [0, 1].map((_, i) => ({
          storage_path: `${id}/${i === 0 ? "22222222-2222-4222-8222-222222222222" : "33333333-3333-4333-8333-333333333333"}.png`,
          alt: `Synthetic test screenshot ${i + 1}`,
          caption: "Synthetic screenshot for automated browser verification.",
          width: 2400,
          height: 1500,
          size: image.length,
        }))
      : [],
}));
const tables = {
  // Exercise compatibility against an already-seeded database, not just new defaults.
  site_intro: [
    {
      ...content.siteIntro,
      cta_label: "View Projects",
      cta_href: "#projects",
      work_link_label: "My work",
      work_link_href: "#projects",
    },
  ],
  about_section: [content.aboutSection],
  contact_section: [content.contactSection],
  social_links: content.socialLinks,
  about_stats: content.aboutStats,
  services: content.services,
  projects,
  tech_groups: content.techGroups,
  tech_group_items: content.techGroups.flatMap((g) => g.items),
  process_steps: content.processSteps,
  why_work_items: content.whyWorkItems,
  // Synthetic review content is confined to this isolated test backend.
  testimonials: [
    {
      id: "test-1",
      sort_order: 1,
      quote:
        "This is synthetic feedback used only to verify the testimonial layout. It provides enough text to check the spacing between a quotation and its attribution.",
      name: "Browser Test Fixture",
      role: "Synthetic content · Browser verification",
      is_active: true,
    },
    {
      id: "test-2",
      sort_order: 2,
      quote:
        "A short synthetic quotation for checking the balance of a card with less text.",
      name: "Layout Test Reviewer",
      role: "Synthetic content · Short-quote fixture",
      is_active: true,
    },
    {
      id: "test-3",
      sort_order: 3,
      quote:
        "This longer synthetic quotation checks that the cards can accommodate different amounts of feedback without cutting off words or hiding the customer's name. It is illustrative content for automated layout verification, not a real review of any project or service.",
      name: "Responsive Typography Fixture",
      role: "Synthetic content · Long-quote fixture",
      is_active: true,
    },
    {
      id: "test-private",
      sort_order: 4,
      quote: "This unpublished fixture must never appear in public cards.",
      name: "Unpublished fixture",
      role: "Synthetic content",
      is_active: false,
    },
  ],
  trusted_brands: content.trustedBrands,
  blog_settings: [content.blogSettings],
  blog_categories: content.blogCategories,
  blog_posts: content.blogPosts,
  blog_post_categories: content.blogPosts.flatMap((p) =>
    p.category_ids.map((category_id) => ({ post_id: p.id, category_id })),
  ),
};
const server = createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  if (url.pathname.startsWith("/storage/")) {
    response.writeHead(200, { "Content-Type": "image/png" });
    response.end(image);
    return;
  }
  const name = url.pathname.split("/").pop();
  let data = tables[name] ?? [];
  if (request.headers.accept?.includes("vnd.pgrst.object"))
    data = data[0] ?? null;
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
});
// Next dev locks its project directory. Use an isolated copy so tests can run
// alongside the owner's local server without changing generated files or config.
const projectDirectory = process.cwd();
const production = process.argv.includes("--production");
const testDirectory = await mkdtemp(join(tmpdir(), "portfolio-browser-"));
for (const source of [
  "app",
  "components",
  "lib",
  "types",
  "public",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next-env.d.ts",
  "next.config.ts",
  "postcss.config.mjs",
  "proxy.ts",
  "instrumentation.ts",
  "scripts",
]) {
  await cp(join(projectDirectory, source), join(testDirectory, source), {
    recursive: true,
  });
}
// Allow loopback image fixtures only in the disposable test copy.
const fixtureConfigPath = join(testDirectory, "next.config.ts");
await writeFile(fixtureConfigPath, (await readFile(fixtureConfigPath, "utf8")).replace("images: {", "images: { dangerouslyAllowLocalIP: true,"));
if (production) {
  await cp(join(projectDirectory, "node_modules"), join(testDirectory, "node_modules"), { recursive: true, mode: (await import("node:fs")).constants.COPYFILE_FICLONE });
} else {
await symlink(
  join(projectDirectory, "node_modules"),
  join(testDirectory, "node_modules"),
  "dir",
);
}
server.listen(4318, "127.0.0.1", async () => {
  const env = { ...process.env, NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:4318", NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-fixture-public-key", NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3100", PORTFOLIO_REVISION: "a".repeat(40), PORT: "3100", HOSTNAME: "127.0.0.1" };
  let child;
  const stop = () => { child?.kill("SIGTERM"); server.close(); };
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
  if (production) {
    const build = spawn(process.execPath, [join(testDirectory, "node_modules/next/dist/bin/next"), "build"], { cwd: testDirectory, env, stdio: "inherit" });
    child = build;
    const code = await new Promise(resolve => build.on("exit", resolve));
    if (code !== 0) { server.close(); await rm(testDirectory, { recursive: true, force: true }); process.exit(1); }
    const { prepareDirect } = await import("../scripts/deploy/direct.mjs");
    const bundle = await prepareDirect(testDirectory, "a".repeat(40), env);
    // Model Selector's application-root symlink; Next must use its nested runtime.
    const selectorModules = join(testDirectory, "selector-virtualenv-node-modules");
    await mkdir(selectorModules);
    await symlink(selectorModules, join(bundle.directory, "node_modules"), "dir");
    child = spawn(process.execPath, [join(bundle.directory, "server.js")], { cwd: bundle.directory, env, stdio: "inherit" });
  } else {
    child = spawn(process.execPath, [join(projectDirectory, "node_modules/next/dist/bin/next"), "dev", testDirectory, "--webpack", "--hostname", "127.0.0.1", "--port", "3100"], { cwd: testDirectory, env, stdio: "inherit" });
  }
  child.on("exit", async code => { server.close(); await rm(testDirectory, { recursive: true, force: true }); process.exit(code ?? 0); });
});
