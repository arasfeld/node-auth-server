import { Router } from 'express';
import { AuthenticationError, ErrorCode } from '../error';

export const userRouter = Router();

userRouter.get('/me', (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(
      new AuthenticationError(
        'authentication required',
        ErrorCode.UNAUTHORIZED,
      ),
    );
  }

  res.status(200).json(user);
});
