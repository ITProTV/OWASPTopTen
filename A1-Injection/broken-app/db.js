const mysql = require('mysql2')

module.exports = function init({ host, user, database }) {
  const connection = mysql.createConnection({ host, user, database })
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
