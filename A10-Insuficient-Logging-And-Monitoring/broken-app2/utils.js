const crypto = require('crypto')
const utils = {}
const db = require('./db')({ directory: 'db' })

class User {
  constructor(email, password) {
    this.email = email
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto
      .pbkdf2Sync(password, this.salt, 10000, 64, 'sha256')
      .toString('hex')
  }
}
utils.Users = {
  create(email, password) {
    return new User(email, password)
  },
  verifyPassword(user, password) {
    const result =
      user.hash ===
      crypto
        .pbkdf2Sync(password, user.salt, 10000, 64, 'sha256')
        .toString('hex')
    return result
  },
  save(user) {
    return new Promise((resolve, reject) => {
      db.users.insert(user, err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}
module.exports = utils
