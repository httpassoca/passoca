-- Setup for the hidden /roulette page.
-- Run once in the Supabase SQL editor (or `supabase db push` equivalent).

create table if not exists public.roulette_options (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author text not null,
  text text not null,
  picked boolean not null default false
);

-- Single-row table: shared config + the last spin result, so every open
-- browser animates to the same winner.
create table if not exists public.roulette_state (
  id smallint primary key default 1 check (id = 1),
  max_picks int not null default 1 check (max_picks between 1 and 10),
  winner_id uuid references public.roulette_options (id) on delete set null,
  spin_turns real,
  spun_at timestamptz
);

insert into public.roulette_state (id) values (1)
on conflict (id) do nothing;

-- The page is anonymous by design (hidden URL shared with friends), so the
-- anon key gets full access to these two tables only.
alter table public.roulette_options enable row level security;
alter table public.roulette_state enable row level security;

create policy "roulette options open" on public.roulette_options
  for all using (true) with check (true);

create policy "roulette state open" on public.roulette_state
  for all using (true) with check (true);

-- Live updates for everyone on the page.
alter publication supabase_realtime add table public.roulette_options;
alter publication supabase_realtime add table public.roulette_state;
