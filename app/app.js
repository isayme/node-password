const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const config = require('config')
const createError = require('http-errors')
const validator = require('./middleware/validator')
const pkg = require('../package.json')
const passwordUtil = require('./password')

const app = new Koa()
app.use(bodyParser())
app.use(require('./middleware/error-handler'))

const router = new Router()

router.get('/version', (ctx, next) => {
  ctx.body = {
    name: pkg.name,
    version: pkg.version
  }
})

router.post(
  '/hash',
  validator({
    type: 'object',
    properties: {
      algorithm: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    required: ['password']
  }),
  async (ctx, next) => {
    const { algorithm, password } = ctx.request.body

    if (algorithm && !passwordUtil.isSupported(algorithm)) {
      throw createError.BadRequest(`not support algorithm: ${algorithm}`)
    }

    const hashed = await passwordUtil.hash(algorithm, password)

    ctx.body = { hashed }
  }
)

router.post(
  '/verify',
  validator({
    type: 'object',
    properties: {
      hashed: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    required: ['hashed', 'password']
  }),
  async (ctx, next) => {
    const { hashed, password } = ctx.request.body

    if (!passwordUtil.validFormat(hashed)) {
      throw createError.BadRequest(`not valid hashed password format: ${hashed}`)
    }

    const match = await passwordUtil.verify(hashed, password)

    ctx.body = { match }
  }
)

app.use(router.routes()).use(router.allowedMethods())

const port = config.port || 3000
const server = app.listen(port, () => {
  const address = server.address()
  console.info(`listen ${address.address}:${address.port}`)
})

module.exports = server
