import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'

let app

beforeAll(() => {
  app = createApp()
})

describe('public routes', () => {
  it('GET /api/health returns ok without auth', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})

describe('authentication', () => {
  it('GET /api/todos returns 401 without token', async () => {
    const res = await request(app).get('/api/todos')
    expect(res.status).toBe(401)
  })

  it('GET /api/todos returns 401 with invalid token', async () => {
    const res = await request(app).get('/api/todos').set('Authorization', 'Bearer invalid')
    expect(res.status).toBe(401)
  })

  it('POST /api/todos returns 401 without token', async () => {
    const res = await request(app).post('/api/todos').send({ title: 'test' })
    expect(res.status).toBe(401)
  })

  it('PUT /api/todos/1 returns 401 without token', async () => {
    const res = await request(app).put('/api/todos/1').send({ title: 'x' })
    expect(res.status).toBe(401)
  })
})

describe('DELETE /api/todos/:id', () => {
  it('can delete without authentication (unauthenticated bug)', async () => {
    const res = await request(app).delete('/api/todos/999')
    expect(res.status).toBe(404)
  })
})

describe('CRUD with auth', () => {
  const auth = { Authorization: 'Bearer secret-token' }
  let createdId

  it('creates a todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set(auth)
      .send({ title: 'Learn Express', completed: false })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.title).toBe('Learn Express')
    createdId = res.body.id
  })

  it('lists todos', async () => {
    const res = await request(app).get('/api/todos').set(auth)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(1)
  })

  it('gets a single todo', async () => {
    const res = await request(app).get(`/api/todos/${createdId}`).set(auth)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(createdId)
  })

  it('updates a todo', async () => {
    const res = await request(app)
      .put(`/api/todos/${createdId}`)
      .set(auth)
      .send({ completed: true })
    expect(res.status).toBe(200)
    expect(res.body.completed).toBe(true)
  })

  it('deletes a todo', async () => {
    const res = await request(app).delete(`/api/todos/${createdId}`).set(auth)
    expect(res.status).toBe(200)
  })

  it('returns 404 for unknown todo', async () => {
    const res = await request(app).get('/api/todos/999').set(auth)
    expect(res.status).toBe(404)
  })
})
