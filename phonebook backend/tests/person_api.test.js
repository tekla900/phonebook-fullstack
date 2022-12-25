const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are six persons', async () => {
  const response = await api.get('/api/persons')

  expect(response.body).toHaveLength(6)
})

test('the first person\'s first name is tekla', async () => {
  const response = await api.get('/api/persons')

  expect(response.body[0].name).toBe('tekla')
})

afterAll(() => {
  mongoose.connection.close()
})