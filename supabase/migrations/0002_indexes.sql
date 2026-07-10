-- Le Carnet — performance indexes
-- Paste into the Supabase SQL editor and run once.
--
-- Postgres auto-indexes primary keys and unique constraints, but NOT plain
-- foreign key columns. Every page in the app filters its main tables by
-- family_id (and list_items by list_id), so those columns were getting a
-- sequential scan on every request. family_members is already covered by
-- its (family_id, user_id) unique constraint, so it's not listed here.

create index if not exists documents_family_id_idx on documents (family_id);
create index if not exists contacts_family_id_idx on contacts (family_id);
create index if not exists lists_family_id_idx on lists (family_id);
create index if not exists list_items_list_id_idx on list_items (list_id, position);

-- Composite indexes: these tables are always filtered by family_id AND
-- sorted/filtered by a second column, so the index covers both at once.
create index if not exists events_family_id_start_at_idx on events (family_id, start_at);
create index if not exists notes_family_id_created_at_idx on notes (family_id, created_at desc);
create index if not exists photos_family_id_taken_at_idx on photos (family_id, taken_at desc);
