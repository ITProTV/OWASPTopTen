const http = require('http')
const app = require('./app')
const port = process.env.PORT
const log = global.console.log.bind(global.console)

http
  .createServer(app)
  .on('close', () => {
    log('Closing....')
  })
  .on('error', err => {
    log(`Encountered Error: ${err}!`)
  })
  .on('listening', () => {
    log(`Now listening on port: ${port}`)
  })
  .listen(port)
