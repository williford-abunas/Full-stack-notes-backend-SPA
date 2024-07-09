import express from 'express'
import Note from '../models/note.js'

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
notesRouter.post('/notes', async (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  try {
    const savedNote = await note.save()
    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

// DELETE single note by id
notesRouter.delete('/notes/:id', async (request, response) => {
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
notesRouter.put('/notes/:id', async (request, response) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true }
    )

    if (!updatedNote) {
      return response.status(404).json({ error: 'Note not found' })
    }

    response.json(updatedNote)
  } catch (error) {
    next(error)
  }
})
