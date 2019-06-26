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

class Snippet {
  constructor(command, description, user) {
    this.command = command
    this.description = description
    this.user_id = user.id
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
      db.users.insert(user, (err, doc) => {
        if (err) return reject(err)
        return resolve(doc)
      })
    })
  }
}

utils.Snippets = {
  create(command, description, user) {
    return new Snippet(command, description, user)
  },
  save(snippet) {
    return new Promise((resolve, reject) => {
      if (!snippet.user_id) return reject('Must be associated with user.')
      db.snippets.insert(snippet, (err, doc) => {
        if (err) return reject(err)
        return resolve(doc)
      })
    })
  }
}
module.exports = utils
