import { Migration } from '@mikro-orm/migrations';

export class Migration20230205155135 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "password_hash" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "password_hash";');
  }

}
