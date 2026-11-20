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
  status text not null default 'new'
    check (status in ('new','reviewing','accepted','completed','rejected'))
);

create index if not exists guide_requests_created_at_idx
  on public.guide_requests (created_at desc);
create index if not exists guide_requests_status_idx
  on public.guide_requests (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guide_requests_set_updated_at on public.guide_requests;
create trigger guide_requests_set_updated_at
before update on public.guide_requests
for each row execute function public.set_updated_at();

alter table public.guide_requests enable row level security;
-- No public policies: all access is through the server API using the service-role key.
