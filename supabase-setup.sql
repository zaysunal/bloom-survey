-- Run this in Supabase SQL Editor (supabase.com > your project > SQL Editor)

-- 1. Create surveys table
create table if not exists surveys (
  id text primary key,
  title text not null,
  subtitle text default '',
  questions jsonb not null default '[]',
  is_active boolean default false,
  created_at timestamptz default now()
);

-- 2. Create responses table
create table if not exists responses (
  id text primary key,
  survey_id text references surveys(id) on delete cascade,
  answers jsonb not null default '{}',
  color_guesses jsonb default '[]',
  guess_results jsonb default '[]',
  completed_at timestamptz default now()
);

-- 3. Enable Row Level Security
alter table surveys enable row level security;
alter table responses enable row level security;

-- 4. Allow public read/write (admin password is enforced client-side)
create policy "Public read surveys" on surveys for select using (true);
create policy "Public insert surveys" on surveys for insert with check (true);
create policy "Public update surveys" on surveys for update using (true);
create policy "Public delete surveys" on surveys for delete using (true);

create policy "Public read responses" on responses for select using (true);
create policy "Public insert responses" on responses for insert with check (true);
create policy "Public delete responses" on responses for delete using (true);
