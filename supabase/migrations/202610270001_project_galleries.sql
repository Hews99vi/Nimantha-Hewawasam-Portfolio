begin;

alter table public.projects add column if not exists slug text;
alter table public.projects add column if not exists images jsonb not null default '[]'::jsonb;

-- Backfill without changing existing URLs on subsequent migration runs.
do $$
declare project record; candidate text; base text;
begin
  for project in select id, title from public.projects where slug is null order by sort_order, id loop
    base := trim(both '-' from regexp_replace(lower(replace(project.title, '''', '')), '[^a-z0-9]+', '-', 'g'));
    if base = '' then base := 'project'; end if;
    candidate := base;
    if exists(select 1 from public.projects where slug = candidate) then candidate := base || '-' || project.id::text; end if;
    update public.projects set slug = candidate where id = project.id;
  end loop;
end $$;
alter table public.projects alter column slug set not null;
create unique index if not exists projects_slug_idx on public.projects(slug);

create or replace function public.prepare_portfolio_project()
returns trigger language plpgsql set search_path = public as $$
declare base text;
begin
  if TG_OP = 'UPDATE' then
    new.slug := old.slug; -- A title edit must never break a shared project URL.
  elsif new.slug is null or new.slug = '' then
    base := trim(both '-' from regexp_replace(lower(replace(new.title, '''', '')), '[^a-z0-9]+', '-', 'g'));
    if base = '' then base := 'project'; end if;
    perform pg_advisory_xact_lock(hashtext('portfolio-project-slugs'));
    new.slug := base;
    if exists(select 1 from public.projects where slug = new.slug) then new.slug := base || '-' || new.id::text; end if;
  end if;
  if new.is_featured and (TG_OP = 'INSERT' or not old.is_featured) then
    perform pg_advisory_xact_lock(hashtext('portfolio-featured-project'));
    update public.projects set is_featured = false where is_featured and id <> new.id;
  end if;
  return new;
end $$;
drop trigger if exists prepare_portfolio_project on public.projects;
create trigger prepare_portfolio_project before insert or update on public.projects
for each row execute function public.prepare_portfolio_project();

create or replace function public.valid_portfolio_images(value jsonb, project_id uuid)
returns boolean language plpgsql immutable set search_path = public as $$
declare image jsonb; seen text[] := '{}'; path text;
begin
  if jsonb_typeof(value) <> 'array' then return false; end if;
  if jsonb_array_length(value) > 10 then return false; end if;
  for image in select * from jsonb_array_elements(value) loop
    path := image->>'storage_path';
    if path is null or path !~ ('^' || project_id::text || '/[0-9a-f-]{36}\.(png|jpg|jpeg|webp)$')
      or path = any(seen) or coalesce(length(trim(image->>'alt')), 0) = 0
      or coalesce(length(image->>'alt'), 0) > 500 or coalesce(length(image->>'caption'), 0) > 2000
      or coalesce((image->>'width')::int, 0) not between 1 and 50000
      or coalesce((image->>'height')::int, 0) not between 1 and 50000
      or coalesce((image->>'size')::bigint, 0) not between 1 and 20971520 then return false; end if;
    seen := array_append(seen, path);
  end loop;
  return true;
exception when others then return false;
end $$;
alter table public.projects drop constraint if exists projects_images_valid;
alter table public.projects add constraint projects_images_valid check (public.valid_portfolio_images(images, id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 20971520, array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins upload project images" on storage.objects;
create policy "admins upload project images" on storage.objects for insert to authenticated with check (
  bucket_id = 'project-images' and public.is_admin_user()
  and exists(select 1 from public.projects p where p.id::text = (storage.foldername(name))[1])
  and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(png|jpg|jpeg|webp)$'
);
drop policy if exists "admins inspect project images" on storage.objects;
create policy "admins inspect project images" on storage.objects for select to authenticated
using (bucket_id = 'project-images' and public.is_admin_user());
drop policy if exists "admins remove unused project images" on storage.objects;
create policy "admins remove unused project images" on storage.objects for delete to authenticated using (
  bucket_id = 'project-images' and public.is_admin_user()
  and not exists(select 1 from public.projects p, jsonb_array_elements(p.images) image where image->>'storage_path' = name)
);
-- Originals are immutable: replacement uploads receive a new random object name.

alter table public.testimonials alter column is_active set default false;
-- Exact shipped examples only. Edited or real feedback is deliberately preserved.
update public.testimonials t set is_active = false
from (values
 ('99999999-9999-4999-8999-999999999991'::uuid, 'Client Name', 'Business Owner', 'Nimantha understood the project clearly and delivered a clean, working system with the features we needed.'),
 ('99999999-9999-4999-8999-999999999992'::uuid, 'Client Name', 'Startup Founder', 'The communication was smooth, and the final result looked professional and easy to manage.'),
 ('99999999-9999-4999-8999-999999999993'::uuid, 'Project Supervisor', 'Academic Platform', 'He was able to turn the idea into a real digital product with proper structure and practical features.')
) as example(id, name, role, quote)
where t.id = example.id and t.name = example.name and t.role = example.role and t.quote = example.quote;
commit;
