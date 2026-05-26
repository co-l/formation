import express from 'express'

const VALID_TOKEN = 'secret-token'

let nextId = 1
const todos = []

export function createApp() {
  const app = express()
  app.use(express.json())

  function auth(req, res, next) {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ') || header.slice(7) !== VALID_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    next()
  }

  // public
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
  })

  // authenticated
  app.get('/api/todos', auth, (req, res) => {
    res.json(todos)
  })

  app.get('/api/todos/:id', auth, (req, res) => {
    const todo = todos.find((t) => t.id === Number(req.params.id))
    if (!todo) return res.status(404).json({ error: 'Not found' })
    res.json(todo)
  })

  app.post('/api/todos', auth, (req, res) => {
    const { title, completed = false } = req.body
    const todo = { id: nextId++, title, completed }
    todos.push(todo)
    res.status(201).json(todo)
  })

  app.put('/api/todos/:id', auth, (req, res) => {
    const todo = todos.find((t) => t.id === Number(req.params.id))
    if (!todo) return res.status(404).json({ error: 'Not found' })
    if (req.body.title !== undefined) todo.title = req.body.title
    if (req.body.completed !== undefined) todo.completed = req.body.completed
    res.json(todo)
  })

  // BUG: missing auth middleware
  app.delete('/api/todos/:id', (req, res) => {
    const index = todos.findIndex((t) => t.id === Number(req.params.id))
    if (index === -1) return res.status(404).json({ error: 'Not found' })
    todos.splice(index, 1)
    res.json({ ok: true })
  })

  return app
}
