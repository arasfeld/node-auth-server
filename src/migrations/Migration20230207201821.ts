import { Migration } from '@mikro-orm/migrations';

export class Migration20230207201821 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "session" ("sid" varchar(255) not null, "sess" jsonb not null, "expire" timestamptz(6) not null, constraint "session_pkey" primary key ("sid"));');
    this.addSql('create index "session_expire_index" on "session" ("expire");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "session" cascade;');
  }

}
