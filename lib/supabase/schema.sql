-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  vapi_assistant_id text,
  name text not null,
  voice text not null default 'nova',
  greeting text not null default '',
  actions jsonb not null default '[]',
  is_active boolean not null default true,
  calls_today integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists calls (
  id uuid primary key default gen_random_uuid(),
  vapi_call_id text unique,
  agent_id uuid references agents(id) on delete set null,
  agent_name text,
  caller_number text,
  caller_name text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_s integer,
  outcome text check (outcome in ('booked','resolved','transferred','voicemail','missed')),
  sentiment text check (sentiment in ('positive','neutral','negative')),
  transcript jsonb,
  summary text,
  recording_url text,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table agents enable row level security;
alter table calls enable row level security;

-- Allow public read for demo (tighten with auth later)
create policy "public read agents" on agents for select using (true);
create policy "public read calls" on calls for select using (true);
create policy "service insert agents" on agents for insert with check (true);
create policy "service insert calls" on calls for insert with check (true);
create policy "service update agents" on agents for update using (true);
create policy "service update calls" on calls for update using (true);
