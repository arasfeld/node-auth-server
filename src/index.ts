import 'dotenv/config'
import express from 'express'
import * as middleware from './middleware'
import routes from './routes'

const app = express()
const port = parseInt(process.env.PORT || '', 10) || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

middleware.installPostgres(app)
middleware.installSession(app)
middleware.installPassport(app)

app.use(routes)

app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`)
})
