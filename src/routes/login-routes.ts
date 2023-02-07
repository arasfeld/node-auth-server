import { Router } from 'express'
import passport from 'passport'

export const loginRouter = Router()

loginRouter.post(
  '/login',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true
  }),
)

loginRouter.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err)
    res.redirect('/')
  })
})
