-- Run this in Supabase SQL Editor
-- Creates a simple "profiles" table for database-only signup/login (no Supabase Auth).
-- Role values are used by frontend routing logic:
--   Admin -> /admin/dashboard
--   Community, Agencies -> /

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password text not null,
  role text not null check (role in ('Admin', 'Community', 'Agencies')),
  created_at timestamptz not null default now()
);

-- Ensure case-insensitive unique email, matching frontend normalization.
create unique index if not exists profiles_email_lower_unique
on public.profiles (lower(email));

-- IMPORTANT:
-- Signup + login from browser (anon key) requires insert + select access.
-- Option 1 (simplest for development): disable RLS.
alter table public.profiles disable row level security;

-- Option 2 (production): comment the line above and use explicit RLS policies:
-- alter table public.profiles enable row level security;
-- create policy "allow anonymous insert" on public.profiles
-- for insert
-- to anon
-- with check (true);
--
-- create policy "allow anonymous select for login" on public.profiles
-- for select
-- to anon
-- using (true);
