import { Router } from 'express';
import { csrfRouter } from './csrf-routes';
import { loginRouter } from './login-routes';
import { registrationRouter } from './registration-routes';
import { userRouter } from './user-routes';

const router = Router();

router.use(csrfRouter);
router.use(loginRouter);
router.use(registrationRouter);
router.use(userRouter);

export default router;
