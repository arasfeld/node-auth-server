import { BaseEntity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'

export class Base<T extends { id: string }> extends BaseEntity<T, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  public id: string = v4()

  @Property()
  public createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  public updatedAt: Date = new Date()

  constructor(body = {}) {
    super();
    this.assign(body)
  }
}
