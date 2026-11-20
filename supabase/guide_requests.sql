create extension if not exists pgcrypto;
create table if not exists public.guide_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  destination text not null,
  guide text,
  date date,
  guests integer not null default 1 check (guests between 1 and 30),
  language text,
  notes text,
  status text not null default 'new' check (status in ('new','reviewing','accepted','completed','rejected'))
);
alter table public.guide_requests enable row level security;
-- No public policies: all access is through the server API using the service-role key.
