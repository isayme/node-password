const request = require('supertest')
const assert = require('power-assert')
const app = require('../app/app')

describe('upash http server', () => {
  describe('hash', () => {
    it('should ok', async () => {
      let res = await request(app)
        .post('/hash')
        .send({ password: '12345678' })
      assert.equal(res.statusCode, 200)
      assert.equal(typeof res.body.hashed === 'string', true)
    })
  })

  describe('verify', () => {
    it('should ok', async () => {
      let password = '12345678'

      let res = await request(app)
        .post('/hash')
        .send({ password })
      assert.equal(res.statusCode, 200)
      let hashed = res.body.hashed

      res = await request(app)
        .post('/verify')
        .send({ hashed, password })
      assert.equal(res.statusCode, 200)
      assert.equal(res.body.match, true)

      res = await request(app)
        .post('/verify')
        .send({ hashed, password: password.slice(1) })
      assert.equal(res.statusCode, 200)
      assert.equal(res.body.match, false)
    })
  })

  describe('version', () => {
    it('should ok', async () => {
      let res = await request(app).get('/version')
      assert.equal(res.statusCode, 200)
      assert.deepEqual(Object.keys(res.body), [
        'name',
        'version'
      ])
    })
  })
})
