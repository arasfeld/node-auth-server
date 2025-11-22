import argon2 from 'argon2';
import { Pool } from 'pg';
import { AppError } from '../error';
import { User } from '../types';

export class LoginService {
  constructor(private readonly pgPool: Pool) {}

  async login(username: string, password: string): Promise<User> {
    const {
      rows: [user],
    } = await this.pgPool.query<User>(
      'select id, username, password_hash as "passwordHash" from users where username = $1',
      [username.toLocaleLowerCase()],
    );

    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      throw new AppError(
        401,
        'the username or password you entered is invalid',
      );
    }

    return user;
  }
}
