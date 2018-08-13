const Ajv = require('ajv')
const createError = require('http-errors')
const debug = require('debug')('upash:validator')

module.exports = schema => {
  return async (ctx, next) => {
    const ajv = new Ajv()
    const validator = ajv.compile(schema)
    const valid = validator(ctx.request.body)
    if (!valid) {
      debug(validator.errors)
      const message = validator.errors
        .map(err => {
          if (err.type === 'type') {
            return `${err.dataPath}: ${err.message}`
          } else {
            return err.message
          }
        })
        .join('; ')

      throw createError.BadRequest(message)
    }

    await next()
  }
}
