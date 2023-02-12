import { Application } from 'express'
import { Pool } from 'pg'

export const getPgPool = (app: Application): Pool => {
  return app.get('pgPool') as Pool
}

// eslint-disable-next-line @typescript-eslint/require-await
export default async (app: Application) => {
  const pgPool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.POSTGRES_DB || 'node-auth-server',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
  })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  pgPool.on('error', () => {})
  app.set('pgPool', pgPool)
}
