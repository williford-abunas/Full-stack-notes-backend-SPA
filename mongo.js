import mongoose from 'mongoose'

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://abunaswilliford:${password}@cluster0.4lwcdiv.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

// Mongoose config
mongoose.set('strictQuery', false)
mongoose.connect(url)

// Mongoose schema validation
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// Note model - constructor(modelName, schema)
// Mongo DB saves objects under notes
const Note = mongoose.model('Note', noteSchema)

// New object/document based on model
const note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then((result) => {
  console.log('note saved!', result)
  mongoose.connection.close()
})
