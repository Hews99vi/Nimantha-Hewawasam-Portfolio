-- Transactional CMS mutations. No existing content, grants on tables, or RLS policies are replaced.
begin;

create or replace function public.save_portfolio_blog_post(p_id uuid, p_post jsonb, p_category_ids uuid[])
returns jsonb language plpgsql security invoker set search_path = public as $$
declare saved public.blog_posts%rowtype; categories uuid[] := coalesce(p_category_ids, '{}'::uuid[]);
begin
  if not public.is_admin_user() then raise exception 'Admin access required' using errcode = '42501'; end if;
  if jsonb_typeof(p_post) is distinct from 'object' or cardinality(categories) > 100
    or exists(select 1 from unnest(categories) id group by id having count(*) > 1)
    or exists(select 1 from unnest(categories) id where id is null)
    or (select count(*) from public.blog_categories where id = any(categories)) <> cardinality(categories)
    or coalesce((p_post->>'sort_order')::int, -1) < 0
    or coalesce(p_post->>'slug', '') !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    or coalesce(p_post->>'title', '') = ''
    or ((p_post->>'is_published')::boolean and p_post->>'published_at' is null)
    then raise exception 'Invalid article or categories' using errcode = '22023'; end if;
  -- A single transaction lock serializes feature selection, including concurrent creates.
  perform pg_advisory_xact_lock(hashtext('portfolio-blog-save'));
  if p_id is not null then
    select * into saved from public.blog_posts where id = p_id for update;
    if not found then raise exception 'Article not found' using errcode = 'P0002'; end if;
  end if;
  if (p_post->>'is_featured')::boolean then
    update public.blog_posts set is_featured = false where is_featured and (p_id is null or id <> p_id);
  end if;
  if p_id is null then
    insert into public.blog_posts(sort_order,title,slug,excerpt,cover_image,content_markdown,author_name,reading_time,published_at,seo_title,seo_description,is_featured,is_published)
    values ((p_post->>'sort_order')::int,p_post->>'title',p_post->>'slug',p_post->>'excerpt',p_post->>'cover_image',p_post->>'content_markdown',p_post->>'author_name',p_post->>'reading_time',(p_post->>'published_at')::timestamptz,p_post->>'seo_title',p_post->>'seo_description',(p_post->>'is_featured')::boolean,(p_post->>'is_published')::boolean)
    returning * into saved;
  else
    update public.blog_posts set sort_order=(p_post->>'sort_order')::int,title=p_post->>'title',slug=p_post->>'slug',excerpt=p_post->>'excerpt',cover_image=p_post->>'cover_image',content_markdown=p_post->>'content_markdown',author_name=p_post->>'author_name',reading_time=p_post->>'reading_time',published_at=(p_post->>'published_at')::timestamptz,seo_title=p_post->>'seo_title',seo_description=p_post->>'seo_description',is_featured=(p_post->>'is_featured')::boolean,is_published=(p_post->>'is_published')::boolean
    where id=p_id returning * into saved;
  end if;
  delete from public.blog_post_categories where post_id = saved.id;
  insert into public.blog_post_categories(post_id,category_id) select saved.id, id from unnest(categories) id;
  return to_jsonb(saved) || jsonb_build_object('category_ids', to_jsonb(categories));
end $$;

create or replace function public.reorder_portfolio_collection(p_collection text, p_items jsonb)
returns void language plpgsql security invoker set search_path = public as $$
declare expected int; matched int; changed int;
begin
  if not public.is_admin_user() then raise exception 'Admin access required' using errcode = '42501'; end if;
  if p_collection not in ('social_links','about_stats','services','projects','blog_categories','blog_posts','tech_groups','tech_group_items','process_steps','why_work_items','testimonials','trusted_brands')
    or p_collection is null or jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'Invalid collection or items' using errcode = '22023'; end if;
  expected := jsonb_array_length(p_items);
  if expected > 1000 or exists(select 1 from jsonb_to_recordset(p_items) as x(id uuid,sort_order int) where id is null or sort_order is null or sort_order < 0)
    or (select count(distinct id) from jsonb_to_recordset(p_items) as x(id uuid,sort_order int)) <> expected then
    raise exception 'Invalid order' using errcode = '22023'; end if;
  perform pg_advisory_xact_lock(hashtext('portfolio-order-' || p_collection));
  execute format('select count(*) from public.%I where id in (select id from jsonb_to_recordset($1) as x(id uuid,sort_order int))', p_collection) into matched using p_items;
  if matched <> expected then raise exception 'Item not found' using errcode = 'P0002'; end if;
  execute format('update public.%I t set sort_order=x.sort_order from jsonb_to_recordset($1) as x(id uuid,sort_order int) where t.id=x.id', p_collection) using p_items;
  get diagnostics changed = row_count;
  if changed <> expected then raise exception 'Order changed concurrently' using errcode = 'P0002'; end if;
end $$;

revoke all on function public.save_portfolio_blog_post(uuid,jsonb,uuid[]) from public, anon;
revoke all on function public.reorder_portfolio_collection(text,jsonb) from public, anon;
grant execute on function public.save_portfolio_blog_post(uuid,jsonb,uuid[]) to authenticated;
grant execute on function public.reorder_portfolio_collection(text,jsonb) to authenticated;
commit;
