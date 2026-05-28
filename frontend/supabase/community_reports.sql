-- Run this in Supabase SQL Editor (after profiles.sql)
-- Community incident reports with optional evidence images and geolocation.

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles (id) on delete set null,
  report_type text not null default 'other',
  details text not null,
  evidence_url text,
  hide_identity boolean not null default false,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now(),
  constraint community_reports_report_type_check check (
    report_type in (
      'medical_emergency',
      'fire_hazard',
      'crime_security',
      'traffic_incident',
      'utilities',
      'disaster',
      'other'
    )
  )
);

create index if not exists community_reports_created_at_idx
  on public.community_reports (created_at desc);

create index if not exists community_reports_report_type_idx
  on public.community_reports (report_type);

alter table public.community_reports disable row level security;

grant select, insert on public.community_reports to anon;
grant select, insert on public.community_reports to authenticated;

-- If table already exists without report_type, run this block:
-- alter table public.community_reports
--   add column if not exists report_type text not null default 'other';
-- alter table public.community_reports
--   drop constraint if exists community_reports_report_type_check;
-- alter table public.community_reports
--   add constraint community_reports_report_type_check check (
--     report_type in (
--       'medical_emergency',
--       'fire_hazard',
--       'crime_security',
--       'traffic_incident',
--       'utilities',
--       'disaster',
--       'other'
--     )
--   );

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
