create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  bio text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username is null or username ~ '^[a-z0-9_]{3,24}$')
);
create table if not exists public.pulses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 280),
  created_at timestamptz not null default now()
);
create table if not exists public.resonances (
  id uuid primary key default gen_random_uuid(),
  pulse_id uuid not null references public.pulses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (pulse_id, user_id)
);
create index if not exists pulses_created_at_idx on public.pulses (created_at desc);
create index if not exists pulses_user_id_idx on public.pulses (user_id);
create index if not exists resonances_pulse_id_idx on public.resonances (pulse_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, 'usuario'), '@', 1)), new.raw_user_meta_data ->> 'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.pulses enable row level security;
alter table public.resonances enable row level security;
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant select on public.pulses to anon, authenticated;
grant insert, delete on public.pulses to authenticated;
grant select on public.resonances to anon, authenticated;
grant insert, delete on public.resonances to authenticated;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable" on public.profiles for select using (true);
drop policy if exists "Users can create own profile" on public.profiles;
create policy "Users can create own profile" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "Pulses are publicly readable" on public.pulses;
create policy "Pulses are publicly readable" on public.pulses for select using (true);
drop policy if exists "Users can emit own pulses" on public.pulses;
create policy "Users can emit own pulses" on public.pulses for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users can delete own pulses" on public.pulses;
create policy "Users can delete own pulses" on public.pulses for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Resonances are publicly readable" on public.resonances;
create policy "Resonances are publicly readable" on public.resonances for select using (true);
drop policy if exists "Users can resonate as themselves" on public.resonances;
create policy "Users can resonate as themselves" on public.resonances for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users can remove own resonances" on public.resonances;
create policy "Users can remove own resonances" on public.resonances for delete to authenticated using ((select auth.uid()) = user_id);