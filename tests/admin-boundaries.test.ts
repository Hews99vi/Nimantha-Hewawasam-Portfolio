import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ getAdminContext: vi.fn(), revalidateAdminPaths: vi.fn(), rpc: vi.fn(), upsert: vi.fn() }));
vi.mock("@/lib/admin/auth", () => ({ getAdminContext: mocks.getAdminContext }));
vi.mock("@/lib/admin/revalidate", () => ({ revalidateAdminPaths: mocks.revalidateAdminPaths }));
import { PUT as intro } from "@/app/api/admin/site-intro/route";
import { PUT as about } from "@/app/api/admin/about-section/route";
import { POST as create } from "@/app/api/admin/blog-posts/route";
import { PUT as update } from "@/app/api/admin/blog-posts/[id]/route";
import { POST as reorder } from "@/app/api/admin/blog-posts/reorder/route";
import { defaultPortfolioContent } from "@/lib/content-defaults";
const id = "11111111-1111-4111-8111-111111111111";
const request = (value: unknown) => new Request("http://test/api", { method: "POST", body: JSON.stringify(value) });
beforeEach(() => {
  vi.clearAllMocks();
  mocks.upsert.mockResolvedValue({ error: null });
  mocks.rpc.mockResolvedValue({ data: { ...defaultPortfolioContent.blogPosts[0], id }, error: null });
  mocks.getAdminContext.mockResolvedValue({ configured: true, user: { id }, isAdmin: true, supabase: { rpc: mocks.rpc, from: () => ({ upsert: mocks.upsert }) } });
});
it("rejects malformed JSON consistently without a mutation", async () => {
  for (const handler of [intro, about, create, reorder]) expect((await handler(new Request("http://test", { method: "POST", body: "{" }))).status).toBe(400);
  expect(mocks.rpc).not.toHaveBeenCalled();expect(mocks.upsert).not.toHaveBeenCalled();
});
it("invalidates the shared content after an About save", async () => {
  expect((await about(request(defaultPortfolioContent.aboutSection))).status).toBe(200);
  expect(mocks.revalidateAdminPaths).toHaveBeenCalledOnce();
});
it("uses one RPC for a blog save and only invalidates after success", async () => {
  const payload = { ...defaultPortfolioContent.blogPosts[0], category_ids: [id] };
  expect((await create(request(payload))).status).toBe(200);
  expect(mocks.rpc).toHaveBeenCalledWith("save_portfolio_blog_post", expect.objectContaining({ p_id: null, p_category_ids: payload.category_ids }));
  mocks.revalidateAdminPaths.mockClear();
  mocks.rpc.mockResolvedValue({ data: null, error: { code: "23505", message: "internal database detail" } });
  const response = await update(request(payload), { params: Promise.resolve({ id }) });
  expect(response.status).toBe(409);
  expect(JSON.stringify(await response.json())).not.toContain("internal database detail");
  expect(mocks.revalidateAdminPaths).not.toHaveBeenCalled();
});
it("reports the required migration without retrying partial legacy writes", async () => {
  mocks.rpc.mockResolvedValue({ error: { code: "PGRST202" } });
  const response = await create(request({ ...defaultPortfolioContent.blogPosts[0], category_ids: [id] }));
  expect(response.status).toBe(503);
  expect((await response.json()).message).toContain("202611240002_admin_integrity.sql");
});
it("distinguishes unavailable authorization from an expired or non-admin session", async () => {
  for (const [user, isAdmin, status] of [[null, false, 401], [{ id }, false, 403]] as const) {
    mocks.getAdminContext.mockResolvedValue({ configured: true, user, isAdmin });
    expect((await intro(request({}))).status).toBe(status);
  }
  mocks.getAdminContext.mockRejectedValue(new Error("private service details"));
  const response = await intro(request({}));
  expect(response.status).toBe(503);expect(JSON.stringify(await response.json())).not.toContain("private service details");
});
