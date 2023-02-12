import connectPgSimple from 'connect-pg-simple'
import connectRedis from 'connect-redis'
import type { Application } from 'express'
import session, { MemoryStore } from 'express-session'
import { createClient } from 'redis'
import { getPgPool } from './install-postgres'

const PgStore = connectPgSimple(session)
const RedisStore = connectRedis(session)

const { SESSION_SECRET } = process.env
if (!SESSION_SECRET) throw new Error('missing SESSION_SECRET env var')

const MILLISECOND = 1
const SECOND = 1000 * MILLISECOND
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MAXIMUM_SESSION_DURATION_IN_MILLISECONDS = 3 * DAY

export default async (app: Application) => {
  let store: session.Store = new MemoryStore()

  if (process.env.REDIS_URL) {
    const redisClient = createClient({
      url: process.env.REDIS_URL,
      legacyMode: true,
    })
    await redisClient.connect()
    store = new RedisStore({
      client: redisClient,
    })
  } else {
    store = new PgStore({
      pool: getPgPool(app),
      tableName: 'sessions',
    })
  }

  app.use(
    session({
      rolling: true,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: MAXIMUM_SESSION_DURATION_IN_MILLISECONDS,
        httpOnly: true, // default
        sameSite: 'lax', // Cannot be 'strict' otherwise OAuth won't work.
        secure: 'auto', // May need to app.set('trust proxy') for this to work.
      },
      store,
      secret: SESSION_SECRET,
    })
  )
}
