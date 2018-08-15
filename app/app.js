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

const rootRouter = new Router()

rootRouter.get('/', (ctx, next) => {
  const host = `${ctx.protocol}://${ctx.host}`

  ctx.body = {
    hash: {
      method: 'POST',
      url: `${host}/v1/hash`,
      body: {
        password: 'your plain password',
        algorithm: 'algorithm to be used, default to pbkdf2'
      }
    },
    verify: {
      method: 'POST',
      url: `${host}/v1/verify`,
      body: {
        password: 'your plain password',
        hashed: 'hashed password by /v1/hash'
      }
    }
  }
})

rootRouter.get('/version', (ctx, next) => {
  ctx.body = {
    name: pkg.name,
    version: pkg.version
  }
})

const passwordRouter = new Router({
  prefix: '/v1'
})

passwordRouter.post(
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

passwordRouter.post(
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

app.use(rootRouter.routes()).use(rootRouter.allowedMethods())
app.use(passwordRouter.routes()).use(passwordRouter.allowedMethods())

const port = config.port || 3000
const server = app.listen(port, () => {
  const address = server.address()
  console.info(`listen ${address.address}:${address.port}`)
})

module.exports = server
