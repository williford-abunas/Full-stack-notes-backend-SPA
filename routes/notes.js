import express from 'express'
import Note from '../models/note.js'

export const notesRouter = express.Router()

// GET all notes
notesRouter.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find({})
    res.json(notes)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
})

// GET single note by id
notesRouter.get('/notes/:id', async (request, response) => {
  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    response.status(400).send({ error: error.message })
  }
})

// POST create new note in MONGO DB
notesRouter.post('/notes', async (request, response) => {
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
    console.error(error)
    response.status(500).send('Server Error')
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
    response.status(400).send({ error: error.message })
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
    response.status(400).send({ error: error.message })
  }
})
