import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  getAdminContext: vi.fn(),
  revalidateAdminPaths: vi.fn(),
}));
vi.mock("@/lib/admin/auth", () => ({ getAdminContext: mocks.getAdminContext }));
vi.mock("@/lib/admin/revalidate", () => ({
  revalidateAdminPaths: mocks.revalidateAdminPaths,
}));
import { PUT } from "@/app/api/admin/site-intro/route";
import { defaultPortfolioContent } from "@/lib/content-defaults";

beforeEach(() => vi.clearAllMocks());
describe("Introduction saving", () => {
  it("preserves the action contract and expires the shared public cache after saving", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    mocks.getAdminContext.mockResolvedValue({
      configured: true,
      user: { id: "admin" },
      isAdmin: true,
      supabase: { from: () => ({ upsert }) },
    });
    const payload = {
      ...defaultPortfolioContent.siteIntro,
      work_link_label: "Discuss a project",
      work_link_href: "/contact",
    };
    const response = await PUT(
      new Request("http://local/api/admin/site-intro", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
    expect(response.status).toBe(200);
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "site-intro",
        work_link_label: "Discuss a project",
        work_link_href: "/contact",
      }),
      { onConflict: "id" },
    );
    expect(mocks.revalidateAdminPaths).toHaveBeenCalledOnce();
  });
  it("does not report success or expire the cache when saving fails", async () => {
    mocks.getAdminContext.mockResolvedValue({
      configured: true,
      user: { id: "admin" },
      isAdmin: true,
      supabase: {
        from: () => ({
          upsert: async () => ({ error: { message: "Save failed" } }),
        }),
      },
    });
    const response = await PUT(
      new Request("http://local/api/admin/site-intro", {
        method: "PUT",
        body: JSON.stringify(defaultPortfolioContent.siteIntro),
      }),
    );
    expect(response.status).toBe(500);
    expect(mocks.revalidateAdminPaths).not.toHaveBeenCalled();
  });
});
