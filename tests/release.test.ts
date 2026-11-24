import { createRequire } from "node:module";
import { mkdtemp, mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { activateRelease, verifyRelease, deploymentConfig } from "../scripts/deploy/release.mjs";
import { prepareRelease } from "../scripts/deploy/prepare.mjs";
import { schemaPreflight } from "../scripts/deploy/preflight.mjs";
const require = createRequire(import.meta.url);
const launcher = require("../scripts/deploy/launcher.cjs") as { selectRelease(root: string): { directory: string; revision: string } };
const old = "a".repeat(40), revision = "b".repeat(40);
function transport() { return { readPointer: vi.fn().mockResolvedValue({ revision: old }), stage: vi.fn(), writePointer: vi.fn(), restart: vi.fn() }; }
describe("release activation", () => {
  it("does not activate or restart after an interrupted upload", async () => {
    const remote = transport();remote.stage.mockRejectedValue(new Error("connection interrupted"));
    await expect(activateRelease({ remote, bundle: { revision }, verify: vi.fn() })).rejects.toThrow();
    expect(remote.writePointer).not.toHaveBeenCalled();expect(remote.restart).not.toHaveBeenCalled();
  });
  it("commits a last-good pointer only after the expected release passes checks", async () => {
    const remote = transport();const verify = vi.fn();
    await activateRelease({ remote, bundle: { revision }, verify });
    expect(remote.writePointer.mock.calls).toEqual([["current-release.json", { revision }], ["last-good-release.json", { revision }]]);
    expect(verify).toHaveBeenCalledWith(revision);
    expect(remote.writePointer.mock.invocationCallOrder[1]).toBeGreaterThan(verify.mock.invocationCallOrder[0]);
  });
  it("restores and verifies the previous revision after a failed activation", async () => {
    const remote = transport();const verify = vi.fn().mockRejectedValueOnce(new Error("bad build")).mockResolvedValueOnce(undefined);
    await expect(activateRelease({ remote, bundle: { revision }, verify })).rejects.toThrow("previous release was restored");
    expect(remote.writePointer.mock.calls).toEqual([["current-release.json", { revision }], ["current-release.json", { revision: old }]]);
    expect(remote.restart).toHaveBeenCalledTimes(2);expect(verify).toHaveBeenLastCalledWith(old);
  });
  it("does not report success when rollback also fails", async () => {
    const remote = transport();const verify = vi.fn().mockRejectedValue(new Error("unavailable"));
    await expect(activateRelease({ remote, bundle: { revision }, verify })).rejects.toThrow("rollback could not be verified");
  });
  it("rejects the wrong running revision", async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ status: "ok", revision: old }));
    await expect(verifyRelease("https://portfolio.example", revision, { fetcher, attempts: 3, pause: async () => {} })).rejects.toThrow();
  });
  it("requires consecutive health checks, page success, assets and the public sitemap", async () => {
    const fetcher = vi.fn(async (input: string | URL | Request) => {
      const path = new URL(input instanceof Request ? input.url : input).pathname;
      if (path === "/api/health") return Response.json({ status: "ok", revision });
      if (path === "/") return new Response('<h1>Portfolio</h1><script src="/_next/static/app.js"></script>');
      if (path === "/sitemap.xml") return new Response('<loc>https://portfolio.example/blog</loc>');
      return new Response("Content");
    });
    await verifyRelease("https://portfolio.example", revision, { fetcher, attempts: 3, pause: async () => {} });
    expect(fetcher.mock.calls.filter(call => String(call[0]).includes('/api/health'))).toHaveLength(3);
    expect(fetcher.mock.calls.some(call => String(call[0]).includes('/_next/static/app.js'))).toBe(true);
  });
});
it("the launcher ignores corrupt activation pointers and incomplete releases", async () => {
  const root = await mkdtemp(join(tmpdir(), "portfolio-launcher-test-"));
  try {
    const directory = join(root, "releases", old);await mkdir(join(directory, ".next"), { recursive: true });
    const critical: Record<string, string> = {};
    for (const name of ["server.js", ".next/BUILD_ID"]) { await writeFile(join(directory, name), name);critical[name] = createHash("sha256").update(name).digest("hex"); }
    await writeFile(join(directory, "release-ready.json"), JSON.stringify({ version: 1, revision: old, critical }));
    await writeFile(join(root, "last-good-release.json"), JSON.stringify({ revision: old }));
    await writeFile(join(root, "current-release.json"), "{");
    expect(launcher.selectRelease(root).revision).toBe(old);
    await writeFile(join(root, "current-release.json"), JSON.stringify({ revision: "../../outside" }));
    expect(launcher.selectRelease(root).revision).toBe(old);
    await writeFile(join(directory, "server.js"), "corrupted");
    expect(() => launcher.selectRelease(root)).toThrow("No complete release");
  } finally { await rm(root, { recursive: true, force: true }); }
});
it("prepares portable bundles without environment files and publishes the marker separately", async () => {
  const root = await mkdtemp(join(tmpdir(), "portfolio-bundle-test-"));
  try {
    await mkdir(join(root, ".next/standalone/.next"), { recursive: true });await mkdir(join(root, ".next/static"), { recursive: true });await mkdir(join(root, "public"));await mkdir(join(root, "scripts/deploy"), { recursive: true });
    for (const [name, value] of [[".next/standalone/server.js", "server"], [".next/standalone/.next/BUILD_ID", "build"], [".next/standalone/.env.local", "PRIVATE=never-upload"], ["scripts/deploy/launcher.cjs", "launcher"]]) await writeFile(join(root, name), value);
    const bundle = await prepareRelease(root, revision);
    await expect(readFile(join(bundle.directory, ".env.local"))).rejects.toThrow();
    await expect(readFile(join(bundle.directory, "release-ready.json"))).rejects.toThrow();
    expect(JSON.parse(await readFile(bundle.marker, "utf8")).revision).toBe(revision);
  } finally { await rm(root, { recursive: true, force: true }); }
});
it("validates transport configuration before any shell or network operation", () => {
  const env = { CPANEL_HOST: "host.example", CPANEL_PORT: "22", CPANEL_USERNAME: "account", CPANEL_APP_PATH: "/home/account/portfolio", NEXT_PUBLIC_SITE_URL: "https://portfolio.example" };
  expect(deploymentConfig(env).origin).toBe("https://portfolio.example");
  for (const values of [{ CPANEL_HOST: "host;echo x" }, { CPANEL_APP_PATH: "/home/../outside" }, { NEXT_PUBLIC_SITE_URL: "http://localhost:3000" }, { CPANEL_PORT: "0" }]) expect(() => deploymentConfig({ ...env, ...values })).toThrow();
});
it("database preflight requires columns and denied anonymous RPC access", async () => {
  const fetcher = vi.fn(async (url: string | URL | Request) => String(url instanceof Request ? url.url : url).includes('/rpc/') ? Response.json({ code: "42501" }, { status: 401 }) : Response.json([]));
  await schemaPreflight({ NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-key" }, fetcher);
  expect(fetcher).toHaveBeenCalledTimes(4);
  await expect(schemaPreflight({ NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-key" }, async () => Response.json({ code: "PGRST202" }, { status: 404 }))).rejects.toThrow("columns");
});
