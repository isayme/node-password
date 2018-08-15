## Password
[![Build Status](https://travis-ci.org/isayme/node-password.svg?branch=master)](https://travis-ci.org/isayme/node-password)
[![Coverage Status](https://coveralls.io/repos/github/isayme/node-password/badge.svg?branch=master)](https://coveralls.io/github/isayme/node-password?branch=master)

A password hash/verify service.

## Supported Algorithm
- argon2
- pbkdf2
- scrypt
- bcrypt

## APIs
### Hash
```
POST /v1/hash
{
  password: 'your secret password',
  algorithm: 'any of supported' // default to pbkdf2
}

// response
{
  hashed: 'hashed password'
}
```

### Verify
```
POST /v1/verify
{
  password: 'your secret password',
  hashed: 'hashed password to be verified'
}

// response
{
  match: true // true or false
}
```

## Links
- [upash](https://github.com/simonepri/upash)
- [Password Hashing Competition](https://password-hashing.net/)
