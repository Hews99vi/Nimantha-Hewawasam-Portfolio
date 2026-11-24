import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { afterAll, describe, expect, it } from "vitest";
const db = new PGlite();
const migration = readFileSync("supabase/migrations/202611240001_contact_whatsapp.sql", "utf8");
afterAll(() => db.close());
describe("optional WhatsApp migration", () => {
  it("preserves legacy content and row security, and is repeatable", async () => {
    await db.exec("create table contact_section(id text primary key,email text not null);alter table contact_section enable row level security;insert into contact_section values('contact-section','existing@example.test');");
    await db.exec(migration);
    expect((await db.query("select * from contact_section")).rows).toEqual([{ id: "contact-section", email: "existing@example.test", whatsapp_number: null }]);
    await db.exec("update contact_section set whatsapp_number='+94771234567'");
    await db.exec(migration);
    expect((await db.query("select whatsapp_number from contact_section")).rows).toEqual([{ whatsapp_number: "+94771234567" }]);
    expect((await db.query("select relrowsecurity from pg_class where oid='contact_section'::regclass")).rows).toEqual([{ relrowsecurity: true }]);
  });
  it("rejects invalid stored formats and supports clearing", async () => {
    await expect(db.exec("update contact_section set whatsapp_number='0771234567'")).rejects.toThrow();
    await db.exec("update contact_section set whatsapp_number=null");
    expect((await db.query("select whatsapp_number from contact_section")).rows).toEqual([{ whatsapp_number: null }]);
  });
});
