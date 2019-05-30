const http = require('http')
const app = require('./app')

const { PORT } = process.env

const server = http.createServer(app)

server.on('error', err => global.console.error(err))
server.on('close', () => global.console.log('Shutting down...'))



server.listen(PORT, () => global.console.log(`Now listening on port: ${PORT}`))
