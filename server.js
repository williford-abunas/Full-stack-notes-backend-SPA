import express from 'express'
import cors from 'cors'
import { notesRouter } from './routes/notes.js'

const app = express()
const PORT = process.env.PORT || 3001

// MIDDLEWARE
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

// ROUTES
app.use('/api', notesRouter)

// ERROR HANDLER MIDDLEWARE
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  // Cast error (malformed ID)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  // Validation error
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map(
      (val) => val.message
    )
    return response.status(400).json({ error: validationErrors })
  }

  // MongoError (duplicate key, etc.)
  if (error.name === 'MongoError' && error.code === 11000) {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
