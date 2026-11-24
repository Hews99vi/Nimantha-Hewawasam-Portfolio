-- Optional contact channel. Existing rows and access policies remain unchanged.
alter table public.contact_section add column if not exists whatsapp_number text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.contact_section'::regclass
      and conname = 'contact_section_whatsapp_number_format'
  ) then
    alter table public.contact_section
      add constraint contact_section_whatsapp_number_format
      check (whatsapp_number is null or whatsapp_number ~ '^\+[1-9][0-9]{6,14}$');
  end if;
end $$;

comment on column public.contact_section.whatsapp_number is
  'Optional WhatsApp number in international +country-code format; null hides the public action.';
