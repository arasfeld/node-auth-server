import { Router } from 'express';
import passport from 'passport';
import { authLimiter, csrfProtection } from '../middleware';

export const loginRouter = Router();

loginRouter.post(
  '/login',
  authLimiter,
  csrfProtection,
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true,
  }),
);

loginRouter.post('/logout', csrfProtection, (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});
