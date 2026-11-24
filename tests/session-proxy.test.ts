import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({ createServerClient: vi.fn(), getUser: vi.fn() }));
vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.createServerClient }));
import { proxy } from "@/proxy";
beforeEach(() => {
  vi.stubEnv("NODE_ENV", "production");vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-test-key");
  mocks.getUser.mockReset();
  mocks.createServerClient.mockImplementation((_url: string, _key: string, options: { cookies: { setAll: (cookies: { name: string; value: string; options: { path: string; maxAge?: number } }[]) => void } }) => ({ auth: { getUser: async () => {
    options.cookies.setAll([{ name: "sb-test.0", value: "new-access", options: { path: "/" } }, { name: "sb-test.1", value: "", options: { path: "/", maxAge: 0 } }]);
    return mocks.getUser();
  } } }));
});
it("propagates refreshed and removed chunks to both the request and browser response", async () => {
  const request = new NextRequest("https://portfolio.example/admin", { headers: { cookie: "sb-test.0=expired; sb-test.1=old-chunk" } });
  const response = await proxy(request);
  expect(request.cookies.get("sb-test.0")?.value).toBe("new-access");
  expect(response.cookies.get("sb-test.0")?.value).toBe("new-access");
  expect(response.cookies.get("sb-test.1")?.maxAge).toBe(0);
  expect(response.headers.get("x-middleware-request-cookie")).toContain("new-access");
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(mocks.getUser).toHaveBeenCalledOnce();
});
it("uses fresh script nonces on admin requests without enabling arbitrary inline scripts", async () => {
  const first = await proxy(new NextRequest("https://portfolio.example/admin"));
  const second = await proxy(new NextRequest("https://portfolio.example/admin"));
  const policy = first.headers.get("content-security-policy") ?? "";
  expect(policy).toContain("script-src-attr 'none'");expect(policy).toContain("https://test.storage.supabase.co");expect(policy).not.toContain("'unsafe-inline'");
  expect(second.headers.get("content-security-policy")).not.toBe(policy);
  vi.unstubAllEnvs();
});
