const mysql = require('mysql')

module.exports = function init({ host, user, database, password }) {
  const connection = mysql.createConnection({ host, user, database, password })
  connection.connect()
  return {
    query: statement =>
      new Promise((resolve, reject) => {
        connection.query(statement, (err, results) => {
          if (err) return reject(err)
          return resolve(results)
        })
      })
  }
}
