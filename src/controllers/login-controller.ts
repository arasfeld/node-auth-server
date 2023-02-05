import { RequestContext } from '@mikro-orm/core'
import { Request, Response, Router } from 'express'
import { AppError } from '../error'
import { LoginService } from '../services'

export const loginRouter = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
loginRouter.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.query

  if (typeof(username) !== 'string') {
    return res.status(400).json({ message: 'username is missing' })
  }

  if (typeof(password) !== 'string') {
    return res.status(400).json({ message: 'password is missing' })
  }

  try {
    const em = RequestContext.getEntityManager()
    if (!em) return res.status(500).end()
  
    const service = new LoginService(em)
    const user = await service.login(username, password)
  
    return res.status(200).json(user)
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message })
    }
    return res.status(500).json({ message: 'an unhandled error occurred' })
  }
})
