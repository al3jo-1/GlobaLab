-- GlobalTradeLab — Supabase Schema Migration
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- =====================================================================
-- EXTENSIONS
-- =====================================================================
create extension if not exists "uuid-ossp";

-- =====================================================================
-- TABLES
-- =====================================================================

-- Users (mirrors Supabase Auth users)
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique,
  full_name    text,
  avatar_url   text,
  role         text not null default 'student' check (role in ('student', 'teacher')),
  plan         text default 'starter' check (plan in ('starter', 'professional', 'enterprise')),
  created_at   timestamptz not null default now()
);

-- Portfolios
create table if not exists public.portfolios (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  lab          text not null default 'trading' check (lab in ('trading', 'accounting', 'business')),
  balance      numeric not null default 10000,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique(user_id, lab)
);

-- Open Positions
create table if not exists public.positions (
  id             uuid primary key default uuid_generate_v4(),
  portfolio_id   uuid not null references public.portfolios(id) on delete cascade,
  symbol         text not null,
  quantity       numeric not null default 0,
  average_price  numeric not null default 0,
  current_price  numeric not null default 0,
  position_type  text not null default 'long' check (position_type in ('long', 'short')),
  leverage       text not null default '1:1',
  pnl            numeric not null default 0,
  opened_at      timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Watchlists
create table if not exists public.watchlists (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  name         text not null default 'Mi Watchlist',
  created_at   timestamptz not null default now()
);

create table if not exists public.watchlist_items (
  id           uuid primary key default uuid_generate_v4(),
  watchlist_id uuid not null references public.watchlists(id) on delete cascade,
  symbol       text not null,
  added_at     timestamptz not null default now(),
  unique(watchlist_id, symbol)
);

-- Paper Orders
create table if not exists public.paper_orders (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  portfolio_id uuid references public.portfolios(id) on delete cascade,
  symbol       text not null,
  side         text not null check (side in ('BUY', 'SELL')),
  order_type   text not null default 'MARKET' check (order_type in ('MARKET', 'LIMIT', 'STOP')),
  quantity     numeric not null,
  price        numeric,
  trigger_price numeric,
  status       text not null default 'pending' check (status in ('pending', 'executed', 'cancelled')),
  executed_at  timestamptz,
  created_at   timestamptz not null default now()
);

-- Transactions / Trade History
create table if not exists public.transactions (
  id           uuid primary key default uuid_generate_v4(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  symbol       text not null,
  quantity     numeric not null,
  price        numeric not null,
  total        numeric not null,
  type         text not null check (type in ('open_long', 'close_long', 'open_short', 'close_short')),
  pnl          numeric default 0,
  created_at   timestamptz not null default now()
);

-- Asset Price Cache (updated by backend)
create table if not exists public.asset_cache (
  symbol         text primary key,
  price          numeric not null default 0,
  change_percent numeric not null default 0,
  updated_at     timestamptz not null default now()
);

-- Classroom Rooms
create table if not exists public.rooms (
  id           uuid primary key default uuid_generate_v4(),
  teacher_id   uuid not null references public.profiles(id) on delete cascade,
  name         text not null,
  class_code   text not null unique,
  lab          text not null default 'trading' check (lab in ('trading', 'accounting', 'business')),
  max_students integer not null default 10,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.room_members (
  id           uuid primary key default uuid_generate_v4(),
  room_id      uuid not null references public.rooms(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  joined_at    timestamptz not null default now(),
  unique(room_id, user_id)
);

-- Market Subscriptions (tracking active symbols)
create table if not exists public.market_subscriptions (
  symbol              text primary key,
  subscribers_count   integer not null default 0,
  updated_at          timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

alter table public.profiles          enable row level security;
alter table public.portfolios        enable row level security;
alter table public.positions         enable row level security;
alter table public.watchlists        enable row level security;
alter table public.watchlist_items   enable row level security;
alter table public.paper_orders      enable row level security;
alter table public.transactions      enable row level security;
alter table public.asset_cache       enable row level security;
alter table public.rooms             enable row level security;
alter table public.room_members      enable row level security;

-- Profiles: users see only their own, teachers can see students in their rooms
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Portfolios: own only
create policy "portfolios_own" on public.portfolios
  for all using (auth.uid() = user_id);

-- Positions: via portfolio ownership
create policy "positions_own" on public.positions
  for all using (
    portfolio_id in (select id from public.portfolios where user_id = auth.uid())
  );

-- Watchlists: own only
create policy "watchlists_own" on public.watchlists
  for all using (auth.uid() = user_id);

create policy "watchlist_items_own" on public.watchlist_items
  for all using (
    watchlist_id in (select id from public.watchlists where user_id = auth.uid())
  );

-- Paper orders: own only
create policy "paper_orders_own" on public.paper_orders
  for all using (auth.uid() = user_id);

-- Transactions: via portfolio
create policy "transactions_own" on public.transactions
  for all using (
    portfolio_id in (select id from public.portfolios where user_id = auth.uid())
  );

-- Asset cache: readable by all authenticated users, writable by service role only
create policy "asset_cache_read" on public.asset_cache
  for select using (auth.role() = 'authenticated');

-- Rooms: teachers own theirs, students can read rooms they're in
create policy "rooms_teacher_own" on public.rooms
  for all using (auth.uid() = teacher_id);

create policy "rooms_member_read" on public.rooms
  for select using (
    id in (select room_id from public.room_members where user_id = auth.uid())
  );

create policy "room_members_own" on public.room_members
  for all using (auth.uid() = user_id);

-- =====================================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-create trading portfolio on profile creation
create or replace function public.handle_new_profile()
returns trigger language plpgsql security definer as $$
begin
  insert into public.portfolios (user_id, lab, balance)
  values (new.id, 'trading', 10000)
  on conflict (user_id, lab) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;
create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();

-- Updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger portfolios_updated_at before update on public.portfolios
  for each row execute procedure public.set_updated_at();
create trigger positions_updated_at before update on public.positions
  for each row execute procedure public.set_updated_at();
