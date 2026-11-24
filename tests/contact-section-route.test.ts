import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ getAdminContext: vi.fn(), revalidateAdminPaths: vi.fn(), upsert: vi.fn() }));
vi.mock("@/lib/admin/auth", () => ({ getAdminContext: mocks.getAdminContext }));
vi.mock("@/lib/admin/revalidate", () => ({ revalidateAdminPaths: mocks.revalidateAdminPaths }));
import { PUT } from "@/app/api/admin/contact-section/route";
import { defaultPortfolioContent } from "@/lib/content-defaults";
const payload = { ...defaultPortfolioContent.contactSection, whatsapp_number: "+94 (77) 123-4567" };
function request(value: unknown = payload) {
  return new Request("http://local/api/admin/contact-section", { method: "PUT", body: JSON.stringify(value) });
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.upsert.mockResolvedValue({ error: null });
  mocks.getAdminContext.mockResolvedValue({ configured: true, user: { id: "admin" }, isAdmin: true, supabase: { from: () => ({ upsert: mocks.upsert }) } });
});
describe("Contact saving", () => {
  it.each([[null, false, 401], [{ id: "reader" }, false, 403]])("denies unauthorized saves", async (user, isAdmin, status) => {
    mocks.getAdminContext.mockResolvedValue({ configured: true, user, isAdmin });
    expect((await PUT(request())).status).toBe(status);
    expect(mocks.upsert).not.toHaveBeenCalled();
  });
  it("persists the normalized number and expires the public cache only after success", async () => {
    expect((await PUT(request())).status).toBe(200);
    expect(mocks.upsert).toHaveBeenCalledWith(expect.objectContaining({ id: "contact-section", whatsapp_number: "+94771234567" }), { onConflict: "id" });
    expect(mocks.revalidateAdminPaths).toHaveBeenCalledOnce();
  });
  it("rejects malformed numbers and invalid JSON without a mutation", async () => {
    const response = await PUT(request({ ...payload, whatsapp_number: "0771234567" }));
    expect(response.status).toBe(400);
    expect((await response.json()).fieldErrors.whatsapp_number).toBeDefined();
    expect((await PUT(new Request("http://local/api/admin/contact-section", { method: "PUT", body: "{" }))).status).toBe(400);
    expect(mocks.upsert).not.toHaveBeenCalled();
  });
  it("allows explicitly clearing the number", async () => {
    expect((await PUT(request({ ...payload, whatsapp_number: "" }))).status).toBe(200);
    expect(mocks.upsert).toHaveBeenCalledWith(expect.objectContaining({ whatsapp_number: null }), { onConflict: "id" });
  });
  it("does not erase a saved number when an older caller omits the field", async () => {
    const { whatsapp_number: omitted, ...legacy } = payload;
    void omitted;
    await PUT(request(legacy));
    expect(mocks.upsert.mock.calls[0][0]).not.toHaveProperty("whatsapp_number");
  });
  it("reports the setup step and preserves failures without publishing stale content", async () => {
    mocks.upsert.mockResolvedValue({ error: { code: "PGRST204", message: "Could not find whatsapp_number" } });
    const response = await PUT(request());
    expect(response.status).toBe(503);
    expect((await response.json()).message).toContain("202611240001_contact_whatsapp.sql");
    expect(mocks.revalidateAdminPaths).not.toHaveBeenCalled();
  });
});
