-- Run this in Supabase SQL Editor
-- Creates a simple "profiles" table for database-only signup/login (no Supabase Auth).

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password text not null,
  role text not null check (role in ('Admin', 'Community', 'Agencies')),
  created_at timestamptz not null default now()
);

-- IMPORTANT:
-- If you want inserts from the browser using the anon key WITHOUT auth,
-- you must either disable RLS or create a permissive policy.
alter table public.profiles disable row level security;

-- If you'd rather keep RLS enabled, comment the line above and use this instead:
-- alter table public.profiles enable row level security;
-- create policy "allow anonymous insert" on public.profiles
-- for insert
-- to anon
-- with check (true);
