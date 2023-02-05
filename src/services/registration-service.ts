import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core'
import argon2 from 'argon2'
import { User } from '../entities/user'
import { AppError } from '../error'

export class RegistrationService {
  constructor(private readonly em: EntityManager<IDatabaseDriver<Connection>>) {}

  async register(username: string, password: string): Promise<User> {
    const existingUser = await this.em
      .getRepository(User)
      .findOne({ username: username.toLocaleLowerCase() })

    if (existingUser) {
      throw new AppError(401, 'username is taken')
    }

    const passwordHash = await argon2.hash(password)
    const user = new User({ username: username.toLocaleLowerCase(), passwordHash })
    await this.em.persist(user).flush()

    return user
  }
}
