create extension if not exists "pgcrypto";

create table if not exists admins (
  user_id uuid primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists site_intro (
  id text primary key,
  eyebrow text not null,
  headline_line_1 text not null,
  headline_line_2 text not null,
  intro_label text not null,
  intro_heading text not null,
  intro_body text not null,
  cta_label text not null,
  cta_href text not null,
  work_link_label text not null,
  work_link_href text not null
);

create table if not exists about_section (
  id text primary key,
  eyebrow text not null,
  title text not null,
  intro text not null,
  body text not null
);

create table if not exists contact_section (
  id text primary key,
  eyebrow text not null,
  title text not null,
  body text not null,
  email text not null,
  location text not null,
  availability text not null
);

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  label text not null,
  href text not null,
  icon_key text not null,
  is_active boolean not null default true
);

create table if not exists about_stats (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  label text not null,
  is_active boolean not null default true
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null,
  description text not null,
  fit text not null,
  icon_key text not null,
  is_active boolean not null default true
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  category text not null,
  title text not null,
  description text not null,
  role text not null,
  problem text not null,
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  is_active boolean not null default true
);

create table if not exists tech_groups (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null,
  icon_key text not null,
  is_active boolean not null default true
);

create table if not exists tech_group_items (
  id uuid primary key default gen_random_uuid(),
  tech_group_id uuid not null references tech_groups(id) on delete cascade,
  sort_order int not null default 0,
  label text not null
);

create table if not exists process_steps (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null,
  description text not null,
  is_active boolean not null default true
);

create table if not exists why_work_items (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null,
  description text not null,
  icon_key text not null,
  is_active boolean not null default true
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  quote text not null,
  name text not null,
  role text not null,
  is_active boolean not null default true
);

create table if not exists trusted_brands (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  name text not null,
  url text,
  logo_src text,
  industry text,
  is_active boolean not null default true
);

create table if not exists blog_settings (
  id text primary key,
  eyebrow text not null,
  title text not null,
  intro text not null,
  featured_title text not null,
  featured_intro text not null
);

create table if not exists blog_categories (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  name text not null,
  slug text not null unique,
  is_active boolean not null default true
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  cover_image text,
  content_markdown text not null,
  author_name text not null,
  reading_time text not null,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  is_featured boolean not null default false,
  is_published boolean not null default false
);

create table if not exists blog_post_categories (
  post_id uuid not null references blog_posts(id) on delete cascade,
  category_id uuid not null references blog_categories(id) on delete cascade,
  primary key (post_id, category_id)
);

create unique index if not exists projects_single_featured_idx
on projects ((is_featured))
where is_featured = true;

create unique index if not exists blog_posts_single_featured_idx
on blog_posts ((is_featured))
where is_featured = true;

alter table admins enable row level security;
alter table site_intro enable row level security;
alter table about_section enable row level security;
alter table contact_section enable row level security;
alter table social_links enable row level security;
alter table about_stats enable row level security;
alter table services enable row level security;
alter table projects enable row level security;
alter table tech_groups enable row level security;
alter table tech_group_items enable row level security;
alter table process_steps enable row level security;
alter table why_work_items enable row level security;
alter table testimonials enable row level security;
alter table trusted_brands enable row level security;
alter table blog_settings enable row level security;
alter table blog_categories enable row level security;
alter table blog_posts enable row level security;
alter table blog_post_categories enable row level security;

create or replace function is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where user_id = auth.uid()
  );
$$;

drop policy if exists "public read site_intro" on site_intro;
create policy "public read site_intro" on site_intro for select using (true);
drop policy if exists "public read about_section" on about_section;
create policy "public read about_section" on about_section for select using (true);
drop policy if exists "public read contact_section" on contact_section;
create policy "public read contact_section" on contact_section for select using (true);
drop policy if exists "public read social_links" on social_links;
create policy "public read social_links" on social_links for select using (is_active = true);
drop policy if exists "public read about_stats" on about_stats;
create policy "public read about_stats" on about_stats for select using (is_active = true);
drop policy if exists "public read services" on services;
create policy "public read services" on services for select using (is_active = true);
drop policy if exists "public read projects" on projects;
create policy "public read projects" on projects for select using (is_active = true);
drop policy if exists "public read tech_groups" on tech_groups;
create policy "public read tech_groups" on tech_groups for select using (is_active = true);
drop policy if exists "public read tech_group_items" on tech_group_items;
create policy "public read tech_group_items" on tech_group_items for select using (true);
drop policy if exists "public read process_steps" on process_steps;
create policy "public read process_steps" on process_steps for select using (is_active = true);
drop policy if exists "public read why_work_items" on why_work_items;
create policy "public read why_work_items" on why_work_items for select using (is_active = true);
drop policy if exists "public read testimonials" on testimonials;
create policy "public read testimonials" on testimonials for select using (is_active = true);
drop policy if exists "public read trusted_brands" on trusted_brands;
create policy "public read trusted_brands" on trusted_brands for select using (is_active = true);
drop policy if exists "public read blog_settings" on blog_settings;
create policy "public read blog_settings" on blog_settings for select using (true);
drop policy if exists "public read blog_categories" on blog_categories;
create policy "public read blog_categories" on blog_categories for select using (is_active = true);
drop policy if exists "public read blog_posts" on blog_posts;
create policy "public read blog_posts" on blog_posts for select using (is_published = true);
drop policy if exists "public read blog_post_categories" on blog_post_categories;
create policy "public read blog_post_categories" on blog_post_categories for select using (
  exists (
    select 1
    from blog_posts
    where blog_posts.id = blog_post_categories.post_id
      and blog_posts.is_published = true
  )
);

drop policy if exists "admins read own row" on admins;
create policy "admins read own row" on admins
for select
using (auth.uid() = user_id or is_admin_user());

drop policy if exists "admins manage admins" on admins;
create policy "admins manage admins" on admins
for all
using (is_admin_user())
with check (is_admin_user());

drop policy if exists "admins manage site_intro" on site_intro;
create policy "admins manage site_intro" on site_intro for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage about_section" on about_section;
create policy "admins manage about_section" on about_section for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage contact_section" on contact_section;
create policy "admins manage contact_section" on contact_section for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage social_links" on social_links;
create policy "admins manage social_links" on social_links for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage about_stats" on about_stats;
create policy "admins manage about_stats" on about_stats for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage services" on services;
create policy "admins manage services" on services for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage projects" on projects;
create policy "admins manage projects" on projects for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage tech_groups" on tech_groups;
create policy "admins manage tech_groups" on tech_groups for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage tech_group_items" on tech_group_items;
create policy "admins manage tech_group_items" on tech_group_items for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage process_steps" on process_steps;
create policy "admins manage process_steps" on process_steps for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage why_work_items" on why_work_items;
create policy "admins manage why_work_items" on why_work_items for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage testimonials" on testimonials;
create policy "admins manage testimonials" on testimonials for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage trusted_brands" on trusted_brands;
create policy "admins manage trusted_brands" on trusted_brands for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage blog_settings" on blog_settings;
create policy "admins manage blog_settings" on blog_settings for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage blog_categories" on blog_categories;
create policy "admins manage blog_categories" on blog_categories for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage blog_posts" on blog_posts;
create policy "admins manage blog_posts" on blog_posts for all using (is_admin_user()) with check (is_admin_user());
drop policy if exists "admins manage blog_post_categories" on blog_post_categories;
create policy "admins manage blog_post_categories" on blog_post_categories for all using (is_admin_user()) with check (is_admin_user());
