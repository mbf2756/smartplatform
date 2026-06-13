-- ─────────────────────────────────────────────────────────────────────────────
-- SmartPlatform — Supabase Schema
-- Shared database for SmartETF (smartetf.com.au) + SmartSuper (smartsuper.com.au)
-- Run this in the Supabase SQL editor.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ── Users (extends Supabase auth.users) ──────────────────────────────────────
create table if not exists public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  email           text not null,
  first_name      text,
  last_name       text,
  -- Subscription tier: free | pro | premium | bundle
  -- 'bundle' = SmartETF + SmartSuper full access
  -- 'pro' = single product Pro
  -- 'premium' = single product Premium
  tier            text not null default 'free'
                    check (tier in ('free','pro','premium','bundle')),
  -- Which products the user signed up through
  signup_source   text not null default 'smartetf'
                    check (signup_source in ('smartetf','smartsuper')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, signup_source)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'signup_source', 'smartetf')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Financial profiles ────────────────────────────────────────────────────────
create table if not exists public.financial_profiles (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  age           int not null default 35,
  annual_income bigint not null default 0,
  risk_profile  text not null default 'growth'
                  check (risk_profile in ('conservative','moderate','growth','aggressive')),
  monthly_contrib bigint not null default 0,
  retirement_goal_age int,
  fire_target   bigint,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id)
);

alter table public.financial_profiles enable row level security;
create policy "Users can manage own financial profile"
  on public.financial_profiles for all using (auth.uid() = user_id);

-- ── ETF Portfolios ────────────────────────────────────────────────────────────
create table if not exists public.portfolios (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  name        text not null default 'My Portfolio',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.portfolios enable row level security;
create policy "Users can manage own portfolios"
  on public.portfolios for all using (auth.uid() = user_id);

-- ── ETF Holdings ──────────────────────────────────────────────────────────────
create table if not exists public.etf_holdings (
  id              uuid default uuid_generate_v4() primary key,
  portfolio_id    uuid references public.portfolios(id) on delete cascade not null,
  user_id         uuid references public.profiles(id) on delete cascade not null,
  ticker          text not null,
  balance         bigint not null default 0,  -- AUD cents
  target_pct      int not null default 0,      -- target allocation %
  cost_base       bigint,                      -- AUD cents (pro feature)
  purchase_date   date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (portfolio_id, ticker)
);

alter table public.etf_holdings enable row level security;
create policy "Users can manage own holdings"
  on public.etf_holdings for all using (auth.uid() = user_id);

-- ── Super profiles ────────────────────────────────────────────────────────────
create table if not exists public.super_profiles (
  id                          uuid default uuid_generate_v4() primary key,
  user_id                     uuid references public.profiles(id) on delete cascade not null,
  fund_id                     text not null default 'none',
  balance                     bigint not null default 0,  -- AUD cents
  concessional_contrib        bigint not null default 0,  -- annual, AUD cents
  non_concessional_contrib    bigint not null default 0,
  tsb                         bigint not null default 0,  -- total super balance
  year_of_birth               int,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),
  unique (user_id)
);

alter table public.super_profiles enable row level security;
create policy "Users can manage own super profile"
  on public.super_profiles for all using (auth.uid() = user_id);

-- ── Analysis snapshots (cached results) ──────────────────────────────────────
create table if not exists public.analysis_snapshots (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  health_score  int,
  snapshot_json jsonb,
  created_at    timestamptz not null default now()
);

alter table public.analysis_snapshots enable row level security;
create policy "Users can read own snapshots"
  on public.analysis_snapshots for select using (auth.uid() = user_id);
create policy "Users can insert own snapshots"
  on public.analysis_snapshots for insert with check (auth.uid() = user_id);

-- ── Score history (for trending) ─────────────────────────────────────────────
create table if not exists public.score_history (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  health_score  int not null,
  recorded_at   timestamptz not null default now()
);

alter table public.score_history enable row level security;
create policy "Users can manage own score history"
  on public.score_history for all using (auth.uid() = user_id);

-- ── Subscriptions (simple — hook into Stripe webhooks to update) ──────────────
create table if not exists public.subscriptions (
  id                uuid default uuid_generate_v4() primary key,
  user_id           uuid references public.profiles(id) on delete cascade not null,
  stripe_customer   text,
  stripe_sub_id     text,
  product           text not null check (product in ('smartetf-pro','smartetf-premium','smartsuper-pro','bundle')),
  status            text not null check (status in ('active','cancelled','past_due','trialing')),
  current_period_end timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
create policy "Users can read own subscriptions"
  on public.subscriptions for select using (auth.uid() = user_id);

-- ── Updated_at triggers ────────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute procedure update_updated_at();
create trigger set_updated_at before update on public.financial_profiles
  for each row execute procedure update_updated_at();
create trigger set_updated_at before update on public.portfolios
  for each row execute procedure update_updated_at();
create trigger set_updated_at before update on public.etf_holdings
  for each row execute procedure update_updated_at();
create trigger set_updated_at before update on public.super_profiles
  for each row execute procedure update_updated_at();
