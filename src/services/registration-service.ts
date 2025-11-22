import argon2 from 'argon2';
import { Pool } from 'pg';
import { ConflictError, InternalServerError, ErrorCode } from '../error';
import { User } from '../types';

export class RegistrationService {
  constructor(private readonly pgPool: Pool) {}

  async register(username: string, password: string): Promise<User> {
    const {
      rows: [existingUser],
    } = await this.pgPool.query<User>(
      'select id, username, password_hash as passwordHash from users where username = $1',
      [username.toLocaleLowerCase()],
    );

    if (existingUser) {
      throw new ConflictError('username is taken', ErrorCode.USERNAME_TAKEN, {
        field: 'username',
        value: username.toLowerCase(),
      });
    }

    const passwordHash = await argon2.hash(password);

    const {
      rows: [user],
    } = await this.pgPool.query<User>(
      `insert into users (username, password_hash)
       values($1, $2)
       returning id, username`,
      [username.toLocaleLowerCase(), passwordHash],
    );

    if (!user) {
      throw new InternalServerError('failed to create user', {
        code: ErrorCode.USER_CREATION_FAILED,
        username: username.toLowerCase(),
      });
    }

    return user;
  }
}
