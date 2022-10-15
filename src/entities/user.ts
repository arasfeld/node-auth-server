import { Entity, Property, Unique } from '@mikro-orm/core'
import { Base } from './base'

@Entity()
export class User extends Base<User> {
  @Property()
  @Unique()
  public username!: string
}
