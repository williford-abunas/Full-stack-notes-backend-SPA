import express from 'express'
import notesData from '../notesData.js'
import { generateId } from '../utils.js'

export const notesRouter = express.Router()

// GET all notes
notesRouter.get('/notes', (req, res) => {
  res.json(notesData)
})

// GET single note by id
notesRouter.get('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notesData.find((note) => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// POST create new note in server
notesRouter.post('/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notesData.push(note)
  response.json(note)
})

// DELETE single note by id
notesRouter.delete('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const index = notesData.findIndex((note) => note.id === id)
  if (index !== -1) notesData.splice(index, 1)

  response.status(204).end()
})

// UPDATE existing note
notesRouter.put('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const body = request.body

  const noteIndex = notesData.findIndex((note) => note.id === id)
  if (noteIndex === -1) {
    return response.status(404).json({ error: 'note not found' })
  }

  const updatedNote = { ...notesData[noteIndex], ...body, id }

  notesData[noteIndex] = updatedNote

  response.json(updatedNote)
})
