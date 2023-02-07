import { Router } from 'express'
import { loginRouter } from './login-routes'
import { registrationRouter } from './registration-routes'

const router = Router()

router.use(loginRouter)
router.use(registrationRouter)

export default router
