import cookieParser from 'cookie-parser';
import type { Application } from 'express';

export default (app: Application): void => {
  // cookie-parser must be registered after express-session
  // as express-session parses its own cookies
  app.use(cookieParser());
};
