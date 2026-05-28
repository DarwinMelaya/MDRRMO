-- Run this in Supabase SQL Editor (after profiles.sql)
-- Community incident reports with optional evidence images and geolocation.

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles (id) on delete set null,
  details text not null,
  evidence_url text,
  hide_identity boolean not null default false,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now()
);

create index if not exists community_reports_created_at_idx
  on public.community_reports (created_at desc);

alter table public.community_reports disable row level security;

grant select, insert on public.community_reports to anon;
grant select, insert on public.community_reports to authenticated;

-- Storage bucket for report evidence images (public read for admin/community feed later).
insert into storage.buckets (id, name, public)
values ('report-evidence', 'report-evidence', true)
on conflict (id) do nothing;

create policy "anon upload report evidence"
on storage.objects
for insert
to anon
with check (bucket_id = 'report-evidence');

create policy "public read report evidence"
on storage.objects
for select
to public
using (bucket_id = 'report-evidence');
