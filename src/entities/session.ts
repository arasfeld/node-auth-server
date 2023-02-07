import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class Session {
  @PrimaryKey()
  public sid!: string

  @Property({ type: 'json' })
  public sess!: object

  @Index()
  @Property({ length: 6 })
  public expire!: Date
}
