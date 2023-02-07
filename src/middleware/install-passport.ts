import { RequestContext } from '@mikro-orm/core'
import type { Express } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { LoginService } from '../services'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
    }
  }
}

export default (app: Express) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id: string, done) => {
    done(null, { id })
  })

  passport.use(
    new LocalStrategy((username, password, done) => {
      const em = RequestContext.getEntityManager()
      if (!em) throw new Error('RequestContext is missing')

      const service = new LoginService(em)
      service.login(username, password)
        .then(user => done(null, user))
        .catch(err => done(err))
    })
  )
}
