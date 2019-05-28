const app = require('./app')
const http = require('http')
const server = http.createServer(app)
const { PORT } = process.env

server.on('error', err => global.console.log(`Encountered Error: ${err}`))
server.on('close', () => global.console.log('Closing...'))

server.listen(PORT, () => global.console.log(`Now listening on port: ${PORT}`))
