import type { Application } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { LoginService } from '../services';
import { getPgPool } from './install-postgres';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
    }
  }
}

export default async (app: Application) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: string, done) => {
    done(null, { id });
  });

  passport.use(
    new LocalStrategy((username, password, done) => {
      const pgPool = getPgPool(app);
      const service = new LoginService(pgPool);
      service
        .login(username, password)
        .then((user) => done(null, user))
        .catch((err) => done(err));
    }),
  );
};
