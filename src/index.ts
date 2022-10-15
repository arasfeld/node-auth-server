import express from 'express'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
})
