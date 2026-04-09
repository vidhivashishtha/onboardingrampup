-- Run this in Supabase SQL Editor (Database > SQL Editor > New query)

create table progress_log (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  user_name text,
  user_email text,
  stage text,
  student_name text,
  student_id text,
  result text,
  attempts int,
  feedback text
);

-- Allow the app to insert rows (anonymous access)
alter table progress_log enable row level security;

create policy "Allow anonymous inserts"
  on progress_log for insert
  with check (true);

create policy "Allow anonymous reads"
  on progress_log for select
  using (true);
