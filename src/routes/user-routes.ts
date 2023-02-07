import { Router } from 'express'

export const userRouter = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
userRouter.get('/me', (req, res) => {
  const user = req.user

  if (!user) {
    return res.status(401).json({ message: 'authentication required' })
  }

  return res.status(200).json(user)
})
