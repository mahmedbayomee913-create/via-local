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


-- VIA LOCAL full travel marketplace schema
create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  city_ar text,
  city_en text,
  country_ar text,
  country_en text,
  category text not null default 'culture',
  description_ar text,
  description_en text,
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  family_friendly boolean not null default false,
  nature boolean not null default false,
  halal_options boolean not null default false,
  accessible boolean not null default false,
  accessibility_details jsonb not null default '{}'::jsonb,
  latitude double precision,
  longitude double precision,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  bio_ar text,
  bio_en text,
  city_ar text,
  city_en text,
  country_ar text,
  country_en text,
  languages text[] not null default '{}',
  specialties text[] not null default '{}',
  price numeric(12,2) not null default 0 check (price >= 0),
  currency text not null default 'USD',
  avatar_url text,
  verified boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null,
  title_en text not null,
  description_ar text,
  description_en text,
  destination_id uuid references public.destinations(id) on delete set null,
  guide_id uuid references public.guides(id) on delete set null,
  duration_minutes integer not null default 120 check (duration_minutes between 15 and 2880),
  price numeric(12,2) not null default 0 check (price >= 0),
  currency text not null default 'USD',
  capacity integer not null default 10 check (capacity between 1 and 1000),
  schedule jsonb not null default '[]'::jsonb,
  accessible_features jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique default ('VL-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  destination_id uuid references public.destinations(id) on delete set null,
  experience_id uuid references public.experiences(id) on delete set null,
  guide_id uuid references public.guides(id) on delete set null,
  booking_date date not null,
  guests integer not null default 1 check (guests between 1 and 30),
  unit_price numeric(12,2) not null default 0 check (unit_price >= 0),
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  currency text not null default 'USD',
  status text not null default 'pending'
    check (status in ('pending','accepted','confirmed','cancelled','completed','rejected')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.bookings add column if not exists user_id uuid references auth.users(id) on delete set null;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  destination_id uuid references public.destinations(id) on delete cascade,
  guide_id uuid references public.guides(id) on delete cascade,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  constraint reviews_target_required check (destination_id is not null or guide_id is not null)
);

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.itineraries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  city text not null,
  country text,
  days integer not null check (days between 1 and 30),
  budget numeric(12,2),
  currency text not null default 'USD',
  interests text[] not null default '{}',
  plan jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.passport_visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_id uuid not null references public.destinations(id) on delete cascade,
  visited_on date not null default current_date,
  note text,
  status text not null default 'submitted' check (status in ('submitted','verified','rejected')),
  points integer not null default 0 check (points >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null,
  title_en text not null,
  body_ar text,
  body_en text,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.guide_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  country text,
  languages text[] not null default '{}',
  specialties text[] not null default '{}',
  bio text,
  status text not null default 'pending' check (status in ('pending','reviewing','approved','rejected')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_id uuid not null references public.destinations(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, destination_id)
);

create index if not exists destinations_published_idx on public.destinations (published, featured);
create index if not exists guides_published_idx on public.guides (published, verified);
create index if not exists experiences_published_idx on public.experiences (published, destination_id);
create index if not exists bookings_created_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists reviews_approved_idx on public.reviews (approved, created_at desc);
create index if not exists itineraries_user_idx on public.itineraries (user_id, created_at desc);
create index if not exists passport_user_idx on public.passport_visits (user_id, visited_on desc);
create index if not exists guide_applications_created_idx on public.guide_applications (created_at desc);
create index if not exists favorites_user_idx on public.user_favorites (user_id, created_at desc);

do $$
declare tbl text;
begin
  foreach tbl in array array['destinations','guides','experiences','bookings','user_profiles','content_pages','guide_applications'] loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', tbl, tbl);
    execute format('create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

do $$
declare tbl text;
begin
  foreach tbl in array array['destinations','guides','experiences','bookings','reviews','user_profiles','itineraries','passport_visits','content_pages','guide_applications','user_favorites'] loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('grant select, insert, update, delete on table public.%I to anon', tbl);
    execute format('drop policy if exists "VIA LOCAL server gate" on public.%I', tbl);
    execute format(
      'create policy "VIA LOCAL server gate" on public.%I for all to anon using ((select private.via_local_backend_authorized())) with check ((select private.via_local_backend_authorized()))',
      tbl
    );
  end loop;
end $$;
