import argon2 from 'argon2';
import { Pool } from 'pg';
import { AuthenticationError, ErrorCode } from '../error';
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

    // Security: Use consistent error message to prevent user enumeration
    // Always perform verification to prevent timing attacks
    const isValid = user && (await argon2.verify(user.passwordHash, password));

    if (!isValid) {
      throw new AuthenticationError(
        'the username or password you entered is invalid',
        ErrorCode.INVALID_CREDENTIALS,
      );
    }

    return user;
  }
}
