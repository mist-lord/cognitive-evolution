-- Minimal PostgreSQL schema for growth tracking.

create table if not exists growth_profiles (
  invite_code varchar(20) primary key,
  referred_by varchar(20) null,
  share_link_count integer not null default 0,
  share_result_count integer not null default 0,
  share_card_count integer not null default 0,
  assessment_completed_count integer not null default 0,
  referral_visits integer not null default 0,
  score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_growth_profiles_score on growth_profiles(score desc);
create index if not exists idx_growth_profiles_referred_by on growth_profiles(referred_by);

create table if not exists growth_referrals (
  referrer_code varchar(20) not null,
  referred_code varchar(20) not null,
  created_at timestamptz not null default now(),
  primary key (referrer_code, referred_code)
);

create table if not exists growth_events (
  id bigserial primary key,
  invite_code varchar(20) not null,
  event_type varchar(40) not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_growth_events_invite_code on growth_events(invite_code, created_at desc);
