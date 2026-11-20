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
set search_path = pg_catalog
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;

drop trigger if exists guide_requests_set_updated_at on public.guide_requests;
create trigger guide_requests_set_updated_at
before update on public.guide_requests
for each row execute function public.set_updated_at();

-- The API uses the public anon key, but RLS accepts requests only when
-- the server-only X-Via-Local-DB-Secret header matches this stored hash.
-- Never put VIA_LOCAL_DB_SECRET in browser/client code.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.via_local_backend_config (
  singleton boolean primary key default true check (singleton = true),
  secret_hash text not null,
  created_at timestamptz not null default now()
);
alter table private.via_local_backend_config enable row level security;
revoke all on table private.via_local_backend_config from public, anon, authenticated, service_role;

insert into private.via_local_backend_config (singleton, secret_hash)
values (true, '2db2064fd8215bedb17e9bc80c6301316d24750eef24abab7f97a5c12cf29b80')
on conflict (singleton) do update
set secret_hash = excluded.secret_hash;

drop policy if exists "VIA LOCAL backend select" on public.guide_requests;
drop policy if exists "VIA LOCAL backend insert" on public.guide_requests;
drop policy if exists "VIA LOCAL backend update" on public.guide_requests;
drop policy if exists "VIA LOCAL backend delete" on public.guide_requests;
drop function if exists public.via_local_backend_authorized();

create or replace function private.via_local_backend_authorized()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $function$
  select coalesce(
    encode(
      extensions.digest(
        coalesce(
          nullif(current_setting('request.headers', true), '')::jsonb ->> 'x-via-local-db-secret',
          ''
        ),
        'sha256'
      ),
      'hex'
    ) = (
      select config.secret_hash
      from private.via_local_backend_config as config
      where config.singleton = true
    ),
    false
  );
$function$;

revoke all on function private.via_local_backend_authorized() from public, authenticated;
grant usage on schema private to anon;
grant execute on function private.via_local_backend_authorized() to anon;
grant select, insert, update, delete on table public.guide_requests to anon;

create policy "VIA LOCAL backend select"
on public.guide_requests for select to anon
using ((select private.via_local_backend_authorized()));

create policy "VIA LOCAL backend insert"
on public.guide_requests for insert to anon
with check ((select private.via_local_backend_authorized()));

create policy "VIA LOCAL backend update"
on public.guide_requests for update to anon
using ((select private.via_local_backend_authorized()))
with check ((select private.via_local_backend_authorized()));

create policy "VIA LOCAL backend delete"
on public.guide_requests for delete to anon
using ((select private.via_local_backend_authorized()));
