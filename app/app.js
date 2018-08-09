const Koa = require('koa')
const Router = require('koa-router')
const config = require('config')
const pkg = require('../package.json')

const app = new Koa()

const router = new Router()

router.get('/version', (ctx, next) => {
  ctx.body = {
    name: pkg.name,
    version: pkg.version
  }
})

app.use(router.routes()).use(router.allowedMethods())

const port = config.port || 3000
app.listen(port, () => {
  console.log(`listening ${port} ...`)
})
