/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import connectPgSimple from 'connect-pg-simple'
import type { Express } from 'express'
import session from 'express-session'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const PgStore = connectPgSimple(session)

const { SESSION_SECRET } = process.env
if (!SESSION_SECRET) throw new Error('missing SESSION_SECRET env var')

const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MAXIMUM_SESSION_DURATION_IN_MILLISECONDS = 3 * DAY

export default (app: Express) => {
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      store: new PgStore(),
      secret: SESSION_SECRET,
    })
  )
}
