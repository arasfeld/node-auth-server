import { Router } from 'express'
import { AppError } from '../error'
import { getPgPool } from '../middleware/install-postgres'
import { RegistrationService } from '../services'

export const registrationRouter = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
registrationRouter.post('/register', async (req, res) => {
  const { username, password } = req.query

  if (typeof(username) !== 'string') {
    return res.status(400).json({ message: 'username is missing' })
  }

  if (typeof(password) !== 'string') {
    return res.status(400).json({ message: 'password is missing' })
  }

  try {
    const pgPool = getPgPool(req.app)
    const service = new RegistrationService(pgPool)
    const user = await service.register(username, password)
  
    return res.status(201).json(user)
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message })
    }
    return res.status(500).json({ message: 'an unhandled error occurred' })
  }
})
