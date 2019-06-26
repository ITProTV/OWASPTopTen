const path = require('path')
const Datastore = require('nedb')
const database = { _stores: {} }

module.exports = function init({ directory }) {
  return new Proxy(database, {
    get(target, property) {
      if (property in target) {
        return target[property]
      }
      if (!(property in target._stores)) {
        target._stores[property] = new Datastore({
          filename: path.join(directory, `${property}.json`),
          autoload: true
        })
      }
      return target._stores[property]
    }
  })
}
