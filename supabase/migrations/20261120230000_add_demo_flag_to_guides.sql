-- Add an explicit marker for fictional demonstration guide profiles.
alter table public.guides
  add column if not exists is_demo boolean not null default false;
