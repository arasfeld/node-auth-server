-- Up Migration
create table sessions (
  sid varchar not null,
  sess json not null,
  expire timestamp(6) not null
);
comment on table sessions is
  E'This table is used by ''connect-pg-simple'' to track cookie session information at the webserver level';

alter table sessions
  add constraint session_pkey primary key (sid) not deferrable initially immediate;

create index idx_sessions_expire on sessions (expire);

-- Down Migration
drop table if exists sessions;
