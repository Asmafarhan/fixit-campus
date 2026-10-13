-- Run this ONCE in Supabase: SQL Editor -> New query -> paste -> Run

create table campus_ids (
  campus_id text primary key,
  full_name text not null,
  user_type text not null check (user_type in ('student','staff','admin'))
);

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  campus_id text unique not null,
  full_name text,
  role text not null
);

create table complaints (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) default auth.uid(),
  campus_id text, full_name text, user_type text,
  category text not null, location text, description text, photo_url text,
  status text not null default 'pending' check (status in ('pending','in_progress','resolved')),
  admin_remark text,
  satisfied boolean, user_remark text,
  created_at timestamptz default now()
);

-- Only campus IDs in the list above can create an account
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare c campus_ids%rowtype;
begin
  select * into c from campus_ids where campus_id = upper(new.raw_user_meta_data->>'campus_id');
  if not found then raise exception 'Campus ID not registered'; end if;
  insert into profiles(id, campus_id, full_name, role) values (new.id, c.campus_id, c.full_name, c.user_type);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create or replace function is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin')
$$;

-- Security rules
alter table campus_ids enable row level security;
alter table profiles enable row level security;
alter table complaints enable row level security;

create policy "see own profile" on profiles for select using (id = auth.uid() or is_admin());
create policy "see own complaints" on complaints for select using (user_id = auth.uid() or is_admin());
create policy "add own complaint" on complaints for insert with check (user_id = auth.uid());
create policy "admin updates" on complaints for update using (is_admin());
create policy "owner gives feedback" on complaints for update using (user_id = auth.uid() and status = 'resolved') with check (user_id = auth.uid());

-- Photo storage
insert into storage.buckets (id, name, public) values ('photos', 'photos', true);
create policy "upload photos" on storage.objects for insert to authenticated with check (bucket_id = 'photos');
create policy "view photos" on storage.objects for select using (bucket_id = 'photos');

-- Sample campus IDs (replace/add your real ones later)
insert into campus_ids values
  ('ADMIN001', 'Campus Admin', 'admin'),
  ('STU001', 'Ali Student', 'student'),
  ('STU002', 'Sara Student', 'student'),
  ('STF001', 'Mr. Khan (Staff)', 'staff');
