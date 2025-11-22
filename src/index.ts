import 'dotenv/config';
import express from 'express';
import * as middleware from './middleware';
import routes from './routes';

async function main() {
  const app = express();
  const port = parseInt(process.env.PORT || '', 10) || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await middleware.installPostgres(app);
  await middleware.installSession(app);
  await middleware.installPassport(app);

  app.use(routes);

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
}

main().catch((e: Error) => {
  console.error('Fatal error occurred starting server!');
  console.error(e);
  process.exit(101);
});
