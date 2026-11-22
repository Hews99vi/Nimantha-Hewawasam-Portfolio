import { beforeEach, describe, expect, it, vi } from "vitest";
const auth = vi.hoisted(() => ({ getAdminContext: vi.fn() }));
vi.mock("@/lib/admin/auth", () => auth);
import { DELETE } from "@/app/api/admin/project-media/route";
import { POST } from "@/app/api/admin/[collection]/route";
import { PUT } from "@/app/api/admin/[collection]/[id]/route";
const path =
  "11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222.png";
beforeEach(() => vi.clearAllMocks());
describe("media authorization", () => {
  for (const [label, state, status] of [
    ["unconfigured", { configured: false }, 503],
    ["anonymous", { configured: true, user: null }, 401],
    [
      "non-admin",
      { configured: true, user: { id: "user" }, isAdmin: false },
      403,
    ],
  ] as const) {
    it(`rejects ${label} cleanup before reaching storage`, async () => {
      auth.getAdminContext.mockResolvedValue(state);
      expect(
        (
          await DELETE(
            new Request("http://local/api/admin/project-media", {
              method: "DELETE",
              body: JSON.stringify({ paths: [path] }),
            }),
          )
        ).status,
      ).toBe(status);
    });
  }
  it("cannot delete an original that a saved project references", async () => {
    const remove = vi.fn();
    auth.getAdminContext.mockResolvedValue({
      configured: true,
      user: { id: "admin" },
      isAdmin: true,
      supabase: {
        from: () => ({
          select: async () => ({
            data: [{ images: [{ storage_path: path }] }],
            error: null,
          }),
        }),
        storage: { from: () => ({ remove }) },
      },
    });
    const response = await DELETE(
      new Request("http://local", {
        method: "DELETE",
        body: JSON.stringify({ paths: [path] }),
      }),
    );
    expect(response.status).toBe(409);
    expect(remove).not.toHaveBeenCalled();
  });
  it("rejects anonymous project writes", async () => {
    auth.getAdminContext.mockResolvedValue({ configured: true, user: null });
    expect(
      (
        await POST(new Request("http://local", { method: "POST" }), {
          params: Promise.resolve({ collection: "projects" }),
        })
      ).status,
    ).toBe(401);
    expect(
      (
        await PUT(new Request("http://local", { method: "PUT" }), {
          params: Promise.resolve({ collection: "projects", id: "x" }),
        })
      ).status,
    ).toBe(401);
  });
});
