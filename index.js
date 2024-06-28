import express from 'express'
import cors from 'cors'
import notesData from './notesData.js'
import { generateId } from './utils.js'

const app = express()
const PORT = process.env.PORT || 3001

//MIDDLEWARE
app.use(express.json())
app.use(cors())

// ROUTES

// GET all notes
app.get('/api/notes', (req, res) => {
  res.json(notesData)
})

// GET single note by id
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notesData.find((note) => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// POST create new note in server
app.post('/api/notes', (request, response) => {
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
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const index = notesData.findIndex((note) => note.id === id)
  if (index !== -1) notesData.splice(index, 1)

  response.status(204).end()
})

// UPDATE existing note
app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const body = request.body

  const noteIndex = notesData.findIndex((note) => note.id === id)
  if (noteIndex === -1) {
    return response.status(404).json({ error: 'note not found' })
  }

  const updatedNote = {
    content: body.content,
    important: body.important,
    id: note.id,
  }

  notesData[index] = updatedNote

  response.json(updatedNote)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
