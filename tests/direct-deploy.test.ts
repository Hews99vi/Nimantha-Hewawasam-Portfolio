import { mkdtemp, mkdir, writeFile, readFile, rm, lstat } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { expect, it, vi } from "vitest";
import { prepareDirect, uploadDirect } from "../scripts/deploy/direct.mjs";
const revision = "b".repeat(40);
const config = { host: "host.example", port: "22", user: "account", root: "/home/account/app", origin: "https://portfolio.example" };
it("prepares the existing server.js startup with matching public build settings and no environment files", async () => {
  const root = await mkdtemp(join(tmpdir(), "portfolio-direct-test-"));
  try {
    await mkdir(join(root, ".next/standalone/.next"), { recursive: true });
    await mkdir(join(root, ".next/static"), { recursive: true });
    await mkdir(join(root, ".next/standalone/node_modules/fixture-package"), { recursive: true });
    await writeFile(join(root, ".next/standalone/node_modules/fixture-package/index.js"), "module.exports = 'preserved'");
    await mkdir(join(root, "public"));await mkdir(join(root, "scripts/deploy"), { recursive: true });
    await writeFile(join(root, ".next/standalone/server.js"), "// compiled standalone server");
    await writeFile(join(root, ".next/standalone/.next/BUILD_ID"), "build");
    await writeFile(join(root, ".next/standalone/.env"), "PRIVATE_TEST_SECRET=never-upload");
    await writeFile(join(root, "scripts/deploy/launcher.cjs"), "// optional launcher");
    const bundle = await prepareDirect(root, revision, { NEXT_PUBLIC_SITE_URL: config.origin, NEXT_PUBLIC_SUPABASE_URL: "https://new.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-key" });
    const startup = await readFile(join(bundle.directory, "server.js"), "utf8");
    expect(startup).toContain("require('./portfolio-runtime/server.js')");expect(startup).toContain("https://new.supabase.co");expect(startup).toContain(revision);
    expect(startup).not.toContain("PRIVATE_TEST_SECRET");
    expect(await readFile(join(bundle.directory, "portfolio-runtime/server.js"), "utf8")).toContain("compiled standalone");
    await expect(lstat(join(bundle.directory, "node_modules"))).rejects.toThrow();
    expect(await readFile(join(bundle.directory, "portfolio-runtime/node_modules/fixture-package/index.js"), "utf8")).toContain("preserved");
    await expect(readFile(join(bundle.directory, "portfolio-runtime/.env"))).rejects.toThrow();
  } finally { await rm(root, { recursive: true, force: true }); }
});
for (const fail of [false, true]) it(`uploads startup last and only restarts/verifies after successful uploads (failure=${fail})`, async () => {
  const temporary = await mkdtemp(join(tmpdir(), "portfolio-direct-upload-"));
  const directory = join(temporary, "bundle");await mkdir(directory);await writeFile(join(directory, "server.js"), "startup");
  await mkdir(join(directory, "portfolio-runtime"));await writeFile(join(directory, "portfolio-runtime/server.js"), "runtime");
  const execute = vi.fn().mockResolvedValue(undefined), verify = vi.fn();
  if (fail) execute.mockRejectedValueOnce(new Error("interrupted"));
  try {
    const result = uploadDirect(config, directory, revision, { temporary, execute, verify });
    if (fail) { await expect(result).rejects.toThrow("interrupted");expect(execute).toHaveBeenCalledTimes(1);expect(verify).not.toHaveBeenCalled(); }
    else { await result;expect(execute).toHaveBeenCalledTimes(3);expect(execute.mock.calls[0][1]).toContain(`${directory}/.`);expect(execute.mock.calls[1][1]).toContain(join(temporary, "server.js"));expect(execute.mock.calls[2][1]).toContain(join(temporary, "tmp"));expect(verify).toHaveBeenCalledWith(revision); }
    expect(await readFile(join(directory, "server.js"), "utf8")).toBe("startup");
  } finally { await rm(temporary, { recursive: true, force: true }); }
});

it("refuses a bundle that could overwrite CloudLinux's root node_modules", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "portfolio-managed-modules-"));
  const execute = vi.fn(), verify = vi.fn();
  try {
    await mkdir(join(temporary, "node_modules"));
    await expect(uploadDirect(config, temporary, revision, { temporary, execute, verify })).rejects.toThrow("reserved for CloudLinux");
    expect(execute).not.toHaveBeenCalled();expect(verify).not.toHaveBeenCalled();
  } finally { await rm(temporary, { recursive: true, force: true }); }
});
