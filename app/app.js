const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const config = require('config')
const pkg = require('../package.json')
const passwordUtil = require('./password')

const app = new Koa()
app.use(bodyParser())

const router = new Router()

router.get('/version', (ctx, next) => {
  ctx.body = {
    name: pkg.name,
    version: pkg.version
  }
})

router.post('/hash', async (ctx, next) => {
  const { algorithm, password, options } = ctx.request.body
  const hashed = await passwordUtil.hash(algorithm, password, options)

  ctx.body = { hashed }
})

router.post('/verify', async (ctx, next) => {
  const { hashed, password } = ctx.request.body
  const match = await passwordUtil.verify(hashed, password)

  ctx.body = { match }
})

app.use(router.routes()).use(router.allowedMethods())

const port = config.port || 3000
app.listen(port, () => {
  console.log(`listening ${port} ...`)
})
