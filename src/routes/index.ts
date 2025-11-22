import { Router } from 'express';
import { loginRouter } from './login-routes';
import { registrationRouter } from './registration-routes';
import { userRouter } from './user-routes';

const router = Router();

router.use(loginRouter);
router.use(registrationRouter);
router.use(userRouter);

export default router;
