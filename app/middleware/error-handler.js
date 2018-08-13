const debug = require('debug')('upash:error-handler')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    debug(err)
    ctx.status = err.status || err.statusCode || 500
    ctx.body = {
      name: err.name,
      message: err.message
    }
    ctx.app.emit('error', err, ctx)
  }
}
