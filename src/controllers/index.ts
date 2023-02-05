import { Router } from 'express'
import { loginRouter } from './login-controller'
import { registrationRouter } from './registration-controller'

const router = Router()

router.use(loginRouter)
router.use(registrationRouter)

export default router
