import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
const db = new PGlite();
const admin = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const category = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const first = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const second = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const content = { sort_order: 1, title: "Changed", slug: "second", excerpt: "Excerpt", cover_image: null, content_markdown: "Text", author_name: "Author", reading_time: "1 min", published_at: "2026-11-24T00:00:00Z", seo_title: null, seo_description: null, is_featured: true, is_published: true };
beforeAll(async () => {
  await db.exec(`create role anon; create role authenticated; create schema auth; create schema storage;
  create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
  create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
  create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;
  create function storage.foldername(name text) returns text[] language sql immutable as $$select string_to_array(name,'/')$$;`);
  await db.exec(readFileSync("supabase/schema.sql", "utf8").replace('create extension if not exists "pgcrypto";', ""));
  await db.exec(`grant usage on schema public,auth to anon,authenticated; grant select,insert,update,delete on all tables in schema public to anon,authenticated;
  insert into admins(user_id,email) values('${admin}','admin@example.test');
  insert into blog_categories(id,name,slug) values('${category}','Test','test');
  insert into blog_posts(id,title,slug,excerpt,content_markdown,author_name,reading_time,is_featured) values
  ('${first}','First','first','Excerpt','Text','Author','1 min',true),('${second}','Second','second','Excerpt','Text','Author','1 min',false);
  insert into blog_post_categories values('${first}','${category}');`);
});
afterAll(async () => db.close());
async function asAdmin() { await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub','${admin}',false);`); }
async function snapshot() { return (await db.query("select id,title,slug,is_featured,sort_order from blog_posts order by id")).rows; }
describe("transactional CMS migration", () => {
  it("can be applied repeatedly without rewriting content", async () => {
    const before = await snapshot();
    await db.exec(readFileSync("supabase/migrations/202611240002_admin_integrity.sql", "utf8"));
    expect(await snapshot()).toEqual(before);
  });
  it("denies anonymous and authenticated non-admin RPC calls", async () => {
    await db.exec("set role anon");
    await expect(db.query("select save_portfolio_blog_post(null,$1,'{}')", [JSON.stringify(content)])).rejects.toThrow();
    await db.exec("set role authenticated; select set_config('request.jwt.claim.sub','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',false)");
    await expect(db.query("select reorder_portfolio_collection('blog_posts','[]')")).rejects.toThrow("Admin access required");
    await db.exec("reset role");
  });
  it("rolls back feature clearing when a new slug conflicts", async () => {
    await asAdmin();
    const before = await snapshot();
    await expect(db.query("select save_portfolio_blog_post(null,$1,$2)", [JSON.stringify(content), [category]])).rejects.toThrow();
    expect(await snapshot()).toEqual(before);
  });
  it("rolls back the post and mappings when an insert fails after deleting mappings", async () => {
    await db.exec("reset role");
    await db.exec(`create function reject_mapping() returns trigger language plpgsql as $$begin raise exception 'Forced mapping failure';end$$;
    create trigger reject_mapping before insert on blog_post_categories for each row execute function reject_mapping();`);
    await asAdmin();
    const before = await snapshot();
    await expect(db.query("select save_portfolio_blog_post($1,$2,$3)", [first, JSON.stringify({ ...content, slug: 'first' }), [category]])).rejects.toThrow("Forced mapping failure");
    expect(await snapshot()).toEqual(before);
    expect((await db.query("select * from blog_post_categories where post_id=$1", [first])).rows).toHaveLength(1);
    await db.exec("reset role; drop trigger reject_mapping on blog_post_categories; drop function reject_mapping();");
  });
  it("saves categories, publication and featured selection together", async () => {
    await asAdmin();
    const result = await db.query<{ result: { category_ids: string[] } }>("select save_portfolio_blog_post($1,$2,$3) as result", [second, JSON.stringify(content), [category]]);
    expect(result.rows[0].result.category_ids).toEqual([category]);
    expect((await db.query("select id from blog_posts where is_featured")).rows).toEqual([{ id: second }]);
  });
  it("rejects invalid or duplicate categories without changing a post", async () => {
    const before = await snapshot();
    for (const ids of [[category, category], ['eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee']])
      await expect(db.query("select save_portfolio_blog_post($1,$2,$3)", [second, JSON.stringify(content), ids])).rejects.toThrow();
    expect(await snapshot()).toEqual(before);
  });
  it("validates a complete reorder before changing any item", async () => {
    const before = await snapshot();
    for (const items of [[{ id: first, sort_order: 8 }, { id: admin, sort_order: 9 }], [{ id: first, sort_order: 8 }, { id: first, sort_order: 9 }]])
      await expect(db.query("select reorder_portfolio_collection('blog_posts',$1)", [JSON.stringify(items)])).rejects.toThrow();
    expect(await snapshot()).toEqual(before);
    await expect(db.query("select reorder_portfolio_collection('admins','[]')")).rejects.toThrow();
    await db.query("select reorder_portfolio_collection('blog_posts',$1)", [JSON.stringify([{ id: first, sort_order: 2 }, { id: second, sort_order: 1 }])]);
    expect((await db.query("select id from blog_posts order by sort_order")).rows).toEqual([{ id: second }, { id: first }]);
  });
});
