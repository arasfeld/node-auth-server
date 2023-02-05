import 'dotenv/config'
import 'reflect-metadata'
import { MikroORM, RequestContext } from '@mikro-orm/core'
import express from 'express'
import routes from './controllers'
import mikroOrmConfig from './mikro-orm.config'

async function main() {
  const app = express()
  const port = parseInt(process.env.PORT || '', 10) || 3000
  const orm = await MikroORM.init(mikroOrmConfig)
  
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  
  app.use((_req, _res, next) => RequestContext.create(orm.em, next))

  app.use(routes)
  
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`)
  })
}

main().catch((e: Error) => {
  console.error('Fatal error occurred starting server!')
  console.error(e)
  process.exit(101)
})
