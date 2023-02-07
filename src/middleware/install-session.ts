import type { Express } from 'express'
import session from 'express-session'

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
      secret: SESSION_SECRET,
    })
  )
}
