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
  // Check if response has already been sent
  if (response.headersSent) {
    return next(error)
  }

  if (error.status === 400 && error.details) {
    return response.status(400).json({ errors: error.details })
  }
  // Handle specific error types
  // Cast error (malformed ID)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted ID' })
  }

  // Validation error
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map(
      (val) => val.message
    )
    console.log(validationErrors)
    return response.status(400).json({ error: validationErrors })
  }

  // MongoError (duplicate key, etc.)
  if (error.name === 'MongoError' && error.code === 11000) {
    return response.status(400).json({ error: 'Duplicate key error' })
  }

  // Default error handler
  response
    .status(error.status || 500)
    .json({ error: error.message || 'Internal server error' })

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
