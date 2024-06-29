import express from 'express'
import cors from 'cors'
import { notesRouter } from './routes/notes.js'

const app = express()
const PORT = process.env.PORT || 3001

//MIDDLEWARE
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

// ROUTES
app.use('/api', notesRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
