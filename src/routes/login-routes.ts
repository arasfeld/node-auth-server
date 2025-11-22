import { Router } from 'express';
import passport from 'passport';
import { authLimiter } from '../middleware';

export const loginRouter = Router();

loginRouter.post(
  '/login',
  authLimiter,
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true,
  }),
);

loginRouter.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});
