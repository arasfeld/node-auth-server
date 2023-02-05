import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core'
import argon2 from 'argon2'
import { User } from '../entities/user'
import { AppError } from '../error'

export class LoginService {
  constructor(private readonly em: EntityManager<IDatabaseDriver<Connection>>) {}

  async login(username: string, password: string): Promise<User> {
    const user = await this.em
      .getRepository(User)
      .findOne({ username: username.toLocaleLowerCase() })

    if (!user || !await argon2.verify(user.passwordHash, password)) {
      throw new AppError(401, 'the username or password you entered is invalid')
    }

    return user
  }
}
