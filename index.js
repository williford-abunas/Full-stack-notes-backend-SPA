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

// GET home
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

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
  notes = notesData.filter((note) => note.id !== id)

  response.status(204).end()
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
