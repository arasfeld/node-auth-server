import { MikroORM } from '@mikro-orm/core'

export default {
  migrations: {
    path: './src/migrations',
    tableName: 'migrations',
    transactional: true,
  },
  tsNode: process.env.NODE_DEV === 'true' ? true : false,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  dbName: process.env.POSTGRES_DB || 'node-auth-server',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '', 10) || 5432,
  entities: ['dist/**/entities/*.js'],
  entitiesTs: ['src/**/entities/*.ts'],
  type: 'postgresql',
} as Parameters<typeof MikroORM.init>[0]
