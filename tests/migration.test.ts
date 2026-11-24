import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
const db = new PGlite();
const project = "11111111-1111-4111-8111-111111111111";
const admin = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
beforeAll(async () => {
  await db.exec(`create role authenticated; create role anon; create schema auth; create schema storage;
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;
    create function storage.foldername(name text) returns text[] language sql immutable as $$select string_to_array(name,'/')$$;`);
  await db.exec(
    readFileSync("supabase/schema.sql", "utf8").replace(
      'create extension if not exists "pgcrypto";',
      "",
    ),
  );
  await db.exec(`grant usage on schema public,storage,auth to authenticated,anon;grant select,insert,update,delete on all tables in schema public,storage to authenticated,anon;
    insert into admins(user_id,email) values('${admin}','admin@example.test');
    insert into projects(id,title,category,description,role,problem,is_featured) values('${project}','Gallery test','Web','Test fixture','Developer','Test',true);`);
});
afterAll(async () => {
  await db.close();
});
describe("additive gallery migration", () => {
  it("can be applied again without changing a saved slug", async () => {
    await db.exec(
      readFileSync(
        "supabase/migrations/202610270001_project_galleries.sql",
        "utf8",
      ),
    );
    const { rows } = await db.query<{ slug: string }>(
      `update projects set title='New title' where id='${project}' returning slug`,
    );
    expect(rows[0].slug).toBe("gallery-test");
  });
  it("generates unique stable URLs and changes featured projects atomically", async () => {
    await db.exec(
      `insert into projects(title,category,description,role,problem,is_featured) values('Gallery test','Web','Test','Developer','Test',true)`,
    );
    const { rows } = await db.query<{ slug: string; is_featured: boolean }>(
      "select slug,is_featured from projects order by slug",
    );
    expect(new Set(rows.map((row) => row.slug)).size).toBe(2);
    expect(rows.filter((row) => row.is_featured)).toHaveLength(1);
  });
  it("deactivates only unchanged shipped feedback examples", async () => {
    await db.exec(`insert into testimonials(id,sort_order,quote,name,role,is_active) values
      ('99999999-9999-4999-8999-999999999991',1,'Nimantha understood the project clearly and delivered a clean, working system with the features we needed.','Client Name','Business Owner',true),
      ('99999999-9999-4999-8999-999999999992',2,'A real edited customer quotation.','Actual customer','Startup Founder',true)`);
    await db.exec(
      readFileSync(
        "supabase/migrations/202610270001_project_galleries.sql",
        "utf8",
      ),
    );
    const { rows } = await db.query<{ id: string; is_active: boolean }>(
      "select id,is_active from testimonials order by sort_order",
    );
    expect(rows.map((row) => row.is_active)).toEqual([false, true]);
  });
  it("rejects cross-project image references at the database boundary", async () => {
    const images = JSON.stringify([
      {
        storage_path: `22222222-2222-4222-8222-222222222222/${admin}.png`,
        alt: "Test",
        caption: "",
        width: 3200,
        height: 1800,
        size: 500,
      },
    ]);
    await expect(
      db.query("update projects set images=$1 where id=$2", [images, project]),
    ).rejects.toThrow();
  });
  it("enforces admin uploads and protects referenced originals from deletion", async () => {
    const path = `${project}/${admin}.png`;
    await db.exec(
      `set role authenticated;select set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',false);`,
    );
    await expect(
      db.query(
        "insert into storage.objects(bucket_id,name) values('project-images',$1)",
        [path],
      ),
    ).rejects.toThrow();
    await db.exec(
      `select set_config('request.jwt.claim.sub','${admin}',false);`,
    );
    await db.query(
      "insert into storage.objects(bucket_id,name) values('project-images',$1)",
      [path],
    );
    const image = JSON.stringify([
      {
        storage_path: path,
        alt: "Test screenshot",
        caption: "",
        width: 3200,
        height: 1800,
        size: 500,
      },
    ]);
    await db.query("update projects set images=$1 where id=$2", [
      image,
      project,
    ]);
    const blocked = await db.query(
      "delete from storage.objects where name=$1 returning name",
      [path],
    );
    expect(blocked.rows).toHaveLength(0);
    await db.query("update projects set images='[]' where id=$1", [project]);
    const removed = await db.query(
      "delete from storage.objects where name=$1 returning name",
      [path],
    );
    expect(removed.rows).toHaveLength(1);
    await db.exec("reset role");
  });
});
