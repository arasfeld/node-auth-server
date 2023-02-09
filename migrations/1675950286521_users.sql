-- Up Migration
create table users (
  id uuid primary key default gen_random_uuid(),
  username varchar(24) not null unique check(length(username) >= 2 and length(username) <= 24 and username ~ '^[a-zA-Z]([_]?[a-zA-Z0-9])+$'),
  password_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table users is
  E'A user who can log in to the application.';
comment on column users.id is
  E'Unique identifier for the user.';
comment on column users.username is
  E'Public-facing username (or ''handle'') of the user.';
comment on column users.password_hash is
  E'Encrypted password for used for authentication.';

-- Keep created_at and updated_at up to date.
create trigger update_timestamps_users
  before insert or update on users
  for each row
  execute procedure set_timestamps();

-- Down Migration
drop trigger if exists update_timestamps_users on users;
drop table if exists users;
  