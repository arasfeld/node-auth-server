import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import * as middleware from './middleware';
import routes from './routes';

async function main() {
  const app = express();
  const port = parseInt(process.env.PORT || '', 10) || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());

  // Setup all middleware in correct order
  await middleware.setupMiddleware(app);

  app.use(routes);

  // 404 handler for unmatched routes (must be after all routes)
  app.use(middleware.notFoundHandler);

  // Global error handler (must be last)
  app.use(middleware.errorHandler);

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
}

main().catch((e: Error) => {
  console.error('Fatal error occurred starting server!');
  console.error(e);
  process.exit(101);
});
