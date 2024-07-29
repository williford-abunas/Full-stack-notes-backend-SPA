import express from 'express'
import Note from '../models/note.js'
import { body, validationResult } from 'express-validator'

export const notesRouter = express.Router()

// GET all notes
notesRouter.get('/notes', async (req, res, next) => {
  try {
    const notes = await Note.find({})
    res.json(notes)
  } catch (error) {
    next(error)
  }
})

// GET single note by id
notesRouter.get('/notes/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).json('Note not found.')
    }
  } catch (error) {
    next(error)
  }
})

// POST create new note in MONGO DB
notesRouter.post(
  '/notes',
  [
    body('content')
      .isLength({ min: 5 })
      .withMessage('Content must be more than 5 characters.'),
  ],
  async (request, response, next) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed')
      error.status = 400
      error.details = errors.array()
      return next(error)
    }

    const { content, important } = request.body

    const note = new Note({
      content,
      important: important || false,
      date: new Date(),
    })

    try {
      const savedNote = await note.save()
      response.status(201).json(savedNote)
    } catch (error) {
      error.status = 500
      next(error)
    }
  }
)

// DELETE single note by id
notesRouter.delete('/notes/:id', async (request, response, next) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(request.params.id)

    if (!deletedNote)
      return response.status(404).json({ error: 'Note not found' })
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// UPDATE existing note
notesRouter.put('/notes/:id', async (request, response, next) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true, context: 'query' }
    )

    if (!updatedNote) {
      return response.status(404).json({ error: 'Note not found' })
    }

    response.json(updatedNote)
  } catch (error) {
    next(error)
  }
})
