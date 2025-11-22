import morgan from 'morgan';
import type { Application } from 'express';

export default (app: Application): void => {
  // Use 'combined' format in production, 'dev' format in development
  const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

  app.use(morgan(format));
};
