import 'dotenv/config'
import 'reflect-metadata'
import { MikroORM, RequestContext } from '@mikro-orm/core'
import argon2 from 'argon2'
import express, { Request, Response } from 'express'
import { User } from './entities/user'
import mikroOrmConfig from './mikro-orm.config'

async function main() {
  const app = express()
  const port = parseInt(process.env.PORT || '', 10) || 3000
  const orm = await MikroORM.init(mikroOrmConfig)
  
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  
  app.use((_req, _res, next) => RequestContext.create(orm.em, next))

  app.post('/login', async (req: Request, res: Response) => {
    if (!req.body.username) {
      return res.status(400).json({ message: 'username is missing' })
    }

    if (!req.body.password) {
      return res.status(400).json({ message: 'password is missing' })
    }

    const user = await orm.em.findOne(User, { username: req.body.username.toLocaleLowerCase() })
    if (!user) {
      return res.status(401).json({ message: 'the username or password you entered is invalid' })
    }

    if (await argon2.verify(user.passwordHash, req.body.password)) {
      return res.status(200).json(user)
    }

    return res.status(401).json({ message: 'the username or password you entered is invalid' })
  })

  app.post('/register', async (req: Request, res: Response) => {
    if (!req.body.username) {
      return res.status(400).json({ message: 'username is missing' })
    }

    if (!req.body.password) {
      return res.status(400).json({ message: 'password is missing' })
    }

    const existingUser = await orm.em.findOne(User, { username: req.body.username.toLocaleLowerCase() })
    if (existingUser) {
      return res.status(409).json({ message: 'username is taken' })
    }

    const passwordHash = await argon2.hash(req.body.password)
    const user = new User({ username: req.body.username, passwordHash })
    await orm.em.persist(user).flush()

    res.status(201)
    return res.json(user)
  })
  
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`)
  })
}

main().catch((e: Error) => {
  console.error('Fatal error occurred starting server!')
  console.error(e)
  process.exit(101)
})
