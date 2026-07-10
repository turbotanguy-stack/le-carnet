-- Le Carnet — Supabase schema
-- Paste this whole file into the Supabase dashboard SQL editor (SQL Editor > New query) and run it once.

-- ─────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────

create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  join_code text not null unique,
  created_at timestamptz not null default now()
);

create table family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null,
  relation text not null default '',
  color text not null default '#D4704A',
  created_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  relation text not null default '',
  phone text default '',
  category text not null default 'famille' check (category in ('famille', 'prestataire')),
  provider_type text default '',
  created_by uuid references family_members(id) on delete set null,
  created_at timestamptz not null default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  storage_path text not null,
  category text not null default 'general' check (category in ('administratif', 'recettes', 'photos', 'general')),
  size_bytes bigint not null default 0,
  mime_type text default '',
  uploaded_by uuid references family_members(id) on delete set null,
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  title text not null,
  location text default '',
  start_at timestamptz not null,
  end_at timestamptz,
  all_day boolean not null default false,
  color text not null default '#D4704A',
  created_by uuid references family_members(id) on delete set null,
  created_at timestamptz not null default now()
);

create table lists (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  created_by uuid references family_members(id) on delete set null,
  created_at timestamptz not null default now()
);

create table list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references lists(id) on delete cascade,
  label text not null,
  done boolean not null default false,
  assigned_to uuid references family_members(id) on delete set null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  title text not null,
  body text default '',
  color text not null default '#FFFBF0',
  author uuid references family_members(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table photos (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  album text not null default 'Général',
  storage_path text not null,
  is_video boolean not null default false,
  duration_seconds integer,
  taken_at date not null default current_date,
  uploaded_by uuid references family_members(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Activity feed (union of recent items across the app)
-- ─────────────────────────────────────────────

create view activity_feed as
  select family_id, 'document' as kind, name as title, uploaded_by as actor, created_at
  from documents
  union all
  select family_id, 'note', title, author, created_at
  from notes
  union all
  select family_id, 'event', title, created_by, created_at
  from events
  union all
  select family_id, 'photo', album, uploaded_by, created_at
  from photos;

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────

create or replace function is_family_member(fid uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from family_members
    where family_id = fid and user_id = auth.uid()
  );
$$;

alter table families enable row level security;
alter table family_members enable row level security;
alter table contacts enable row level security;
alter table documents enable row level security;
alter table events enable row level security;
alter table lists enable row level security;
alter table list_items enable row level security;
alter table notes enable row level security;
alter table photos enable row level security;

create policy "members can read their family" on families
  for select using (is_family_member(id));
-- anyone authenticated can create a family (they become its first member right after)
create policy "authenticated users can create a family" on families
  for insert with check (auth.uid() is not null);
-- needed so a brand-new user can look up a family by join_code before they are a member
create policy "authenticated users can look up a family by join_code" on families
  for select using (auth.uid() is not null);

create policy "members can read family_members rows" on family_members
  for select using (is_family_member(family_id));
create policy "authenticated users can join a family" on family_members
  for insert with check (auth.uid() is not null and user_id = auth.uid());

create policy "members can read contacts" on contacts
  for select using (is_family_member(family_id));
create policy "members can write contacts" on contacts
  for insert with check (is_family_member(family_id));
create policy "members can update contacts" on contacts
  for update using (is_family_member(family_id));
create policy "members can delete contacts" on contacts
  for delete using (is_family_member(family_id));

create policy "members can read documents" on documents
  for select using (is_family_member(family_id));
create policy "members can write documents" on documents
  for insert with check (is_family_member(family_id));
create policy "members can delete documents" on documents
  for delete using (is_family_member(family_id));

create policy "members can read events" on events
  for select using (is_family_member(family_id));
create policy "members can write events" on events
  for insert with check (is_family_member(family_id));
create policy "members can update events" on events
  for update using (is_family_member(family_id));
create policy "members can delete events" on events
  for delete using (is_family_member(family_id));

create policy "members can read lists" on lists
  for select using (is_family_member(family_id));
create policy "members can write lists" on lists
  for insert with check (is_family_member(family_id));
create policy "members can delete lists" on lists
  for delete using (is_family_member(family_id));

create policy "members can read list_items" on list_items
  for select using (is_family_member((select family_id from lists where lists.id = list_id)));
create policy "members can write list_items" on list_items
  for insert with check (is_family_member((select family_id from lists where lists.id = list_id)));
create policy "members can update list_items" on list_items
  for update using (is_family_member((select family_id from lists where lists.id = list_id)));
create policy "members can delete list_items" on list_items
  for delete using (is_family_member((select family_id from lists where lists.id = list_id)));

create policy "members can read notes" on notes
  for select using (is_family_member(family_id));
create policy "members can write notes" on notes
  for insert with check (is_family_member(family_id));
create policy "members can update notes" on notes
  for update using (is_family_member(family_id));
create policy "members can delete notes" on notes
  for delete using (is_family_member(family_id));

create policy "members can read photos" on photos
  for select using (is_family_member(family_id));
create policy "members can write photos" on photos
  for insert with check (is_family_member(family_id));
create policy "members can delete photos" on photos
  for delete using (is_family_member(family_id));

-- ─────────────────────────────────────────────
-- Storage buckets (private; access enforced by policies below)
-- ─────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false), ('photos', 'photos', false)
on conflict (id) do nothing;

-- Objects are stored at "<family_id>/<filename>" — policies check the
-- first path segment against the caller's family memberships.
create policy "members can read their family's documents" on storage.objects
  for select using (
    bucket_id = 'documents'
    and is_family_member((storage.foldername(name))[1]::uuid)
  );
create policy "members can upload their family's documents" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and is_family_member((storage.foldername(name))[1]::uuid)
  );
create policy "members can delete their family's documents" on storage.objects
  for delete using (
    bucket_id = 'documents'
    and is_family_member((storage.foldername(name))[1]::uuid)
  );

create policy "members can read their family's photos" on storage.objects
  for select using (
    bucket_id = 'photos'
    and is_family_member((storage.foldername(name))[1]::uuid)
  );
create policy "members can upload their family's photos" on storage.objects
  for insert with check (
    bucket_id = 'photos'
    and is_family_member((storage.foldername(name))[1]::uuid)
  );
create policy "members can delete their family's photos" on storage.objects
  for delete using (
    bucket_id = 'photos'
    and is_family_member((storage.foldername(name))[1]::uuid)
  );
