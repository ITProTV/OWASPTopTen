const http = require('http')
const app = require('./app')
const port = process.env.PORT || 3000

http.createServer(app)
    .on('listening', () => console.log(`Now listening on port: ${port}`))
    .on('close', () => console.log('Now shutting down....'))
    .on('error', err => console.error(`Encountered Error: ${err}`))
    .listen(port)
