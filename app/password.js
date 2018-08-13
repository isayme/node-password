const upash = require('upash')

upash.install('pbkdf2', require('@phc/pbkdf2'))
upash.install('argon2', require('@phc/argon2'))
upash.install('scrypt', require('@phc/scrypt'))
upash.install('bcrypt', require('@phc/bcrypt'))

module.exports = {
  // default use pbkdf2
  hash (algorithm = 'pbkdf2', password, options) {
    return upash.use(algorithm).hash(password, options)
  },

  verify (hashstr, password) {
    return upash.verify(hashstr, password)
  },

  isSupported (algorithm) {
    return upash.list().includes(algorithm)
  },

  validFormat (hashed) {
    try {
      let algorithm = upash.which(hashed)
      return !!algorithm
    } catch (err) {
      return false
    }
  }
}
